import React, { useState } from 'react';
import {
  WoodenRoofParams,
  WoodenRoofResults,
  TerraceFoundationParams,
  TerraceFoundationResults,
} from '../types';
import { Layers, Eye, Info, ZoomIn, Maximize2, ShieldCheck } from 'lucide-react';

interface TerraceAndRoofVisualizerProps {
  roofParams: WoodenRoofParams;
  roofResults: WoodenRoofResults;
  terraceParams: TerraceFoundationParams;
  terraceResults: TerraceFoundationResults;
}

type ViewMode = 'full-cross' | 'roof-framing' | 'terrace-layers' | 'top-plan';

export const TerraceAndRoofVisualizer: React.FC<TerraceAndRoofVisualizerProps> = ({
  roofParams,
  roofResults,
  terraceParams,
  terraceResults,
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('full-cross');
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(false);

  // SVG canvas dimensions
  const svgWidth = 800;
  const svgHeight = 480;

  // Key measurements (convert cm to meters for SVG drawing)
  const wallH = roofParams.heightAtWall / 100; // e.g. 2.70m
  const frontH = roofParams.heightAtFront / 100; // e.g. 2.20m
  const depth = roofParams.depth / 100; // e.g. 3.5m
  const overhang = roofParams.frontOverhang / 100; // e.g. 0.3m

  // Excavation depths (in cm)
  const surfaceThickness = terraceParams.customSurfaceThickness;
  const beddingThickness = terraceParams.beddingThickness;
  const subBaseThickness = terraceResults.actualSubBaseThickness;
  const totalExcavationDepth = terraceResults.totalExcavationDepth;

  // Drawing geometry calculations
  const groundY = 320;
  const scaleX = 100; // 1m = 100px
  const scaleY = 70; // 1m = 70px

  const wallX = 140;
  const frontX = wallX + depth * scaleX;
  const overhangX = frontX + overhang * scaleX;

  const wallY = groundY - wallH * scaleY;
  const frontY = groundY - frontH * scaleY;

  // Excavation pixel heights
  const pxSurface = Math.min(surfaceThickness * 2, 25);
  const pxBedding = Math.min(beddingThickness * 2, 20);
  const pxSubBase = Math.min(subBaseThickness * 1.5, 60);

  const ySurface = groundY;
  const yBedding = ySurface + pxSurface;
  const ySubBase = yBedding + pxBedding;
  const ySoil = ySubBase + pxSubBase;

  // Rafter geometry
  const rafterStartX = wallX - 12;
  const rafterStartY = wallY - 10;
  const rafterEndX = overhangX;
  const rafterEndY = frontY - 10 + (frontY - wallY) * (overhang / depth);

  // Element details dictionary for interactive inspector
  const elementDetails: Record<string, { title: string; desc: string; stats: string }> = {
    rafters: {
      title: 'Krokwie Drewniane',
      desc: `Nośne belce dachowe przekroju ${roofParams.rafterDimension.width}x${roofParams.rafterDimension.height} cm, opierające się na płatwi przyściennej i przedniej.`,
      stats: `Liczba: ${roofResults.raftersCount} szt. | Rozstaw: co ${roofResults.actualRafterSpacing} cm | Długość: ${roofResults.rafterLength} m`,
    },
    posts: {
      title: 'Słupy Drewniane',
      desc: `Pionowe słupy nośne ${roofParams.postDimension.width}x${roofParams.postDimension.height} cm osadzone w stalowych kotwach regulowanych.`,
      stats: `Liczba: ${roofResults.postsCount} szt. | Rozstaw słupów: ${roofResults.postSpanDistance} m`,
    },
    braces: {
      title: 'Miecze (Zastrzały)',
      desc: `Uskośne stężenia usztywniające połączenie słupa z płatwią przednią, zapobiegające chwianiu się zadaszenia.`,
      stats: `Liczba: ${roofResults.bracesCount} szt. | Przekrój: ${roofParams.braceDimension.width}x${roofParams.braceDimension.height} cm`,
    },
    wallLedger: {
      title: 'Płatew Przyścienna (Murłata)',
      desc: `Belka mocowana do ściany budynku na kotwach chemicznych M12 w rozstawie co 60–80 cm.`,
      stats: `Przekrój: ${roofParams.wallBeamDimension.width}x${roofParams.wallBeamDimension.height} cm | Długość: ${(roofParams.width / 100).toFixed(2)} m (${roofParams.width} cm)`,
    },
    roofCover: {
      title: `Pokrycie Dachowe (${roofParams.roofCoverType.replace('_', ' ')})`,
      desc: `Lekkie szczelne pokrycie zadaszenia montowane z zachowaniem spadku min. ${roofResults.roofAngleDegrees}°.`,
      stats: `Powierzchnia dachu: ${roofResults.roofArea} m² | Spadek: ${roofResults.roofAngleDegrees}° (${roofResults.roofSlopePercent}%)`,
    },
    footings: {
      title: 'Stopy Fundamentowe',
      desc: `Betonowe stopy wylewane do głębokości strefy przemarzania (${roofResults.footingDepthCm} cm) ze stalowymi kotwami regulowanymi.`,
      stats: `Liczba: ${roofResults.foundationFootingsCount} szt. | Głębokość: ${roofResults.footingDepthCm} cm | Beton: ${roofResults.footingConcreteVolumeM3} m³`,
    },
    terraceSurface: {
      title: `Nawierzchnia Tarasowa (${terraceParams.surfaceType.replace('_', ' ')})`,
      desc: `Wykończenie górne tarasu o grubości ${surfaceThickness} cm układane na podsypce.`,
      stats: `Powierzchnia: ${terraceResults.terraceArea} m² | Ilość z zapasem: ${terraceResults.surfaceMaterialArea} m²`,
    },
    bedding: {
      title: 'Warstwa Podsypki',
      desc: `Warstwa wyrównująca z grysiku 2-5mm lub podsypki cementowo-piaskowej.`,
      stats: `Grubość: ${beddingThickness} cm | Obj: ${terraceResults.beddingVolume} m³ | Waga: ${terraceResults.beddingWeightTons} t`,
    },
    subBase: {
      title: 'Podbudowa z Tłucznia Łamanego 0-31.5 mm',
      desc: `Zagęszczony warstwowo tłuczeń zapewniający nośność i drenaż podbudowy.`,
      stats: `Grubość: ${subBaseThickness} cm | Obj. ubita: ${terraceResults.subBaseVolumeCompacted} m³ | Waga: ${terraceResults.subBaseWeightTons} t`,
    },
    geotextile: {
      title: 'Geowłóknina Filtracyjna',
      desc: `Separacyjna geowłóknina 150-200 g/m² zapobiegająca zapadaniu się tłucznia w grunt rodzimy.`,
      stats: `Powierzchnia z zakładem 15%: ${(terraceResults.terraceArea * 1.15).toFixed(1)} m²`,
    },
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-5">
      {/* HEADER CONTROLS */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <Layers className="w-4 h-4 text-blue-600" />
            Interaktywna Wizualizacja Graficzna 2D / Przekrój Budowlany
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Graficzne odwzorowanie wymiarów tarasu, warstw wykopu i konstrukcji zadaszenia drewnianego
          </p>
        </div>

        {/* VIEW MODES */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-1 rounded-xl border border-slate-200 text-xs">
          <button
            onClick={() => setViewMode('full-cross')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              viewMode === 'full-cross'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Przekrój Pełny
          </button>
          <button
            onClick={() => setViewMode('roof-framing')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              viewMode === 'roof-framing'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Zadaszenie 2D
          </button>
          <button
            onClick={() => setViewMode('terrace-layers')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              viewMode === 'terrace-layers'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Warstwy Tarasu
          </button>
          <button
            onClick={() => setViewMode('top-plan')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition cursor-pointer ${
              viewMode === 'top-plan'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Rzut z Góry
          </button>
        </div>
      </div>

      {/* TOGGLES BAR */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800">
            <input
              type="checkbox"
              checked={showDimensions}
              onChange={(e) => setShowDimensions(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Pokaż koty wymiarowe i opisy</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer hover:text-slate-800">
            <input
              type="checkbox"
              checked={showGrid}
              onChange={(e) => setShowGrid(e.target.checked)}
              className="rounded text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
            />
            <span>Siatka pomocnicza 0.5m</span>
          </label>
        </div>
        <span className="text-[11px] text-blue-600 font-medium hidden md:inline">
          💡 Kliknij element na schemacie, aby zobaczyć szczegółową specyfikację
        </span>
      </div>

      {/* MAIN GRAPHIC CANVAS / SVG VIEWPORT */}
      <div className="relative border border-slate-200 rounded-2xl bg-slate-900/5 overflow-hidden p-2">
        <svg
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
          className="w-full h-auto max-h-[500px] select-none"
        >
          <defs>
            {/* GRID PATTERN */}
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#cbd5e1" strokeWidth="0.5" strokeDasharray="2 2" />
            </pattern>

            {/* BRICK WALL PATTERN */}
            <pattern id="wallPattern" width="24" height="12" patternUnits="userSpaceOnUse">
              <rect width="24" height="12" fill="#f1f5f9" />
              <line x1="0" y1="6" x2="24" y2="6" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="12" y1="0" x2="12" y2="6" stroke="#cbd5e1" strokeWidth="1" />
              <line x1="0" y1="6" x2="0" y2="12" stroke="#cbd5e1" strokeWidth="1" />
            </pattern>

            {/* WOOD PATTERN */}
            <linearGradient id="woodTexture" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#d97706" />
              <stop offset="50%" stopColor="#b45309" />
              <stop offset="100%" stopColor="#78350f" />
            </linearGradient>

            {/* HIGHLIGHT GRADIENT */}
            <linearGradient id="highlightGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#60a5fa" />
            </linearGradient>

            {/* TILE / PAVING PATTERN */}
            <pattern id="tilePatternVisual" width="30" height="15" patternUnits="userSpaceOnUse">
              <rect width="30" height="15" fill="#e2e8f0" stroke="#cbd5e1" strokeWidth="1" />
              <rect width="28" height="13" x="1" y="1" fill="#f8fafc" rx="1" />
            </pattern>

            {/* CRUSHED STONE / GRAVEL PATTERN */}
            <pattern id="gravelPatternVisual" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="#cbd5e1" />
              <polygon points="2,2 6,4 4,8 1,6" fill="#94a3b8" />
              <polygon points="10,3 14,5 12,10 8,8" fill="#64748b" />
              <polygon points="4,11 8,14 6,16 2,13" fill="#94a3b8" />
              <polygon points="12,11 15,14 13,16 9,13" fill="#475569" />
            </pattern>

            {/* SOIL PATTERN */}
            <pattern id="soilPatternVisual" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#f1f5f9" />
              <circle cx="4" cy="4" r="1.5" fill="#cbd5e1" />
              <circle cx="14" cy="12" r="2" fill="#94a3b8" />
            </pattern>
          </defs>

          {/* BACKGROUND GRID */}
          {showGrid && <rect width={svgWidth} height={svgHeight} fill="url(#grid)" />}

          {/* VIEW MODE 1 & 2: FULL CROSS SECTION OR ROOF FRAMING */}
          {(viewMode === 'full-cross' || viewMode === 'roof-framing') && (
            <g id="full-cross-group">
              {/* GROUND / NATIVE SOIL */}
              <rect
                x="0"
                y={groundY}
                width={svgWidth}
                height={svgHeight - groundY}
                fill="url(#soilPatternVisual)"
              />

              {/* EXCAVATION & SUB-BASE LAYERS UNDER TERRACE (IF FULL CROSS) */}
              {viewMode === 'full-cross' && (
                <g id="terrace-layers-in-full">
                  {/* TŁUCZEŃ SUB-BASE */}
                  <rect
                    x={wallX}
                    y={yBedding + pxBedding}
                    width={depth * scaleX + overhang * scaleX + 20}
                    height={pxSubBase}
                    fill="url(#gravelPatternVisual)"
                    stroke="#94a3b8"
                    strokeWidth="1"
                    className="cursor-pointer transition hover:opacity-80"
                    onClick={() => setSelectedElement('subBase')}
                  />

                  {/* GEOTEXTILE MEMBRANE */}
                  <line
                    x1={wallX}
                    y1={ySoil}
                    x2={wallX + depth * scaleX + overhang * scaleX + 20}
                    y2={ySoil}
                    stroke="#db2777"
                    strokeWidth="3"
                    strokeDasharray="6 3"
                    className="cursor-pointer"
                    onClick={() => setSelectedElement('geotextile')}
                  />

                  {/* BEDDING PODSYPKA */}
                  <rect
                    x={wallX}
                    y={ySurface + pxSurface}
                    width={depth * scaleX + overhang * scaleX + 20}
                    height={pxBedding}
                    fill="#fef3c7"
                    stroke="#d97706"
                    strokeWidth="1"
                    className="cursor-pointer hover:opacity-90"
                    onClick={() => setSelectedElement('bedding')}
                  />

                  {/* SURFACE NAWIERZCHNIA */}
                  <rect
                    x={wallX}
                    y={ySurface}
                    width={depth * scaleX + overhang * scaleX + 20}
                    height={pxSurface}
                    fill="url(#tilePatternVisual)"
                    stroke="#64748b"
                    strokeWidth="1.5"
                    className="cursor-pointer hover:opacity-90"
                    onClick={() => setSelectedElement('terraceSurface')}
                  />
                </g>
              )}

              {/* HOUSE WALL */}
              <rect
                x="20"
                y="20"
                width="100"
                height={groundY - 20}
                fill="url(#wallPattern)"
                stroke="#cbd5e1"
                strokeWidth="1.5"
              />
              {/* Wall Insulation Layer */}
              <rect x="120" y="20" width="20" height={groundY - 20} fill="#fef08a" stroke="#eab308" strokeWidth="1" />

              {/* FOOTINGS IN GROUND (STOPY FUNDAMENTOWE) */}
              <g
                className="cursor-pointer group"
                onClick={() => setSelectedElement('footings')}
              >
                <rect
                  x={frontX - 16}
                  y={groundY}
                  width="32"
                  height="70"
                  fill="#e2e8f0"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                  rx="2"
                  className={selectedElement === 'footings' ? 'stroke-blue-600 stroke-2' : ''}
                />
                {/* Steel bracket / Kotwa regulowana */}
                <path d={`M ${frontX - 8} ${groundY - 8} L ${frontX + 8} ${groundY - 8} L ${frontX + 8} ${groundY} L ${frontX - 8} ${groundY} Z`} fill="#64748b" />
                <line x1={frontX} y1={groundY - 8} x2={frontX} y2={groundY + 25} stroke="#334155" strokeWidth="4" />
              </g>

              {/* POSTS (SŁUPY DREWNIANE) */}
              <rect
                x={frontX - 9}
                y={frontY}
                width="18"
                height={groundY - frontY - 8}
                fill="url(#woodTexture)"
                stroke="#451a03"
                strokeWidth="1.5"
                rx="1"
                className={`cursor-pointer transition hover:brightness-110 ${
                  selectedElement === 'posts' ? 'stroke-blue-600 stroke-2 ring-2 ring-blue-400' : ''
                }`}
                onClick={() => setSelectedElement('posts')}
              />

              {/* WALL LEDGER / MURŁATA PRZYŚCIENNA */}
              <g className="cursor-pointer" onClick={() => setSelectedElement('wallLedger')}>
                <rect
                  x={wallX - 4}
                  y={wallY - 14}
                  width="18"
                  height="26"
                  fill="#d97706"
                  stroke="#78350f"
                  strokeWidth="1.5"
                  rx="1"
                  className={selectedElement === 'wallLedger' ? 'stroke-blue-600 stroke-2' : ''}
                />
                {/* Anchor bolts into wall */}
                <line x1={wallX - 25} y1={wallY} x2={wallX + 10} y2={wallY} stroke="#dc2626" strokeWidth="2.5" strokeDasharray="3 2" />
                <circle cx={wallX - 15} cy={wallY} r="3.5" fill="#dc2626" />
              </g>

              {/* FRONT BEAM / PŁATEW PRZEDNIA */}
              <rect
                x={frontX - 12}
                y={frontY - 14}
                width="24"
                height="20"
                fill="#d97706"
                stroke="#78350f"
                strokeWidth="1.5"
                rx="1"
                className="cursor-pointer"
                onClick={() => setSelectedElement('posts')}
              />

              {/* BRACING / MIECZE */}
              <line
                x1={frontX - 9}
                y1={frontY + 45}
                x2={frontX - 50}
                y2={frontY - 5}
                stroke="url(#woodTexture)"
                strokeWidth="10"
                strokeLinecap="round"
                className="cursor-pointer hover:brightness-110"
                onClick={() => setSelectedElement('braces')}
              />

              {/* RAFTER / KROKWIE */}
              <line
                x1={rafterStartX}
                y1={rafterStartY}
                x2={rafterEndX}
                y2={rafterEndY}
                stroke="url(#woodTexture)"
                strokeWidth="14"
                strokeLinecap="round"
                className={`cursor-pointer transition hover:brightness-110 ${
                  selectedElement === 'rafters' ? 'stroke-blue-600 stroke-2' : ''
                }`}
                onClick={() => setSelectedElement('rafters')}
              />

              {/* ROOF COVERING */}
              <line
                x1={rafterStartX - 5}
                y1={rafterStartY - 10}
                x2={rafterEndX + 5}
                y2={rafterEndY - 10}
                stroke="url(#highlightGrad)"
                strokeWidth="6"
                strokeLinecap="round"
                className="cursor-pointer hover:brightness-110"
                onClick={() => setSelectedElement('roofCover')}
              />

              {/* DIMENSIONS OVERLAY */}
              {showDimensions && (
                <g id="dimensions-overlay">
                  {/* Wall Height */}
                  <line x1={wallX - 35} y1={wallY} x2={wallX - 35} y2={groundY} stroke="#2563eb" strokeWidth="1.5" />
                  <text x={wallX - 75} y={(wallY + groundY) / 2} fill="#2563eb" fontSize="11" fontWeight="bold">
                    h = {wallH.toFixed(2)} m
                  </text>

                  {/* Front Height */}
                  <line x1={frontX + 50} y1={frontY} x2={frontX + 50} y2={groundY} stroke="#2563eb" strokeWidth="1.5" />
                  <text x={frontX + 58} y={(frontY + groundY) / 2} fill="#2563eb" fontSize="11" fontWeight="bold">
                    h = {frontH.toFixed(2)} m
                  </text>

                  {/* Depth / Span */}
                  <line x1={wallX} y1={groundY + 90} x2={frontX} y2={groundY + 90} stroke="#dc2626" strokeWidth="1.5" />
                  <text x={(wallX + frontX) / 2 - 35} y={groundY + 108} fill="#dc2626" fontSize="12" fontWeight="bold">
                    Wysięg: {depth.toFixed(2)} m
                  </text>

                  {/* Overhang */}
                  <line x1={frontX} y1={groundY + 90} x2={overhangX} y2={groundY + 90} stroke="#e11d48" strokeWidth="1.5" />
                  <text x={frontX + 5} y={groundY + 108} fill="#e11d48" fontSize="10" fontWeight="bold">
                    Okap: {roofParams.frontOverhang} cm
                  </text>

                  {/* Slope Angle */}
                  <line x1={wallX + 20} y1={wallY} x2={wallX + 90} y2={wallY} stroke="#7e22ce" strokeWidth="1" strokeDasharray="3 3" />
                  <text x={wallX + 95} y={wallY + 4} fill="#7e22ce" fontSize="11" fontWeight="bold">
                    {roofResults.roofAngleDegrees}° spadek
                  </text>
                </g>
              )}
            </g>
          )}

          {/* VIEW MODE 3: TERRACE EXCAVATION LAYERS ONLY */}
          {viewMode === 'terrace-layers' && (
            <g id="terrace-layers-detail">
              {/* Title */}
              <text x="30" y="40" fill="#0f172a" fontSize="14" fontWeight="bold">
                Szczegółowy Przekrój Warstw Wykopu i Podbudowy Tarasu
              </text>

              {/* Surface Layer */}
              <rect x="100" y="80" width="450" height="40" fill="url(#tilePatternVisual)" stroke="#64748b" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedElement('terraceSurface')} />
              <text x="120" y="105" fill="#0f172a" fontSize="12" fontWeight="bold">
                1. Nawierzchnia: {terraceParams.surfaceType.replace('_', ' ')} ({surfaceThickness} cm)
              </text>

              {/* Bedding Layer */}
              <rect x="100" y="120" width="450" height="40" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedElement('bedding')} />
              <text x="120" y="145" fill="#78350f" fontSize="12" fontWeight="bold">
                2. Podsypka: grysik 2-5mm / cementowo-piaskowa ({beddingThickness} cm)
              </text>

              {/* Geotextile Membrane */}
              <line x1="100" y1="160" x2="550" y2="160" stroke="#db2777" strokeWidth="4" strokeDasharray="8 4" className="cursor-pointer" onClick={() => setSelectedElement('geotextile')} />
              <text x="120" y="157" fill="#be185d" fontSize="11" fontWeight="bold">
                --- Geowłóknina filtracyjna 150-200 g/m² ---
              </text>

              {/* Sub-base Layer */}
              <rect x="100" y="160" width="450" height="120" fill="url(#gravelPatternVisual)" stroke="#475569" strokeWidth="1.5" className="cursor-pointer" onClick={() => setSelectedElement('subBase')} />
              <text x="120" y="220" fill="#0f172a" fontSize="13" fontWeight="bold">
                3. Podbudowa z Tłucznia Łamanego 0-31.5 mm ({subBaseThickness} cm, {terraceResults.compactionLayersCount} warstwy ubijania)
              </text>

              {/* Native Soil */}
              <rect x="100" y="280" width="450" height="60" fill="url(#soilPatternVisual)" stroke="#cbd5e1" strokeWidth="1.5" />
              <text x="120" y="315" fill="#475569" fontSize="12" fontWeight="bold">
                4. Grunt rodzimy (dno wykopu wyrównane ze spadkiem 1.5-2%)
              </text>

              {/* Total Excavation Arrow */}
              <line x1="60" y1="80" x2="60" y2="280" stroke="#dc2626" strokeWidth="2.5" />
              <polygon points="60,80 55,90 65,90" fill="#dc2626" />
              <polygon points="60,280 55,270 65,270" fill="#dc2626" />
              <text x="-210" y="45" fill="#dc2626" fontSize="13" fontWeight="bold" transform="rotate(-90)">
                Łączny Wykop: {totalExcavationDepth} cm
              </text>
            </g>
          )}

          {/* VIEW MODE 4: TOP PLAN VIEW */}
          {viewMode === 'top-plan' && (
            <g id="top-plan-view">
              <text x="30" y="38" fill="#0f172a" fontSize="14" fontWeight="bold">
                Rzut z Góry — {terraceParams.terraceShape === 'narozny_L' ? 'Taras Narożny L (2 Ściany Budynku)' : 'Układ Krokwi, Słupów i Obwodu Tarasu'}
              </text>

              {terraceParams.terraceShape === 'narozny_L' ? (
                /* CORNER INNER L-SHAPE TOP PLAN */
                <g id="l-shape-top-plan">
                  {/* House Wall 1 (Top edge) */}
                  <rect x="100" y="60" width="380" height="20" fill="url(#wallPattern)" stroke="#cbd5e1" strokeWidth="1.5" />
                  <text x="210" y="74" fill="#475569" fontSize="11" fontWeight="bold">
                    ŚCIANA 1 ({terraceParams.terraceLength} m)
                  </text>

                  {/* House Wall 2 (Right edge / Inner Corner) */}
                  <rect x="480" y="60" width="20" height="200" fill="url(#wallPattern)" stroke="#cbd5e1" strokeWidth="1.5" />
                  <text x="495" y="160" fill="#475569" fontSize="11" fontWeight="bold" transform="rotate(90, 495, 160)">
                    ŚCIANA 2 ({terraceParams.sideBLength ?? 3} m)
                  </text>

                  {/* L-shaped Terrace Polygon (Inner corner) */}
                  <polygon
                    points="100,80 480,80 480,260 630,260 630,360 100,360"
                    fill="url(#tilePatternVisual)"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeDasharray="4 2"
                  />

                  <text x="220" y="210" fill="#1d4ed8" fontSize="14" fontWeight="bold">
                    TARAS WKLĘSŁY (WCIĘCIE L): {terraceResults.terraceArea} m²
                  </text>
                  <text x="220" y="230" fill="#475569" fontSize="11">
                    Ramię A: {terraceParams.terraceLength}m x {terraceParams.terraceWidth}m | Ramię B: {terraceParams.sideBLength ?? 3}m x {terraceParams.sideBWidth ?? 2.5}m
                  </text>

                  {/* Rafters over L-shape */}
                  {Array.from({ length: 9 }).map((_, idx) => {
                    const currentX = 120 + idx * 40;
                    return (
                      <line key={idx} x1={currentX} y1="80" x2={currentX} y2="360" stroke="url(#woodTexture)" strokeWidth="6" opacity="0.85" />
                    );
                  })}

                  <text x="200" y="405" fill="#dc2626" fontSize="12" fontWeight="bold">
                    💡 Do opaski wokół domu automatycznie wyłączane są 2 ściany ({terraceParams.terraceLength}m + {terraceParams.sideBLength ?? 3}m = {(terraceParams.terraceLength + (terraceParams.sideBLength ?? 3)).toFixed(1)}m)
                  </text>
                </g>
              ) : terraceParams.terraceShape === 'narozny_L_zewnetrzny' ? (
                /* CORNER OUTER L-SHAPE TOP PLAN (OPLATAJĄCY NAROŻNIK ZEWNĘTRZNY) */
                <g id="l-outer-shape-top-plan">
                  {/* House Block Corner in Top-Left */}
                  <rect x="100" y="60" width="280" height="180" fill="url(#wallPattern)" stroke="#cbd5e1" strokeWidth="2" />
                  
                  {/* House Wall 1 Label (Bottom of House Corner) */}
                  <text x="160" y="232" fill="#dc2626" fontSize="11" fontWeight="bold">
                    ŚCIANA 1 BUDYNKU ({terraceParams.terraceLength} m)
                  </text>

                  {/* House Wall 2 Label (Right of House Corner) */}
                  <text x="370" y="130" fill="#dc2626" fontSize="11" fontWeight="bold" transform="rotate(90, 370, 130)">
                    ŚCIANA 2 BUDYNKU ({terraceParams.sideBLength ?? 3} m)
                  </text>

                  {/* Outer L-Terrace Polygon wrapping around House Corner (With optional Chamfer) */}
                  {(() => {
                    const isChamfered = terraceParams.chamferCorner;
                    const chamferPx = isChamfered ? Math.min(50, Math.max(15, (terraceParams.chamferSize || 1.2) * 25)) : 0;
                    const pointsStr = isChamfered
                      ? `100,240 380,240 380,60 520,60 520,${360 - chamferPx} ${520 - chamferPx},360 100,360`
                      : '100,240 380,240 380,60 520,60 520,360 100,360';

                    return (
                      <g>
                        <polygon
                          points={pointsStr}
                          fill="url(#tilePatternVisual)"
                          stroke="#2563eb"
                          strokeWidth="2.5"
                          strokeDasharray="4 2"
                        />
                        {isChamfered && (
                          <g>
                            {/* Chamfer dimension indicator line */}
                            <line
                              x1={520}
                              y1={360 - chamferPx}
                              x2={520 - chamferPx}
                              y2={360}
                              stroke="#dc2626"
                              strokeWidth="3"
                            />
                            <text
                              x={520 - chamferPx / 2 + 5}
                              y={360 - chamferPx / 2 - 5}
                              fill="#dc2626"
                              fontSize="11"
                              fontWeight="bold"
                            >
                              Skos: {terraceParams.chamferSize || 1.2}m
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })()}

                  {/* Labels on terrace wings */}
                  <text x="130" y="295" fill="#1d4ed8" fontSize="13" fontWeight="bold">
                    TARAS OPLATAJĄCY NAROŻNIK ZEWNĘTRZNY: {terraceResults.terraceArea} m²
                  </text>
                  <text x="130" y="315" fill="#475569" fontSize="11">
                    Skrzydło 1: {terraceParams.terraceLength}m x {terraceParams.terraceWidth}m | Skrzydło 2: {terraceParams.sideBLength ?? 3}m x {terraceParams.sideBWidth ?? 2.5}m {terraceParams.chamferCorner ? `| Skos: ${terraceParams.chamferSize || 1.2}m` : ''}
                  </text>

                  {/* Rafters over Outer L-shape */}
                  {Array.from({ length: 10 }).map((_, idx) => {
                    const currentX = 110 + idx * 40;
                    const startY = currentX > 380 ? 60 : 240;
                    return (
                      <line key={idx} x1={currentX} y1={startY} x2={currentX} y2="360" stroke="url(#woodTexture)" strokeWidth="6" opacity="0.85" />
                    );
                  })}

                  <text x="140" y="405" fill="#dc2626" fontSize="12" fontWeight="bold">
                    💡 Taras przylega do narożnika wypukłego — od opaski odejmowane są obie ściany wokół narożnika ({(terraceParams.terraceLength + (terraceParams.sideBLength ?? 3)).toFixed(1)} m)
                  </text>
                </g>
              ) : (
                /* STANDARD RECTANGULAR TOP PLAN */
                <g id="standard-top-plan">
                  {/* House Wall (Top Edge) */}
                  <rect x="80" y="70" width="600" height="25" fill="url(#wallPattern)" stroke="#cbd5e1" strokeWidth="1.5" />
                  <text x="320" y="87" fill="#64748b" fontSize="11" fontWeight="bold">
                    ŚCIANA BUDYNKU (DŁUGOŚĆ {roofParams.width} m)
                  </text>

                  {/* Terrace Perimeter */}
                  <rect x="100" y="95" width="560" height="260" fill="url(#tilePatternVisual)" stroke="#2563eb" strokeWidth="2" strokeDasharray="4 2" />
                  <text x="310" y="230" fill="#1d4ed8" fontSize="13" fontWeight="bold">
                    POWIERZCHNIA TARASU: {terraceResults.terraceArea} m²
                  </text>

                  {/* Rafters Lines from Wall to Front */}
                  {Array.from({ length: Math.min(roofResults.raftersCount, 15) }).map((_, idx) => {
                    const totalRafters = Math.min(roofResults.raftersCount, 15);
                    const stepX = 560 / (totalRafters - 1 || 1);
                    const currentX = 100 + idx * stepX;

                    return (
                      <g key={idx}>
                        <line x1={currentX} y1="95" x2={currentX} y2="380" stroke="url(#woodTexture)" strokeWidth="8" />
                        <circle cx={currentX} cy="95" r="3" fill="#78350f" />
                      </g>
                    );
                  })}

                  {/* Front Beam (Płatew) */}
                  <rect x="90" y="345" width="580" height="14" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />

                  {/* Posts Locations */}
                  {Array.from({ length: roofResults.postsCount }).map((_, idx) => {
                    const totalPosts = roofResults.postsCount;
                    const stepX = 560 / (totalPosts - 1 || 1);
                    const currentX = 100 + idx * stepX;

                    return (
                      <g key={idx}>
                        <rect x={currentX - 10} y="337" width="20" height="20" fill="#78350f" stroke="#f59e0b" strokeWidth="1.5" rx="2" />
                        <text x={currentX - 14} y="375" fill="#78350f" fontSize="10" fontWeight="bold">
                          Słup #{idx + 1}
                        </text>
                      </g>
                    );
                  })}

                  {/* Dimensions Labels */}
                  <text x="340" y="420" fill="#dc2626" fontSize="12" fontWeight="bold">
                    Szerokość zadaszenia: {roofParams.width} m (Rozstaw krokwi: co {roofResults.actualRafterSpacing} cm)
                  </text>
                </g>
              )}
            </g>
          )}
        </svg>
      </div>

      {/* INSPECTOR PANEL / SELECTED ELEMENT DETAILS */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 transition-all">
        {selectedElement && elementDetails[selectedElement] ? (
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-700 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                {elementDetails[selectedElement].title}
              </span>
              <button
                onClick={() => setSelectedElement(null)}
                className="text-[11px] text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                Zamknij ✕
              </button>
            </div>
            <p className="text-xs text-slate-700 leading-relaxed">
              {elementDetails[selectedElement].desc}
            </p>
            <p className="text-xs font-bold text-slate-900 pt-1">
              {elementDetails[selectedElement].stats}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <Info className="w-4 h-4 text-blue-600 flex-shrink-0" />
            <span>
              Wskazówka: Kliknij dowolny element zadaszenia lub podbudowy na powyższym schemacie, aby zobaczyć dokładne parametry techniczne i wyliczenia.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
