import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeartCanvas3DProps {
  bpm: number;
  status: 'normal' | 'warning' | 'critical';
  className?: string;
  showLabels?: boolean;
}

export const HeartCanvas3D: React.FC<HeartCanvas3DProps> = ({
  bpm,
  status,
  className = '',
  showLabels = true,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const width = container.clientWidth || 300;
    const height = container.clientHeight || 280;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    // Heart Group
    const heartGroup = new THREE.Group();
    scene.add(heartGroup);

    // Color based on status
    const getColors = () => {
      if (status === 'critical') {
        return {
          main: 0xef4444,
          glow: 0xff0055,
          vessels: 0xfca5a5,
          ambient: 0x450a0a,
        };
      }
      if (status === 'warning') {
        return {
          main: 0xf59e0b,
          glow: 0xffaa00,
          vessels: 0xfde68a,
          ambient: 0x451a03,
        };
      }
      return {
        main: 0x06b6d4,
        glow: 0x0ea5e9,
        vessels: 0x38bdf8,
        ambient: 0x082f49,
      };
    };

    const colors = getColors();

    // 1. Procedural Left & Right Ventricles and Atria Geometry
    // Parametric heart shape geometry
    const heartShape = new THREE.Shape();
    const x = 0, y = 0;
    heartShape.moveTo(x + 0.5, y + 0.5);
    heartShape.bezierCurveTo(x + 0.5, y + 0.5, x + 0.4, y, x, y);
    heartShape.bezierCurveTo(x - 0.6, y, x - 0.6, y + 0.7, x - 0.6, y + 0.7);
    heartShape.bezierCurveTo(x - 0.6, y + 1.1, x - 0.3, y + 1.54, x + 0.5, y + 1.9);
    heartShape.bezierCurveTo(x + 1.2, y + 1.54, x + 1.6, y + 1.1, x + 1.6, y + 0.7);
    heartShape.bezierCurveTo(x + 1.6, y + 0.7, x + 1.6, y, x + 1.0, y);
    heartShape.bezierCurveTo(x + 0.7, y, x + 0.5, y + 0.5, x + 0.5, y + 0.5);

    const extrudeSettings = {
      depth: 0.8,
      bevelEnabled: true,
      bevelSegments: 8,
      steps: 4,
      bevelSize: 0.3,
      bevelThickness: 0.3,
    };

    const heartGeo = new THREE.ExtrudeGeometry(heartShape, extrudeSettings);
    heartGeo.center();

    // Heart main material with subtle iridescent specular
    const heartMat = new THREE.MeshPhysicalMaterial({
      color: colors.main,
      emissive: colors.glow,
      emissiveIntensity: 0.35,
      metalness: 0.2,
      roughness: 0.35,
      clearcoat: 0.8,
      clearcoatRoughness: 0.2,
      wireframe: false,
      transparent: true,
      opacity: 0.92,
    });

    const heartMesh = new THREE.Mesh(heartGeo, heartMat);
    heartMesh.rotation.z = Math.PI;
    heartMesh.scale.set(1.4, 1.4, 1.4);
    heartGroup.add(heartMesh);

    // 2. Wireframe Overlay for 3D Medical Hologram aesthetic
    const wireframeGeo = new THREE.WireframeGeometry(heartGeo);
    const wireframeMat = new THREE.LineBasicMaterial({
      color: colors.vessels,
      transparent: true,
      opacity: 0.35,
    });
    const wireframeLines = new THREE.LineSegments(wireframeGeo, wireframeMat);
    wireframeLines.rotation.z = Math.PI;
    wireframeLines.scale.set(1.405, 1.405, 1.405);
    heartGroup.add(wireframeLines);

    // 3. Aorta and Pulmonary Artery structures
    const aortaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(0.2, 1.2, 0),
      new THREE.Vector3(0.4, 1.8, 0.2),
      new THREE.Vector3(0.1, 2.3, -0.1),
      new THREE.Vector3(-0.6, 2.0, -0.3),
      new THREE.Vector3(-0.8, 1.4, -0.2),
    ]);
    const aortaGeo = new THREE.TubeGeometry(aortaCurve, 20, 0.22, 8, false);
    const aortaMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      roughness: 0.4,
      metalness: 0.3,
      emissive: 0x0284c7,
      emissiveIntensity: 0.3,
    });
    const aortaMesh = new THREE.Mesh(aortaGeo, aortaMat);
    heartGroup.add(aortaMesh);

    // Vena Cava
    const venaCurve = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.6, 1.2, 0.2),
      new THREE.Vector3(-0.7, 2.1, 0.1),
    ]);
    const venaGeo = new THREE.TubeGeometry(venaCurve, 10, 0.18, 8, false);
    const venaMesh = new THREE.Mesh(venaGeo, aortaMat);
    heartGroup.add(venaMesh);

    // 4. Bio-Pulse Ring Particles (Cardiac rhythm wave emitting outward)
    const particleCount = 80;
    const particleGeo = new THREE.BufferGeometry();
    const particlePos = new Float32Array(particleCount * 3);
    const particleAngles = new Float32Array(particleCount);

    for (let i = 0; i < particleCount; i++) {
      particleAngles[i] = (i / particleCount) * Math.PI * 2;
      particlePos[i * 3] = Math.cos(particleAngles[i]) * 2.2;
      particlePos[i * 3 + 1] = Math.sin(particleAngles[i]) * 2.2;
      particlePos[i * 3 + 2] = (Math.random() - 0.5) * 0.8;
    }
    particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePos, 3));

    const particleMat = new THREE.PointsMaterial({
      color: colors.vessels,
      size: 0.08,
      transparent: true,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // 5. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const dirLight1 = new THREE.DirectionalLight(0x38bdf8, 2.0);
    dirLight1.position.set(5, 5, 5);
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(colors.glow, 1.5);
    dirLight2.position.set(-5, -5, 2);
    scene.add(dirLight2);

    const pointLight = new THREE.PointLight(colors.glow, 2.5, 8);
    pointLight.position.set(0, 0, 1.5);
    heartGroup.add(pointLight);

    // Animation Loop
    let animationId: number;
    let clock = new THREE.Clock();

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetRotationX = 0;
    let targetRotationY = 0;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouseY = -(((e.clientY - rect.top) / rect.height) * 2 - 1);
      targetRotationY = mouseX * 0.6;
      targetRotationX = -mouseY * 0.4;
    };

    container.addEventListener('mousemove', handleMouseMove);

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Cardiac Beat Cycle calculation
      // Beats per second = bpm / 60
      const bps = Math.max(30, Math.min(220, bpm)) / 60;
      const beatCycle = (elapsedTime * bps * Math.PI * 2) % (Math.PI * 2);

      // Anatomical dual-systole pulse formula (lub-dub)
      let scaleOffset = 0;
      if (beatCycle < 0.6) {
        // First contraction (Atrial / Early Ventricular)
        scaleOffset = Math.sin(beatCycle * Math.PI / 0.6) * 0.12;
      } else if (beatCycle >= 0.7 && beatCycle < 1.3) {
        // Second contraction (Ventricular peak)
        scaleOffset = Math.sin((beatCycle - 0.7) * Math.PI / 0.6) * 0.08;
      }

      const currentScale = 1 + scaleOffset;
      heartMesh.scale.set(1.4 * currentScale, 1.4 * currentScale, 1.4 * currentScale);
      wireframeLines.scale.set(1.405 * currentScale, 1.405 * currentScale, 1.405 * currentScale);

      // Light pulsation with beat
      pointLight.intensity = 1.5 + scaleOffset * 10;

      // Smooth idle rotation + cursor tracking
      heartGroup.rotation.y += (targetRotationY - heartGroup.rotation.y) * 0.05 + Math.sin(elapsedTime * 0.5) * 0.002;
      heartGroup.rotation.x += (targetRotationX - heartGroup.rotation.x) * 0.05;

      // Pulse ring expansion
      const ringScale = 1 + ((elapsedTime * bps) % 1) * 0.8;
      particles.scale.set(ringScale, ringScale, 1);
      particleMat.opacity = Math.max(0, 0.8 - (((elapsedTime * bps) % 1) * 0.8));
      particles.rotation.z += 0.003;

      renderer.render(scene, camera);
    };

    animate();

    // Resize Observer
    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries[0]) return;
      const { width: newWidth, height: newHeight } = entries[0].contentRect;
      if (newWidth === 0 || newHeight === 0) return;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      container.removeEventListener('mousemove', handleMouseMove);
      resizeObserver.disconnect();
      renderer.dispose();
      heartGeo.dispose();
      heartMat.dispose();
      wireframeGeo.dispose();
      wireframeMat.dispose();
      aortaGeo.dispose();
      aortaMat.dispose();
      venaGeo.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [bpm, status]);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <div
        ref={containerRef}
        className="w-full h-full min-h-[220px] cursor-grab active:cursor-grabbing relative z-10"
        title="Interactive 3D Anatomical Heart Model (Rotate by hovering)"
      />
      
      {showLabels && (
        <div className="absolute bottom-2 left-3 right-3 z-20 flex items-center justify-between px-3 py-1.5 rounded-lg bg-slate-950/70 border border-cyan-500/20 backdrop-blur-md text-xs">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                status === 'critical' ? 'bg-rose-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
              <span className={`relative inline-flex rounded-full h-2 w-2 ${
                status === 'critical' ? 'bg-rose-500' : status === 'warning' ? 'bg-amber-500' : 'bg-emerald-500'
              }`} />
            </span>
            <span className="font-mono text-cyan-300 font-semibold">{bpm} BPM</span>
          </div>
          <span className="text-[11px] text-slate-400 font-mono">3D Real-Time Cardiac Mesh</span>
        </div>
      )}
    </div>
  );
};
