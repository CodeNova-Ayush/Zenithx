'use client';

import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { CAMPUS_BUILDINGS, CATEGORY_COLORS } from '@/lib/constants';
import { RotateCcw, Droplets, Zap, ShieldCheck, Wifi, Sparkles, X, ArrowRight, Building2, MapPin } from 'lucide-react';
import Link from 'next/link';

interface IncidentBeacon {
  id: string;
  buildingName: string;
  category: 'plumbing' | 'electricity' | 'cleanliness' | 'internet';
  position: [number, number, number];
  ticketCount: number;
  priority: 'Urgent' | 'High' | 'Normal';
  headline: string;
}

const DEMO_BEACONS: IncidentBeacon[] = [
  {
    id: 'beacon-1',
    buildingName: 'Tagore Hostel (Block C)',
    category: 'plumbing',
    position: [-3.5, 4.2, 2.5],
    ticketCount: 3,
    priority: 'Urgent',
    headline: 'Continuous freshwater leak under washroom sink',
  },
  {
    id: 'beacon-2',
    buildingName: 'APJ Abdul Kalam Engineering Quad',
    category: 'electricity',
    position: [3.2, 5.2, 2.2],
    ticketCount: 2,
    priority: 'Urgent',
    headline: 'Lab 204 breaker tripped with intermittent voltage drops',
  },
  {
    id: 'beacon-3',
    buildingName: 'Central Knowledge Commons (Library)',
    category: 'internet',
    position: [0.0, 3.8, 0.0],
    ticketCount: 2,
    priority: 'High',
    headline: 'Wi-Fi AP dropouts in 2nd Floor Study Pods',
  },
  {
    id: 'beacon-4',
    buildingName: 'Student Dining & Recreational Center',
    category: 'cleanliness',
    position: [-0.2, 3.2, -3.5],
    ticketCount: 1,
    priority: 'Normal',
    headline: 'Spill hazard reported near north entrance cafeteria',
  },
  {
    id: 'beacon-5',
    buildingName: 'Aryabhatta Science & Technology Center',
    category: 'electricity',
    position: [3.0, 4.5, -2.8],
    ticketCount: 1,
    priority: 'High',
    headline: 'Corridor emergency lighting failure on 3rd floor',
  },
];

