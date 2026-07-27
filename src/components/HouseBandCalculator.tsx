import React from 'react';
import { HouseBandParams, HouseBandResults, BandExclusion } from '../types';
import { CrossSectionDiagram } from './CrossSectionDiagram';
import { Info, Calculator, CheckCircle2, Plus, Trash2, Scissors } from 'lucide-react';

interface HouseBandCalculatorProps {
  params: HouseBandParams;
  onChange: (updated: HouseBandParams) => void;
  results: HouseBandResults;
}

export const HouseBandCalculator: React.FC<HouseBandCalculatorProps> = ({
  params,
  onChange,
  results,
}) => {
  const handleInputChange = (field: keyof HouseBandParams, value: any) => {
    onChange({ ...params, [field]: value });
  };

  // MULTIPLE EXCLUSIONS MANAGEMENT
  const currentExclusions: BandExclusion[] =
    params.exclusions && params.exclusions.length > 0
      ? params.exclusions
      : [{ id: 'ex-1', name: 'Taras ogrodowy', length: params.terraceExclusionWidth || 4.5 }];

  const totalExclusionLength = currentExclusions.reduce(
    (acc, item) => acc + (Number(item.length) || 0),
    0
  );

  const updateExclusionsList = (newList: BandExclusion[]) => {
    const sumLength = newList.reduce((acc, item) => acc + (Number(item.length) || 0), 0);
    onChange({
      ...params,
      exclusions: newList,
      terraceExclusionWidth: Math.round(sumLength * 10) / 10,
    });
  };

  const handleAddExclusion = (presetName?: string, presetLength?: number) => {
    const newExclusion: BandExclusion = {
      id: `ex-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      name: presetName || 'Nowe wyłączenie',
      length: presetLength !== undefined ? presetLength : 2.5,
    };
    updateExclusionsList([...currentExclusions, newExclusion]);
  };

  const handleRemoveExclusion = (id: string) => {
    const updated = currentExclusions.filter((item) => item.id !== id);
    updateExclusionsList(updated);
  };

  const handleUpdateExclusion = (id: string, field: keyof BandExclusion, value: any) => {
    const updated = currentExclusions.map((item) => {
      if (item.id === id) {
        return { ...item, [field]: value };
      }
      return item;
    });
    updateExclusionsList(updated);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* INPUT FORM (LEFT COLUMN) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Calculator className="w-4 h-4 text-blue-600" />
            1. Wymiary i Materiały Opaski Domu
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Wprowadź obwód budynku, szerokość opaski i materiały oporowe
          </p>
        </div>

        {/* SEC 1: GEOMETRIA DOMU I OPASKI */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Geometria i Wymiary Budynku
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Obwód domu (cm):
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="np. 4000"
                value={params.housePerimeter === 0 || params.housePerimeter === undefined ? '' : params.housePerimeter}
                onChange={(e) => handleInputChange('housePerimeter', parseFloat(e.target.value.replace(',', '.')) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">np. 4000 cm dla budynków 12x8 m</span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">
                Szerokość opaski (cm):
              </label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="np. 80"
                value={params.bandWidth === 0 || params.bandWidth === undefined ? '' : params.bandWidth}
                onChange={(e) => handleInputChange('bandWidth', parseFloat(e.target.value.replace(',', '.')) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none transition-colors"
              />
              <span className="text-[10px] text-slate-400 mt-0.5 block">standardowo 60 - 100 cm</span>
            </div>
          </div>

          {/* MULTI-EXCLUSION SECTION */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Scissors className="w-3.5 h-3.5 text-blue-600" />
                Wyłączenia z opaski (Taras, Schody, Podjazd itp.)
              </label>
              <span className="text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                Suma: {totalExclusionLength} cm ({(totalExclusionLength / 100).toFixed(1)} m)
              </span>
            </div>

            <p className="text-[11px] text-slate-500 leading-snug">
              Miejsca przy ścianie budynku, gdzie opaska nie jest wykonywana (np. taras ogrodowy, schody wejściowe, wjazd do garażu).
            </p>

            {/* LIST OF EXCLUSIONS */}
            <div className="space-y-2">
              {currentExclusions.map((ex, idx) => (
                <div key={ex.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-slate-200 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 w-4 text-center">{idx + 1}.</span>
                  <input
                    type="text"
                    value={ex.name}
                    placeholder="Nazwa (np. Schody frontowe)"
                    onChange={(e) => handleUpdateExclusion(ex.id, 'name', e.target.value)}
                    className="flex-1 bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 focus:bg-white focus:outline-none"
                  />
                  <div className="flex items-center gap-1 w-28">
                    <input
                      type="number"
                      min="0"
                      max="100000"
                      step="any"
                      placeholder="np. 450"
                      value={ex.length === 0 || ex.length === undefined ? '' : ex.length}
                      onChange={(e) => handleUpdateExclusion(ex.id, 'length', parseFloat(e.target.value.replace(',', '.')) || 0)}
                      className="w-full bg-slate-50 border border-slate-200 rounded px-2 py-1 text-xs text-slate-800 text-right font-bold focus:bg-white focus:outline-none"
                    />
                    <span className="text-xs font-medium text-slate-500">cm</span>
                  </div>
                  <button
                    onClick={() => handleRemoveExclusion(ex.id)}
                    className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition cursor-pointer"
                    title="Usuń wyłączenie"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* PRESET CHIPS TO QUICK ADD */}
            <div className="pt-1 flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] text-slate-400 font-medium">Szybkie dodanie:</span>
              <button
                type="button"
                onClick={() => handleAddExclusion('Taras ogrodowy', 450)}
                className="text-[10px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-2 py-1 rounded border border-slate-200 hover:border-blue-300 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5 text-blue-600" /> Taras (450 cm)
              </button>
              <button
                type="button"
                onClick={() => handleAddExclusion('Schody wejściowe', 250)}
                className="text-[10px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-2 py-1 rounded border border-slate-200 hover:border-blue-300 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5 text-blue-600" /> Schody (250 cm)
              </button>
              <button
                type="button"
                onClick={() => handleAddExclusion('Wjazd do garażu', 600)}
                className="text-[10px] bg-white hover:bg-blue-50 text-slate-700 hover:text-blue-700 font-semibold px-2 py-1 rounded border border-slate-200 hover:border-blue-300 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5 text-blue-600" /> Garaż (600 cm)
              </button>
              <button
                type="button"
                onClick={() => handleAddExclusion('Inne wyłączenie', 150)}
                className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold px-2 py-1 rounded border border-slate-300 transition cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-2.5 h-2.5" /> Inne (150 cm)
              </button>
            </div>

            <div className="text-[10px] text-slate-500 pt-1 flex justify-between border-t border-slate-200/60">
              <span>Efektywny obwód opaski przy ścianach:</span>
              <strong className="text-slate-800">
                {Math.max(0, (params.housePerimeter || 0) - totalExclusionLength)} cm ({Math.max(0, ((params.housePerimeter || 0) - totalExclusionLength) / 100).toFixed(1)} m)
              </strong>
            </div>
          </div>
        </div>

        {/* SEC 2: OBRZEŻA / KRAWĘŻNIKI */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Wymiary Obrzeża Trawnikowego
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Długość (cm):</label>
              <input
                type="number"
                placeholder="np. 100"
                value={params.edgingLength === 0 || params.edgingLength === undefined ? '' : params.edgingLength}
                onChange={(e) => handleInputChange('edgingLength', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Wysokość (cm):</label>
              <input
                type="number"
                placeholder="np. 20"
                value={params.edgingHeight === 0 || params.edgingHeight === undefined ? '' : params.edgingHeight}
                onChange={(e) => handleInputChange('edgingHeight', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Grubość (cm):</label>
              <input
                type="number"
                placeholder="np. 6"
                value={params.edgingThickness === 0 || params.edgingThickness === undefined ? '' : params.edgingThickness}
                onChange={(e) => handleInputChange('edgingThickness', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* SEC 3: NAWIERZCHNIA */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Rodzaj i Wymiary Nawierzchni
          </h3>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Typ wykończenia opaski:</label>
            <select
              value={params.surfaceType}
              onChange={(e) => handleInputChange('surfaceType', e.target.value as any)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none cursor-pointer"
            >
              <option value="plyty">Płyty betonowe / tarasowe</option>
              <option value="kostka">Kostka brukowa / granitowa</option>
              <option value="zwir">Żwir ozdobny / Grys płukany</option>
            </select>
          </div>

          {params.surfaceType === 'plyty' && (
            <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Dł. płyty (cm):</label>
                <input
                  type="number"
                  placeholder="np. 50"
                  value={params.tileLength === 0 || params.tileLength === undefined ? '' : params.tileLength}
                  onChange={(e) => handleInputChange('tileLength', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Szer. płyty (cm):</label>
                <input
                  type="number"
                  placeholder="np. 50"
                  value={params.tileWidth === 0 || params.tileWidth === undefined ? '' : params.tileWidth}
                  onChange={(e) => handleInputChange('tileWidth', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm text-slate-800"
                />
              </div>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Grubość (cm):</label>
                <input
                  type="number"
                  placeholder="np. 4"
                  value={params.tileThickness === 0 || params.tileThickness === undefined ? '' : params.tileThickness}
                  onChange={(e) => handleInputChange('tileThickness', parseFloat(e.target.value) || 0)}
                  className="w-full bg-white border border-slate-200 rounded px-2 py-1 text-sm text-slate-800"
                />
              </div>
            </div>
          )}

          {params.surfaceType === 'zwir' && (
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <label className="block text-xs font-semibold text-slate-600 mb-1">Grubość warstwy żwiru (cm):</label>
              <input
                type="number"
                placeholder="np. 5"
                value={params.gravelLayerThickness === 0 || params.gravelLayerThickness === undefined ? '' : params.gravelLayerThickness}
                onChange={(e) => handleInputChange('gravelLayerThickness', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-3 py-1.5 text-sm text-slate-800"
              />
            </div>
          )}
        </div>

        {/* SEC 4: WARSTWY PODBUDOWY */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Grubości Warstw Podbudowy i Zapas
          </h3>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Tłuczeń (cm):</label>
              <input
                type="number"
                placeholder="np. 15"
                value={params.subBaseThickness === 0 || params.subBaseThickness === undefined ? '' : params.subBaseThickness}
                onChange={(e) => handleInputChange('subBaseThickness', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Podsypka (cm):</label>
              <input
                type="number"
                placeholder="np. 4"
                value={params.beddingThickness === 0 || params.beddingThickness === undefined ? '' : params.beddingThickness}
                onChange={(e) => handleInputChange('beddingThickness', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Zapas (%):</label>
              <input
                type="number"
                placeholder="np. 8"
                value={params.wasteBufferPercent === 0 || params.wasteBufferPercent === undefined ? '' : params.wasteBufferPercent}
                onChange={(e) => handleInputChange('wasteBufferPercent', parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

      </div>

      {/* RESULTS DISPLAY (RIGHT COLUMN) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* SUMMARY CARDS GRID */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Powierzchnia opaski:</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">{results.bandAreaNet} m²</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">bez obszaru tarasu</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Liczba obrzeży:</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">{results.edgingPiecesCount} szt</span>
            <span className="text-[10px] text-slate-500 block mt-0.5">dł. całkowita: {results.outerEdgingLength} mb</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm col-span-2 sm:col-span-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Nawierzchnia:</span>
            {params.surfaceType === 'plyty' && (
              <span className="text-2xl font-bold text-blue-600 mt-1 block">{results.tilesCount} szt płyty</span>
            )}
            {params.surfaceType === 'kostka' && (
              <span className="text-2xl font-bold text-blue-600 mt-1 block">{results.pavingArea} m² kostki</span>
            )}
            {params.surfaceType === 'zwir' && (
              <span className="text-2xl font-bold text-blue-600 mt-1 block">{results.gravelWeightTons} t żwiru</span>
            )}
            <span className="text-[10px] text-slate-500 block mt-0.5">z uwzględnieniem zapasu {params.wasteBufferPercent}%</span>
          </div>
        </div>

        {/* DETAILED MATERIAL BREAKDOWN TABLE */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center justify-between border-b border-slate-100 pb-3">
            <span className="flex items-center gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-blue-600" />
              Kompletne Zestawienie Materiałów na Opaskę Domu
            </span>
            <span className="text-xs text-slate-500 font-normal normal-case">Głębokość wykopu: <strong>{results.totalExcavationDepth} cm</strong></span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider bg-slate-50">
                  <th className="py-2.5 px-3">Element / Materiał</th>
                  <th className="py-2.5 px-3">Ilość netto</th>
                  <th className="py-2.5 px-3">Zalecana ilość z zapasem</th>
                  <th className="py-2.5 px-3">Waga / Pojemność</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Obrzeża trawnikowe ({params.edgingLength}x{params.edgingHeight}x{params.edgingThickness} cm)</td>
                  <td className="py-2.5 px-3">{results.outerEdgingLength} mb</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{results.edgingPiecesCount} szt.</td>
                  <td className="py-2.5 px-3 text-slate-500">ok. {(results.edgingPiecesCount * 28 / 1000).toFixed(2)} tony</td>
                </tr>

                {params.surfaceType === 'plyty' && (
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">Płyty tarasowe / betonowe ({params.tileLength}x{params.tileWidth} cm)</td>
                    <td className="py-2.5 px-3">{results.bandAreaNet} m²</td>
                    <td className="py-2.5 px-3 font-bold text-blue-600">{results.tilesCount} szt.</td>
                    <td className="py-2.5 px-3 text-slate-500">{(results.tilesCount! * (params.tileLength * params.tileWidth * params.tileThickness * 0.0024)).toFixed(0)} kg</td>
                  </tr>
                )}

                {params.surfaceType === 'kostka' && (
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">Kostka brukowa</td>
                    <td className="py-2.5 px-3">{results.bandAreaNet} m²</td>
                    <td className="py-2.5 px-3 font-bold text-blue-600">{results.pavingArea} m²</td>
                    <td className="py-2.5 px-3 text-slate-500">ok. {(results.pavingArea! * 0.135).toFixed(1)} t</td>
                  </tr>
                )}

                {params.surfaceType === 'zwir' && (
                  <tr>
                    <td className="py-2.5 px-3 font-semibold text-blue-700">Żwir / Grys płukany (gr. {params.gravelLayerThickness} cm)</td>
                    <td className="py-2.5 px-3">{results.gravelVolume} m³</td>
                    <td className="py-2.5 px-3 font-bold text-blue-600">{results.gravelWeightTons} tony</td>
                    <td className="py-2.5 px-3 text-slate-500">{results.gravelVolume} m³ sypkiego</td>
                  </tr>
                )}

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Tłuczeń łamany 0-31.5 mm (podbudowa)</td>
                  <td className="py-2.5 px-3">{results.subBaseVolume} m³</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{results.subBaseWeightTons} tony</td>
                  <td className="py-2.5 px-3 text-slate-500">gęstość ~1.85 t/m³</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Podsypka cementowo-piaskowa (1:4) lub grysik</td>
                  <td className="py-2.5 px-3">{results.beddingVolume} m³</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{results.beddingWeightTons} t piasku + {results.cementBags25kg} worków cementu 25kg</td>
                  <td className="py-2.5 px-3 text-slate-500">worki cementu 25kg</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Beton B15 na ławę i opór obrzeży</td>
                  <td className="py-2.5 px-3">—</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{results.concreteLeanForEdging} m³ betonu</td>
                  <td className="py-2.5 px-3 text-slate-500">ok. {Math.ceil(results.concreteLeanForEdging * 40)} worków po 25kg</td>
                </tr>

                <tr>
                  <td className="py-2.5 px-3 font-semibold text-slate-800">Geowłóknina filtracyjna (pod tłuczeń)</td>
                  <td className="py-2.5 px-3">{results.bandAreaNet} m²</td>
                  <td className="py-2.5 px-3 font-bold text-slate-900">{results.geotextileArea} m²</td>
                  <td className="py-2.5 px-3 text-slate-500">z zakładkami 15%</td>
                </tr>

                <tr className="bg-slate-50 font-bold">
                  <td className="py-2.5 px-3 text-slate-800">Urabisko z wykopu (ziemia do wywiezienia)</td>
                  <td className="py-2.5 px-3 text-slate-600">{results.excavationVolume} m³ w gruncie</td>
                  <td className="py-2.5 px-3 text-slate-900">{results.excavationVolumeLoose} m³ spęcznionej ziemi</td>
                  <td className="py-2.5 px-3 text-slate-500">ok. {(results.excavationVolumeLoose * 1.5).toFixed(1)} ton</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* VISUAL CROSS SECTION DIAGRAM */}
        <CrossSectionDiagram
          title="Przekrój Opaski Wokół Domu"
          surfaceType={params.surfaceType === 'plyty' ? 'Płyty tarasowe' : params.surfaceType === 'kostka' ? 'Kostka brukowa' : 'Żwir ozdobny'}
          surfaceThicknessCm={params.surfaceType === 'plyty' ? params.tileThickness : params.surfaceType === 'kostka' ? 6 : params.gravelLayerThickness}
          beddingThicknessCm={params.beddingThickness}
          subBaseThicknessCm={params.subBaseThickness}
          totalDepthCm={results.totalExcavationDepth}
        />

        {/* TIPS BOX */}
        <div className="bg-blue-50 border border-blue-200/80 rounded-2xl p-5 text-xs text-blue-900 flex gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1.5 leading-relaxed">
            <span className="font-semibold text-blue-900 block text-sm">Porady wykonawcze dla opaski wokół domu:</span>
            <p>
              1. Pamiętaj o zachowaniu spadku opaski od ściany budynku na zewnątrz (ok. 1.5 - 2%, czyli 1.5 - 2 cm na metr szerokości) dla odprowadzenia wody deszczowej od fundamentu.
            </p>
            <p>
              2. Obrzeża trawnikowe należy osadzać na ławie betonowej z oporem (klinem) pod kątem 45° sięgającym do połowy wysokości obrzeża, aby nawierzchnia nie rozjeżdżała się pod naciskiem.
            </p>
          </div>
        </div>

      </div>

    </div>
  );
};
