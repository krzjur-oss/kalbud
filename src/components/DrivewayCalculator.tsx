import React from 'react';
import { DrivewayParams, DrivewayResults, DrivewaySurfaceType, DrivewayShape, SoilType } from '../types';
import { Car, Layers, ArrowDownUp, CheckCircle, Info, ShieldCheck, Ruler } from 'lucide-react';

interface DrivewayCalculatorProps {
  params: DrivewayParams;
  onChange: (params: DrivewayParams) => void;
  results: DrivewayResults;
}

export const DrivewayCalculator: React.FC<DrivewayCalculatorProps> = ({
  params,
  onChange,
  results,
}) => {
  const handleInputChange = (field: keyof DrivewayParams, value: any) => {
    onChange({
      ...params,
      [field]: value,
    });
  };

  const getSurfaceLabel = (type: DrivewaySurfaceType) => {
    switch (type) {
      case 'kostka_6cm': return 'Kostka brukowa 6 cm (ruch lekki)';
      case 'kostka_8cm': return 'Kostka brukowa 8 cm (ruch ciężki / osobowe + dostawcze)';
      case 'plyty_azurowe': return 'Płyty ażurowe betonowe (Meba / Eko)';
      case 'geokrata': return 'Geokrata trawnikowa / żwirowa wzmocniona';
      case 'kruszywo': return 'Nawierzchnia z kruszywa łamanego (kliniec / grys)';
      case 'plyty_betonowe_duze': return 'Płyty betonowe wielkoformatowe (np. 80x80 cm)';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Car className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-3 border border-blue-400/30">
            <Car className="w-3.5 h-3.5" />
            Podjazd do Garażu & Nawierzchnia Utwardzona
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Kalkulator Podjazdu</h2>
          <p className="text-slate-300 text-sm mt-1">
            Precyzyjne wyliczenie głębokości wykopu, warstw podbudowy tłudniowej, podsypki, krawężników drogowych oraz ilości materiału nawierzchniowego z uwzględnieniem obciążenia autami.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: FORM INPUTS */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* CARD 1: DIMENSIONS & SHAPE */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Ruler className="w-4 h-4 text-blue-600" />
              1. Wymiary i Kształt Podjazdu
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Długość podjazdu (cm):
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="np. 1200 (12m)"
                  value={!params.length ? '' : params.length}
                  onChange={(e) => handleInputChange('length', parseFloat(e.target.value.replace(',', '.')) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Szerokość bazowa (cm):
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="np. 350 (3.5m)"
                  value={!params.width ? '' : params.width}
                  onChange={(e) => handleInputChange('width', parseFloat(e.target.value.replace(',', '.')) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Kształt podjazdu:
              </label>
              <select
                value={params.shape}
                onChange={(e) => handleInputChange('shape', e.target.value as DrivewayShape)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="prosty">Prosty pas dojazdowy</option>
                <option value="poszerzony_garaz">Poszerzający się przy garażu 2-stanowiskowym</option>
                <option value="nawrotka">Z pętlą nawrotową (+25% pow.)</option>
              </select>
            </div>

            {params.shape === 'poszerzony_garaz' && (
              <div className="grid grid-cols-2 gap-3 p-3 bg-blue-50/60 rounded-xl border border-blue-100">
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1">
                    Dodatki przy garażu - szerokość (cm):
                  </label>
                  <input
                    type="number"
                    placeholder="np. 250"
                    value={!params.extraWidthGarage ? '' : params.extraWidthGarage}
                    onChange={(e) => handleInputChange('extraWidthGarage', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-blue-900 mb-1">
                    Długość skosu/poszerzenia (cm):
                  </label>
                  <input
                    type="number"
                    placeholder="np. 400"
                    value={!params.extraLengthGarage ? '' : params.extraLengthGarage}
                    onChange={(e) => handleInputChange('extraLengthGarage', parseFloat(e.target.value) || 0)}
                    className="w-full bg-white border border-blue-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
              </div>
            )}
          </div>

          {/* CARD 2: SURFACE & SUBBASE LAYERS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-blue-600" />
              2. Materiał i Warstwy Podbudowy
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rodzaj nawierzchni:
              </label>
              <select
                value={params.surfaceType}
                onChange={(e) => {
                  const val = e.target.value as DrivewaySurfaceType;
                  let defThick = 8;
                  if (val === 'kostka_6cm') defThick = 6;
                  if (val === 'kostka_8cm' || val === 'plyty_azurowe') defThick = 8;
                  if (val === 'geokrata') defThick = 5;
                  if (val === 'kruszywo') defThick = 6;
                  onChange({
                    ...params,
                    surfaceType: val,
                    customSurfaceThickness: defThick,
                  });
                }}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-blue-500 focus:bg-white"
              >
                <option value="kostka_8cm">Kostka brukowa 8 cm (zalecana na auta)</option>
                <option value="kostka_6cm">Kostka brukowa 6 cm (ruch osobowy)</option>
                <option value="plyty_azurowe">Płyty ażurowe betonowe 8 cm (Eko)</option>
                <option value="geokrata">Geokrata komórkowa na żwir</option>
                <option value="plyty_betonowe_duze">Płyty betonowe wielkoformatowe (8-10 cm)</option>
                <option value="kruszywo">Tylko nawierzchnia z klinńca / tłucznia</option>
              </select>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Kostka/Płyta (cm):
                </label>
                <input
                  type="number"
                  value={params.customSurfaceThickness}
                  onChange={(e) => handleInputChange('customSurfaceThickness', parseFloat(e.target.value) || 0)}
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
                  onChange={(e) => handleInputChange('beddingThickness', parseFloat(e.target.value) || 0)}
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
                  onChange={(e) => handleInputChange('subBaseThickness', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={params.useFilterSandLayer}
                  onChange={(e) => handleInputChange('useFilterSandLayer', e.target.checked)}
                  className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                Dodaj warstwę odcinającą piasku filtracyjnego pod tłuczeń
              </label>

              {params.useFilterSandLayer && (
                <div className="mt-2 pl-6">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Grubość warstwy piasku (cm):
                  </label>
                  <input
                    type="number"
                    value={params.filterSandThickness}
                    onChange={(e) => handleInputChange('filterSandThickness', parseFloat(e.target.value) || 0)}
                    className="w-32 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-800"
                  />
                </div>
              )}
            </div>
          </div>

          {/* CARD 3: EDGING & SOIL */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <ShieldCheck className="w-4 h-4 text-blue-600" />
              3. Krawężniki i Typ Rodzimego Gruntu
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Krawężniki / Obrzeża:
                </label>
                <select
                  value={params.edgingType}
                  onChange={(e) => handleInputChange('edgingType', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800"
                >
                  <option value="kraweznik_drogowy_100x30x15">Krawężnik drogowy 100x30x15 cm</option>
                  <option value="obrzeze_100x20x6">Obrzeże trawnikowe 100x20x6 cm</option>
                  <option value="palisada">Palisada betonowa</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Krawężnikowanie:
                </label>
                <select
                  value={params.edgingSides}
                  onChange={(e) => handleInputChange('edgingSides', e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800"
                >
                  <option value="oba">Obustronnie (2 krawędzie)</option>
                  <option value="jeden">Jednostronnie</option>
                  <option value="brak">Brak krawężników</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Typ gruntu rodzimego:
                </label>
                <select
                  value={params.soilType}
                  onChange={(e) => handleInputChange('soilType', e.target.value as SoilType)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-2 text-xs text-slate-800"
                >
                  <option value="piaskowy">Piaskowy / Przepuszczalny</option>
                  <option value="sredni">Średni / Glinasto-piaszczysty</option>
                  <option value="gliniasty">Gliniasty / Nieprzepuszczalny</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Zapas na docięcia (%):
                </label>
                <input
                  type="number"
                  value={params.wasteBufferPercent}
                  onChange={(e) => handleInputChange('wasteBufferPercent', parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: VISUAL CROSS SECTION DIAGRAM & CALCULATED RESULTS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* CROSS-SECTION DIAGRAM */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <ArrowDownUp className="w-4 h-4 text-blue-600" />
                Przekrój Poprzeczny Podjazdu
              </h3>
              <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                Całkowity wykop: {results.totalExcavationDepth} cm
              </span>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 text-white overflow-hidden relative">
              <svg viewBox="0 0 600 240" className="w-full h-auto">
                
                {/* GRUNT RODZIMY */}
                <rect x="50" y="180" width="500" height="40" fill="#334155" />
                <text x="300" y="205" fill="#94a3b8" fontSize="12" textAnchor="middle" fontWeight="bold">
                  Grunt rodzimy ({params.soilType === 'piaskowy' ? 'przepuszczalny' : params.soilType === 'gliniasty' ? 'glina - spęcznienie 1.35' : 'średni'})
                </text>

                {/* GEOWŁÓKNINA LINE */}
                <line x1="50" y1="180" x2="550" y2="180" stroke="#f59e0b" strokeWidth="3" strokeDasharray="6 3" />

                {/* SAND FILTER LAYER */}
                {params.useFilterSandLayer && (
                  <g>
                    <rect x="50" y="150" width="500" height="30" fill="#fef08a" opacity="0.8" />
                    <text x="300" y="170" fill="#854d0e" fontSize="11" textAnchor="middle" fontWeight="bold">
                      Piasek odcinający ({params.filterSandThickness} cm)
                    </text>
                  </g>
                )}

                {/* SUBBASE LAYER */}
                <rect
                  x="50"
                  y={params.useFilterSandLayer ? "90" : "110"}
                  width="500"
                  height={params.useFilterSandLayer ? "60" : "70"}
                  fill="#64748b"
                />
                <text
                  x="300"
                  y={params.useFilterSandLayer ? "125" : "150"}
                  fill="#ffffff"
                  fontSize="12"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  Tłuczeń / Kruszywo łamane 0-31.5mm ({params.subBaseThickness} cm)
                </text>

                {/* BEDDING LAYER */}
                <rect
                  x="50"
                  y={params.useFilterSandLayer ? "65" : "85"}
                  width="500"
                  height="25"
                  fill="#cbd5e1"
                />
                <text
                  x="300"
                  y={params.useFilterSandLayer ? "82" : "102"}
                  fill="#1e293b"
                  fontSize="11"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  Podsypka piaskowo-cementowa 1:4 ({params.beddingThickness} cm)
                </text>

                {/* SURFACE LAYER */}
                <rect
                  x="50"
                  y={params.useFilterSandLayer ? "25" : "45"}
                  width="500"
                  height="40"
                  fill="#3b82f6"
                  rx="2"
                />
                <text
                  x="300"
                  y={params.useFilterSandLayer ? "50" : "70"}
                  fill="#ffffff"
                  fontSize="13"
                  textAnchor="middle"
                  fontWeight="bold"
                >
                  {getSurfaceLabel(params.surfaceType)} ({params.customSurfaceThickness} cm)
                </text>

                {/* KRAWĘŻNIKI */}
                {params.edgingSides !== 'brak' && (
                  <g>
                    {/* LEWY KRAWĘŻNIK */}
                    <rect x="30" y="25" width="20" height="155" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                    <polygon points="10,180 30,120 30,180" fill="#94a3b8" opacity="0.6" />
                    <text x="40" y="20" fill="#60a5fa" fontSize="10" textAnchor="middle">Krawężnik</text>
                    
                    {/* PRAWY KRAWĘŻNIK */}
                    {params.edgingSides === 'oba' && (
                      <g>
                        <rect x="550" y="25" width="20" height="155" fill="#475569" stroke="#94a3b8" strokeWidth="1" />
                        <polygon points="570,120 590,180 570,180" fill="#94a3b8" opacity="0.6" />
                        <text x="560" y="20" fill="#60a5fa" fontSize="10" textAnchor="middle">Krawężnik</text>
                      </g>
                    )}
                  </g>
                )}

              </svg>
            </div>
          </div>

          {/* RESULTS SUMMARY GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* POWIERZCHNIA & WYKOP */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                <span>1. Wykop & Ziemia</span>
                <span className="text-blue-600 font-bold">{results.areaNet} m²</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Powierzchnia brutto (z zapasem {params.wasteBufferPercent}%):</span>
                  <span className="font-bold text-slate-900">{results.areaGross} m²</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Głębokość korytowania:</span>
                  <span className="font-bold text-blue-600">{results.totalExcavationDepth} cm</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Objętość wykopu w gruncie:</span>
                  <span className="font-bold text-slate-900">{results.excavationVolume} m³</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Ziemia ze spęcznieniem do wywozu:</span>
                  <span className="font-bold text-amber-600">{results.excavationVolumeLoose} m³ (~{results.excavationWeightTons} t)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Geowłóknina separacyjna:</span>
                  <span className="font-bold text-slate-900">{results.geotextileArea} m²</span>
                </div>
              </div>
            </div>

            {/* PODBUDOWA TŁUCZNIOWA */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                <span>2. Tłuczeń & Podsypka</span>
                <span className="text-emerald-600 font-bold">{results.subBaseWeightTons} ton</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Tłuczeń 0-31.5 mm (po ubiciu):</span>
                  <span className="font-bold text-slate-900">{results.subBaseVolumeCompacted} m³</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Tłuczeń sypki do zamówienia (+20%):</span>
                  <span className="font-bold text-emerald-600">{results.subBaseVolumeLoose} m³ ({results.subBaseWeightTons} t)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Podsypka piaskowo-cementowa:</span>
                  <span className="font-bold text-slate-900">{results.beddingVolume} m³ ({results.beddingWeightTons} t)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Cement do podsypki (worki 25kg):</span>
                  <span className="font-bold text-slate-900">{results.cementBags25kg} worków</span>
                </div>
                {params.useFilterSandLayer && (
                  <div className="flex justify-between py-1">
                    <span className="text-slate-500">Piasek odcinający:</span>
                    <span className="font-bold text-amber-700">{results.filterSandVolume} m³ ({results.filterSandWeightTons} t)</span>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* KRAWĘŻNIKI & BETON B20 */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold shrink-0">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs font-bold text-slate-800 uppercase">
                  Obrzeża / Krawężniki i Ława Betonowa
                </div>
                <div className="text-xs text-slate-500 mt-0.5">
                  Łączny obwód krawężnikowany: <strong className="text-slate-800">{results.edgingLength} m</strong> | Ilość sztuk: <strong className="text-slate-800">{results.edgingPiecesCount} szt. (1m)</strong>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-xl px-4 py-2 text-right border border-slate-200 shrink-0">
              <div className="text-[11px] text-slate-500">Beton B15 na opór krawężników</div>
              <div className="text-sm font-black text-slate-900">{results.concreteLeanForEdging} m³</div>
            </div>
          </div>

          {/* TIP BOX */}
          <div className="bg-amber-50 rounded-2xl p-4 border border-amber-200 text-xs text-amber-900 flex items-start gap-3">
            <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <strong>Rekomendacja wykonawcza dla podjazdu:</strong> Warstwa tłucznia {params.subBaseThickness} cm powinna być zagęszczana warstwowo po max 10–15 cm zagęszczarką płytową min. 200–300 kg z rewersem. Zachowaj 1.5–2% spadku poprzecznego lub podłużnego do odprowadzenia wody deszczowej.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
