import React, { useState } from 'react';
import {
  HouseBandParams,
  HouseBandResults,
  TerraceFoundationParams,
  TerraceFoundationResults,
  WoodenRoofParams,
  WoodenRoofResults,
  DrivewayParams,
  DrivewayResults,
  ParkingParams,
  ParkingResults,
  FenceParams,
  FenceResults,
  PriceList,
} from '../types';
import { ShoppingBag, Printer, Edit2, Download, RefreshCw, Car, SquareParking, Shield, FileJson } from 'lucide-react';
import { DEFAULT_PRICE_LIST } from '../data/defaults';
import { generateCostEstimatePDF } from '../utils/pdfExport';

interface SummaryShoppingListProps {
  projectName?: string;
  bandParams: HouseBandParams;
  bandResults: HouseBandResults;
  terraceParams: TerraceFoundationParams;
  terraceResults: TerraceFoundationResults;
  roofParams: WoodenRoofParams;
  roofResults: WoodenRoofResults;
  drivewayParams?: DrivewayParams;
  drivewayResults?: DrivewayResults;
  parkingParams?: ParkingParams;
  parkingResults?: ParkingResults;
  fenceParams?: FenceParams;
  fenceResults?: FenceResults;
  priceList: PriceList;
  onPriceListChange: (updated: PriceList) => void;
}

