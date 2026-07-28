import React from 'react';
import { FenceParams, FenceResults, FenceType } from '../types';
import { Shield, Layers, Ruler, CheckCircle, Info, ShieldCheck, DoorClosed } from 'lucide-react';
import { parseLocaleFloat } from '../utils/parseUtils';

interface FenceCalculatorProps {
  params: FenceParams;
  onChange: (params: FenceParams) => void;
  results: FenceResults;
}

export const FenceCalculator: React.FC<FenceCalculatorProps> = ({
  params,
  onChange,
  results,
}) => {
  const handleInputChange = (field: keyof FenceParams, value: any) => {
    onChange({
      ...params,
      [field]: value,
    });
  };

  const getFenceLabel = (type: FenceType) => {
    switch (type) {
      case 'panelowe_3d': return 'Ogrodzenie panelowe 3D z przetłoczeniem';
      case 'panelowe_2d': return 'Ogrodzenie panelowe 2D proste (ciężkie)';
      case 'palisada': return 'Ogrodzenie palisadowe / żaluzjowe';
      case 'siatka': return 'Siatka ogrodzeniowa pleciona';
      case 'sztachety': return 'Sztachety metalowe / kompozytowe / drewniane';
      case 'bloczki_lupane': return 'Ogrodzenie modułowe z bloczków łupanych';
      default: return type;
    }
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER BANNER */}
      <div className="bg-gradient-to-r from-purple-950 via-slate-900 to-purple-950 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 opacity-10 pointer-events-none flex items-center pr-10">
          <Shield className="w-64 h-64 text-white" />
        </div>
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-xs font-semibold mb-3 border border-purple-400/30">
            <Shield className="w-3.5 h-3.5" />
            Ogrodzenia Panelowe, Palisadowe & Podmurówki
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">Kalkulator Ogrodzenia</h2>
          <p className="text-purple-100/80 text-sm mt-1">
            Wyliczenie liczby paneli, słupków, płyt podmurówki prefabrykowanej, obejm montażowych, betonu na dołki oraz furtek i bram wjazdowych.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: FORM INPUTS */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* CARD 1: DIMENSIONS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Ruler className="w-4 h-4 text-purple-600" />
              1. Długość i Typ Ogrodzenia
            </h3>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Rodzaj ogrodzenia:
              </label>
              <select
                value={params.fenceType}
                onChange={(e) => handleInputChange('fenceType', e.target.value as FenceType)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-purple-500 focus:bg-white"
              >
                <option value="panelowe_3d">Panelowe 3D przetłaczane (Fi 4mm lub 5mm)</option>
                <option value="panelowe_2d">Panelowe 2D proste (Fi 6/5/6 mm)</option>
                <option value="palisada">Palisada meandrowa / żaluzjowa</option>
                <option value="siatka">Siatka pleciona powlekana PVC</option>
                <option value="sztachety">Sztachety poziome lub pionowe</option>
                <option value="bloczki_lupane">Bloczki betonowe łupane gładkie</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Całkowita długość (cm):
                </label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="np. 4000 (40m)"
                  value={!params.totalLength ? '' : params.totalLength}
                  onChange={(e) => handleInputChange('totalLength', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Wysokość panela (cm):
                </label>
                <input
                  type="number"
                  placeholder="np. 153"
                  value={!params.fenceHeight ? '' : params.fenceHeight}
                  onChange={(e) => handleInputChange('fenceHeight', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-sm text-slate-800 focus:ring-2 focus:ring-purple-500 focus:bg-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Długość panela/przęsła (cm):
                </label>
                <input
                  type="number"
                  placeholder="250"
                  value={!params.spanLength ? '' : params.spanLength}
                  onChange={(e) => handleInputChange('spanLength', parseLocaleFloat(e.target.value) || 250)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Obejmy na słup (szt):
                </label>
                <input
                  type="number"
                  placeholder="3"
                  value={!params.clampsPerPost ? '' : params.clampsPerPost}
                  onChange={(e) => handleInputChange('clampsPerPost', parseInt(e.target.value, 10) || 3)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* CARD 2: CONCRETE BOARD & POST HOLES */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <Layers className="w-4 h-4 text-purple-600" />
              2. Podmurówka i Dołki pod Słupki
            </h3>

            <div>
              <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800">
                <input
                  type="checkbox"
                  checked={params.useConcreteBoard}
                  onChange={(e) => handleInputChange('useConcreteBoard', e.target.checked)}
                  className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500"
                />
                Stosuj podmurówkę betonową prefabrykowaną (deski + łączniki)
              </label>

              {params.useConcreteBoard && (
                <div className="mt-2.5 pl-6">
                  <label className="block text-xs font-semibold text-slate-600 mb-1">
                    Wysokość płyty podmurówki (cm):
                  </label>
                  <select
                    value={params.concreteBoardHeight}
                    onChange={(e) => handleInputChange('concreteBoardHeight', parseLocaleFloat(e.target.value) || 25)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                  >
                    <option value="20">20 cm</option>
                    <option value="25">25 cm (standard)</option>
                    <option value="30">30 cm</option>
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Głębokość dołka (cm):
                </label>
                <input
                  type="number"
                  placeholder="80"
                  value={!params.postHoleDepth ? '' : params.postHoleDepth}
                  onChange={(e) => handleInputChange('postHoleDepth', parseLocaleFloat(e.target.value) || 80)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Średnica dołka (cm):
                </label>
                <input
                  type="number"
                  placeholder="25"
                  value={!params.postHoleDiameter ? '' : params.postHoleDiameter}
                  onChange={(e) => handleInputChange('postHoleDiameter', parseLocaleFloat(e.target.value) || 25)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

          {/* CARD 3: GATES & WICKETS */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2 border-b border-slate-100 pb-2">
              <DoorClosed className="w-4 h-4 text-purple-600" />
              3. Furtki i Bramy Wjazdowe
            </h3>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Liczba furtek (szt):
                </label>
                <input
                  type="number"
                  value={params.wicketsCount}
                  onChange={(e) => handleInputChange('wicketsCount', parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Szerokość furtki (cm):
                </label>
                <input
                  type="number"
                  value={params.wicketWidth}
                  onChange={(e) => handleInputChange('wicketWidth', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Liczba bram (szt):
                </label>
                <input
                  type="number"
                  value={params.gatesCount}
                  onChange={(e) => handleInputChange('gatesCount', parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Szerokość bramy (cm):
                </label>
                <input
                  type="number"
                  value={params.gateWidth}
                  onChange={(e) => handleInputChange('gateWidth', parseLocaleFloat(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-2.5 py-1.5 text-xs text-slate-800"
                />
              </div>
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: DIAGRAM & RESULTS */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* VISUAL FENCE DIAGRAM */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
                <Shield className="w-4 h-4 text-purple-600" />
                Schemat Przęseł Ogrodzeniowych ({results.spansCount} paneli)
              </h3>
              <span className="text-xs font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                Długość płotu netto: {results.netFenceLength} m
              </span>
            </div>

            <div className="bg-slate-900 rounded-xl p-4 text-white overflow-hidden relative">
              <svg viewBox="0 0 600 220" className="w-full h-auto">
                {/* TEREN GROUND LEVEL */}
                <line x1="20" y1="170" x2="580" y2="170" stroke="#a1a1aa" strokeWidth="2" />
                <rect x="20" y="170" width="560" height="40" fill="#27272a" />

                {/* DRAWING FENCE SPANS */}
                {Array.from({ length: 4 }).map((_, idx) => {
                  const x = 50 + idx * 110;

                  return (
                    <g key={idx}>
                      {/* SŁUPEK BETONOWANY */}
                      <rect x={x} y="60" width="12" height="110" fill="#a855f7" rx="1" />
                      {/* STOPA BETONOWA IN GROUND */}
                      <rect x={x - 8} y="170" width="28" height="35" fill="#71717a" opacity="0.8" rx="2" />

                      {/* CONCRETE BOARD IF CHECKED */}
                      {params.useConcreteBoard && (
                        <rect x={x + 12} y="150" width="98" height="20" fill="#d4d4d8" stroke="#52525b" strokeWidth="1" />
                      )}

                      {/* PANEL 3D MESH */}
                      <rect
                        x={x + 12}
                        y="70"
                        width="98"
                        height={params.useConcreteBoard ? "78" : "98"}
                        fill="none"
                        stroke="#c084fc"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      {/* PRZETŁOCZENIA V */}
                      <line x1={x + 12} y1="95" x2={x + 110} y2="95" stroke="#e9d5ff" strokeWidth="2" />
                      <line x1={x + 12} y1="125" x2={x + 110} y2="125" stroke="#e9d5ff" strokeWidth="2" />
                    </g>
                  );
                })}

                {/* END POST */}
                <rect x="490" y="60" width="12" height="110" fill="#a855f7" rx="1" />
                <rect x="482" y="170" width="28" height="35" fill="#71717a" opacity="0.8" rx="2" />

                {/* GATE / WICKET ICON SCHEMATIC */}
                {params.wicketsCount > 0 && (
                  <g transform="translate(515, 75)">
                    <rect x="0" y="0" width="50" height="95" fill="none" stroke="#f59e0b" strokeWidth="2" rx="2" />
                    <circle cx="42" cy="50" r="3" fill="#f59e0b" />
                    <text x="25" y="112" fill="#fbbf24" fontSize="10" textAnchor="middle">Furtka</text>
                  </g>
                )}

                <text x="300" y="40" fill="#e9d5ff" fontSize="11" textAnchor="middle" fontWeight="bold">
                  Słupek 60x40mm | Wys. panela {params.fenceHeight} cm | Dołek Ø{params.postHoleDiameter}cm x {params.postHoleDepth}cm
                </text>
              </svg>
            </div>
          </div>

          {/* RESULTS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* ELEMENTY KONSTRUKCJI */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                <span>1. Panele, Słupki & Podmurówka</span>
                <span className="text-purple-600 font-bold">{results.spansCount} paneli</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Przęsła / Panele ogrodzeniowe:</span>
                  <span className="font-bold text-slate-900">{results.spansCount} szt. (2.5m)</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Słupki ogrodzeniowe (60x40 mm):</span>
                  <span className="font-bold text-purple-700">{results.postsCountTotal} szt.</span>
                </div>
                {params.useConcreteBoard && (
                  <>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Płyty podmurówki (2.5m x {params.concreteBoardHeight}cm):</span>
                      <span className="font-bold text-slate-900">{results.concreteBoardsCount} szt.</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-slate-50">
                      <span className="text-slate-500">Łączniki betonowe (cechówki/H):</span>
                      <span className="font-bold text-slate-900">{results.concreteConnectorsCount} szt.</span>
                    </div>
                  </>
                )}
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Obejmy montażowe ({params.clampsPerPost} na słupek):</span>
                  <span className="font-bold text-slate-900">{results.clampsTotalCount} szt.</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Zaślepki / daszki na słupki:</span>
                  <span className="font-bold text-slate-900">{results.postCapsCount} szt.</span>
                </div>
              </div>
            </div>

            {/* BETON DOŁKÓW & BRAMY */}
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
              <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center justify-between border-b border-slate-100 pb-2">
                <span>2. Beton do Dołków & Bramy</span>
                <span className="text-blue-600 font-bold">{results.concreteHolesVolumeM3} m³ betonu</span>
              </h4>

              <div className="space-y-2 text-xs text-slate-700">
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Objętość betonu na dołki słupków:</span>
                  <span className="font-bold text-slate-900">{results.concreteHolesVolumeM3} m³</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Suchy Beton B20 (worki 25kg):</span>
                  <span className="font-bold text-blue-600">{results.concreteB20Bags} worków</span>
                </div>
                <div className="flex justify-between py-1 border-b border-slate-50">
                  <span className="text-slate-500">Furtki wejściowe:</span>
                  <span className="font-bold text-slate-900">{params.wicketsCount} szt. (łącznie {results.wicketsTotalWidthM} m)</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-slate-500">Bramy wjazdowe:</span>
                  <span className="font-bold text-slate-900">{params.gatesCount} szt. (łącznie {results.gatesTotalWidthM} m)</span>
                </div>
              </div>
            </div>

          </div>

          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs text-slate-600 flex items-start gap-3">
            <Info className="w-5 h-5 text-purple-600 shrink-0 mt-0.5" />
            <div>
              <strong>Porada montażowa dla słupków:</strong> Głębokość dołka {params.postHoleDepth} cm zabezpiecza słupek przed wysadzaniem mrozowym. Na dnie dołka warto podsypać 5 cm żwiru drenującego, a przy zalewaniu betonem gęstoplastycznym B20 dokładnie go zagęścić i pionować słupki na czas wiązania.
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
