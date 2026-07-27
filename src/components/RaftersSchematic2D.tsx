import React, { useState, useMemo } from 'react';
import {
  WoodenRoofParams,
  WoodenRoofResults,
} from '../types';
import {
  Ruler,
  Info,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Grid,
  Layers,
} from 'lucide-react';

interface RaftersSchematic2DProps {
  params: WoodenRoofParams;
  onChange: (updated: WoodenRoofParams) => void;
  results: WoodenRoofResults;
}

type ViewMode = 'plan' | 'elevation';

export const RaftersSchematic2D: React.FC<RaftersSchematic2DProps> = ({
  params,
  onChange,
  results,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('plan');
  const [hoveredRafterIndex, setHoveredRafterIndex] = useState<number | null>(null);
  const [showClearDimensions, setShowClearDimensions] = useState<boolean>(true);
  const [showAxialDimensions, setShowAxialDimensions] = useState<boolean>(true);

  // Meter dimensions
  const widthM = params.width / 100;
  const depthM = params.depth / 100;
  const overhangM = params.frontOverhang / 100;

  // Timber cross section in cm
  const rafterWidthCm = params.rafterDimension.width; // e.g. 7 cm

  // Rafter math
  const raftersCount = results.raftersCount || Math.max(2, Math.round(widthM / 0.7) + 1);
  const axialSpacingCm = results.actualRafterSpacing || Math.round((widthM / (raftersCount - 1)) * 100);
  const clearSpacingCm = Math.max(0, Math.round(axialSpacingCm - rafterWidthCm));

  // Canvas geometry
  const svgWidth = 840;
  const svgHeight = viewMode === 'plan' ? 440 : 340;
  const paddingX = 70;
  const paddingY = 60;

  const drawableWidth = svgWidth - paddingX * 2;
  const drawableHeight = svgHeight - paddingY * 2 - (viewMode === 'plan' ? 40 : 20);

  // Scale factor (pixels per meter)
  const scaleX = drawableWidth / widthM;
  const scaleY = drawableHeight / (depthM + overhangM);

  // Calculate X position of each rafter in pixels (center of rafter)
  const raftersList = useMemo(() => {
    const list = [];
    const stepX = raftersCount > 1 ? widthM / (raftersCount - 1) : widthM;

    for (let i = 0; i < raftersCount; i++) {
      const posXM = i * stepX;
      const posXCm = Math.round(posXM * 100);
      const pixelX = paddingX + posXM * scaleX;

      list.push({
        index: i,
        posXM,
        posXCm,
        pixelX,
      });
    }
    return list;
  }, [raftersCount, widthM, scaleX, paddingX]);

  // Handle spacing adjustments directly
  const handleAdjustTargetSpacing = (deltaCm: number) => {
    const currentTarget = params.targetRafterSpacing || 70;
    const newTarget = Math.min(130, Math.max(35, currentTarget + deltaCm));
    onChange({
      ...params,
      targetRafterSpacing: newTarget,
    });
  };

  // Evaluation status
  const isSpacingOptimal = axialSpacingCm >= 55 && axialSpacingCm <= 85;
  const isSpacingTight = axialSpacingCm < 55;

  // Post positions for elevation view
  const postsCount = results.postsCount || 2;
  const postStep = postsCount > 1 ? widthM / (postsCount - 1) : widthM;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      {/* HEADER & VIEW SWITCHER */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Ruler className="w-4 h-4 text-blue-600" />
            Schemat Rozstawu Krokwi (SVG 2D)
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Interaktywny plan konstrukcji zadaszenia pokazujący dokładne odcinki w świetle i osiowe
          </p>
        </div>

        {/* VIEW MODE TOGGLE */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            type="button"
            onClick={() => setViewMode('plan')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'plan'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Grid className="w-3.5 h-3.5" />
            Rzut z Góry (Plan)
          </button>
          <button
            type="button"
            onClick={() => setViewMode('elevation')}
            className={`px-3 py-1.5 rounded-lg font-bold transition cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'elevation'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Widok od Przodu (Czołowy)
          </button>
        </div>
      </div>

      {/* PARAMETER SUMMARY & QUICK STEPPER */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
        <div className="md:col-span-8 flex flex-wrap items-center gap-6 text-xs">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Ilość krokwi:</span>
            <strong className="text-lg text-blue-700">{raftersCount} szt.</strong>
          </div>
          <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Rozstaw osiowy:</span>
            <strong className="text-lg text-slate-800">{axialSpacingCm} cm</strong>
          </div>
          <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Odstęp w świetle:</span>
            <strong className="text-lg text-slate-900">{clearSpacingCm} cm</strong>
          </div>
          <div className="h-7 w-px bg-slate-200 hidden sm:block"></div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Szerokość dachu:</span>
            <strong className="text-sm text-slate-700">
              {widthM.toFixed(2)} m
            </strong>
          </div>
        </div>

        {/* STEPPER BUTTONS */}
        <div className="md:col-span-4 flex items-center justify-end gap-2 bg-white p-2 rounded-xl border border-slate-200 shadow-2xs">
          <span className="text-xs font-semibold text-slate-600 mr-1">Docelowy rozstaw:</span>
          <button
            type="button"
            onClick={() => handleAdjustTargetSpacing(-5)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition cursor-pointer"
            title="Zmniejsz docelowy rozstaw (-5 cm)"
          >
            <Minus className="w-4 h-4" />
          </button>
          <span className="text-xs font-extrabold text-slate-800 px-1.5 min-w-[50px] text-center">
            {params.targetRafterSpacing} cm
          </span>
          <button
            type="button"
            onClick={() => handleAdjustTargetSpacing(5)}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-700 hover:text-blue-700 transition cursor-pointer"
            title="Zwiększ docelowy rozstaw (+5 cm)"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* TOGGLES & OPTIONS */}
      <div className="flex flex-wrap items-center justify-between gap-3 text-xs text-slate-600 bg-slate-100/70 px-4 py-2 rounded-xl border border-slate-200">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-slate-900">
            <input
              type="checkbox"
              checked={showAxialDimensions}
              onChange={(e) => setShowAxialDimensions(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Wymiary osiowe ({axialSpacingCm} cm)</span>
          </label>

          <label className="flex items-center gap-1.5 cursor-pointer font-medium hover:text-slate-900">
            <input
              type="checkbox"
              checked={showClearDimensions}
              onChange={(e) => setShowClearDimensions(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Wymiary w świetle ({clearSpacingCm} cm)</span>
          </label>
        </div>

        <div className="flex items-center gap-2 text-slate-500">
          <Info className="w-3.5 h-3.5 text-blue-500" />
          <span>Najedź na krokiew, aby zobaczyć dokładne dane techniczne</span>
        </div>
      </div>

      {/* SVG DIAGRAM VIEWPORT */}
      <div className="relative border border-slate-200 rounded-2xl bg-slate-900 p-3 overflow-hidden shadow-inner flex items-center justify-center">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto select-none"
        >
          <defs>
            {/* Wood Grain Hatch / Pattern */}
            <pattern id="rafter-wood-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#f59e0b" />
              <line x1="0" y1="0" x2="20" y2="20" stroke="#d97706" strokeWidth="1" opacity="0.4" />
            </pattern>

            <pattern id="wall-brick-pattern" width="16" height="12" patternUnits="userSpaceOnUse">
              <rect width="16" height="12" fill="#334155" />
              <line x1="0" y1="6" x2="16" y2="6" stroke="#475569" strokeWidth="0.8" />
              <line x1="8" y1="0" x2="8" y2="6" stroke="#475569" strokeWidth="0.8" />
              <line x1="0" y1="6" x2="0" y2="12" stroke="#475569" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* BACKGROUND GRID */}
          <rect x="0" y="0" width={svgWidth} height={svgHeight} fill="#0f172a" />

          {/* PLAN VIEW (RZUT Z GÓRY) */}
          {viewMode === 'plan' && (
            <g>
              {/* Wall Ledger Line at top (Belka przyścienna / Ściana) */}
              <rect
                x={paddingX}
                y={paddingY - 20}
                width={drawableWidth}
                height="20"
                fill="url(#wall-brick-pattern)"
                stroke="#64748b"
                strokeWidth="1"
              />
              <text
                x={paddingX + drawableWidth / 2}
                y={paddingY - 6}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#cbd5e1"
              >
                ŚCIANA DOMU / BELKA PRZYŚCIENNA ({params.wallBeamDimension.width}x{params.wallBeamDimension.height} cm)
              </text>

              {/* Front Purlin Line (Płatew przednia) */}
              <line
                x1={paddingX}
                y1={paddingY + depthM * scaleY}
                x2={paddingX + drawableWidth}
                y2={paddingY + depthM * scaleY}
                stroke="#b45309"
                strokeWidth="6"
                strokeDasharray="8 4"
              />
              <text
                x={paddingX + drawableWidth - 10}
                y={paddingY + depthM * scaleY - 8}
                textAnchor="end"
                fontSize="9"
                fontWeight="bold"
                fill="#fbbf24"
              >
                Linia Płatwi Przedniej
              </text>

              {/* Overhang Line at bottom */}
              <line
                x1={paddingX}
                y1={paddingY + (depthM + overhangM) * scaleY}
                x2={paddingX + drawableWidth}
                y2={paddingY + (depthM + overhangM) * scaleY}
                stroke="#38bdf8"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
              <text
                x={paddingX + 10}
                y={paddingY + (depthM + overhangM) * scaleY + 14}
                textAnchor="start"
                fontSize="9"
                fontWeight="bold"
                fill="#38bdf8"
              >
                Krawędź Okapu (Wysięg okapu: {params.frontOverhang} cm)
              </text>

              {/* DRAW ALL RAFTERS (KROKWIE) AS RECTANGLES */}
              {raftersList.map((r) => {
                const isHovered = hoveredRafterIndex === r.index;
                const pixelWidth = Math.max(4, (rafterWidthCm / 100) * scaleX);
                const rectX = r.pixelX - pixelWidth / 2;
                const rectY = paddingY;
                const rectHeight = (depthM + overhangM) * scaleY;

                return (
                  <g
                    key={`rafter-plan-${r.index}`}
                    className="cursor-pointer transition-all duration-150"
                    onMouseEnter={() => setHoveredRafterIndex(r.index)}
                    onMouseLeave={() => setHoveredRafterIndex(null)}
                    onClick={() => setHoveredRafterIndex(hoveredRafterIndex === r.index ? null : r.index)}
                  >
                    {/* Rafter Body */}
                    <rect
                      x={rectX}
                      y={rectY}
                      width={pixelWidth}
                      height={rectHeight}
                      fill={isHovered ? '#3b82f6' : 'url(#rafter-wood-pattern)'}
                      stroke={isHovered ? '#60a5fa' : '#b45309'}
                      strokeWidth={isHovered ? '2' : '1'}
                      rx="1"
                    />

                    {/* Rafter Index Number */}
                    <circle
                      cx={r.pixelX}
                      cy={rectY + rectHeight / 2}
                      r="9"
                      fill={isHovered ? '#2563eb' : '#1e293b'}
                      stroke={isHovered ? '#ffffff' : '#f59e0b'}
                      strokeWidth="1.5"
                    />
                    <text
                      x={r.pixelX}
                      y={rectY + rectHeight / 2 + 3.5}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="extrabold"
                      fill="#ffffff"
                    >
                      {r.index + 1}
                    </text>
                  </g>
                );
              })}

              {/* AXIAL SPACING DIMENSIONS (NA GÓRZE) */}
              {showAxialDimensions &&
                raftersList.slice(0, -1).map((rA, idx) => {
                  const rB = raftersList[idx + 1];
                  const midX = (rA.pixelX + rB.pixelX) / 2;
                  const dimY = paddingY + 25;

                  return (
                    <g key={`axial-dim-${idx}`}>
                      <line
                        x1={rA.pixelX}
                        y1={dimY}
                        x2={rB.pixelX}
                        y2={dimY}
                        stroke="#f59e0b"
                        strokeWidth="1"
                      />
                      <circle cx={rA.pixelX} cy={dimY} r="2" fill="#f59e0b" />
                      <circle cx={rB.pixelX} cy={dimY} r="2" fill="#f59e0b" />
                      
                      {idx === 0 || idx === Math.floor(raftersList.length / 2) - 1 || idx === raftersList.length - 2 ? (
                        <g>
                          <rect
                            x={midX - 22}
                            y={dimY - 8}
                            width="44"
                            height="15"
                            fill="#0f172a"
                            stroke="#f59e0b"
                            rx="3"
                          />
                          <text
                            x={midX}
                            y={dimY + 3.5}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight="bold"
                            fill="#fbbf24"
                          >
                            {axialSpacingCm} cm
                          </text>
                        </g>
                      ) : null}
                    </g>
                  );
                })}

              {/* CLEAR SPACING DIMENSIONS (W ŚWIETLE - NA DOLE) */}
              {showClearDimensions &&
                raftersList.slice(0, -1).map((rA, idx) => {
                  const rB = raftersList[idx + 1];
                  const pixelRafterW = Math.max(4, (rafterWidthCm / 100) * scaleX);
                  const startX = rA.pixelX + pixelRafterW / 2;
                  const endX = rB.pixelX - pixelRafterW / 2;
                  const midX = (startX + endX) / 2;
                  const dimY = paddingY + (depthM + overhangM) * scaleY - 35;

                  return (
                    <g key={`clear-dim-${idx}`}>
                      <line
                        x1={startX}
                        y1={dimY}
                        x2={endX}
                        y2={dimY}
                        stroke="#38bdf8"
                        strokeWidth="1"
                        strokeDasharray="2 2"
                      />
                      <line x1={startX} y1={dimY - 4} x2={startX} y2={dimY + 4} stroke="#38bdf8" strokeWidth="1" />
                      <line x1={endX} y1={dimY - 4} x2={endX} y2={dimY + 4} stroke="#38bdf8" strokeWidth="1" />

                      {idx === 0 || idx === Math.floor(raftersList.length / 2) - 1 || idx === raftersList.length - 2 ? (
                        <g>
                          <rect
                            x={midX - 24}
                            y={dimY - 8}
                            width="48"
                            height="15"
                            fill="#0f172a"
                            stroke="#38bdf8"
                            rx="3"
                          />
                          <text
                            x={midX}
                            y={dimY + 3.5}
                            textAnchor="middle"
                            fontSize="9"
                            fontWeight="bold"
                            fill="#7dd3fc"
                          >
                            w śv. {clearSpacingCm}cm
                          </text>
                        </g>
                      ) : null}
                    </g>
                  );
                })}

              {/* OVERALL ROOF WIDTH ARROW */}
              <g key="overall-roof-width-arrow">
                <line
                  x1={paddingX}
                  y1={paddingY - 35}
                  x2={paddingX + drawableWidth}
                  y2={paddingY - 35}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <line x1={paddingX} y1={paddingY - 42} x2={paddingX} y2={paddingY - 28} stroke="#38bdf8" strokeWidth="1.5" />
                <line
                  x1={paddingX + drawableWidth}
                  y1={paddingY - 42}
                  x2={paddingX + drawableWidth}
                  y2={paddingY - 28}
                  stroke="#38bdf8"
                  strokeWidth="1.5"
                />
                <rect
                  x={paddingX + drawableWidth / 2 - 60}
                  y={paddingY - 44}
                  width="120"
                  height="18"
                  fill="#0284c7"
                  rx="4"
                />
                <text
                  x={paddingX + drawableWidth / 2}
                  y={paddingY - 32}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="extrabold"
                  fill="#ffffff"
                >
                  Szerokość dachu: {widthM.toFixed(2)} m
                </text>
              </g>
            </g>
          )}

          {/* ELEVATION VIEW (WIDOK OD PRZODU) */}
          {viewMode === 'elevation' && (
            <g>
              {/* Front Purlin Beam */}
              <rect
                x={paddingX}
                y={paddingY + 40}
                width={drawableWidth}
                height="18"
                fill="#b45309"
                stroke="#78350f"
                strokeWidth="1"
              />
              <text
                x={paddingX + drawableWidth / 2}
                y={paddingY + 53}
                textAnchor="middle"
                fontSize="10"
                fontWeight="bold"
                fill="#fef3c7"
              >
                PŁATEW PRZEDNIA ({params.frontBeamDimension.width}x{params.frontBeamDimension.height} cm)
              </text>

              {/* Rafter Ends */}
              {raftersList.map((r) => {
                const isHovered = hoveredRafterIndex === r.index;
                const pixelWidth = Math.max(6, (rafterWidthCm / 100) * scaleX);
                const rectX = r.pixelX - pixelWidth / 2;
                const rectY = paddingY + 12;
                const rectHeight = 28;

                return (
                  <g
                    key={`rafter-front-${r.index}`}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredRafterIndex(r.index)}
                    onMouseLeave={() => setHoveredRafterIndex(null)}
                  >
                    <rect
                      x={rectX}
                      y={rectY}
                      width={pixelWidth}
                      height={rectHeight}
                      fill={isHovered ? '#3b82f6' : '#f59e0b'}
                      stroke={isHovered ? '#ffffff' : '#78350f'}
                      strokeWidth="1"
                      rx="1"
                    />
                    <text
                      x={r.pixelX}
                      y={rectY - 4}
                      textAnchor="middle"
                      fontSize="9"
                      fontWeight="bold"
                      fill={isHovered ? '#60a5fa' : '#cbd5e1'}
                    >
                      #{r.index + 1}
                    </text>
                  </g>
                );
              })}

              {/* Posts under front beam */}
              {Array.from({ length: postsCount }).map((_, pIdx) => {
                const pxM = pIdx * postStep;
                const pxX = paddingX + pxM * scaleX;
                const postPixelW = Math.max(12, (params.postDimension.width / 100) * scaleX);

                return (
                  <g key={`post-front-${pIdx}`}>
                    <rect
                      x={pxX - postPixelW / 2}
                      y={paddingY + 58}
                      width={postPixelW}
                      height="120"
                      fill="#d97706"
                      stroke="#78350f"
                      strokeWidth="1"
                    />
                    {/* Anchor Footing */}
                    <rect
                      x={pxX - postPixelW / 2 - 4}
                      y={paddingY + 178}
                      width={postPixelW + 8}
                      height="10"
                      fill="#64748b"
                      rx="2"
                    />
                  </g>
                );
              })}

              {/* Spacing lines under rafters in elevation */}
              {raftersList.slice(0, -1).map((rA, idx) => {
                const rB = raftersList[idx + 1];
                const midX = (rA.pixelX + rB.pixelX) / 2;
                return (
                  <g key={`elev-dim-${idx}`}>
                    <line
                      x1={rA.pixelX}
                      y1={paddingY + 200}
                      x2={rB.pixelX}
                      y2={paddingY + 200}
                      stroke="#38bdf8"
                      strokeWidth="1"
                    />
                    <line x1={rA.pixelX} y1={paddingY + 195} x2={rA.pixelX} y2={paddingY + 205} stroke="#38bdf8" strokeWidth="1" />
                    <line x1={rB.pixelX} y1={paddingY + 195} x2={rB.pixelX} y2={paddingY + 205} stroke="#38bdf8" strokeWidth="1" />
                    {idx === 0 || idx === raftersList.length - 2 ? (
                      <text
                        x={midX}
                        y={paddingY + 215}
                        textAnchor="middle"
                        fontSize="9"
                        fontWeight="bold"
                        fill="#38bdf8"
                      >
                        {axialSpacingCm} cm
                      </text>
                    ) : null}
                  </g>
                );
              })}
            </g>
          )}
        </svg>

        {/* HOVER CARD / TOOLTIP */}
        {hoveredRafterIndex !== null && (
          <div className="absolute top-4 left-4 bg-slate-900/90 backdrop-blur-md border border-slate-700 text-white px-3 py-2 rounded-xl text-xs shadow-lg animate-in fade-in">
            <span className="font-extrabold text-amber-400 block mb-0.5">
              Krokwia #{hoveredRafterIndex + 1} z {raftersCount}
            </span>
            <div className="text-[11px] text-slate-300 space-y-0.5">
              <div>Pozycja od lewej: <strong>{((hoveredRafterIndex * widthM) / (raftersCount - 1)).toFixed(2)} m</strong> ({Math.round(((hoveredRafterIndex * widthM) / (raftersCount - 1)) * 100)} cm)</div>
              <div>Przekrój: <strong>{params.rafterDimension.width} x {params.rafterDimension.height} cm</strong></div>
              <div>Odstęp osiowy: <strong>{axialSpacingCm} cm</strong> | Odstęp w świetle: <strong>{clearSpacingCm} cm</strong></div>
            </div>
          </div>
        )}
      </div>

      {/* FOOTER ADVICE BADGE */}
      <div className="flex items-center justify-between text-xs bg-slate-50 p-3 rounded-xl border border-slate-200">
        <div className="flex items-center gap-2">
          {isSpacingOptimal ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
          )}
          <span className="text-slate-700 font-medium">
            {isSpacingOptimal
              ? `Optymalny rozstaw (${axialSpacingCm} cm osiowo). Zapewnia odpowiednią nośność dla pokrycia: ${params.roofCoverType.replace('_', ' ')}.`
              : isSpacingTight
              ? `Gęsty rozstaw (${axialSpacingCm} cm osiowo). Bardzo wysoka sztywność, zwiększone zużycie drewna.`
              : `Szeroki rozstaw (${axialSpacingCm} cm osiowo). Zalecana weryfikacja ugięcia dla ciężkich opadów śniegu.`}
          </span>
        </div>
      </div>
    </div>
  );
};
