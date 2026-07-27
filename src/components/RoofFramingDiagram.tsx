import React from 'react';
import { WoodenRoofParams, WoodenRoofResults } from '../types';

interface RoofFramingDiagramProps {
  params: WoodenRoofParams;
  results: WoodenRoofResults;
}

export const RoofFramingDiagram: React.FC<RoofFramingDiagramProps> = ({ params, results }) => {
  const widthSvg = 650;
  const heightSvg = 380;

  // Key measurements (convert cm to meters for SVG drawing)
  const wallH = params.heightAtWall / 100; // e.g. 2.70m
  const frontH = params.heightAtFront / 100; // e.g. 2.20m
  const depth = params.depth / 100; // e.g. 3.5m
  const overhang = params.frontOverhang / 100; // e.g. 0.3m

  // Diagram geometry mapping
  const marginX = 80;
  const wallX = marginX; // Wall location
  const frontX = marginX + depth * 110; // Front posts location
  const overhangX = frontX + overhang * 110;

  const groundY = 320;
  const scaleY = 75; // pixels per meter

  const wallY = groundY - wallH * scaleY;
  const frontY = groundY - frontH * scaleY;

  // Slope line coordinates
  const rafterStartX = wallX - 10;
  const rafterStartY = wallY - 12;
  const rafterEndX = overhangX;
  const rafterEndY = frontY - 12 + (frontY - wallY) * (overhang / depth);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-800 shadow-sm">
      <div className="flex flex-wrap items-center justify-between mb-3 border-b border-slate-100 pb-3 gap-2">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
          <span>🪵</span>
          Konstrukcja Zadaszenia Drewnianego — Schemat Boczny i Wymiary
        </h4>
        <div className="flex items-center gap-2 text-xs font-mono">
          <span className="bg-slate-100 text-slate-800 border border-slate-200 px-2.5 py-1 rounded-full font-semibold">
            Kąt nachylenia: {results.roofAngleDegrees}° ({results.roofSlopePercent}%)
          </span>
          <span className="bg-blue-50 text-blue-700 border border-blue-200 px-2.5 py-1 rounded-full font-semibold">
            Długość krokwi: {results.rafterLength} m
          </span>
        </div>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${widthSvg} ${heightSvg}`} className="w-full h-auto min-w-[550px]">
          <defs>
            {/* Patterns for wall and wood */}
            <pattern id="brickWall" width="20" height="10" patternUnits="userSpaceOnUse">
              <rect width="20" height="10" fill="#f8fafc" />
              <line x1="0" y1="5" x2="20" y2="5" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="10" y1="0" x2="10" y2="5" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="0" y1="5" x2="0" y2="10" stroke="#cbd5e1" strokeWidth="1" />
            </pattern>

            <linearGradient id="woodGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            <linearGradient id="roofCoverGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.9" />
            </linearGradient>
          </defs>

          {/* GROUND LINE */}
          <line x1="20" y1={groundY} x2={widthSvg - 20} y2={groundY} stroke="#10b981" strokeWidth="2.5" />
          <text x="20" y={groundY + 18} fill="#059669" fontSize="11" fontWeight="bold">
            Poziom terenu / Taras
          </text>

          {/* HOUSE WALL (LEFT) */}
          <rect x="20" y="30" width="60" height={groundY - 30} fill="url(#brickWall)" stroke="#cbd5e1" strokeWidth="1.5" />
          <text x="50" y="50" fill="#64748b" fontSize="11" fontWeight="bold" transform="rotate(-90 50,50)">
            Ściana budynku
          </text>

          {/* WALL LEDGER BEAM (BELKA PRZYŚCIENNA / MURŁATA) */}
          <rect x={wallX - 2} y={wallY - 14} width="14" height="24" fill="#d97706" stroke="#78350f" strokeWidth="1.5" rx="1" />
          <text x={wallX - 35} y={wallY - 20} fill="#b45309" fontSize="11" fontWeight="bold">
            Murłata przyścienna
          </text>
          {/* Anchor bolt symbol */}
          <line x1={wallX - 15} y1={wallY} x2={wallX + 10} y2={wallY} stroke="#dc2626" strokeWidth="2.5" strokeDasharray="3 2" />
          <circle cx={wallX - 12} cy={wallY} r="3" fill="#dc2626" />

          {/* FRONT POST (SŁUP) */}
          <rect x={frontX - 8} y={frontY} width="16" height={groundY - frontY} fill="url(#woodGrad)" stroke="#451a03" strokeWidth="1.5" rx="1" />
          <text x={frontX + 12} y={frontY + (groundY - frontY) / 2} fill="#78350f" fontSize="11" fontWeight="bold">
            Słupy {params.postDimension.width}x{params.postDimension.height}cm ({results.postsCount} szt)
          </text>

          {/* POST ANCHOR & FOOTING (STOPA FUNDAMENTOWA) */}
          <rect x={frontX - 14} y={groundY} width="28" height="35" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
          <line x1={frontX} y1={groundY - 5} x2={frontX} y2={groundY + 10} stroke="#64748b" strokeWidth="3" />
          <text x={frontX + 18} y={groundY + 22} fill="#64748b" fontSize="10">
            Stopa h=90cm ({results.foundationFootingsCount} szt)
          </text>

          {/* FRONT BEAM (PŁATEW PRZEDNIA) */}
          <rect x={frontX - 10} y={frontY - 14} width="20" height="18" fill="#d97706" stroke="#78350f" strokeWidth="1.5" rx="1" />

          {/* BRACE / MIECZ (ZASTRZAŁ) */}
          <line x1={frontX - 8} y1={frontY + 45} x2={frontX - 45} y2={frontY - 5} stroke="url(#woodGrad)" strokeWidth="10" strokeLinecap="round" />
          <text x={frontX - 60} y={frontY + 30} fill="#b45309" fontSize="10" fontWeight="bold">
            Miecz (zastrzał)
          </text>

          {/* RAFTER (KROKWIE) */}
          <line
            x1={rafterStartX}
            y1={rafterStartY}
            x2={rafterEndX}
            y2={rafterEndY}
            stroke="url(#woodGrad)"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <text x={(wallX + frontX) / 2 - 40} y={(wallY + frontY) / 2 - 20} fill="#78350f" fontSize="12" fontWeight="bold">
            Krokwie {params.rafterDimension.width}x{params.rafterDimension.height}cm ({results.raftersCount} szt co {results.actualRafterSpacing}cm)
          </text>

          {/* ROOF COVERING LAYER (POLIWĘGLAN / BLACHA) */}
          <line
            x1={rafterStartX - 5}
            y1={rafterStartY - 10}
            x2={rafterEndX + 5}
            y2={rafterEndY - 10}
            stroke="url(#roofCoverGrad)"
            strokeWidth="6"
            strokeLinecap="round"
          />
          <text x={(wallX + frontX) / 2 - 20} y={(wallY + frontY) / 2 - 32} fill="#1d4ed8" fontSize="11" fontWeight="bold">
            Pokrycie: {params.roofCoverType.replace('_', ' ')} ({results.roofArea} m²)
          </text>

          {/* HEIGHT AT WALL DIMENSION */}
          <line x1={wallX - 35} y1={wallY} x2={wallX - 35} y2={groundY} stroke="#2563eb" strokeWidth="1.5" />
          <text x={wallX - 70} y={(wallY + groundY) / 2} fill="#2563eb" fontSize="11" fontWeight="bold">
            {wallH.toFixed(2)} m
          </text>

          {/* HEIGHT AT FRONT DIMENSION */}
          <line x1={frontX + 60} y1={frontY} x2={frontX + 60} y2={groundY} stroke="#2563eb" strokeWidth="1.5" />
          <text x={frontX + 68} y={(frontY + groundY) / 2} fill="#2563eb" fontSize="11" fontWeight="bold">
            {frontH.toFixed(2)} m
          </text>

          {/* DEPTH / SPAN DIMENSION */}
          <line x1={wallX} y1={groundY + 38} x2={frontX} y2={groundY + 38} stroke="#dc2626" strokeWidth="1.5" />
          <text x={(wallX + frontX) / 2 - 30} y={groundY + 54} fill="#dc2626" fontSize="12" fontWeight="bold">
            Wysięg: {depth.toFixed(2)} m
          </text>

          {/* OVERHANG DIMENSION */}
          <line x1={frontX} y1={groundY + 38} x2={overhangX} y2={groundY + 38} stroke="#e11d48" strokeWidth="1.5" />
          <text x={frontX + 5} y={groundY + 54} fill="#e11d48" fontSize="10" fontWeight="bold">
            Okap: {params.frontOverhang} cm
          </text>

          {/* SLOPE TRIANGLE / ANGLE */}
          <line x1={wallX + 15} y1={wallY} x2={wallX + 80} y2={wallY} stroke="#9333ea" strokeWidth="1" strokeDasharray="3 3" />
          <text x={wallX + 85} y={wallY + 4} fill="#7e22ce" fontSize="11" fontWeight="bold">
            {results.roofAngleDegrees}° spadek
          </text>
        </svg>
      </div>

      <div className="mt-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-700 flex flex-wrap justify-between gap-2">
        <div>
          <span className="text-slate-900 font-semibold">Rozstaw słupów:</span> {results.postSpanDistance} m
        </div>
        <div>
          <span className="text-slate-900 font-semibold">Rozstaw krokwi:</span> co {results.actualRafterSpacing} cm
        </div>
        <div>
          <span className="text-slate-900 font-semibold">Objętość drewna:</span> {results.totalWoodVolumeM3} m³
        </div>
        <div>
          <span className="text-slate-900 font-semibold">Dno stóp w ziemi:</span> {results.footingDepthCm} cm
        </div>
      </div>
    </div>
  );
};
