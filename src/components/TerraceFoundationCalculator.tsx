import React from 'react';
import {
  TerraceFoundationParams,
  TerraceFoundationResults,
  WoodenRoofParams,
  WoodenRoofResults,
} from '../types';
import { CrossSectionDiagram } from './CrossSectionDiagram';
import { TerraceAndRoofVisualizer } from './TerraceAndRoofVisualizer';
import { Shovel, Layers, AlertCircle, CheckCircle2 } from 'lucide-react';

interface TerraceFoundationCalculatorProps {
  params: TerraceFoundationParams;
  onChange: (updated: TerraceFoundationParams) => void;
  results: TerraceFoundationResults;
  roofParams: WoodenRoofParams;
  roofResults: WoodenRoofResults;
}

export const TerraceFoundationCalculator: React.FC<TerraceFoundationCalculatorProps> = ({
  params,
  onChange,
  results,
  roofParams,
  roofResults,
}) => {
  const handleInputChange = (field: keyof TerraceFoundationParams, value: any) => {
    onChange({ ...params, [field]: value });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* INPUT FORM (LEFT COLUMN) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Shovel className="w-4 h-4 text-blue-600" />
            2. Parametry Wykopu i Podbudowy pod Taras
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Określ wymiary tarasu, grunt i rodzaj nawierzchni, by wyliczyć głębokość wykopu i ubicie tłucznia
          </p>
        </div>

        {/* SEC 1: WYMIARY I KSZTAŁT TARASU */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Kształt i Wymiary Planowanego Tarasu
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1.5">Bryła / Kształt Tarasu:</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => handleInputChange('terraceShape', 'prostokat')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer text-center ${
                  (params.terraceShape || 'prostokat') === 'prostokat'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Prostokątny
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('terraceShape', 'narozny_L')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer text-center ${
                  params.terraceShape === 'narozny_L'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Narożny Wklęsły L
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('terraceShape', 'narozny_L_zewnetrzny')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer text-center ${
                  params.terraceShape === 'narozny_L_zewnetrzny'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Narożny Wypukły L
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('terraceShape', 'trapez')}
                className={`py-2 px-2 rounded-xl border text-[11px] font-semibold transition cursor-pointer text-center ${
                  params.terraceShape === 'trapez'
                    ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                    : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                }`}
              >
                Trapezowy
              </button>
            </div>
          </div>

          {/* PROSTOKĄT LUB TRAPEZ */}
          {(params.terraceShape === 'prostokat' || !params.terraceShape) && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Długość wzdłuż ściany (cm):</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="np. 450"
                  value={params.terraceLength === 0 || params.terraceLength === undefined ? '' : params.terraceLength}
                  onChange={(e) => handleInputChange('terraceLength', parseFloat(e.target.value.replace(',', '.')) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Wysięg w teren (cm):</label>
                <input
                  type="number"
                  min="0"
                  step="any"
                  placeholder="np. 350"
                  value={params.terraceWidth === 0 || params.terraceWidth === undefined ? '' : params.terraceWidth}
                  onChange={(e) => handleInputChange('terraceWidth', parseFloat(e.target.value.replace(',', '.')) || 0)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          )}

          {/* NAROŻNY L-KSZTAŁTNY (WKLĘSŁY I WYPUKŁY) */}
          {(params.terraceShape === 'narozny_L' || params.terraceShape === 'narozny_L_zewnetrzny') && (
            <div className="space-y-3 bg-blue-50/60 p-3.5 rounded-xl border border-blue-100">
              <div className="text-xs font-bold text-blue-900 flex items-center justify-between">
                <span>
                  {params.terraceShape === 'narozny_L_zewnetrzny'
                    ? '📐 Parametry Tarasu Oplatającego Narożnik Zewnętrzny (2 Ściany)'
                    : '📐 Parametry Tarasu w Narożniku Wewnętrznym (Wcięcie w Ścianie)'}
                </span>
                <span className="text-[10px] bg-blue-200/80 text-blue-800 px-2 py-0.5 rounded font-mono">
                  {params.terraceShape === 'narozny_L_zewnetrzny' ? 'Outer L-Corner' : 'Inner L-Corner'}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Długość Ściany 1 (cm):</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="np. 450"
                    value={params.terraceLength === 0 || params.terraceLength === undefined ? '' : params.terraceLength}
                    onChange={(e) => handleInputChange('terraceLength', parseFloat(e.target.value.replace(',', '.')) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Długość wzdłuż 1. ściany</span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wysięg Ramię A (cm):</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="np. 350"
                    value={params.terraceWidth === 0 || params.terraceWidth === undefined ? '' : params.terraceWidth}
                    onChange={(e) => handleInputChange('terraceWidth', parseFloat(e.target.value.replace(',', '.')) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Szerokość ramienia przy 1. ścianie</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-blue-200/60">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Długość Ściany 2 (cm):</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="np. 300"
                    value={!params.sideBLength ? '' : params.sideBLength}
                    onChange={(e) => handleInputChange('sideBLength', parseFloat(e.target.value.replace(',', '.')) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Długość wzdłuż 2. ściany</span>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Wysięg Ramię B (cm):</label>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder="np. 250"
                    value={!params.sideBWidth ? '' : params.sideBWidth}
                    onChange={(e) => handleInputChange('sideBWidth', parseFloat(e.target.value.replace(',', '.')) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 font-bold focus:ring-1 focus:ring-blue-500"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Szerokość ramienia przy 2. ścianie</span>
                </div>
              </div>

              {params.terraceShape === 'narozny_L_zewnetrzny' && (
                <p className="text-[11px] text-blue-800 bg-blue-100/70 p-2 rounded-lg leading-snug">
                  💡 <strong>Taras opasujący narożnik zewnętrzny:</strong> Składa się z dwóch skrzydeł biegnących wzdłuż dwóch zewnętrznych ścian budynku oraz narożnika łączącego o wymiarach {params.terraceWidth || 0} cm x {params.sideBWidth || 0} cm ({((params.terraceWidth || 0) / 100).toFixed(2)}m x {((params.sideBWidth || 0) / 100).toFixed(2)}m).
                </p>
              )}

              {/* CHAMFERED CORNER OPTION */}
              <div className="pt-2 border-t border-blue-200/80 mt-2 space-y-2">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={params.chamferCorner || false}
                    onChange={(e) => handleInputChange('chamferCorner', e.target.checked)}
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500 border-slate-300"
                  />
                  <span className="text-xs font-bold text-slate-800">
                    Ścięty narożnik zewnętrzny (Skos 45°)
                  </span>
                </label>

                {params.chamferCorner && (
                  <div className="bg-white p-2.5 rounded-lg border border-blue-200 flex items-center justify-between gap-3">
                    <div className="flex-1">
                      <label className="block text-[11px] font-semibold text-slate-700">
                        Wielkość ścięcia narożnika (długość boku skosu w cm):
                      </label>
                      <p className="text-[10px] text-slate-500">
                        Odejmuje trójkąt ze skosu o pow. {(0.5 * Math.pow((params.chamferSize || 0) / 100, 2)).toFixed(2)} m²
                      </p>
                    </div>
                    <div className="w-28 flex items-center gap-1">
                      <input
                        type="number"
                        min="0"
                        max={Math.min(params.terraceWidth || 300, params.sideBWidth || 300)}
                        step="any"
                        placeholder="np. 120"
                        value={!params.chamferSize ? '' : params.chamferSize}
                        onChange={(e) => handleInputChange('chamferSize', parseFloat(e.target.value.replace(',', '.')) || 0)}
                        className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 font-bold text-right focus:bg-white focus:outline-none"
                      />
                      <span className="text-xs text-slate-600 font-medium">cm</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TRAPEZ */}
          {params.terraceShape === 'trapez' && (
            <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Baza przy ścianie (cm):</label>
                  <input
                    type="number"
                    min="0"
                    max="3000"
                    step="any"
                    placeholder="np. 450"
                    value={params.terraceLength === 0 || params.terraceLength === undefined ? '' : params.terraceLength}
                    onChange={(e) => handleInputChange('terraceLength', parseFloat(e.target.value.replace(',', '.')) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Baza zewnętrzna (cm):</label>
                  <input
                    type="number"
                    min="0"
                    max="3000"
                    step="any"
                    placeholder="np. 300"
                    value={!params.sideBLength ? '' : params.sideBLength}
                    onChange={(e) => handleInputChange('sideBLength', parseFloat(e.target.value.replace(',', '.')) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">Wysięg (cm):</label>
                  <input
                    type="number"
                    min="0"
                    max="3000"
                    step="any"
                    placeholder="np. 350"
                    value={params.terraceWidth === 0 || params.terraceWidth === undefined ? '' : params.terraceWidth}
                    onChange={(e) => handleInputChange('terraceWidth', parseFloat(e.target.value.replace(',', '.')) || 0)}
                    className="w-full bg-white border border-slate-200 rounded-lg px-2 py-1.5 text-xs text-slate-800 font-bold"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 p-2.5 rounded-xl text-right flex items-center justify-between">
            <span className="text-slate-600 font-normal">Wyliczona łączna powierzchnia:</span>
            <span className="text-base text-blue-900 font-bold">{results.terraceArea} m²</span>
          </div>
        </div>

        {/* SEC 2: GRUNT I NAWIERZCHNIA */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Rodzaj Gruntu i Nawierzchnia
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Rodzaj gruntu rodzimego:</label>
            <select
              value={params.soilType}
              onChange={(e) => handleInputChange('soilType', e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="piaskowy">Przepuszczalny / piaszczysty (rekomendowany tłuczeń 20 cm)</option>
              <option value="sredni">Średni / spoisty (rekomendowany tłuczeń 30 cm)</option>
              <option value="gliniasty">Gliniasty / nieprzepuszczalny (rekomendowany tłuczeń 40 cm)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Rodzaj planowanej nawierzchni:</label>
            <select
              value={params.surfaceType}
              onChange={(e) => handleInputChange('surfaceType', e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="plyty_betonowe">Płyty betonowe / tarasowe (grubość 4 cm)</option>
              <option value="gres_2cm">Gres porcelanowy 2 cm na wspornikach/grysie</option>
              <option value="kostka_6cm">Kostka brukowa (grubość 6 cm)</option>
              <option value="deska_kompozyt">Deska kompozytowa / drewniana na legarach (~8.5 cm)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Dostosuj grubość nawierzchni (cm):</label>
            <input
              type="number"
              min="0"
              max="25"
              step="any"
              placeholder="np. 4"
              value={!params.customSurfaceThickness ? '' : params.customSurfaceThickness}
              onChange={(e) => handleInputChange('customSurfaceThickness', parseFloat(e.target.value.replace(',', '.')) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800"
            />
          </div>
        </div>

        {/* SEC 3: WARSTWA PODBUDOWY I ZAGĘSZCZANIE */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Konfiguracja Tłucznia i Podsypki
          </h3>

          <div className="flex items-center gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <input
              type="checkbox"
              id="useCustomSubBase"
              checked={params.useCustomSubBase}
              onChange={(e) => handleInputChange('useCustomSubBase', e.target.checked)}
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
            />
            <label htmlFor="useCustomSubBase" className="text-xs font-medium text-slate-700 cursor-pointer">
              Ręcznie wpisz grubość tłucznia (zamiast rekomendowanej {results.recommendedSubBaseThickness} cm)
            </label>
          </div>

          {params.useCustomSubBase && (
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Grubość warstwy tłucznia (cm):</label>
              <input
                type="number"
                min="0"
                max="80"
                step="any"
                placeholder="np. 25"
                value={!params.subBaseThickness ? '' : params.subBaseThickness}
                onChange={(e) => handleInputChange('subBaseThickness', parseFloat(e.target.value.replace(',', '.')) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Grubość podsypki (cm):</label>
              <input
                type="number"
                step="any"
                placeholder="np. 4"
                value={!params.beddingThickness ? '' : params.beddingThickness}
                onChange={(e) => handleInputChange('beddingThickness', parseFloat(e.target.value.replace(',', '.')) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800"
              />
              <span className="text-[10px] text-slate-400 block mt-0.5">grysik 2-5mm / cement</span>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Zapas na docięcia (%):</label>
              <input
                type="number"
                step="any"
                placeholder="np. 8"
                value={!params.wasteBufferPercent ? '' : params.wasteBufferPercent}
                onChange={(e) => handleInputChange('wasteBufferPercent', parseFloat(e.target.value.replace(',', '.')) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

      </div>

      {/* RESULTS DISPLAY (RIGHT COLUMN) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* HIGHLIGHT HERO STATS */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">GŁĘBOKOŚĆ WYKOPU</span>
            <span className="text-3xl font-bold text-slate-900 mt-1 block">{results.totalExcavationDepth} cm</span>
            <span className="text-[10px] text-slate-500 block mt-1">nawierzchnia + podsypka + tłuczeń</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">POTRZEBNY TŁUCZEŃ</span>
            <span className="text-3xl font-bold text-blue-600 mt-1 block">{results.subBaseWeightTons} t</span>
            <span className="text-[10px] text-slate-500 block mt-1">{results.subBaseVolumeCompacted} m³ po ubiciu</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">ZIEMIA DO WYWIEZIENIA</span>
            <span className="text-3xl font-bold text-slate-800 mt-1 block">{results.excavationVolumeLoose} m³</span>
            <span className="text-[10px] text-slate-500 block mt-1">ok. {results.excavationWeightTons} ton spęcznionej ziemi</span>
          </div>
        </div>

        {/* DETAILED GUIDANCE & COMPACTION PLAN */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 text-slate-700">
              <Layers className="w-4 h-4 text-blue-600" />
              Plan Wbudowania i Zagęszczania Podbudowy z Tłucznia
            </span>
            <span className="text-xs text-blue-600 font-semibold bg-blue-50 border border-blue-200/60 px-2.5 py-0.5 rounded-full">
              Współczynnik ubicia: 1.20
            </span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Liczba warstw zagęszczania:</span>
              <div className="text-2xl font-bold text-slate-900 flex items-baseline gap-2">
                <span>{results.compactionLayersCount} warstwy</span>
                <span className="text-xs text-slate-500 font-normal">po ok. {(results.actualSubBaseThickness / results.compactionLayersCount).toFixed(1)} cm</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                ⚠️ Nigdy nie zasypuj całej grubości {results.actualSubBaseThickness} cm na raz. Tłuczeń należy wysypywać i ubijać warstwowo po max 12–15 cm, zraszając lekko wodą.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 block">Zalecana zagęszczarka:</span>
              <div className="text-sm font-bold text-slate-900">
                {results.compactorWeightRecommendation}
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Prawidłowo ubita podbudowa nie powinna uginać się pod ciężarem stopy ani pozostawiać głębokich śladów kół sprzętu.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto pt-2">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">Warstwa</th>
                  <th className="py-2.5 px-3">Grubość</th>
                  <th className="py-2.5 px-3">Ilość materiału</th>
                  <th className="py-2.5 px-3">Waga / Opis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-blue-700">Nawierzchnia tarasowa ({params.surfaceType})</td>
                  <td className="py-2.5 px-3">{params.customSurfaceThickness} cm</td>
                  <td className="py-2.5 px-3 font-bold text-blue-600">{results.surfaceMaterialArea} m²</td>
                  <td className="py-2.5 px-3 text-slate-500">ok. {results.tilesEstimateCount} szt. płyt 60x60cm</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Podsypka (grysik 2-5mm / piasek)</td>
                  <td className="py-2.5 px-3">{params.beddingThickness} cm</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{results.beddingVolume} m³</td>
                  <td className="py-2.5 px-3 text-slate-500">{results.beddingWeightTons} ton</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Podbudowa z tłucznia 0-31.5 mm</td>
                  <td className="py-2.5 px-3">{results.actualSubBaseThickness} cm</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{results.subBaseVolumeCompacted} m³ (ubity) / {results.subBaseVolumeLoose} m³ (sypki)</td>
                  <td className="py-2.5 px-3 text-slate-500">{results.subBaseWeightTons} ton</td>
                </tr>
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Geowłóknina drenażowa</td>
                  <td className="py-2.5 px-3">—</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{(results.terraceArea * 1.15).toFixed(1)} m²</td>
                  <td className="py-2.5 px-3 text-slate-500">z zakładem 15%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* VISUAL DIAGRAM */}
        <TerraceAndRoofVisualizer
          roofParams={roofParams}
          roofResults={roofResults}
          terraceParams={params}
          terraceResults={results}
        />

        {/* TECHNICAL ADVICE BOX */}
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-5 text-xs text-blue-900 space-y-2 leading-relaxed">
          <h4 className="font-semibold text-blue-900 flex items-center gap-2 text-sm">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            Rekomendacje Wykonawcze Inżyniera Budownictwa:
          </h4>
          <ul className="list-disc list-inside space-y-1.5 text-blue-900">
            <li>
              <strong>Wyprofilowanie dna wykopu:</strong> Dno wykopu powinno mieć spadek ok. 1.5–2% na zewnątrz budynku.
            </li>
            <li>
              <strong>Geowłóknina:</strong> Na dnie wykopu koniecznie wyłóż geowłókninę (min. 150-200 g/m²), która zapobiega mieszaniu się tłucznia z rodzimym gruntem i zapobiega zapadaniu się tarasu.
            </li>
            <li>
              <strong>Właściwe kruszywo:</strong> Stosuj tłuczeń / kruszywo łamane (np. melafir, porfir, granit) o frakcji ciągłej 0-31.5 mm. Unikaj żwiru płukanego kulistego do podbudowy, gdyż nie daje się on dobrze zagęścić!
            </li>
          </ul>
        </div>

      </div>

    </div>
  );
};
