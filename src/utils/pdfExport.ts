import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import {
  HouseBandParams,
  HouseBandResults,
  TerraceFoundationParams,
  TerraceFoundationResults,
  WoodenRoofParams,
  WoodenRoofResults,
  PriceList,
  SavedProject,
} from '../types';

// Helper to sanitize/replace Polish characters for standard PDF fonts if needed,
// or keep standard UTF-8 string formatting
function cleanText(str: string): string {
  if (!str) return '';
  return str
    .replace(/ą/g, 'a').replace(/Ą/g, 'A')
    .replace(/ć/g, 'c').replace(/Ć/g, 'C')
    .replace(/ę/g, 'e').replace(/Ę/g, 'E')
    .replace(/ł/g, 'l').replace(/Ł/g, 'L')
    .replace(/ń/g, 'n').replace(/Ń/g, 'N')
    .replace(/ó/g, 'o').replace(/Ó/g, 'O')
    .replace(/ś/g, 's').replace(/Ś/g, 'S')
    .replace(/ź/g, 'z').replace(/Ź/g, 'Z')
    .replace(/ż/g, 'z').replace(/Ż/g, 'Z');
}

export function generateCostEstimatePDF(data: {
  projectName?: string;
  bandParams: HouseBandParams;
  bandResults: HouseBandResults;
  terraceParams: TerraceFoundationParams;
  terraceResults: TerraceFoundationResults;
  roofParams: WoodenRoofParams;
  roofResults: WoodenRoofResults;
  priceList: PriceList;
}): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const projectName = data.projectName || 'Projekt Budowlany';
  const currentDate = new Date().toLocaleDateString('pl-PL');

  // COSTS CALCULATION
  // 1. Opaska
  const costEdging = data.bandResults.edgingPiecesCount * data.priceList.edgingPricePerPiece;
  let costBandSurface = 0;
  if (data.bandParams.surfaceType === 'plyty' && data.bandResults.tilesCount) {
    costBandSurface = data.bandResults.tilesCount * data.priceList.tilePricePerPiece;
  } else if (data.bandParams.surfaceType === 'kostka' && data.bandResults.pavingArea) {
    costBandSurface = data.bandResults.pavingArea * data.priceList.pavingPricePerM2;
  } else if (data.bandParams.surfaceType === 'zwir' && data.bandResults.gravelWeightTons) {
    costBandSurface = data.bandResults.gravelWeightTons * data.priceList.gravelPricePerTon;
  }
  const costBandSubBase = data.bandResults.subBaseWeightTons * data.priceList.subBasePricePerTon;
  const costBandBeddingSand = data.bandResults.beddingWeightTons * data.priceList.beddingSandPricePerTon;
  const costBandCement = data.bandResults.cementBags25kg * data.priceList.cement25kgPricePerBag;
  const costBandConcreteLean = Math.ceil(data.bandResults.concreteLeanForEdging * 40) * data.priceList.concreteBagPricePerBag;
  const costBandGeotextile = data.bandResults.geotextileArea * data.priceList.geotextilePricePerM2;
  const totalBandCost = costEdging + costBandSurface + costBandSubBase + costBandBeddingSand + costBandCement + costBandConcreteLean + costBandGeotextile;

  // 2. Terrace
  const costTerraceSubBase = data.terraceResults.subBaseWeightTons * data.priceList.subBasePricePerTon;
  const costTerraceBedding = data.terraceResults.beddingWeightTons * data.priceList.beddingSandPricePerTon;
  const costTerraceSurface = data.terraceResults.surfaceMaterialArea * (data.terraceParams.surfaceType === 'kostka_6cm' ? data.priceList.pavingPricePerM2 : data.priceList.tilePricePerPiece * 2.7);
  const costTerraceSoilRemoval = data.terraceResults.excavationVolumeLoose * data.priceList.soilRemovalPricePerM3;
  const totalTerraceCost = costTerraceSubBase + costTerraceBedding + costTerraceSurface + costTerraceSoilRemoval;

  // 3. Roof
  const costWood = data.roofResults.totalWoodVolumeM3 * data.priceList.woodPricePerM3;
  const costRoofCover = data.roofResults.roofArea * data.priceList.roofCoverPricePerM2;
  const costPostAnchors = data.roofResults.screwsAndAnchorsEstimate.postAnchors * data.priceList.postAnchorPricePerPiece;
  const costChemicalAnchors = data.roofResults.screwsAndAnchorsEstimate.chemicalAnchorsWall * data.priceList.chemicalAnchorPricePerPiece;
  const costFootingsConcrete = Math.ceil(data.roofResults.footingConcreteVolumeM3 * 40) * data.priceList.concreteBagPricePerBag;
  const costFastenersAndMisc = Math.round(data.roofResults.roofArea * 25);
  const totalRoofCost = costWood + costRoofCover + costPostAnchors + costChemicalAnchors + costFootingsConcrete + costFastenersAndMisc;

  const grandTotal = totalBandCost + totalTerraceCost + totalRoofCost;

  // HEADER BANNER
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 32, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText('KALBUD - KOSZTORYS I LISTA ZAKUPÓW'), 14, 15);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(cleanText(`Projekt: ${projectName}  |  Data wygenerowania: ${currentDate}`), 14, 23);

  // SUMMARY BOX
  doc.setFillColor(239, 246, 255); // blue-50
  doc.setDrawColor(191, 219, 254); // blue-200
  doc.roundedRect(14, 37, 182, 22, 2, 2, 'FD');

  doc.setTextColor(30, 58, 138); // blue-900
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.text(cleanText('ŁĄCZNY SZACOWANY KOSZT MATERIAŁÓW:'), 18, 45);

  doc.setFontSize(14);
  doc.setTextColor(29, 78, 216); // blue-700
  doc.text(`${Math.round(grandTotal).toLocaleString('pl-PL')} PLN`, 18, 53);

  doc.setFontSize(8);
  doc.setTextColor(71, 85, 105);
  doc.text(cleanText(`Opaska: ${Math.round(totalBandCost).toLocaleString('pl-PL')} PLN  |  Podbudowa: ${Math.round(totalTerraceCost).toLocaleString('pl-PL')} PLN  |  Zadaszenie: ${Math.round(totalRoofCost).toLocaleString('pl-PL')} PLN`), 100, 53);

  let startY = 66;

  // TABLE 1: OPASKA DOMU
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText(`1. Opaska Wokół Domu (Powierzchnia: ${data.bandResults.bandAreaNet} m²)`), 14, startY);

  autoTable(doc, {
    startY: startY + 3,
    head: [['Pozycja / Material', 'Ilosc z zapasem', 'Cena jednos.', 'Wartosc (PLN)']].map(row => row.map(cleanText)),
    body: [
      [
        `Obrzeża trawnikowe (${data.bandParams.edgingLength}x${data.bandParams.edgingHeight}x${data.bandParams.edgingThickness} cm)`,
        `${data.bandResults.edgingPiecesCount} szt.`,
        `${data.priceList.edgingPricePerPiece} PLN/szt`,
        `${Math.round(costEdging)} PLN`,
      ],
      [
        data.bandParams.surfaceType === 'plyty'
          ? `Płyty betonowe (${data.bandParams.tileLength}x${data.bandParams.tileWidth} cm)`
          : data.bandParams.surfaceType === 'kostka'
          ? 'Kostka brukowa / granitowa'
          : 'Żwir ozdobny / Grys płukany',
        data.bandParams.surfaceType === 'plyty'
          ? `${data.bandResults.tilesCount} szt.`
          : data.bandParams.surfaceType === 'kostka'
          ? `${data.bandResults.pavingArea} m²`
          : `${data.bandResults.gravelWeightTons} ton`,
        data.bandParams.surfaceType === 'plyty'
          ? `${data.priceList.tilePricePerPiece} PLN/szt`
          : data.bandParams.surfaceType === 'kostka'
          ? `${data.priceList.pavingPricePerM2} PLN/m²`
          : `${data.priceList.gravelPricePerTon} PLN/t`,
        `${Math.round(costBandSurface)} PLN`,
      ],
      [
        `Tłuczeń łamany 0-31.5 mm (gr. ${data.bandParams.subBaseThickness}cm)`,
        `${data.bandResults.subBaseWeightTons} ton`,
        `${data.priceList.subBasePricePerTon} PLN/t`,
        `${Math.round(costBandSubBase)} PLN`,
      ],
      [
        'Podsypka piaskowo-cementowa',
        `${data.bandResults.beddingWeightTons}t piasku + ${data.bandResults.cementBags25kg} worków cementu`,
        '—',
        `${Math.round(costBandBeddingSand + costBandCement)} PLN`,
      ],
      [
        'Beton B15 na ławę pod obrzeża',
        `${data.bandResults.concreteLeanForEdging} m³ (${Math.ceil(data.bandResults.concreteLeanForEdging * 40)} worków)`,
        `${data.priceList.concreteBagPricePerBag} PLN/worek`,
        `${Math.round(costBandConcreteLean)} PLN`,
      ],
      [
        'Geowłóknina drenażowa',
        `${data.bandResults.geotextileArea} m²`,
        `${data.priceList.geotextilePricePerM2} PLN/m²`,
        `${Math.round(costBandGeotextile)} PLN`,
      ],
    ].map(row => row.map(cleanText)),
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 45 },
      2: { cellWidth: 30 },
      3: { cellWidth: 27, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  // @ts-ignore
  let finalY = doc.lastAutoTable.finalY + 8;

  // TABLE 2: WYKOP I TŁUCZEŃ POD TARAS
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText(`2. Wykop i Podbudowa pod Taras (${data.terraceResults.terraceArea} m², Wykop h=${data.terraceResults.totalExcavationDepth}cm)`), 14, finalY);

  autoTable(doc, {
    startY: finalY + 3,
    head: [['Pozycja / Material', 'Ilosc z zapasem', 'Cena jednos.', 'Wartosc (PLN)']].map(row => row.map(cleanText)),
    body: [
      [
        `Tłuczeń 0-31.5 mm na podbudowę (gr. ${data.terraceResults.actualSubBaseThickness}cm)`,
        `${data.terraceResults.subBaseWeightTons} ton (${data.terraceResults.subBaseVolumeLoose} m³ sypkiego)`,
        `${data.priceList.subBasePricePerTon} PLN/t`,
        `${Math.round(costTerraceSubBase)} PLN`,
      ],
      [
        `Podsypka grysikowa 2-5 mm (gr. ${data.terraceParams.beddingThickness}cm)`,
        `${data.terraceResults.beddingWeightTons} ton`,
        `${data.priceList.beddingSandPricePerTon} PLN/t`,
        `${Math.round(costTerraceBedding)} PLN`,
      ],
      [
        `Nawierzchnia tarasu (${data.terraceParams.surfaceType})`,
        `${data.terraceResults.surfaceMaterialArea} m² (ok. ${data.terraceResults.tilesEstimateCount} szt płyt)`,
        '—',
        `${Math.round(costTerraceSurface)} PLN`,
      ],
      [
        'Wywóz ziemi z wykopu (ze spęcznieniem)',
        `${data.terraceResults.excavationVolumeLoose} m³`,
        `${data.priceList.soilRemovalPricePerM3} PLN/m³`,
        `${Math.round(costTerraceSoilRemoval)} PLN`,
      ],
    ].map(row => row.map(cleanText)),
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 45 },
      2: { cellWidth: 30 },
      3: { cellWidth: 27, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  // @ts-ignore
  finalY = doc.lastAutoTable.finalY + 8;

  // Check if we need a page break for section 3
  if (finalY > 230) {
    doc.addPage();
    finalY = 20;
  }

  // TABLE 3: ZADASZENIE DREWNIANE
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(cleanText(`3. Zadaszenie Drewniane (${data.roofParams.width}m x ${data.roofParams.depth}m, Pow: ${data.roofResults.roofArea} m²)`), 14, finalY);

  autoTable(doc, {
    startY: finalY + 3,
    head: [['Element / Material', 'Specyfikacja / Ilosc', 'Cena jednos.', 'Wartosc (PLN)']].map(row => row.map(cleanText)),
    body: [
      [
        `Drewno konstrukcyjne (${data.roofParams.woodGrade})`,
        `${data.roofResults.totalWoodVolumeM3} m³ (słupy, krokwie, płatwie, miecze)`,
        `${data.priceList.woodPricePerM3} PLN/m³`,
        `${Math.round(costWood)} PLN`,
      ],
      [
        `Pokrycie dachu (${data.roofParams.roofCoverType.replace('_', ' ')})`,
        `${data.roofResults.roofArea} m² (${data.roofResults.roofCoverPanelsEstimate})`,
        `${data.priceList.roofCoverPricePerM2} PLN/m²`,
        `${Math.round(costRoofCover)} PLN`,
      ],
      [
        'Kotwy pod słupy + beton na stopy',
        `${data.roofResults.screwsAndAnchorsEstimate.postAnchors} szt kotew + ${Math.ceil(data.roofResults.footingConcreteVolumeM3 * 40)} worków betonu`,
        '—',
        `${Math.round(costPostAnchors + costFootingsConcrete)} PLN`,
      ],
      [
        'Kotwy chemiczne + wkręty ciesielskie',
        `${data.roofResults.screwsAndAnchorsEstimate.chemicalAnchorsWall} kotew M12 + łączniki i wkręty`,
        '—',
        `${Math.round(costChemicalAnchors + costFastenersAndMisc)} PLN`,
      ],
    ].map(row => row.map(cleanText)),
    theme: 'striped',
    headStyles: { fillColor: [30, 41, 59], textColor: [255, 255, 255], fontSize: 8, fontStyle: 'bold' },
    bodyStyles: { fontSize: 8, textColor: [30, 41, 59] },
    columnStyles: {
      0: { cellWidth: 80 },
      1: { cellWidth: 45 },
      2: { cellWidth: 30 },
      3: { cellWidth: 27, halign: 'right' },
    },
    margin: { left: 14, right: 14 },
  });

  // FOOTER NOTE
  // @ts-ignore
  finalY = doc.lastAutoTable.finalY + 10;
  if (finalY > 270) {
    doc.addPage();
    finalY = 20;
  }

  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(226, 232, 240);
  doc.roundedRect(14, finalY, 182, 14, 2, 2, 'FD');

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(cleanText('Kalbud - Kalkulator Budowlany. Wyliczenia maja charakter szacunkowy i pomagaja w doborze zakupu materialow.'), 18, finalY + 6);
  doc.text(cleanText('Przed zamowieniem zalecana weryfikacja wymiarowa na placu budowy.'), 18, finalY + 10);

  // Save the PDF
  const safeFilename = `${projectName.toLowerCase().replace(/[^a-z0-9]/g, '_')}_kosztorys.pdf`;
  doc.save(safeFilename);
}
