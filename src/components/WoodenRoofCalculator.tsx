import React, { useState } from 'react';
import {
  WoodenRoofParams,
  WoodenRoofResults,
  TerraceFoundationParams,
  TerraceFoundationResults,
} from '../types';
import { TerraceAndRoofVisualizer } from './TerraceAndRoofVisualizer';
import { Rafters3DVisualizer } from './Rafters3DVisualizer';
import { RaftersSchematic2D } from './RaftersSchematic2D';
import { Trees, Wrench, Hammer, BookOpen, AlertTriangle, CheckCircle, Box, Layers, Ruler } from 'lucide-react';

interface WoodenRoofCalculatorProps {
  params: WoodenRoofParams;
  onChange: (updated: WoodenRoofParams) => void;
  results: WoodenRoofResults;
  terraceParams: TerraceFoundationParams;
  terraceResults: TerraceFoundationResults;
}

export const WoodenRoofCalculator: React.FC<WoodenRoofCalculatorProps> = ({
  params,
  onChange,
  results,
  terraceParams,
  terraceResults,
}) => {
  const [activeGuideTab, setActiveGuideTab] = useState<'krok-po-kroku' | 'zestawienie' | 'kotwy'>('krok-po-kroku');
  const [visualizerTab, setVisualizerTab] = useState<'3d-rafters' | '2d-schematic' | '2d-diagram'>('3d-rafters');

  const handleInputChange = (field: keyof WoodenRoofParams, value: any) => {
    onChange({ ...params, [field]: value });
  };

  const handleNestedInputChange = (category: 'postDimension' | 'frontBeamDimension' | 'wallBeamDimension' | 'rafterDimension' | 'braceDimension', key: 'width' | 'height', value: number) => {
    onChange({
      ...params,
      [category]: {
        ...params[category],
        [key]: value,
      },
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      
      {/* INPUT FORM (LEFT COLUMN) */}
      <div className="lg:col-span-5 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="border-b border-slate-100 pb-4">
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Trees className="w-4 h-4 text-blue-600" />
            3. Wymiarowanie Zadaszenia Drewnianego
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Zaprojektuj wymiary i przekroje drewnianej pergoli lub zadaszenia tarasowego
          </p>
        </div>

        {/* SEC 1: GEOMETRIA DAECHU */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Wymiary Zadaszenia i Wysokości
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Szerokość wzdłuż ściany (cm):</label>
              <input
                type="number"
                min="0"
                step="any"
                placeholder="np. 450"
                value={!params.width ? '' : params.width}
                onChange={(e) => handleInputChange('width', parseFloat(e.target.value.replace(',', '.')) || 0)}
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
                value={!params.depth ? '' : params.depth}
                onChange={(e) => handleInputChange('depth', parseFloat(e.target.value.replace(',', '.')) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800 focus:ring-1 focus:ring-blue-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Wys. ściana (cm):</label>
              <input
                type="number"
                step="any"
                placeholder="np. 270"
                value={!params.heightAtWall ? '' : params.heightAtWall}
                onChange={(e) => handleInputChange('heightAtWall', parseFloat(e.target.value.replace(',', '.')) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Wys. przód (cm):</label>
              <input
                type="number"
                step="any"
                placeholder="np. 220"
                value={!params.heightAtFront ? '' : params.heightAtFront}
                onChange={(e) => handleInputChange('heightAtFront', parseFloat(e.target.value.replace(',', '.')) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-800"
              />
            </div>
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Okap przód (cm):</label>
              <input
                type="number"
                step="any"
                placeholder="np. 30"
                value={!params.frontOverhang ? '' : params.frontOverhang}
                onChange={(e) => handleInputChange('frontOverhang', parseFloat(e.target.value.replace(',', '.')) || 0)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2 py-1.5 text-sm text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* SEC 2: MATERIAŁY DREWNO I POKRYCIE */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Gatunek Drewna i Pokrycie
          </h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Klasa / Rodzaj drewna:</label>
              <select
                value={params.woodGrade}
                onChange={(e) => handleInputChange('woodGrade', e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="C24">Drewno lite C24 suszone komorowo</option>
                <option value="KVH">Drewno klejone KVH NSI/SI</option>
                <option value="BSH">Drewno klejone wielowarstwowo BSH</option>
                <option value="sosna_surowa">Drewno sosnowe surowe / impregnowane</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1">Pokrycie dachu:</label>
              <select
                value={params.roofCoverType}
                onChange={(e) => handleInputChange('roofCoverType', e.target.value as any)}
                className="w-full bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-2 text-xs text-slate-800 focus:ring-1 focus:ring-blue-500 cursor-pointer"
              >
                <option value="poliwęglan_komorowy">Poliwęglan komorowy (10-16mm)</option>
                <option value="poliwęglan_lity">Poliwęglan lity (przezroczysty/dymiony)</option>
                <option value="blachodachówka">Blachodachówka / Blacha trapezowa</option>
                <option value="szkło_vsg">Szkło bezpieczne hartowane VSG</option>
                <option value="gont">Gont bitumiczny na płycie OSB</option>
              </select>
            </div>
          </div>
        </div>

        {/* SEC 3: PRZEKROJE ELEMENTÓW DREWNIANYCH */}
        <div className="space-y-3 pt-3 border-t border-slate-100">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600"></span>
            Przekroje Elementów (Szerokość x Wysokość w cm)
          </h3>

          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-700 font-semibold block mb-1">Słupy nośne (pionowe):</span>
              <div className="flex gap-1.5 items-center">
                <input
                  type="number"
                  placeholder="12"
                  value={!params.postDimension.width ? '' : params.postDimension.width}
                  onChange={(e) => handleNestedInputChange('postDimension', 'width', parseFloat(e.target.value) || 0)}
                  className="w-14 bg-white border border-slate-200 rounded px-2 py-1 text-center text-slate-800"
                />
                <span>x</span>
                <input
                  type="number"
                  placeholder="12"
                  value={!params.postDimension.height ? '' : params.postDimension.height}
                  onChange={(e) => handleNestedInputChange('postDimension', 'height', parseFloat(e.target.value) || 0)}
                  className="w-14 bg-white border border-slate-200 rounded px-2 py-1 text-center text-slate-800"
                />
                <span>cm</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-700 font-semibold block mb-1">Płatew przednia (oczep):</span>
              <div className="flex gap-1.5 items-center">
                <input
                  type="number"
                  placeholder="12"
                  value={!params.frontBeamDimension.width ? '' : params.frontBeamDimension.width}
                  onChange={(e) => handleNestedInputChange('frontBeamDimension', 'width', parseFloat(e.target.value) || 0)}
                  className="w-14 bg-white border border-slate-200 rounded px-2 py-1 text-center text-slate-800"
                />
                <span>x</span>
                <input
                  type="number"
                  placeholder="16"
                  value={!params.frontBeamDimension.height ? '' : params.frontBeamDimension.height}
                  onChange={(e) => handleNestedInputChange('frontBeamDimension', 'height', parseFloat(e.target.value) || 0)}
                  className="w-14 bg-white border border-slate-200 rounded px-2 py-1 text-center text-slate-800"
                />
                <span>cm</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-700 font-semibold block mb-1">Belka przyścienna (murłata):</span>
              <div className="flex gap-1.5 items-center">
                <input
                  type="number"
                  placeholder="8"
                  value={!params.wallBeamDimension.width ? '' : params.wallBeamDimension.width}
                  onChange={(e) => handleNestedInputChange('wallBeamDimension', 'width', parseFloat(e.target.value) || 0)}
                  className="w-14 bg-white border border-slate-200 rounded px-2 py-1 text-center text-slate-800"
                />
                <span>x</span>
                <input
                  type="number"
                  placeholder="16"
                  value={!params.wallBeamDimension.height ? '' : params.wallBeamDimension.height}
                  onChange={(e) => handleNestedInputChange('wallBeamDimension', 'height', parseFloat(e.target.value) || 0)}
                  className="w-14 bg-white border border-slate-200 rounded px-2 py-1 text-center text-slate-800"
                />
                <span>cm</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200">
              <span className="text-slate-700 font-semibold block mb-1">Krokwie dachowe:</span>
              <div className="flex gap-1.5 items-center">
                <input
                  type="number"
                  placeholder="7"
                  value={!params.rafterDimension.width ? '' : params.rafterDimension.width}
                  onChange={(e) => handleNestedInputChange('rafterDimension', 'width', parseFloat(e.target.value) || 0)}
                  className="w-14 bg-white border border-slate-200 rounded px-2 py-1 text-center text-slate-800"
                />
                <span>x</span>
                <input
                  type="number"
                  placeholder="16"
                  value={!params.rafterDimension.height ? '' : params.rafterDimension.height}
                  onChange={(e) => handleNestedInputChange('rafterDimension', 'height', parseFloat(e.target.value) || 0)}
                  className="w-14 bg-white border border-slate-200 rounded px-2 py-1 text-center text-slate-800"
                />
                <span>cm</span>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-600 mb-1">Preferowany rozstaw krokwi (cm):</label>
            <input
              type="number"
              min="0"
              max="200"
              step="any"
              placeholder="np. 70"
              value={!params.targetRafterSpacing ? '' : params.targetRafterSpacing}
              onChange={(e) => handleInputChange('targetRafterSpacing', parseFloat(e.target.value.replace(',', '.')) || 0)}
              className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-800"
            />
          </div>
        </div>

      </div>

      {/* RESULTS DISPLAY & INSTRUCTIONS (RIGHT COLUMN) */}
      <div className="lg:col-span-7 space-y-6">
        
        {/* SUMMARY KEY STATS CARDS */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Spadek dachu:</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{results.roofAngleDegrees}° ({results.roofSlopePercent}%)</span>
            <span className="text-[10px] text-slate-500 block">min. 5° dla poliwęglanu</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Liczba słupów:</span>
            <span className="text-2xl font-bold text-slate-900 mt-1 block">{results.postsCount} szt.</span>
            <span className="text-[10px] text-slate-500 block">rozstaw co {results.postSpanDistance}m</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Liczba krokwi:</span>
            <span className="text-2xl font-bold text-blue-600 mt-1 block">{results.raftersCount} szt.</span>
            <span className="text-[10px] text-slate-500 block">rozstaw co {results.actualRafterSpacing}cm</span>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">Kubatura drewna:</span>
            <span className="text-2xl font-bold text-slate-800 mt-1 block">{results.totalWoodVolumeM3} m³</span>
            <span className="text-[10px] text-slate-500 block">klasa: {params.woodGrade}</span>
          </div>
        </div>

        {/* VISUALIZER SECTION (3D RAFTERS, 2D SCHEMATIC, 2D CROSS-SECTION) */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-slate-100 p-1.5 rounded-xl border border-slate-200 gap-2">
            <span className="text-xs font-extrabold text-slate-700 ml-2 flex items-center gap-1.5">
              <Box className="w-4 h-4 text-blue-600" />
              Podgląd i Wizualizacja Zadaszenia
            </span>
            <div className="flex flex-wrap items-center gap-1">
              <button
                type="button"
                onClick={() => setVisualizerTab('3d-rafters')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  visualizerTab === '3d-rafters'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Box className="w-3.5 h-3.5" />
                Podgląd 3D Krokwi
              </button>
              <button
                type="button"
                onClick={() => setVisualizerTab('2d-schematic')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  visualizerTab === '2d-schematic'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                Schemat Rozstawu SVG
              </button>
              <button
                type="button"
                onClick={() => setVisualizerTab('2d-diagram')}
                className={`px-3 py-1.5 text-xs font-bold rounded-lg transition cursor-pointer flex items-center gap-1.5 ${
                  visualizerTab === '2d-diagram'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                Przekrój Budowlany 2D
              </button>
            </div>
          </div>

          {visualizerTab === '3d-rafters' && (
            <Rafters3DVisualizer
              params={params}
              onChange={onChange}
              results={results}
            />
          )}

          {visualizerTab === '2d-schematic' && (
            <RaftersSchematic2D
              params={params}
              onChange={onChange}
              results={results}
            />
          )}

          {visualizerTab === '2d-diagram' && (
            <TerraceAndRoofVisualizer
              roofParams={params}
              roofResults={results}
              terraceParams={terraceParams}
              terraceResults={terraceResults}
            />
          )}
        </div>

        {/* TABS FOR GUIDE & DETAILED BILL OF MATERIALS */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4">
          
          <div className="flex border-b border-slate-100 gap-4">
            <button
              onClick={() => setActiveGuideTab('krok-po-kroku')}
              className={`pb-3 text-xs md:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeGuideTab === 'krok-po-kroku'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Wrench className="w-4 h-4" />
              Instrukcja Montażu Krok po Kroku
            </button>

            <button
              onClick={() => setActiveGuideTab('zestawienie')}
              className={`pb-3 text-xs md:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeGuideTab === 'zestawienie'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <Hammer className="w-4 h-4" />
              Zestawienie Elementów Drewnianych
            </button>

            <button
              onClick={() => setActiveGuideTab('kotwy')}
              className={`pb-3 text-xs md:text-sm font-semibold flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
                activeGuideTab === 'kotwy'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-slate-400 hover:text-slate-700'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Łączniki, Kotwy & Pokrycie
            </button>
          </div>

          {/* TAB CONTENT 1: INSTRUCTION STEP BY STEP */}
          {activeGuideTab === 'krok-po-kroku' && (
            <div className="space-y-4 text-xs text-slate-700">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-sm block flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">1</span>
                  Fundamenty pod Słupy (Stopy Fundamentowe)
                </span>
                <p className="text-slate-600 leading-relaxed pl-7">
                  Wykop {results.foundationFootingsCount} stopy fundamentowe w miejscach słupów na głębokość min. <strong>{results.footingDepthCm} cm</strong> (poniżej poziomu przemarzania gruntu). Wlej beton B20 (ok. {results.footingConcreteVolumeM3} m³) i zatop w nim regulowane kotwy słupowe typu U lub stalowe kotwy wbijane/wkręcane. Odczekaj 3-7 dni na związanie betonu.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-sm block flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">2</span>
                  Montaż Belki Przyściennej do Ściany Budynku
                </span>
                <p className="text-slate-600 leading-relaxed pl-7">
                  Belkę przyścienną ({params.wallBeamDimension.width}x{params.wallBeamDimension.height} cm) zamontuj na wysokości <strong>{params.heightAtWall} m</strong> od podłoża. Użyj <strong>{results.screwsAndAnchorsEstimate.chemicalAnchorsWall} kotew chemicznych M12</strong> rozstawionych co ok. 60-80 cm. Jeśli ściana ma ocieplenie styropianowe, zastosuj tuleje dystansowe ze stali nierdzewnej!
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-sm block flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">3</span>
                  Montaż Słupów Przednich i Płatwi Oczepowej
                </span>
                <p className="text-slate-600 leading-relaxed pl-7">
                  Postaw <strong>{results.postsCount} słupów</strong> ({params.postDimension.width}x{params.postDimension.height} cm) o wysokości {params.heightAtFront} m na kotwach regulowanych. Na szczycie słupów zamontuj płatew przednią ({params.frontBeamDimension.width}x{params.frontBeamDimension.height} cm, długość {params.width} m).
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-sm block flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">4</span>
                  Montaż Mieczy (Zastrzałów) Usztywniających
                </span>
                <p className="text-slate-600 leading-relaxed pl-7">
                  Pomiędzy słupy a płatew oraz pod krokwie zacinaj pod kątem 45° miecze ({params.braceDimension.width}x{params.braceDimension.height} cm). Zamontuj <strong>{results.bracesCount} zastrzałów</strong> dla sztywności konstrukcji wzdłużnej.
                </p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-1">
                <span className="font-bold text-slate-900 text-sm block flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-slate-900 text-white font-bold flex items-center justify-center text-xs">5</span>
                  Montaż Krokwi Dachowych i Pokrycia
                </span>
                <p className="text-slate-600 leading-relaxed pl-7">
                  Zaplanuj <strong>{results.raftersCount} krokwi</strong> ({params.rafterDimension.width}x{params.rafterDimension.height} cm) dociętych na długość {results.rafterLength} m. Wykonaj zacięcia zaciosowe i przymocuj długimi wkrętami ciesielskimi talerzowymi (np. 8x240 mm). Następnie ułóż zadaszenie ({results.roofCoverPanelsEstimate}).
                </p>
              </div>
            </div>
          )}

          {/* TAB CONTENT 2: TIMBER BILL OF MATERIALS */}
          {activeGuideTab === 'zestawienie' && (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider bg-slate-50">
                    <th className="py-2.5 px-3">Nazwa Elementu</th>
                    <th className="py-2.5 px-3">Liczba sztuk</th>
                    <th className="py-2.5 px-3">Przekrój (cm)</th>
                    <th className="py-2.5 px-3">Długość handlowa (m)</th>
                    <th className="py-2.5 px-3">Masa / Objętość (m³)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {results.woodBillOfMaterials.map((item, idx) => (
                    <tr key={idx}>
                      <td className="py-2.5 px-3 font-semibold text-slate-900">{item.name}</td>
                      <td className="py-2.5 px-3 font-bold text-blue-600">{item.count} szt.</td>
                      <td className="py-2.5 px-3">{item.dimensionsCm} cm</td>
                      <td className="py-2.5 px-3">{item.lengthM} m</td>
                      <td className="py-2.5 px-3 text-slate-600">{item.volumeM3} m³</td>
                    </tr>
                  ))}
                  <tr className="bg-slate-50 font-bold border-t border-slate-200 text-slate-900">
                    <td className="py-2.5 px-3">RAZEM DREWNO ({params.woodGrade})</td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 px-3">—</td>
                    <td className="py-2.5 px-3 text-sm text-blue-600 font-bold">{results.totalWoodVolumeM3} m³</td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}

          {/* TAB CONTENT 3: FASTENERS AND HARDWARE */}
          {activeGuideTab === 'kotwy' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-sm block">Łączniki Ciesielskie i Kotwy:</span>
                <ul className="space-y-2 text-slate-700">
                  <li className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span>Kotwy regulowane w beton pod słupy:</span>
                    <strong className="text-blue-600">{results.screwsAndAnchorsEstimate.postAnchors} szt.</strong>
                  </li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span>Kotwy chemiczne M12 do montażu belki przyściennej:</span>
                    <strong className="text-blue-600">{results.screwsAndAnchorsEstimate.chemicalAnchorsWall} zestawów</strong>
                  </li>
                  <li className="flex justify-between border-b border-slate-200/60 pb-1.5">
                    <span>Wkręty ciesielskie talerzowe (np. 8x240 / 8x280 mm):</span>
                    <strong className="text-blue-600">{results.screwsAndAnchorsEstimate.rafterScrews} szt.</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Wkręty z podkładką EPDM do pokrycia:</span>
                    <strong className="text-blue-600">{results.screwsAndAnchorsEstimate.roofScrews} szt.</strong>
                  </li>
                </ul>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
                <span className="font-bold text-slate-900 text-sm block">Specyfikacja Zadaszenia Dachu:</span>
                <p className="text-slate-700">
                  <strong>Wybrane pokrycie:</strong> {params.roofCoverType.replace('_', ' ')}
                </p>
                <div className="bg-white p-3 rounded-lg border border-slate-200 text-slate-800 font-mono text-xs">
                  {results.roofCoverPanelsEstimate}
                </div>
                <p className="text-[11px] text-slate-500 leading-relaxed mt-2">
                  Dla poliwęglanu komorowego należy pamiętać o zaklejeniu komór taśmą paroprzepustową na dole i paroszczelną na górze oraz użyciu profili aluminiowych z uszczelkami.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
};
