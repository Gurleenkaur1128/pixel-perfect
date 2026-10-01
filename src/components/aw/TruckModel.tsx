import { useEffect, useRef } from "react";

const ASSET_ROOT = "/models/low-poly-truck/";

/** Render the supplied FBX once; the journey moves its wrapper with GSAP. */
export function TruckModel({ view = "side" }: { view?: "side" | "top" }) {
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;
    let cancelled = false;
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
      // The FBX references the creator's Windows paths and older texture names.
      manager.setURLModifier((url) => {
        if (!/\.jpg$/i.test(url)) return url;
        const name = url.toLowerCase();
        const file = name.includes("trailer") ? "Texture_Trailer_(2).jpg"
          : name.includes("wheel") ? "Texture_Wheel_(3).jpg"
          : name.includes("body 2") ? "Textures_body_2_(12).jpg"
          : "Textures_Body_(13).jpg";
        return `${ASSET_ROOT}textures/${encodeURIComponent(file)}`;
      });
      let model: InstanceType<typeof THREE.Group> | undefined;
      const draw = () => {
        if (cancelled || !model) return;
        const width = host!.clientWidth;
        const height = host!.clientHeight;
        if (!width || !height) return;
        renderer.setSize(width, height, false);
        const aspect = width / height;
        camera.left = -1.08;
        camera.right = 1.08;
        camera.top = 1.08 / aspect;
        camera.bottom = -1.08 / aspect;
        camera.near = 0.01;
        camera.far = 20;
        camera.position.set(0, view === "top" ? 5 : 0.65, view === "top" ? 0 : 5);
        camera.up.set(0, view === "top" ? 0 : 1, view === "top" ? -1 : 0);
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
        observer.disconnect();
        if (model) disposeModel(model);
        renderer.dispose();
        renderer.domElement.remove();
      };
      manager.onLoad = draw;
      model = await new FBXLoader(manager).loadAsync(`${ASSET_ROOT}source/trucks4.fbx`);
      if (cancelled) { disposeModel(model); return; }
      // The truck's forward axis is +Z. Rotate it to face right on the route.
      model.rotation.y = Math.PI / 2;
      model.updateMatrixWorld(true);
      const bounds = new THREE.Box3().setFromObject(model);
      const center = bounds.getCenter(new THREE.Vector3());
      const scale = 2 / bounds.getSize(new THREE.Vector3()).x;
      model.scale.multiplyScalar(scale);
      model.position.copy(center.multiplyScalar(-scale));
      scene.add(model);
      draw();
    }

    void renderTruck().catch((error) => {
      cleanup();
      console.error("Unable to load the truck model", error);
    });
    return () => { cancelled = true; cleanup(); };
  }, [view]);

  return <div ref={hostRef} role="img" aria-label="Low-poly delivery truck" className={`w-full ${view === "top" ? "aspect-[3/1]" : "aspect-[3.5/1]"}`} />;
}