export default function LivingCampus() {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedBuilding, setSelectedBuilding] = useState<string | null>(null);
  const [activeBeacon, setActiveBeacon] = useState<IncidentBeacon | null>(null);
  const [webGlSupported, setWebGlSupported] = useState(true);

  const resetCameraRef = useRef<() => void>(() => {});

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    try {
      const testCanvas = document.createElement('canvas');
      const gl = testCanvas.getContext('webgl') || testCanvas.getContext('experimental-webgl');
      if (!gl) {
        setWebGlSupported(false);
        return;
      }
    } catch {
      setWebGlSupported(false);
      return;
    }

    const width = container.clientWidth || 800;
    const height = container.clientHeight || 520;

    // 1. Scene: Warm architectural aesthetic complementing the paper texture
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF6F2EB);
    scene.fog = new THREE.FogExp2(0xF6F2EB, 0.028);

    // 2. Camera setup
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    const defaultCamPos = new THREE.Vector3(14, 13, 16);
    camera.position.copy(defaultCamPos);
    camera.lookAt(0, 0, 0);

    // 3. Renderer with high-definition soft shadows
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xFFFBF4, 1.8);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xFFFAF0, 2.0);
    sunLight.position.set(15, 22, 12);
    sunLight.castShadow = true;
    sunLight.shadow.mapSize.width = 2048;
    sunLight.shadow.mapSize.height = 2048;
    sunLight.shadow.camera.near = 0.5;
    sunLight.shadow.camera.far = 60;
    sunLight.shadow.camera.left = -16;
    sunLight.shadow.camera.right = 16;
    sunLight.shadow.camera.top = 16;
    sunLight.shadow.camera.bottom = -16;
    sunLight.shadow.bias = -0.0005;
    scene.add(sunLight);

    const fillLight = new THREE.DirectionalLight(0xE8DFD1, 0.9);
    fillLight.position.set(-12, 10, -12);
    scene.add(fillLight);

    // 5. Ground Plane with Architectural Grid
    const groundGeo = new THREE.PlaneGeometry(32, 32);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0xE8DFD1,
      roughness: 0.9,
      metalness: 0.05,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(32, 32, 0x9AA38A, 0xDCD4C5);
    grid.position.y = 0.015;
    scene.add(grid);

    // 6. Connecting Walkways with Animated Energy Pulses
    const walkwayMat = new THREE.MeshStandardMaterial({
      color: 0xD6CDC0,
      roughness: 0.85,
    });
    const pathX = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 28), walkwayMat);
    pathX.rotation.x = -Math.PI / 2;
    pathX.position.y = 0.025;
    scene.add(pathX);

    const pathZ = new THREE.Mesh(new THREE.PlaneGeometry(28, 1.6), walkwayMat);
    pathZ.rotation.x = -Math.PI / 2;
    pathZ.position.y = 0.025;
    scene.add(pathZ);

    // Central Plaza Octagon
    const plazaGeo = new THREE.CylinderGeometry(2.4, 2.6, 0.06, 8);
    const plazaMat = new THREE.MeshStandardMaterial({ color: 0xCFBFAB, roughness: 0.7 });
    const plaza = new THREE.Mesh(plazaGeo, plazaMat);
    plaza.position.y = 0.03;
    plaza.receiveShadow = true;
    scene.add(plaza);

    // 7. Architectural Buildings with Multi-Tiered Geometry
    const buildingGroup = new THREE.Group();
    const buildingMeshes: THREE.Mesh[] = [];

    CAMPUS_BUILDINGS.forEach((b) => {
      let bHeight = 3.0;
      let bWidth = 2.8;
      let bDepth = 2.4;
      let wallColor = 0x35483A; // deep forest green

      if (b.type === 'hostel') {
        bHeight = 3.8;
        bWidth = 3.2;
        bDepth = 2.6;
        wallColor = 0x2C3D31;
      } else if (b.type === 'academic') {
        bHeight = 4.8;
        bWidth = 3.6;
        bDepth = 3.2;
        wallColor = 0x35483A;
      } else if (b.type === 'library') {
        bHeight = 2.8;
        bWidth = 4.2;
        bDepth = 4.2;
        wallColor = 0x443D36;
      } else if (b.type === 'dining') {
        bHeight = 2.2;
        bWidth = 3.4;
        bDepth = 3.0;
        wallColor = 0x484B3D;
      }

      // Building Structure
      const bGeo = new THREE.BoxGeometry(bWidth, bHeight, bDepth);
      const bMat = new THREE.MeshStandardMaterial({
        color: wallColor,
        metalness: 0.12,
        roughness: 0.65,
      });
      const bMesh = new THREE.Mesh(bGeo, bMat);
      bMesh.position.set(b.coordinates.x, bHeight / 2, b.coordinates.z);
      bMesh.castShadow = true;
      bMesh.receiveShadow = true;
      bMesh.userData = { buildingName: b.building, id: b.id, originalY: bHeight / 2 };
      buildingGroup.add(bMesh);
      buildingMeshes.push(bMesh);

      // Architectural Rooftop Pavilion & Solar Array
      const roofGeo = new THREE.BoxGeometry(bWidth * 0.88, 0.35, bDepth * 0.88);
      const roofMat = new THREE.MeshStandardMaterial({
        color: 0xEDE4D7,
        roughness: 0.85,
        metalness: 0.1,
      });
      const roofMesh = new THREE.Mesh(roofGeo, roofMat);
      roofMesh.position.set(b.coordinates.x, bHeight + 0.18, b.coordinates.z);
      roofMesh.castShadow = true;
      buildingGroup.add(roofMesh);

      // Solar panel modules on roof
      const solarGeo = new THREE.BoxGeometry(bWidth * 0.65, 0.08, bDepth * 0.65);
      const solarMat = new THREE.MeshStandardMaterial({ color: 0x223028, roughness: 0.3, metalness: 0.8 });
      const solar = new THREE.Mesh(solarGeo, solarMat);
      solar.position.set(b.coordinates.x, bHeight + 0.38, b.coordinates.z);
      buildingGroup.add(solar);

      // Floor Windows Ribbon Strips
      const windowGeo = new THREE.BoxGeometry(bWidth + 0.05, 0.16, bDepth + 0.05);
      const windowMat = new THREE.MeshBasicMaterial({ color: 0xF4F6EE, transparent: true, opacity: 0.8 });
      for (let f = 1; f < b.floors.length; f++) {
        const win = new THREE.Mesh(windowGeo, windowMat);
        win.position.set(b.coordinates.x, (bHeight / b.floors.length) * f, b.coordinates.z);
        buildingGroup.add(win);
      }
    });

    scene.add(buildingGroup);

    // 8. Glowing Incident Beacons & Holographic Aura Rings
    const beaconGroup = new THREE.Group();
    const beaconObjects: { group: THREE.Group; beacon: IncidentBeacon; ringMesh: THREE.Mesh }[] = [];

    DEMO_BEACONS.forEach((b) => {
      const bObj = new THREE.Group();
      bObj.position.set(b.position[0], b.position[1], b.position[2]);

      let glowColor = 0x0EA5E9; // cyan for plumbing
      if (b.category === 'electricity') glowColor = 0xF59E0B; // amber
      if (b.category === 'cleanliness') glowColor = 0x10B981; // emerald
      if (b.category === 'internet') glowColor = 0x8B5CF6; // violet

      // Center floating diamond crystal
      const crystalGeo = new THREE.OctahedronGeometry(0.35, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: glowColor,
        emissive: glowColor,
        emissiveIntensity: 0.6,
        roughness: 0.2,
      });
      const crystal = new THREE.Mesh(crystalGeo, crystalMat);
      crystal.userData = { isBeacon: true, beaconData: b };
      bObj.add(crystal);

      // Outer Pulsing Holographic Ring
      const ringGeo = new THREE.RingGeometry(0.45, 0.65, 24);
      const ringMat = new THREE.MeshBasicMaterial({
        color: glowColor,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.rotation.x = Math.PI / 2;
      bObj.add(ringMesh);

      // Vertical Laser Line connecting to building roof
      const laserGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.4, 8);
      const laserMat = new THREE.MeshBasicMaterial({
        color: glowColor,
        transparent: true,
        opacity: 0.55,
      });
      const laser = new THREE.Mesh(laserGeo, laserMat);
      laser.position.y = -0.7;
      bObj.add(laser);

      beaconGroup.add(bObj);
      beaconObjects.push({ group: bObj, beacon: b, ringMesh });
    });

    scene.add(beaconGroup);

    // 9. Floating Ambient Campus Particle Field
    const particleCount = 80;
    const pGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount * 3; i += 3) {
      pPos[i] = (Math.random() - 0.5) * 24;
      pPos[i + 1] = Math.random() * 8 + 0.5;
      pPos[i + 2] = (Math.random() - 0.5) * 24;
    }
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0x9AA38A,
      size: 0.15,
      transparent: true,
      opacity: 0.5,
    });
    const particles = new THREE.Points(pGeo, pMat);
    scene.add(particles);

    // 10. Interactive Drag Orbit & Mouse Parallax
    let isDragging = false;
    let prevMouseX = 0;
    let prevMouseY = 0;
    let cameraAngle = 0.75;
    let cameraElevation = 0.65;
    let cameraDistance = 24;

    const onMouseDown = (e: MouseEvent) => {
      isDragging = true;
      prevMouseX = e.clientX;
      prevMouseY = e.clientY;
    };

    const onMouseUp = () => {
      isDragging = false;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        const deltaX = e.clientX - prevMouseX;
        const deltaY = e.clientY - prevMouseY;
        cameraAngle -= deltaX * 0.007;
        cameraElevation = Math.max(0.25, Math.min(1.3, cameraElevation + deltaY * 0.005));
        prevMouseX = e.clientX;
        prevMouseY = e.clientY;
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      cameraDistance = Math.max(12, Math.min(34, cameraDistance + e.deltaY * 0.02));
    };

    // Raycaster for click inspections
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    const onClick = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      pointer.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObjects(scene.children, true);

      if (intersects.length > 0) {
        for (const hit of intersects) {
          if (hit.object.userData?.isBeacon) {
            const b = hit.object.userData.beaconData as IncidentBeacon;
            setActiveBeacon(b);
            setSelectedBuilding(b.buildingName);
            return;
          }
          if (hit.object.userData?.buildingName) {
            const bName = hit.object.userData.buildingName;
            setSelectedBuilding(bName);
            const matchingBeacon = DEMO_BEACONS.find(b => b.buildingName === bName);
            setActiveBeacon(matchingBeacon || null);
            return;
          }
        }
      }
    };

    container.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    container.addEventListener('mousemove', onMouseMove);
    container.addEventListener('wheel', onWheel, { passive: false });
    container.addEventListener('click', onClick);

    resetCameraRef.current = () => {
      cameraAngle = 0.75;
      cameraElevation = 0.65;
      cameraDistance = 24;
      setSelectedBuilding(null);
      setActiveBeacon(null);
    };

    // 11. Animation Loop with Real-Time Hologram Pulsing
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation based on spherical orbit angles
      const targetX = Math.sin(cameraAngle) * Math.cos(cameraElevation) * cameraDistance;
      const targetY = Math.sin(cameraElevation) * cameraDistance;
      const targetZ = Math.cos(cameraAngle) * Math.cos(cameraElevation) * cameraDistance;

      camera.position.x += (targetX - camera.position.x) * 0.06;
      camera.position.y += (targetY - camera.position.y) * 0.06;
      camera.position.z += (targetZ - camera.position.z) * 0.06;
      camera.lookAt(0, 1.2, 0);

      // Animate Beacon Crystals & Pulsing Hologram Rings
      beaconObjects.forEach(({ group, ringMesh }, i) => {
        // Floating bob
        group.position.y = DEMO_BEACONS[i].position[1] + Math.sin(elapsedTime * 2.5 + i) * 0.15;
        // Crystal rotation
        group.rotation.y = elapsedTime * 1.2 + i;
        // Ring pulsing scale & opacity
        const pulse = (Math.sin(elapsedTime * 3.5 + i) + 1) / 2;
        ringMesh.scale.set(1 + pulse * 0.5, 1 + pulse * 0.5, 1);
        (ringMesh.material as THREE.MeshBasicMaterial).opacity = 0.8 - pulse * 0.5;
      });

      // Ambient particle motion
      particles.rotation.y = elapsedTime * 0.02;

      renderer.render(scene, camera);
    };

    animate();

    const onResize = () => {
      const w = container.clientWidth || 800;
      const h = container.clientHeight || 520;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };

    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      container.removeEventListener('mousemove', onMouseMove);
      container.removeEventListener('wheel', onWheel);
      container.removeEventListener('click', onClick);
      window.removeEventListener('resize', onResize);

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, []);

  return (
    <div className="relative w-full h-[480px] sm:h-[560px] select-none rounded-2xl overflow-hidden bg-[#F6F2EB] border border-[#E7E1D7]">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* Top Floating Badge Bar */}
      <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between gap-2 pointer-events-none z-10">
        <div className="flex items-center gap-2 bg-[#FCFAF6]/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#D5CEBF] shadow-xs pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="font-mono text-xs font-bold text-[#24251F] tracking-wide uppercase whitespace-nowrap">
            Living Campus 3D Twin
          </span>
        </div>

        <button
          onClick={() => resetCameraRef.current()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FCFAF6]/95 backdrop-blur-md border border-[#D5CEBF] hover:bg-[#EDE4D7] text-xs font-mono font-semibold text-[#24251F] transition-colors shadow-xs pointer-events-auto whitespace-nowrap cursor-pointer"
        >
          <RotateCcw className="w-3.5 h-3.5 text-[#35483A]" />
          <span>Reset View</span>
        </button>
      </div>

      {/* Interactive Beacon Category Legend Pill */}
      <div className="absolute bottom-4 left-4 z-10 bg-[#FCFAF6]/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-[#D5CEBF] shadow-sm flex flex-col gap-1.5 pointer-events-auto">
        <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#77766E]">
          Active Incident Holograms (Drag to Rotate • Click to Inspect):
        </span>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-800 border border-sky-200">
            <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
            <span>Plumbing</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Electrical</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sanitation</span>
          </div>
          <div className="flex items-center gap-1.5 text-xs font-mono font-bold px-2 py-0.5 rounded bg-purple-50 text-purple-800 border border-purple-200">
            <span className="w-2 h-2 rounded-full bg-purple-500 animate-pulse" />
            <span>Wi-Fi Network</span>
          </div>
        </div>
      </div>

      {/* Selected Facility Telemetry Drawer */}
      {selectedBuilding && (
        <div className="absolute top-16 right-4 w-72 sm:w-80 bg-[#FCFAF6]/98 backdrop-blur-md rounded-xl border border-[#35483A]/30 p-4 shadow-xl z-20 space-y-3 animate-in slide-in-from-right-4 duration-200">
          <div className="flex items-start justify-between pb-2 border-b border-[#E7E1D7]">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#35483A]">
                Facility Telemetry
              </span>
              <h4 className="text-sm font-serif font-bold text-[#24251F]">
                {selectedBuilding}
              </h4>
            </div>
            <button
              onClick={() => {
                setSelectedBuilding(null);
                setActiveBeacon(null);
              }}
              className="p-1 rounded-md hover:bg-[#EDE4D7] text-[#77766E]"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {activeBeacon ? (
            <div className="p-3 rounded-lg bg-[#F8F4ED] border border-[#E7E1D7] text-xs space-y-2">
              <div className="flex items-center justify-between font-mono">
                <span className="font-bold text-[#35483A] uppercase tracking-wider">
                  Active Incident ({activeBeacon.priority})
                </span>
                <span className="text-[11px] text-[#77766E] font-bold">
                  {activeBeacon.ticketCount} Open Ticket(s)
                </span>
              </div>
              <p className="text-[#24251F] font-medium leading-snug">
                {activeBeacon.headline}
              </p>
              <div className="pt-1 flex items-center justify-between">
                <Link
                  href="/staff/tickets"
                  className="font-mono text-[11px] font-bold text-[#35483A] hover:underline flex items-center gap-1"
                >
                  <span>Dispatch Qualified Tech</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          ) : (
            <p className="text-xs text-[#77766E] font-mono">
              All infrastructure nominal in this facility. Zero unresolved emergency incidents.
            </p>
          )}

          <div className="flex justify-between text-[11px] font-mono text-[#77766E] pt-1 border-t border-[#E7E1D7]">
            <span>STATUS: MONITORED</span>
            <span className="text-emerald-700 font-bold">SLA: 94.2%</span>
          </div>
        </div>
      )}
    </div>
  );
}
