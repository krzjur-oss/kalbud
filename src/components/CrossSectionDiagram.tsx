import React from 'react';

interface CrossSectionDiagramProps {
  title: string;
  surfaceType: string;
  surfaceThicknessCm: number;
  beddingThicknessCm: number;
  subBaseThicknessCm: number;
  totalDepthCm: number;
  subBaseName?: string;
  beddingName?: string;
}

export const CrossSectionDiagram: React.FC<CrossSectionDiagramProps> = ({
  title,
  surfaceType,
  surfaceThicknessCm,
  beddingThicknessCm,
  subBaseThicknessCm,
  totalDepthCm,
  subBaseName = 'Tłuczeń łamany 0-31.5 mm (zagęszczony)',
  beddingName = 'Podsypka grysikowa / piaskowo-cementowa 1:4',
}) => {
  // SVG proportions
  const width = 600;
  const height = 320;
  const startY = 60;
  const diagramHeight = 200;

  // Scale pixels per cm
  const scale = totalDepthCm > 0 ? diagramHeight / Math.max(20, totalDepthCm) : 1;

  const surfaceH = Math.max(12, surfaceThicknessCm * scale);
  const beddingH = Math.max(12, beddingThicknessCm * scale);
  const subBaseH = Math.max(20, subBaseThicknessCm * scale);

  const ySurface = startY;
  const yBedding = ySurface + surfaceH;
  const ySubBase = yBedding + beddingH;
  const ySoil = ySubBase + subBaseH;

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 text-slate-800 shadow-sm">
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-3">
        <h4 className="font-bold text-slate-900 text-xs uppercase tracking-widest flex items-center gap-2">
          <span>📐</span>
          {title} — Przekrój Warstwiczny Wykopu
        </h4>
        <span className="text-xs font-mono bg-blue-50 text-blue-700 font-semibold px-2.5 py-1 rounded-full border border-blue-200">
          Łączna głębokość wykopu: {totalDepthCm} cm
        </span>
      </div>

      <div className="relative w-full overflow-x-auto">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto min-w-[480px]">
          <defs>
            {/* Gradients and patterns */}
            <pattern id="soilPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#f8fafc" />
              <circle cx="4" cy="4" r="1.5" fill="#cbd5e1" />
              <circle cx="14" cy="12" r="2" fill="#e2e8f0" />
              <path d="M 0 10 L 20 10 M 10 0 L 10 20" stroke="#f1f5f9" strokeWidth="0.5" />
            </pattern>

            <pattern id="gravelPattern" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#e2e8f0" />
              <polygon points="2,2 6,4 4,8 1,6" fill="#cbd5e1" />
              <polygon points="10,3 14,5 12,10 8,8" fill="#94a3b8" />
              <polygon points="4,11 8,14 6,16 2,13" fill="#cbd5e1" />
              <polygon points="12,11 15,14 13,16 9,13" fill="#64748b" />
            </pattern>

            <pattern id="beddingPattern" width="10" height="10" patternUnits="userSpaceOnUse">
              <rect width="10" height="10" fill="#fef3c7" />
              <circle cx="2" cy="2" r="1" fill="#f59e0b" />
              <circle cx="7" cy="6" r="1" fill="#d97706" />
              <circle cx="4" cy="8" r="0.8" fill="#b45309" />
            </pattern>

            <pattern id="tilePattern" width="40" height="20" patternUnits="userSpaceOnUse">
              <rect width="40" height="20" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="1" />
              <rect width="38" height="18" x="1" y="1" fill="#f1f5f9" rx="1" />
            </pattern>
          </defs>

          {/* BACKGROUND / ZERO LEVEL LINE */}
          <line x1="40" y1={startY} x2="480" y2={startY} stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />
          <text x="490" y={startY + 4} fill="#059669" fontSize="11" fontWeight="bold" fontFamily="monospace">
            Poziom Zero (0 cm)
          </text>

          {/* LAYER 1: NAWIERZCHNIA */}
          <rect x="60" y={ySurface} width="380" height={surfaceH} fill="url(#tilePattern)" stroke="#64748b" strokeWidth="1.5" />
          <text x="70" y={ySurface + surfaceH / 2 + 4} fill="#0f172a" fontSize="12" fontWeight="bold">
            {surfaceType} ({surfaceThicknessCm} cm)
          </text>
          
          {/* Dimension arrow surface */}
          <line x1="450" y1={ySurface} x2="450" y2={yBedding} stroke="#2563eb" strokeWidth="1.5" />
          <text x="458" y={ySurface + surfaceH / 2 + 4} fill="#2563eb" fontSize="11" fontWeight="bold">
            {surfaceThicknessCm} cm
          </text>

          {/* LAYER 2: PODSYPKA */}
          <rect x="60" y={yBedding} width="380" height={beddingH} fill="url(#beddingPattern)" stroke="#d97706" strokeWidth="1" />
          <text x="70" y={yBedding + beddingH / 2 + 4} fill="#78350f" fontSize="11" fontWeight="bold">
            {beddingName} ({beddingThicknessCm} cm)
          </text>
          
          {/* Dimension arrow bedding */}
          <line x1="450" y1={yBedding} x2="450" y2={ySubBase} stroke="#d97706" strokeWidth="1.5" />
          <text x="458" y={yBedding + beddingH / 2 + 4} fill="#d97706" fontSize="11" fontWeight="bold">
            {beddingThicknessCm} cm
          </text>

          {/* GEOTEXTILE LINE */}
          <line x1="60" y1={ySubBase} x2="440" y2={ySubBase} stroke="#db2777" strokeWidth="3" strokeDasharray="6 3" />
          <text x="70" y={ySubBase - 3} fill="#be185d" fontSize="10" fontWeight="bold">
            --- Geowłóknina 150-200 g/m² ---
          </text>

          {/* LAYER 3: TŁUCZEŃ / PODBUDOWA */}
          <rect x="60" y={ySubBase} width="380" height={subBaseH} fill="url(#gravelPattern)" stroke="#94a3b8" strokeWidth="1" />
          <text x="70" y={ySubBase + subBaseH / 2 + 4} fill="#0f172a" fontSize="12" fontWeight="bold">
            {subBaseName} ({subBaseThicknessCm} cm)
          </text>
          
          {/* Dimension arrow subbase */}
          <line x1="450" y1={ySubBase} x2="450" y2={ySoil} stroke="#7c3aed" strokeWidth="1.5" />
          <text x="458" y={ySubBase + subBaseH / 2 + 4} fill="#7c3aed" fontSize="11" fontWeight="bold">
            {subBaseThicknessCm} cm
          </text>

          {/* LAYER 4: GRUNT RODZIMY (BOTTOM) */}
          <rect x="60" y={ySoil} width="380" height="40" fill="url(#soilPattern)" stroke="#cbd5e1" strokeWidth="1" />
          <text x="70" y={ySoil + 24} fill="#475569" fontSize="11" fontWeight="semibold">
            Grunt rodzimy (dno wykopu - ubitka i wyrównanie)
          </text>

          {/* TOTAL EXCAVATION LINE / ARROW ON LEFT */}
          <line x1="30" y1={ySurface} x2="30" y2={ySoil} stroke="#dc2626" strokeWidth="2" />
          <polygon points="30,55 26,63 34,63" fill="#dc2626" />
          <polygon points={`30,${ySoil + 5} 26,${ySoil - 3} 34,${ySoil - 3}`} fill="#dc2626" />
          <text
            x="-180"
            y="20"
            fill="#dc2626"
            fontSize="12"
            fontWeight="bold"
            transform="rotate(-90)"
          >
            Wykop: {totalDepthCm} cm
          </text>
        </svg>
      </div>

      <div className="mt-2 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
        <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="w-3 h-3 rounded bg-slate-200 border border-slate-400"></span>
          <span className="text-slate-700 font-medium">Nawierzchnia</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="w-3 h-3 rounded bg-amber-200 border border-amber-500"></span>
          <span className="text-slate-700 font-medium">Podsypka</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="w-3 h-3 rounded bg-slate-300 border border-slate-500"></span>
          <span className="text-slate-700 font-medium">Tłuczeń (0-31.5)</span>
        </div>
        <div className="flex items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="w-3 h-3 rounded bg-pink-400 border border-pink-600"></span>
          <span className="text-slate-700 font-medium">Geowłóknina</span>
        </div>
      </div>
    </div>
  );
};
