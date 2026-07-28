import React from 'react';
import { ParkingParams, ParkingResults, ParkingLayout, ParkingSurfaceType, SoilType } from '../types';
import { SquareParking, Layers, Ruler, CheckCircle, Info, ShieldCheck, Car } from 'lucide-react';
import { parseLocaleFloat } from '../utils/parseUtils';

interface ParkingCalculatorProps {
  params: ParkingParams;
  onChange: (params: ParkingParams) => void;
  results: ParkingResults;
}

export const ParkingCalculator: React.FC<ParkingCalculatorProps> = ({
  params,
  onChange,
  results,
}) => {
  const handleInputChange = (field: keyof ParkingParams, value: any) => {
    onChange({
      ...params,
      [field]: value,
    });
  };

  const getSurfaceLabel = (type: ParkingSurfaceType) => {
    switch (type) {
      case 'plyty_azurowe': return 'Płyty ażurowe betonowe 8 cm (Eko parking zielony)';
      case 'geokrata': return 'Geokrata trawnikowa / na grys (Eko kratka)';
      case 'kostka_8cm': return 'Kostka brukowa 8 cm (pełne utwardzenie)';
      case 'kruszywo': return 'Nawirtschaft z kruszywa łamanego (kliniec)';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <SquareParking className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-3 border border-emerald-400/30">
            <SquareParking className="w-3.5 h-3.5" />
            Stanowiska Postojowe & Zielone Parkingi Ażurowe
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Kalkulator Miejsc Parkingowych</h2>
          <p className="text-emerald-100/80 text-sm mt-1">
            Szybkie obliczanie zapotrzebowania na płyty ażurowe, geokratę, tłuczeń podbudowy, krawężniki oraz gumowe odbojniki dla 1, 2, 4 lub więcej stanowisk samochodowych.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: FORM INPUTS */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* CARD 1: SPACES & DIMENSIONS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Ruler className="w-4 h-4 text-emerald-600" />
              1. Stanowiska i Wymiary
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Liczba stanowisk (szt):
                </label>
                <input
                  type="number"
                  min="1"
                  max="50"
                  value={!params.spacesCount ? '' : params.spacesCount}
                  onChange={(e) => handleInputChange('spacesCount', parseInt(e.target.value, 10) || 1)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 font-bold focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Układ stanowisk:
                </label>
                <select
                  value={params.layout}
                  onChange={(e) => handleInputChange('layout', e.target.value as ParkingLayout)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800"
                >
                  <option value="prostopadle">Prostopadłe (obok siebie)</option>
                  <option value="rownolegle">Równoległe (wzdłuż drogi)</option>
                  <option value="skosne">Skośne 45° / 60°</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Długość stanowiska (cm):
                </label>
                <input
                  type="number"
                  placeholder="np. 500 (5m)"
                  value={!params.spaceLength ? '' : params.spaceLength}
                  onChange={(e) => handleInputChange('spaceLength', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Szerokość 1 szt. (cm):
                </label>
                <input
                  type="number"
                  placeholder="np. 280 (2.8m)"
                  value={!params.spaceWidth ? '' : params.spaceWidth}
                  onChange={(e) => handleInputChange('spaceWidth', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: SURFACE & LAYERS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-emerald-600" />
              2. Nawierzchnia i Podbudowa
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rodzaj nawierzchni parkingowej:
              </label>
              <select
                value={params.surfaceType}
                onChange={(e) => {
                  const val = e.target.value as ParkingSurfaceType;
                  let defThick = 8;
                  if (val === 'geokrata') defThick = 5;
                  if (val === 'kruszywo') defThick = 6;
                  onChange({
                    ...params,
                    surfaceType: val,
                    customSurfaceThickness: defThick,
                  });
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:bg-white"
              >
                <option value="plyty_azurowe">Płyty ażurowe 8 cm (Eko parking zielony)</option>
                <option value="geokrata">Geokrata trawnikowa / żwirowa 5 cm</option>
                <option value="kostka_8cm">Kostka brukowa 8 cm</option>
                <option value="kruszywo">Tłuczeń / Kliniec łamany 0-31.5 mm</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Płyta/Kostka (cm):
                </label>
                <input
                  type="number"
                  value={params.customSurfaceThickness}
                  onChange={(e) => handleInputChange('customSurfaceThickness', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Podsypka (cm):
                </label>
                <input
                  type="number"
                  value={params.beddingThickness}
                  onChange={(e) => handleInputChange('beddingThickness', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Tłuczeń (cm):
                </label>
                <input
                  type="number"
                  value={params.subBaseThickness}
                  onChange={(e) => handleInputChange('subBaseThickness', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={params.addStoppers}
                  onChange={(e) => handleInputChange('addStoppers', e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                Dolicz odbojniki / stoper betonowo-gumowe na każde stanowisko
              </label>
            </div>
          </div>

          {/* CARD 3: EDGING & SOIL */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              3. Obrzeża i Zapas
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Krawężnik / Obrzeże:
                </label>
                <select
                  value={params.edgingType}
                  onChange={(e) => handleInputChange('edgingType', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800"
                >
                  <option value="kraweznik_drogowy_100x30x15">Krawężnik drogowy 100x30x15 cm</option>
                  <option value="obrzeze_100x20x6">Obrzeże trawnikowe 100x20x6 cm</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Zapas na docięcia (%):
                </label>
                <input
                  type="number"
                  value={params.wasteBufferPercent}
                  onChange={(e) => handleInputChange('wasteBufferPercent', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DIAGRAM & RESULTS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* VISUAL PARKING SLOTS DIAGRAM */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <SquareParking className="w-4 h-4 text-emerald-600" />
                Schemat Stanowisk Parkingowych ({params.spacesCount} szt.)
              </h3>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full">
                Łącznie: {results.totalAreaNet} m²
              </span>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 text-white overflow-hidden relative">
              <svg viewBox="0 0 600 240" className="w-full h-auto">
                <rect x="20" y="20" width="560" height="200" fill="#0f172a" rx="8" />

                {/* PARKING SPACES DRAWING */}
                {Array.from({ length: Math.min(6, params.spacesCount || 1) }).map((_, idx) => {
                  const count = Math.min(6, params.spacesCount || 1);
                  const spaceW = (520 - (count - 1) * 10) / count;
                  const x = 40 + idx * (spaceW + 10);
                  const y = 35;
                  const h = 170;

                  return (
                    <g key={idx}>
                      {/* PARKING SLOT BOX */}
                      <rect
                        x={x}
                        y={y}
                        width={spaceW}
                        height={h}
                        fill={params.surfaceType === 'plyty_azurowe' || params.surfaceType === 'geokrata' ? '#064e3b' : '#334155'}
                        stroke="#10b981"
                        strokeWidth="2"
                        strokeDasharray="6 3"
                        rx="4"
                      />
                      
                      {/* CAR SILHOUETTE ICON */}
                      <g transform={`translate(${x + spaceW / 2 - 16}, ${y + h / 2 - 20})`}>
                        <rect x="4" y="8" width="24" height="28" rx="4" fill="#1e293b" stroke="#34d399" strokeWidth="1.5" />
                        <line x1="8" y1="14" x2="24" y2="14" stroke="#6ee7b7" strokeWidth="1.5" />
                        <line x1="8" y1="30" x2="24" y2="30" stroke="#6ee7b7" strokeWidth="1.5" />
                      </g>

                      {/* STOPPER IF ADDED */}
                      {params.addStoppers && (
                        <rect x={x + spaceW * 0.2} y={y + 15} width={spaceW * 0.6} height="8" fill="#f59e0b" rx="2" />
                      )}

                      <text x={x + spaceW / 2} y={y + h - 15} fill="#a7f3d0" fontSize="11" textAnchor="middle" fontWeight="bold">
                        P{idx + 1} ({((params.spaceWidth || 0) / 100).toFixed(1)}m x {((params.spaceLength || 0) / 100).toFixed(1)}m)
                      </text>
                    </g>
                  );
                })}

                {params.spacesCount > 6 && (
                  <text x="300" y="225" fill="#f59e0b" fontSize="10" textAnchor="middle">
                    + jeszcze {params.spacesCount - 6} stanowisk(a)
                  </text>
                )}
              </svg>
            </div>
          </div>

          {/* RESULTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* POWIERZCHNIA & WYKOP */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                <span>1. Powierzchnia & Wykop</span>
                <span className="text-emerald-600 font-bold">{results.totalAreaNet} m²</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Powierzchnia z zapasem ({params.wasteBufferPercent}%):</span>
                  <span className="font-bold text-slate-900">{results.totalAreaGross} m²</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Głębokość korytowania:</span>
                  <span className="font-bold text-emerald-600">{results.totalExcavationDepth} cm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Objętość wykopu w gruncie:</span>
                  <span className="font-bold text-slate-900">{results.excavationVolume} m³</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Urobek ziemi do wywozu:</span>
                  <span className="font-bold text-amber-600">{results.excavationVolumeLoose} m³ ({results.excavationWeightTons} t)</span>
                </div>
              </div>
            </div>

            {/* PODBUDOWA & PŁYTY */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                <span>2. Tłuczeń & Podsypka</span>
                <span className="text-blue-600 font-bold">{results.subBaseWeightTons} t tłucznia</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Tłuczeń po zagęszczeniu ({params.subBaseThickness} cm):</span>
                  <span className="font-bold text-slate-900">{results.subBaseVolumeCompacted} m³</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Tłuczeń sypki do zamówienia:</span>
                  <span className="font-bold text-blue-600">{results.subBaseVolumeLoose} m³ ({results.subBaseWeightTons} t)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Podsypka piaskowa ({params.beddingThickness} cm):</span>
                  <span className="font-bold text-slate-900">{results.beddingVolume} m³ ({results.beddingWeightTons} t)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Krawężniki po obwodzie:</span>
                  <span className="font-bold text-slate-900">{results.edgingLength} m ({results.edgingPiecesCount} szt.)</span>
                </div>
              </div>
            </div>

          </div>

          {/* EXTRA ACCESSORIES */}
          {params.addStoppers && (
            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-200 text-xs text-emerald-900 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Gumowe/betonowe odbojniki parkingowe stopery:</span>
              </div>
              <span className="font-black text-sm text-emerald-950">{results.stoppersCount} szt.</span>
            </div>
          )}

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <Info className="w-5 h-5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <strong>Porada zielonego parkingu:</strong> Płyty ażurowe 60x40 cm lub geokratę komórkową można zasypać czarnoziemem z nasionami trawy lub drobnym grysem ozdobnym 8-16 mm. Pod płyty ażurowe stosuj podsypkę z grysiku 2-5 mm zamiast czystego piasku.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
