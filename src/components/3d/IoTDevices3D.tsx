import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { IoTDevice } from '../../types';

interface IoTDevices3DProps {
  device: IoTDevice;
  className?: string;
}

export const IoTDevices3D: React.FC<IoTDevices3DProps> = ({ device, className = '' }) => {
  const mountRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const width = container.clientWidth || 240;
    const height = container.clientHeight || 180;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 100);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const group = new THREE.Group();
    scene.add(group);

    const isConnected = device.connected;
    const accentColor = isConnected ? 0x06b6d4 : 0x64748b;
    const glowColor = isConnected ? 0x38bdf8 : 0x334155;

    // Build specific 3D model according to device type
    if (device.type === 'heart_rate') {
      // ECG Sensor Hub (Hexagonal pod with electrodes)
      const podGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.4, 6);
      const podMat = new THREE.MeshStandardMaterial({
        color: 0x0f172a,
        metalness: 0.8,
        roughness: 0.2,
      });
      const pod = new THREE.Mesh(podGeo, podMat);
      pod.rotation.x = Math.PI / 4;
      group.add(pod);

      // Glowing heart sensor center
      const sensorGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.45, 16);
      const sensorMat = new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: glowColor,
        emissiveIntensity: isConnected ? 0.8 : 0.1,
      });
      const sensor = new THREE.Mesh(sensorGeo, sensorMat);
      sensor.rotation.x = Math.PI / 4;
      group.add(sensor);

      // Electrodes (left and right)
      const elGeo = new THREE.BoxGeometry(0.5, 0.15, 0.2);
      const elMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.9 });
      const elL = new THREE.Mesh(elGeo, elMat);
      elL.position.set(-1.3, 0, 0);
      group.add(elL);
      const elR = new THREE.Mesh(elGeo, elMat);
      elR.position.set(1.3, 0, 0);
      group.add(elR);
    } else if (device.type === 'blood_pressure') {
      // Smart Cuff Tube + Digital Display Unit
      const cuffGeo = new THREE.TorusGeometry(1.1, 0.35, 16, 32, Math.PI * 1.6);
      const cuffMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
      const cuff = new THREE.Mesh(cuffGeo, cuffMat);
      cuff.rotation.x = Math.PI / 3;
      group.add(cuff);

      const unitGeo = new THREE.BoxGeometry(1.1, 0.8, 0.3);
      const unitMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.5 });
      const unit = new THREE.Mesh(unitGeo, unitMat);
      unit.position.set(0, 0.6, 0.5);
      unit.rotation.x = -Math.PI / 6;
      group.add(unit);

      // Screen
      const screenGeo = new THREE.PlaneGeometry(0.8, 0.5);
      const screenMat = new THREE.MeshBasicMaterial({ color: isConnected ? 0x0284c7 : 0x1e293b });
      const screen = new THREE.Mesh(screenGeo, screenMat);
      screen.position.set(0, 0.6, 0.66);
      screen.rotation.x = -Math.PI / 6;
      group.add(screen);
    } else if (device.type === 'pulse_oximeter') {
      // Clip design
      const clipGeo1 = new THREE.BoxGeometry(1.6, 0.4, 0.9);
      const clipMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.6 });
      const clip1 = new THREE.Mesh(clipGeo1, clipMat);
      clip1.position.y = 0.3;
      group.add(clip1);

      const clip2 = new THREE.Mesh(clipGeo1, clipMat);
      clip2.position.y = -0.3;
      group.add(clip2);

      // Optical infrared sensor emitter
      const ledGeo = new THREE.SphereGeometry(0.18, 16, 16);
      const ledMat = new THREE.MeshBasicMaterial({ color: isConnected ? 0xef4444 : 0x475569 });
      const led = new THREE.Mesh(ledGeo, ledMat);
      led.position.set(-0.2, 0.1, 0);
      group.add(led);
    } else {
      // Bio-Patch
      const patchGeo = new THREE.CylinderGeometry(1.2, 1.2, 0.15, 32);
      const patchMat = new THREE.MeshStandardMaterial({
        color: 0x0369a1,
        metalness: 0.3,
        roughness: 0.4,
        emissive: glowColor,
        emissiveIntensity: 0.3,
      });
      const patch = new THREE.Mesh(patchGeo, patchMat);
      patch.rotation.x = Math.PI / 3;
      group.add(patch);
    }

    // Lights
    const ambient = new THREE.AmbientLight(0xffffff, 0.9);
    scene.add(ambient);
    const light = new THREE.DirectionalLight(0x38bdf8, 1.8);
    light.position.set(3, 4, 5);
    scene.add(light);

    let animationId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationId = requestAnimationFrame(animate);
      const delta = clock.getElapsedTime();
      group.rotation.y = Math.sin(delta * 0.8) * 0.4;
      group.rotation.x = Math.cos(delta * 0.5) * 0.2;
      renderer.render(scene, camera);
    };

    animate();

    const resizeObserver = new ResizeObserver(() => {
      if (!container) return;
      const nw = container.clientWidth || 240;
      const nh = container.clientHeight || 180;
      camera.aspect = nw / nh;
      camera.updateProjectionMatrix();
      renderer.setSize(nw, nh);
    });
    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationId);
      resizeObserver.disconnect();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [device]);

  return <div ref={mountRef} className={`w-full h-full min-h-[160px] ${className}`} />;
};