export const SummaryShoppingList: React.FC<SummaryShoppingListProps> = ({
  projectName = 'Projekt',
  bandParams,
  bandResults,
  terraceParams,
  terraceResults,
  roofParams,
  roofResults,
  drivewayParams,
  drivewayResults,
  parkingParams,
  parkingResults,
  fenceParams,
  fenceResults,
  priceList,
  onPriceListChange,
}) => {
  const [showPriceEdit, setShowPriceEdit] = useState(false);

  const handlePriceChange = (field: keyof PriceList, val: number) => {
    onPriceListChange({ ...priceList, [field]: val });
  };

  const handleResetPrices = () => {
    onPriceListChange(DEFAULT_PRICE_LIST);
  };

  // CALCULATE COSTS FOR EACH ITEM
  // 1. OPASKA WOKÓŁ DOMU
  const costEdging = bandResults.edgingPiecesCount * priceList.edgingPricePerPiece;
  let costBandSurface = 0;
  if (bandParams.surfaceType === 'plyty' && bandResults.tilesCount) {
    costBandSurface = bandResults.tilesCount * priceList.tilePricePerPiece;
  } else if (bandParams.surfaceType === 'kostka' && bandResults.pavingArea) {
    costBandSurface = bandResults.pavingArea * priceList.pavingPricePerM2;
  } else if (bandParams.surfaceType === 'zwir' && bandResults.gravelWeightTons) {
    costBandSurface = bandResults.gravelWeightTons * priceList.gravelPricePerTon;
  }
  const costBandSubBase = bandResults.subBaseWeightTons * priceList.subBasePricePerTon;
  const costBandBeddingSand = bandResults.beddingWeightTons * priceList.beddingSandPricePerTon;
  const costBandCement = bandResults.cementBags25kg * priceList.cement25kgPricePerBag;
  const costBandConcreteLean = Math.ceil(bandResults.concreteLeanForEdging * 40) * priceList.concreteBagPricePerBag;
  const costBandGeotextile = bandResults.geotextileArea * priceList.geotextilePricePerM2;

  const totalBandCost = costEdging + costBandSurface + costBandSubBase + costBandBeddingSand + costBandCement + costBandConcreteLean + costBandGeotextile;

  // 2. PODJAZD
  let totalDrivewayCost = 0;
  let costDrivewaySurface = 0;
  let costDrivewaySubbase = 0;
  let costDrivewayEdging = 0;
  let costDrivewayBedding = 0;

  if (drivewayResults && drivewayParams) {
    costDrivewaySubbase = drivewayResults.subBaseWeightTons * (priceList.subBasePricePerTon || 75);
    costDrivewayBedding = drivewayResults.beddingWeightTons * (priceList.beddingSandPricePerTon || 55) + drivewayResults.cementBags25kg * (priceList.cement25kgPricePerBag || 18);
    costDrivewayEdging = drivewayResults.edgingPiecesCount * (priceList.roadCurbsPricePerPiece || 38);
    costDrivewaySurface = drivewayResults.areaGross * (priceList.paving8cmPricePerM2 || 68);
    totalDrivewayCost = costDrivewaySubbase + costDrivewayBedding + costDrivewayEdging + costDrivewaySurface;
  }

  // 3. PARKING
  let totalParkingCost = 0;
  let costParkingSurface = 0;
  let costParkingSubbase = 0;

  if (parkingResults && parkingParams) {
    costParkingSubbase = parkingResults.subBaseWeightTons * (priceList.subBasePricePerTon || 75);
    costParkingSurface = parkingResults.totalAreaGross * (priceList.openworkPlatesPricePerM2 || 48);
    const costParkingEdging = parkingResults.edgingPiecesCount * (priceList.edgingPricePerPiece || 18);
    totalParkingCost = costParkingSubbase + costParkingSurface + costParkingEdging;
  }

  // 4. OGRODZENIE
  let totalFenceCost = 0;
  let costFencePanels = 0;
  let costFencePosts = 0;
  let costFenceConcreteBoards = 0;

  if (fenceResults && fenceParams) {
    costFencePanels = fenceResults.spansCount * (priceList.fencePanelPricePerPiece || 95);
    costFencePosts = fenceResults.postsCountTotal * (priceList.fencePostPricePerPiece || 52);
    costFenceConcreteBoards = fenceResults.concreteBoardsCount * (priceList.concreteBoardPricePerPiece || 42);
    const costFenceConcrete = fenceResults.concreteB20Bags * (priceList.concreteBagPricePerBag || 16);
    totalFenceCost = costFencePanels + costFencePosts + costFenceConcreteBoards + costFenceConcrete;
  }

  // 5. WYKOP I TŁUCZEŃ POD TARAS
  const costTerraceSubBase = terraceResults.subBaseWeightTons * priceList.subBasePricePerTon;
  const costTerraceBedding = terraceResults.beddingWeightTons * priceList.beddingSandPricePerTon;
  const costTerraceSurface = terraceResults.surfaceMaterialArea * (terraceParams.surfaceType === 'kostka_6cm' ? priceList.pavingPricePerM2 : priceList.tilePricePerPiece * 2.7);
  const costTerraceSoilRemoval = terraceResults.excavationVolumeLoose * priceList.soilRemovalPricePerM3;

  const totalTerraceCost = costTerraceSubBase + costTerraceBedding + costTerraceSurface + costTerraceSoilRemoval;

  // 6. ZADASZENIE DREWNIANE
  const costWood = roofResults.totalWoodVolumeM3 * priceList.woodPricePerM3;
  const costRoofCover = roofResults.roofArea * priceList.roofCoverPricePerM2;
  const costPostAnchors = roofResults.screwsAndAnchorsEstimate.postAnchors * priceList.postAnchorPricePerPiece;
  const costChemicalAnchors = roofResults.screwsAndAnchorsEstimate.chemicalAnchorsWall * priceList.chemicalAnchorPricePerPiece;
  const costFootingsConcrete = Math.ceil(roofResults.footingConcreteVolumeM3 * 40) * priceList.concreteBagPricePerBag;
  const costFastenersAndMisc = Math.round(roofResults.roofArea * 25); // estimate for screws & brackets

  const totalRoofCost = costWood + costRoofCover + costPostAnchors + costChemicalAnchors + costFootingsConcrete + costFastenersAndMisc;

  const grandTotalCost = totalBandCost + totalDrivewayCost + totalParkingCost + totalFenceCost + totalTerraceCost + totalRoofCost;

  const handlePrint = () => {
    window.print();
  };

  const handleGeneratePdf = () => {
    generateCostEstimatePDF({
      projectName,
      bandParams,
      bandResults,
      terraceParams,
      terraceResults,
      roofParams,
      roofResults,
      priceList,
    });
  };

  const handleExportJson = () => {
    const projectData = {
      id: `proj_${Date.now()}`,
      name: projectName || 'Projekt KALBUD',
      updatedAt: Date.now(),
      houseBand: bandParams,
      terraceFoundation: terraceParams,
      woodenRoof: roofParams,
      driveway: drivewayParams,
      parking: parkingParams,
      fence: fenceParams,
      priceList: priceList,
    };

    const jsonString = JSON.stringify(projectData, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `${(projectName || 'Projekt_KALBUD').replace(/[^a-z0-9]/gi, '_')}_projekt.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      
      {/* HEADER & ACTION BUTTONS */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <ShoppingBag className="w-4 h-4 text-blue-600" />
            Zbiorcza Lista Zakupów i Szacunkowy Kosztorys Budowlany
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Połączona zestawienie materiałów: opaska, podjazd, parking, ogrodzenie, taras i zadaszenie
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPriceEdit(!showPriceEdit)}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-semibold rounded-xl border border-slate-200 transition cursor-pointer shadow-2xs"
          >
            <Edit2 className="w-3.5 h-3.5 text-blue-600" />
            {showPriceEdit ? 'Zamknij edycję cen' : 'Dostosuj ceny (PLN)'}
          </button>

          <button
            onClick={handleExportJson}
            title="Pobierz pełną specyfikację projektu w formacie JSON"
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-2xs transition cursor-pointer"
          >
            <FileJson className="w-4 h-4" />
            Eksportuj JSON
          </button>

          <button
            onClick={handleGeneratePdf}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Download className="w-4 h-4" />
            Pobierz Plik PDF
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            Drukuj
          </button>
        </div>
      </div>

      {/* PRICE EDITING PANEL */}
      {showPriceEdit && (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm space-y-4 print:hidden animate-in fade-in duration-200">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-2">
              <Edit2 className="w-4 h-4 text-blue-600" />
              Edycja Jednostkowych Cen Rynkowych (PLN brutto)
            </h3>
            <button
              onClick={handleResetPrices}
              className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Przywróć domyślne ceny rynkowe
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 text-xs">
            <div>
              <label className="block text-slate-600 font-semibold mb-1">Obrzeże trawnikowe (PLN/szt):</label>
              <input
                type="number"
                value={!priceList.edgingPricePerPiece ? '' : priceList.edgingPricePerPiece}
                onChange={(e) => handlePriceChange('edgingPricePerPiece', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Krawężnik drogowy (PLN/szt):</label>
              <input
                type="number"
                value={!priceList.roadCurbsPricePerPiece ? '' : priceList.roadCurbsPricePerPiece}
                onChange={(e) => handlePriceChange('roadCurbsPricePerPiece', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Kostka podjazd 8cm (PLN/m²):</label>
              <input
                type="number"
                value={!priceList.paving8cmPricePerM2 ? '' : priceList.paving8cmPricePerM2}
                onChange={(e) => handlePriceChange('paving8cmPricePerM2', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Płyty ażurowe eko (PLN/m²):</label>
              <input
                type="number"
                value={!priceList.openworkPlatesPricePerM2 ? '' : priceList.openworkPlatesPricePerM2}
                onChange={(e) => handlePriceChange('openworkPlatesPricePerM2', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Panel ogrodzeniowy (PLN/szt):</label>
              <input
                type="number"
                value={!priceList.fencePanelPricePerPiece ? '' : priceList.fencePanelPricePerPiece}
                onChange={(e) => handlePriceChange('fencePanelPricePerPiece', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Słupek ogrodzenia (PLN/szt):</label>
              <input
                type="number"
                value={!priceList.fencePostPricePerPiece ? '' : priceList.fencePostPricePerPiece}
                onChange={(e) => handlePriceChange('fencePostPricePerPiece', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Deska podmurówki (PLN/szt):</label>
              <input
                type="number"
                value={!priceList.concreteBoardPricePerPiece ? '' : priceList.concreteBoardPricePerPiece}
                onChange={(e) => handlePriceChange('concreteBoardPricePerPiece', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Tłuczeń 0-31.5mm (PLN/tona):</label>
              <input
                type="number"
                value={!priceList.subBasePricePerTon ? '' : priceList.subBasePricePerTon}
                onChange={(e) => handlePriceChange('subBasePricePerTon', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Drewno C24/KVH (PLN/m³):</label>
              <input
                type="number"
                value={!priceList.woodPricePerM3 ? '' : priceList.woodPricePerM3}
                onChange={(e) => handlePriceChange('woodPricePerM3', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>

            <div>
              <label className="block text-slate-600 font-semibold mb-1">Pokrycie dachu (PLN/m²):</label>
              <input
                type="number"
                value={!priceList.roofCoverPricePerM2 ? '' : priceList.roofCoverPricePerM2}
                onChange={(e) => handlePriceChange('roofCoverPricePerM2', parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-slate-200 rounded px-2.5 py-1.5 text-slate-800"
              />
            </div>
          </div>
        </div>
      )}

      {/* TOTAL COST SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block">1. Opaska</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{Math.round(totalBandCost).toLocaleString('pl-PL')} PLN</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500 block">2. Podjazd</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{Math.round(totalDrivewayCost).toLocaleString('pl-PL')} PLN</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-500 block">3. Parking</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{Math.round(totalParkingCost).toLocaleString('pl-PL')} PLN</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-purple-500 block">4. Ogrodzenie</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{Math.round(totalFenceCost).toLocaleString('pl-PL')} PLN</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
          <span className="text-[10px] font-bold uppercase tracking-widest text-amber-500 block">5. Taras</span>
          <span className="text-xl font-bold text-slate-900 mt-1 block">{Math.round(totalTerraceCost).toLocaleString('pl-PL')} PLN</span>
        </div>

        <div className="bg-blue-600 text-white rounded-2xl p-4 shadow-sm col-span-2 md:col-span-1 lg:col-span-1">
          <span className="text-[10px] font-bold uppercase tracking-widest text-blue-200 block">SUMA MATERIAŁÓW</span>
          <span className="text-xl font-black text-white mt-1 block">{Math.round(grandTotalCost).toLocaleString('pl-PL')} PLN</span>
        </div>
      </div>

      {/* PRINTABLE BILL OF MATERIALS TABLE */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6 print:border-none print:shadow-none">
        
        {/* PRINT HEADER */}
        <div className="border-b border-slate-100 print:border-black pb-4 flex justify-between items-start">
          <div>
            <h1 className="text-lg font-bold text-slate-900 print:text-black">
              Kompleksowa Specyfikacja Materiałowa — {projectName}
            </h1>
            <p className="text-xs text-slate-500 print:text-gray-600 mt-1">
              Data wygenerowania: {new Date().toLocaleDateString('pl-PL')} | Zestawienie materiałowe KALBUD
            </p>
          </div>
          <div className="text-right text-xs text-slate-500 print:text-black">
            <span className="font-bold block text-sm text-slate-900 print:text-black">
              SUMA: {Math.round(grandTotalCost).toLocaleString('pl-PL')} PLN
            </span>
          </div>
        </div>

        {/* SECTION 1: OPASKA DOMU */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
            1. Opaska Wokół Domu ({bandResults.bandAreaNet} m²)
          </h3>

          <table className="w-full text-left text-xs border-collapse text-slate-700">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider bg-slate-50">
                <th className="py-2 px-3">Pozycja / Materiał</th>
                <th className="py-2 px-3">Ilość z zapasem</th>
                <th className="py-2 px-3 text-right">Wartość (PLN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <tr>
                <td className="py-2 px-3">Obrzeża trawnikowe ({bandParams.edgingLength}x{bandParams.edgingHeight}x{bandParams.edgingThickness} cm)</td>
                <td className="py-2 px-3 font-semibold text-slate-900">{bandResults.edgingPiecesCount} szt.</td>
                <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costEdging)} PLN</td>
              </tr>
              {bandParams.surfaceType === 'plyty' && (
                <tr>
                  <td className="py-2 px-3">Płyty betonowe / tarasowe ({bandParams.tileLength}x{bandParams.tileWidth} cm)</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{bandResults.tilesCount} szt.</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costBandSurface)} PLN</td>
                </tr>
              )}
              {bandParams.surfaceType === 'kostka' && (
                <tr>
                  <td className="py-2 px-3">Kostka brukowa / granitowa</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{bandResults.pavingArea} m²</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costBandSurface)} PLN</td>
                </tr>
              )}
              <tr>
                <td className="py-2 px-3">Tłuczeń łamany 0-31.5 mm (podbudowa)</td>
                <td className="py-2 px-3 font-semibold text-slate-900">{bandResults.subBaseWeightTons} ton</td>
                <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costBandSubBase)} PLN</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* SECTION 2: PODJAZD */}
        {drivewayResults && drivewayParams && (
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-blue-600">
              2. Podjazd do Garażu ({drivewayResults.areaNet} m²)
            </h3>
            <table className="w-full text-left text-xs border-collapse text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider bg-slate-50">
                  <th className="py-2 px-3">Pozycja / Materiał</th>
                  <th className="py-2 px-3">Ilość z zapasem</th>
                  <th className="py-2 px-3 text-right">Wartość (PLN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3">Kostka brukowa / nawierzchnia podjazdu ({drivewayParams.surfaceType})</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{drivewayResults.areaGross} m²</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costDrivewaySurface)} PLN</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Tłuczeń podbudowy (gr. {drivewayParams.subBaseThickness} cm)</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{drivewayResults.subBaseWeightTons} ton ({drivewayResults.subBaseVolumeLoose} m³)</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costDrivewaySubbase)} PLN</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Krawężniki drogowe ({drivewayResults.edgingLength} m)</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{drivewayResults.edgingPiecesCount} szt.</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costDrivewayEdging)} PLN</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* SECTION 3: PARKING */}
        {parkingResults && parkingParams && (
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-600">
              3. Miejsca Parkingowe ({parkingParams.spacesCount} szt. - {parkingResults.totalAreaNet} m²)
            </h3>
            <table className="w-full text-left text-xs border-collapse text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider bg-slate-50">
                  <th className="py-2 px-3">Pozycja / Materiał</th>
                  <th className="py-2 px-3">Ilość z zapasem</th>
                  <th className="py-2 px-3 text-right">Wartość (PLN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3">Płyty ażurowe / Geokrata ({parkingParams.surfaceType})</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{parkingResults.totalAreaGross} m²</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costParkingSurface)} PLN</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Tłuczeń podbudowy parkingowej (gr. {parkingParams.subBaseThickness} cm)</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{parkingResults.subBaseWeightTons} ton</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costParkingSubbase)} PLN</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* SECTION 4: OGRODZENIE */}
        {fenceResults && fenceParams && (
          <div className="space-y-2 pt-3 border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-purple-600">
              4. Ogrodzenie Posesji ({fenceResults.netFenceLength} m)
            </h3>
            <table className="w-full text-left text-xs border-collapse text-slate-700">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500 uppercase text-[10px] font-bold tracking-wider bg-slate-50">
                  <th className="py-2 px-3">Pozycja / Materiał</th>
                  <th className="py-2 px-3">Ilość</th>
                  <th className="py-2 px-3 text-right">Wartość (PLN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr>
                  <td className="py-2 px-3">Panele ogrodzeniowe ({fenceParams.fenceType}, wys. {fenceParams.fenceHeight}cm)</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{fenceResults.spansCount} szt.</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costFencePanels)} PLN</td>
                </tr>
                <tr>
                  <td className="py-2 px-3">Słupki ogrodzeniowe (60x40 mm)</td>
                  <td className="py-2 px-3 font-semibold text-slate-900">{fenceResults.postsCountTotal} szt.</td>
                  <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costFencePosts)} PLN</td>
                </tr>
                {fenceParams.useConcreteBoard && (
                  <tr>
                    <td className="py-2 px-3">Deski podmurówki prefabrykowanej (2.5m x {fenceParams.concreteBoardHeight}cm)</td>
                    <td className="py-2 px-3 font-semibold text-slate-900">{fenceResults.concreteBoardsCount} szt.</td>
                    <td className="py-2 px-3 text-right font-bold text-slate-900">{Math.round(costFenceConcreteBoards)} PLN</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* GRAND TOTAL PRINT FOOTER */}
        <div className="pt-4 border-t border-slate-200 flex justify-between items-center bg-slate-50 p-4 rounded-xl">
          <span className="text-sm font-bold text-slate-900">
            ŁĄCZNA SUMA SZACOWANA MATERIAŁOWA:
          </span>
          <span className="text-xl font-bold text-blue-600">
            {Math.round(grandTotalCost).toLocaleString('pl-PL')} PLN
          </span>
        </div>

      </div>

    </div>
  );
};

