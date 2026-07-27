import React, { useState, useMemo } from 'react';
import {
  WoodenRoofParams,
  WoodenRoofResults,
} from '../types';
import {
  Box,
  RotateCw,
  Eye,
  Maximize2,
  ZoomIn,
  ZoomOut,
  Info,
  CheckCircle,
  AlertTriangle,
  Ruler,
  Layers,
  Sparkles,
  MoveHorizontal,
  Plus,
  Minus,
} from 'lucide-react';

interface Rafters3DVisualizerProps {
  params: WoodenRoofParams;
  onChange: (updated: WoodenRoofParams) => void;
  results: WoodenRoofResults;
}

type ViewPreset = 'isometric' | 'top-3d' | 'front-3d' | 'side-3d';

export const Rafters3DVisualizer: React.FC<Rafters3DVisualizerProps> = ({
  params,
  onChange,
  results,
}) => {
  // 3D View angle state
  const [yaw, setYaw] = useState<number>(35); // Horizontal rotation in degrees (-180 to 180)
  const [pitch, setPitch] = useState<number>(25); // Vertical tilt in degrees (5 to 80)
  const [zoom, setZoom] = useState<number>(1.0);
  const [selectedRafterIndex, setSelectedRafterIndex] = useState<number | null>(null);

  // Toggles
  const [showRoofCover, setShowRoofCover] = useState<boolean>(true);
  const [showSpacingLabels, setShowSpacingLabels] = useState<boolean>(true);
  const [showWallAndPosts, setShowWallAndPosts] = useState<boolean>(true);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);

  // Helper for actual meters
  const widthM = params.width / 100;
  const depthM = params.depth / 100;
  const heightWallM = params.heightAtWall / 100;
  const heightFrontM = params.heightAtFront / 100;
  const overhangM = params.frontOverhang / 100;

  // Rafter cross section in meters
  const rafterWidthM = params.rafterDimension.width / 100; // e.g. 0.07m
  const rafterHeightM = params.rafterDimension.height / 100; // e.g. 0.16m

  // Rafter count & spacing
  const raftersCount = results.raftersCount || Math.max(2, Math.round(widthM / 0.7) + 1);
  const actualSpacingCm = results.actualRafterSpacing || Math.round((widthM / (raftersCount - 1)) * 100);
  const clearSpacingCm = Math.max(0, actualSpacingCm - params.rafterDimension.width);

  // 3D Canvas dimensions
  const svgWidth = 800;
  const svgHeight = 480;
  const centerX = svgWidth / 2;
  const centerY = svgHeight / 2 + 50;

  // Scale factor (pixels per meter)
  const maxDim = Math.max(widthM, depthM, heightWallM);
  const baseScale = (220 / Math.max(2, maxDim)) * zoom;

  // 3D Projection math function: converts (X, Y, Z) in meters to SVG (screenX, screenY)
  // X: along width (0 at left, widthM at right, center at widthM/2)
  // Y: along depth (0 at wall, depthM + overhangM at front overhang)
  // Z: height above ground (0 at floor, heightWallM at wall top, heightFrontM at front beam)
  const project3D = (x: number, y: number, z: number) => {
    // Center X around 0
    const cx = x - widthM / 2;
    // Center Y around depthM / 2
    const cy = y - depthM / 2;
    // Center Z around average height
    const cz = z - (heightWallM + heightFrontM) / 4;

    const radYaw = (yaw * Math.PI) / 180;
    const radPitch = (pitch * Math.PI) / 180;

    // Rotate around Y axis (Yaw)
    const x1 = cx * Math.cos(radYaw) + cy * Math.sin(radYaw);
    const y1 = -cx * Math.sin(radYaw) + cy * Math.cos(radYaw);

    // Rotate around X axis (Pitch)
    const y2 = y1 * Math.cos(radPitch) - cz * Math.sin(radPitch);
    const z2 = y1 * Math.sin(radPitch) + cz * Math.cos(radPitch);

    const screenX = centerX + x1 * baseScale;
    const screenY = centerY - z2 * baseScale;

    return { x: screenX, y: screenY, depth: y2 };
  };

  // Preset camera angle views
  const setPresetView = (preset: ViewPreset) => {
    switch (preset) {
      case 'isometric':
        setYaw(35);
        setPitch(25);
        break;
      case 'top-3d':
        setYaw(0);
        setPitch(75);
        break;
      case 'front-3d':
        setYaw(0);
        setPitch(15);
        break;
      case 'side-3d':
        setYaw(75);
        setPitch(20);
        break;
    }
  };

  // Generate 3D Rafter positions
  const raftersData = useMemo(() => {
    const list = [];
    const count = raftersCount;
    const stepX = count > 1 ? widthM / (count - 1) : widthM;

    for (let i = 0; i < count; i++) {
      const posX = i * stepX;
      list.push({
        index: i,
        x: posX,
        label: `Krokwia ${i + 1}`,
      });
    }
    return list;
  }, [raftersCount, widthM]);

  // Adjust target spacing handler
  const handleSpacingChange = (deltaCm: number) => {
    const currentTarget = params.targetRafterSpacing;
    const newTarget = Math.min(130, Math.max(35, currentTarget + deltaCm));
    onChange({
      ...params,
      targetRafterSpacing: newTarget,
    });
  };

  // Rafter 3D Box geometry generator
  // Returns SVG polygon path for top, side, and front faces of a rafter at position rx
  const renderRafter3D = (rx: number, index: number) => {
    const isSelected = selectedRafterIndex === index;

    // Rafter dimensions
    const hw = rafterWidthM / 2;
    const xLeft = rx - hw;
    const xRight = rx + hw;

    const yStart = 0; // At wall ledger
    const yEnd = depthM + overhangM; // At front overhang tip

    const zStart = heightWallM;
    const slope = (heightFrontM - heightWallM) / depthM;
    const zEnd = heightWallM + slope * yEnd;

    const rafterDepthZ = rafterHeightM;

    // 8 3D Corners of the Rafter Box
    // Top-Back-Left, Top-Back-Right, Top-Front-Left, Top-Front-Right
    // Bottom-Back-Left, Bottom-Back-Right, Bottom-Front-Left, Bottom-Front-Right
    const p1 = project3D(xLeft, yStart, zStart); // Back Top Left
    const p2 = project3D(xRight, yStart, zStart); // Back Top Right
    const p3 = project3D(xRight, yEnd, zEnd); // Front Top Right
    const p4 = project3D(xLeft, yEnd, zEnd); // Front Top Left

    const p5 = project3D(xLeft, yStart, zStart - rafterDepthZ); // Back Bot Left
    const p6 = project3D(xRight, yStart, zStart - rafterDepthZ); // Back Bot Right
    const p7 = project3D(xRight, yEnd, zEnd - rafterDepthZ); // Front Bot Right
    const p8 = project3D(xLeft, yEnd, zEnd - rafterDepthZ); // Front Bot Left

    // Colors
    const topFill = isSelected ? '#3b82f6' : '#f59e0b';
    const sideFill = isSelected ? '#2563eb' : '#d97706';
    const frontFill = isSelected ? '#1d4ed8' : '#b45309';
    const strokeColor = isSelected ? '#60a5fa' : '#78350f';

    return (
      <g
        key={`rafter-${index}`}
        className="cursor-pointer transition-all duration-150"
        onClick={() => setSelectedRafterIndex(selectedRafterIndex === index ? null : index)}
        onMouseEnter={() => setSelectedRafterIndex(index)}
      >
        {/* Bottom Face */}
        <polygon
          points={`${p5.x},${p5.y} ${p6.x},${p6.y} ${p7.x},${p7.y} ${p8.x},${p8.y}`}
          fill={sideFill}
          opacity="0.8"
        />

        {/* Back Face */}
        <polygon
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p6.x},${p6.y} ${p5.x},${p5.y}`}
          fill={frontFill}
          opacity="0.9"
        />

        {/* Left Side Face */}
        <polygon
          points={`${p1.x},${p1.y} ${p4.x},${p4.y} ${p8.x},${p8.y} ${p5.x},${p5.y}`}
          fill={sideFill}
          stroke={strokeColor}
          strokeWidth="0.8"
        />

        {/* Right Side Face */}
        <polygon
          points={`${p2.x},${p2.y} ${p3.x},${p3.y} ${p7.x},${p7.y} ${p6.x},${p6.y}`}
          fill={sideFill}
          stroke={strokeColor}
          strokeWidth="0.8"
        />

        {/* Top Face */}
        <polygon
          points={`${p1.x},${p1.y} ${p2.x},${p2.y} ${p3.x},${p3.y} ${p4.x},${p4.y}`}
          fill={topFill}
          stroke={strokeColor}
          strokeWidth="1"
        />

        {/* Front End Cap Face */}
        <polygon
          points={`${p4.x},${p4.y} ${p3.x},${p3.y} ${p7.x},${p7.y} ${p8.x},${p8.y}`}
          fill={frontFill}
          stroke={strokeColor}
          strokeWidth="1"
        />

        {/* Rafter Index Label on Front Tip */}
        <text
          x={p3.x + (p8.x - p3.x) / 2}
          y={p3.y + 16}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill={isSelected ? '#2563eb' : '#475569'}
          className="pointer-events-none"
        >
          #{index + 1}
        </text>
      </g>
    );
  };

  // House Wall Projection
  const renderHouseWall3D = () => {
    if (!showWallAndPosts) return null;

    const w1 = project3D(0, 0, 0); // Wall bottom left
    const w2 = project3D(widthM, 0, 0); // Wall bottom right
    const w3 = project3D(widthM, 0, heightWallM + 0.5); // Wall top right
    const w4 = project3D(0, 0, heightWallM + 0.5); // Wall top left

    // Wall Ledger Beam (Belka przyścienna)
    const beamW1 = project3D(0, 0, heightWallM);
    const beamW2 = project3D(widthM, 0, heightWallM);
    const beamW3 = project3D(widthM, 0, heightWallM - params.wallBeamDimension.height / 100);
    const beamW4 = project3D(0, 0, heightWallM - params.wallBeamDimension.height / 100);

    return (
      <g key="house-wall" className="pointer-events-none">
        {/* House Wall Back Canvas */}
        <polygon
          points={`${w1.x},${w1.y} ${w2.x},${w2.y} ${w3.x},${w3.y} ${w4.x},${w4.y}`}
          fill="#e2e8f0"
          stroke="#cbd5e1"
          strokeWidth="1"
          opacity="0.85"
        />
        {/* Wall Hatching / Texture Lines */}
        <line x1={w1.x} y1={w1.y} x2={w4.x} y2={w4.y} stroke="#94a3b8" strokeWidth="2" />

        {/* Wall Ledger Beam (Murłata) */}
        <polygon
          points={`${beamW1.x},${beamW1.y} ${beamW2.x},${beamW2.y} ${beamW3.x},${beamW3.y} ${beamW4.x},${beamW4.y}`}
          fill="#92400e"
          stroke="#78350f"
          strokeWidth="1"
        />
        <text
          x={(beamW1.x + beamW2.x) / 2}
          y={(beamW1.y + beamW3.y) / 2 - 4}
          textAnchor="middle"
          fontSize="9"
          fontWeight="bold"
          fill="#fef3c7"
        >
          Belka przyścienna ({params.wallBeamDimension.width}x{params.wallBeamDimension.height} cm)
        </text>
      </g>
    );
  };

  // Front Posts & Purlin Beam
  const renderPostsAndFrontBeam3D = () => {
    if (!showWallAndPosts) return null;

    const postsCount = results.postsCount || 2;
    const postStep = postsCount > 1 ? widthM / (postsCount - 1) : widthM;
    const postWidthM = params.postDimension.width / 100;

    const elements = [];

    // Front Beam (Płatew przednia)
    const fb1 = project3D(0, depthM, heightFrontM);
    const fb2 = project3D(widthM, depthM, heightFrontM);
    const fb3 = project3D(widthM, depthM, heightFrontM - params.frontBeamDimension.height / 100);
    const fb4 = project3D(0, depthM, heightFrontM - params.frontBeamDimension.height / 100);

    elements.push(
      <polygon
        key="front-beam"
        points={`${fb1.x},${fb1.y} ${fb2.x},${fb2.y} ${fb3.x},${fb3.y} ${fb4.x},${fb4.y}`}
        fill="#b45309"
        stroke="#78350f"
        strokeWidth="1"
      />
    );

    // Posts (Słupy)
    for (let p = 0; p < postsCount; p++) {
      const px = p * postStep;
      const hw = postWidthM / 2;

      const topL = project3D(px - hw, depthM, heightFrontM - params.frontBeamDimension.height / 100);
      const topR = project3D(px + hw, depthM, heightFrontM - params.frontBeamDimension.height / 100);
      const botR = project3D(px + hw, depthM, 0);
      const botL = project3D(px - hw, depthM, 0);

      elements.push(
        <g key={`post-${p}`}>
          {/* Post Footing Steel Anchor */}
          <rect
            x={botL.x - 4}
            y={botL.y - 6}
            width={botR.x - botL.x + 8}
            height="8"
            fill="#64748b"
            rx="2"
          />
          {/* Post Pillar */}
          <polygon
            points={`${topL.x},${topL.y} ${topR.x},${topR.y} ${botR.x},${botR.y} ${botL.x},${botL.y}`}
            fill="#d97706"
            stroke="#78350f"
            strokeWidth="1"
          />
        </g>
      );
    }

    return <g key="front-posts-group">{elements}</g>;
  };

  // Roof Transparent Cover Panel
  const renderRoofCover3D = () => {
    if (!showRoofCover) return null;

    const slope = (heightFrontM - heightWallM) / depthM;
    const zOverhang = heightWallM + slope * (depthM + overhangM);

    const c1 = project3D(-0.05, -0.05, heightWallM + 0.02); // Wall Top Left
    const c2 = project3D(widthM + 0.05, -0.05, heightWallM + 0.02); // Wall Top Right
    const c3 = project3D(widthM + 0.05, depthM + overhangM + 0.05, zOverhang + 0.02); // Front Overhang Right
    const c4 = project3D(-0.05, depthM + overhangM + 0.05, zOverhang + 0.02); // Front Overhang Left

    return (
      <g key="roof-cover" className="pointer-events-none">
        <polygon
          points={`${c1.x},${c1.y} ${c2.x},${c2.y} ${c3.x},${c3.y} ${c4.x},${c4.y}`}
          fill="url(#polycarbonate-glass-gradient)"
          stroke="#38bdf8"
          strokeWidth="1.5"
          opacity="0.35"
        />
        {/* Reflection Lines */}
        <line x1={c1.x + 30} y1={c1.y + 20} x2={c4.x + 40} y2={c4.y - 20} stroke="#ffffff" strokeWidth="2" opacity="0.6" />
        <line x1={c1.x + 60} y1={c1.y + 20} x2={c4.x + 70} y2={c4.y - 20} stroke="#ffffff" strokeWidth="1" opacity="0.4" />
      </g>
    );
  };

  // Spacing Dimensions Brackets
  const renderSpacingDimensionLines = () => {
    if (!showSpacingLabels || raftersCount < 2) return null;

    const lines = [];
    const stepX = widthM / (raftersCount - 1);

    for (let i = 0; i < raftersCount - 1; i++) {
      const xA = i * stepX;
      const xB = (i + 1) * stepX;

      const pA = project3D(xA, depthM + overhangM, heightFrontM + (heightFrontM - heightWallM) * (overhangM / depthM));
      const pB = project3D(xB, depthM + overhangM, heightFrontM + (heightFrontM - heightWallM) * (overhangM / depthM));

      const midX = (pA.x + pB.x) / 2;
      const midY = (pA.y + pB.y) / 2 + 18;

      lines.push(
        <g key={`spacing-line-${i}`}>
          {/* Dimension Line */}
          <line
            x1={pA.x}
            y1={pA.y + 12}
            x2={pB.x}
            y2={pB.y + 12}
            stroke="#2563eb"
            strokeWidth="1.5"
            strokeDasharray="3 3"
          />
          {/* Tick Marks */}
          <line x1={pA.x} y1={pA.y + 7} x2={pA.x} y2={pA.y + 17} stroke="#2563eb" strokeWidth="1.5" />
          <line x1={pB.x} y1={pB.y + 7} x2={pB.x} y2={pB.y + 17} stroke="#2563eb" strokeWidth="1.5" />

          {/* Spacing Value Tag */}
          {i === 0 || i === Math.floor((raftersCount - 1) / 2) || i === raftersCount - 2 ? (
            <g>
              <rect
                x={midX - 22}
                y={midY - 9}
                width="44"
                height="16"
                fill="#ffffff"
                stroke="#93c5fd"
                rx="4"
              />
              <text
                x={midX}
                y={midY + 3}
                textAnchor="middle"
                fontSize="10"
                fontWeight="extrabold"
                fill="#1e40af"
              >
                {actualSpacingCm} cm
              </text>
            </g>
          ) : null}
        </g>
      );
    }

    // Overall Roof Width Dimension Line
    const pStart = project3D(0, 0, heightWallM + 0.3);
    const pEnd = project3D(widthM, 0, heightWallM + 0.3);
    const midWidthX = (pStart.x + pEnd.x) / 2;
    const midWidthY = (pStart.y + pEnd.y) / 2 - 14;

    lines.push(
      <g key="overall-width-line">
        <line x1={pStart.x} y1={pStart.y - 10} x2={pEnd.x} y2={pEnd.y - 10} stroke="#0284c7" strokeWidth="1.5" />
        <rect
          x={midWidthX - 45}
          y={midWidthY - 10}
          width="90"
          height="18"
          fill="#0284c7"
          rx="4"
        />
        <text
          x={midWidthX}
          y={midWidthY + 2}
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fill="#ffffff"
        >
          Szerokość: {widthM.toFixed(2)} m
        </text>
      </g>
    );

    return <g key="dimensions-group">{lines}</g>;
  };

  // Evaluation status of spacing
  const isSpacingOptimal = actualSpacingCm >= 55 && actualSpacingCm <= 85;
  const isSpacingWide = actualSpacingCm > 85;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      
      {/* HEADER BAR */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Box className="w-4 h-4 text-blue-600" />
            Wizualizacja 3D i Układ Krokwi Dachowych
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Trójwymiarowy podgląd rozkładu krokwi, odstępów osiowych oraz konstrukcji nośnej pergoli
          </p>
        </div>

        {/* QUICK CAMERA PRESETS */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setPresetView('isometric')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              yaw === 35 && pitch === 25 ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            3D Izometria
          </button>
          <button
            onClick={() => setPresetView('top-3d')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              pitch === 75 ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rzut z Góry
          </button>
          <button
            onClick={() => setPresetView('front-3d')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              pitch === 15 && yaw === 0 ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Widok od Przodu
          </button>
          <button
            onClick={() => setPresetView('side-3d')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
              yaw === 75 ? 'bg-blue-600 text-white shadow-2xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Profil Boczny
          </button>
        </div>
      </div>

      {/* QUICK STATS & SPACING ADJUSTMENT BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-blue-50/60 p-4 rounded-xl border border-blue-100">
        <div className="md:col-span-8 flex flex-wrap items-center gap-6">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Liczba krokwi:</span>
            <span className="text-xl font-extrabold text-blue-700">{raftersCount} szt.</span>
          </div>
          <div className="h-8 w-px bg-blue-200 hidden sm:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Rozstaw osiowy:</span>
            <span className="text-xl font-extrabold text-slate-900">{actualSpacingCm} cm</span>
          </div>
          <div className="h-8 w-px bg-blue-200 hidden sm:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Odstęp w świetle:</span>
            <span className="text-xl font-extrabold text-slate-800">{clearSpacingCm} cm</span>
          </div>
          <div className="h-8 w-px bg-blue-200 hidden sm:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">Przekrój krokwi:</span>
            <span className="text-sm font-bold text-slate-700">{params.rafterDimension.width} x {params.rafterDimension.height} cm</span>
          </div>
        </div>

        {/* INTERACTIVE SPACING STEPPER BUTTONS */}
        <div className="md:col-span-4 flex items-center justify-end gap-2 bg-white p-2 rounded-xl border border-blue-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-600 mr-1">Zmień rozstaw:</span>
          <button
            onClick={() => handleSpacingChange(-5)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition cursor-pointer"
            title="Gęstszy rozstaw (zmniejsz o 5 cm)"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-bold text-slate-800 px-1 min-w-[50px] text-center">
            {params.targetRafterSpacing} cm
          </span>
          <button
            onClick={() => handleSpacingChange(5)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition cursor-pointer"
            title="Rzadszy rozstaw (zwiększ o 5 cm)"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* VIEW CONTROLS & TOGGLES */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-slate-50 px-4 py-2.5 rounded-xl border border-slate-200">
        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 font-medium">
            <input
              type="checkbox"
              checked={showRoofCover}
              onChange={(e) => setShowRoofCover(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Pokrycie dachu (przezroczyste)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 font-medium">
            <input
              type="checkbox"
              checked={showSpacingLabels}
              onChange={(e) => setShowSpacingLabels(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Etykiety rozstawu osiowego</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-900 font-medium">
            <input
              type="checkbox"
              checked={showWallAndPosts}
              onChange={(e) => setShowWallAndPosts(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Ściana i Słupy nośne</span>
          </label>
        </div>

        {/* ROTATION SLIDERS */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <RotateCw className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-[11px] text-slate-500">Obrót X:</span>
            <input
              type="range"
              min="-90"
              max="90"
              value={yaw}
              onChange={(e) => setYaw(parseInt(e.target.value))}
              className="w-16 accent-blue-600 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500">Kąt Y:</span>
            <input
              type="range"
              min="5"
              max="85"
              value={pitch}
              onChange={(e) => setPitch(parseInt(e.target.value))}
              className="w-16 accent-blue-600 cursor-pointer"
            />
          </div>
          <div className="flex items-center gap-1 pl-2 border-l border-slate-200">
            <button
              onClick={() => setZoom(Math.max(0.6, zoom - 0.15))}
              className="p-1 rounded hover:bg-slate-200 text-slate-600"
              title="Pomniejsz"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setZoom(Math.min(2.0, zoom + 0.15))}
              className="p-1 rounded hover:bg-slate-200 text-slate-600"
              title="Powiększ"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MAIN 3D SVG VIEWPORT */}
      <div className="relative border border-slate-200 rounded-2xl bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 overflow-hidden shadow-inner p-2 min-h-[420px] flex items-center justify-center">
        
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[500px] select-none"
        >
          <defs>
            {/* Polycarbonate Glass Gradient */}
            <linearGradient id="polycarbonate-glass-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.4" />
              <stop offset="50%" stopColor="#818cf8" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#0284c7" stopOpacity="0.45" />
            </linearGradient>

            {/* Timber Gradient */}
            <linearGradient id="timber-wood-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>

            {/* Ground Grid Pattern */}
            <pattern id="ground-grid-3d" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#334155" strokeWidth="0.5" opacity="0.4" />
            </pattern>
          </defs>

          {/* Ground Grid Layer */}
          <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="url(#ground-grid-3d)" />

          {/* Render 3D Scene Elements in Back-to-Front Order */}
          {renderHouseWall3D()}
          {renderPostsAndFrontBeam3D()}

          {/* Render All Rafters in 3D */}
          {raftersData.map((rafter) => renderRafter3D(rafter.x, rafter.index))}

          {/* Render Roof Cover Layer */}
          {renderRoofCover3D()}

          {/* Render Spacing Dimension Lines & Labels */}
          {renderSpacingDimensionLines()}
        </svg>

        {/* FLOATING INSPECTOR CARD WHEN RAFTER IS SELECTED */}
        {selectedRafterIndex !== null && (
          <div className="absolute bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-xl border border-slate-700 shadow-xl space-y-2 animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="font-bold text-sm text-blue-400 flex items-center gap-2">
                <Ruler className="w-4 h-4 text-blue-400" />
                Specyfikacja Krokwi #{selectedRafterIndex + 1} z {raftersCount}
              </span>
              <button
                onClick={() => setSelectedRafterIndex(null)}
                className="text-xs text-slate-400 hover:text-white px-2 py-0.5 rounded bg-slate-800"
              >
                Zamknij ✕
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-slate-400 block">Położenie na belce:</span>
                <strong className="text-slate-100">
                  {((selectedRafterIndex * widthM) / (raftersCount - 1)).toFixed(2)} m od lewej krawędzi
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Przekrój poprzeczny:</span>
                <strong className="text-amber-400">
                  {params.rafterDimension.width} x {params.rafterDimension.height} cm
                </strong>
              </div>
              <div>
                <span className="text-slate-400 block">Całkowita długość:</span>
                <strong className="text-slate-100">{results.rafterLength} m</strong>
              </div>
              <div>
                <span className="text-slate-400 block">Rozstaw od sąsiedniej:</span>
                <strong className="text-blue-300">{actualSpacingCm} cm osiowo</strong>
              </div>
            </div>
          </div>
        )}

        {/* SPACING EVALUATION BADGE ON 3D CANVAS */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-md p-2.5 rounded-xl border border-slate-700 text-xs text-white flex items-center gap-2">
          {isSpacingOptimal ? (
            <>
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <div>
                <span className="font-bold text-emerald-400 block">Optymalny Rozstaw</span>
                <span className="text-[10px] text-slate-300">Zalecany dla {params.roofCoverType.replace('_', ' ')}</span>
              </div>
            </>
          ) : isSpacingWide ? (
            <>
              <AlertTriangle className="w-4 h-4 text-amber-400" />
              <div>
                <span className="font-bold text-amber-400 block">Szeroki Rozstaw ({actualSpacingCm} cm)</span>
                <span className="text-[10px] text-slate-300">Sprawdź nośność paneli pod obciążeniem śniegiem</span>
              </div>
            </>
          ) : (
            <>
              <Info className="w-4 h-4 text-blue-400" />
              <div>
                <span className="font-bold text-blue-400 block">Gęsty Rozstaw ({actualSpacingCm} cm)</span>
                <span className="text-[10px] text-slate-300">Bardzo wysoka sztywność konstrukcji</span>
              </div>
            </>
          )}
        </div>
      </div>

    </div>
  );
};
