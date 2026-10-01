import { useEffect, useRef, type RefObject } from "react";

const ASSET_ROOT = "/models/low-poly-truck/";

export type TruckPose = {
  pitch: number;
  heading: number;
  distance: number;
};

/** One low-poly truck. Pitch lifts the camera from side to top; heading yaws the model. */
export function TruckModel({ poseRef }: { poseRef: RefObject<TruckPose> }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
    let frame = 0;
    let cleanup = () => {};

    async function renderTruck() {
      const [THREE, { FBXLoader }] = await Promise.all([
        import("three"),
        import("three/examples/jsm/loaders/FBXLoader.js"),
      ]);
      if (cancelled) return;
      const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      host!.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = "width:100%;height:100%;display:block";
      const scene = new THREE.Scene();
      const camera = new THREE.OrthographicCamera();
      scene.add(new THREE.HemisphereLight(0xffffff, 0x718096, 2.4));
      const light = new THREE.DirectionalLight(0xffffff, 3);
      light.position.set(3, 8, 5);
      scene.add(light);
      const manager = new THREE.LoadingManager();
      manager.setURLModifier((url) => {
        if (!/\.jpg$/i.test(url)) return url;
        const name = url.toLowerCase();
        const file = name.includes("trailer")
          ? "Texture_Trailer_(2).jpg"
          : name.includes("wheel")
            ? "Texture_Wheel_(3).jpg"
            : name.includes("body 2")
              ? "Textures_body_2_(12).jpg"
              : "Textures_Body_(13).jpg";
        return `${ASSET_ROOT}textures/${encodeURIComponent(file)}`;
      });
      let model: InstanceType<typeof THREE.Group> | undefined;
      let rig: InstanceType<typeof THREE.Group> | undefined;
      const tires: { obj: InstanceType<typeof THREE.Object3D>; axis: "x" | "y" | "z"; base: number }[] = [];
      let groundFrac = 0.28;
      const SPAN = 1.08;
      const targetQuat = new THREE.Quaternion();
      const targetEuler = new THREE.Euler();
      const draw = () => {
        if (cancelled || !model) return;
        const width = host!.clientWidth;
        const height = host!.clientHeight;
        if (!width || !height) return;
        const pose = poseRef.current ?? { pitch: 0, heading: 0, distance: 0 };
        const pitch = Math.min(1, Math.max(0, pose.pitch));
        if (rig) {
          targetEuler.set(0, -pose.heading, 0);
          targetQuat.setFromEuler(targetEuler);
          rig.quaternion.slerp(targetQuat, 0.1);
        }
        const spin = pose.distance * 0.08;
        for (const tire of tires) tire.obj.rotation[tire.axis] = tire.base + spin;
        const lift = (1 - pitch) * groundFrac * 50;
        host!.style.transform = `translate(-50%, calc(-50% - ${lift}%))`;
        renderer.setSize(width, height, false);
        const aspect = width / Math.max(1, height);
        camera.left = -SPAN * Math.max(1, aspect);
        camera.right = SPAN * Math.max(1, aspect);
        camera.top = SPAN * Math.max(1, 1 / aspect);
        camera.bottom = -SPAN * Math.max(1, 1 / aspect);
        camera.near = 0.01;
        camera.far = 30;
        camera.position.set(0, 5 * pitch, 5 * (1 - pitch) + 0.04 * pitch);
        camera.up.set(0, 1 - pitch, -pitch);
        if (camera.up.lengthSq() < 0.0001) camera.up.set(0, 1, 0);
        camera.up.normalize();
        camera.lookAt(0, 0, 0);
        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };
      const observer = new ResizeObserver(draw);
      observer.observe(host!);
      const disposeModel = (object: InstanceType<typeof THREE.Group>) => {
        object.traverse((child) => {
          if (!(child instanceof THREE.Mesh)) return;
          child.geometry.dispose();
          const materials = Array.isArray(child.material) ? child.material : [child.material];
          materials.forEach((material) => {
            Object.values(material).forEach((value) => {
              if (value instanceof THREE.Texture) value.dispose();
            });
            material.dispose();
          });
        });
      };
      cleanup = () => {
        cancelAnimationFrame(frame);
        observer.disconnect();
        if (model) disposeModel(model);
        rig?.removeFromParent();
        renderer.dispose();
        renderer.domElement.remove();
      };
      const loop = () => {
        draw();
        frame = requestAnimationFrame(loop);
      };
      model = await new FBXLoader(manager).loadAsync(`${ASSET_ROOT}source/trucks4.fbx`);
      if (cancelled) {
        disposeModel(model);
        return;
      }
      model.rotation.y = Math.PI / 2;
      model.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(model);
      const size = bounds.getSize(new THREE.Vector3());
      const center = bounds.getCenter(new THREE.Vector3());
      const scale = 2 / Math.max(0.001, size.x);
      model.scale.multiplyScalar(scale);
      model.position.copy(center.multiplyScalar(-scale));
      rig = new THREE.Group();
      rig.add(model);
      const halfH = (size.y * scale) / 2;
      groundFrac = Math.min(0.92, halfH / SPAN);
      model.traverse((child) => {
        if (!/^(FL|FR|RL|RR)/i.test(child.name)) return;
        if (!("geometry" in child) || !(child.geometry instanceof THREE.BufferGeometry)) return;
        child.geometry.computeBoundingBox();
        const box = child.geometry.boundingBox;
        if (!box) return;
        const extent = box.getSize(new THREE.Vector3());
        const axis: "x" | "y" | "z" =
          extent.x <= extent.y && extent.x <= extent.z ? "x" : extent.y <= extent.z ? "y" : "z";
        tires.push({ obj: child, axis, base: child.rotation[axis] });
      });
      host!.dataset["parts"] = tires.map((tire) => `${tire.obj.name}:${tire.axis}`).join(",") || "none";
      scene.add(rig);
      loop();
    }

    void renderTruck().catch((error) => {
      cleanup();
      console.error("Unable to load the truck model", error);
    });
    return () => {
      cancelled = true;
      cleanup();
    };
  }, [poseRef]);

  return (
    <div
      ref={hostRef}
      role="img"
      aria-label="American West truck"
      className="pointer-events-none absolute left-0 top-0 aspect-square w-[var(--truck-w)]"
    />
  );
}
