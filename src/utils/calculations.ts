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
} from '../types';

/**
 * Calculations for House Perimeter Band (Opaska Wokół Domu)
 */
export function calculateHouseBand(params: HouseBandParams): HouseBandResults {
  const {
    housePerimeter,
    bandWidth,
    terraceExclusionWidth,
    edgingLength,
    surfaceType,
    tileLength,
    tileWidth,
    gravelLayerThickness,
    beddingThickness,
    subBaseThickness,
    wasteBufferPercent,
  } = params;

  // Convert inputs in cm to meters
  const housePerimeterM = (housePerimeter || 0) / 100;
  const bandWidthM = (bandWidth || 0) / 100;
  const edgingLengthM = (edgingLength || 0) / 100;
  const wasteMultiplier = 1 + (wasteBufferPercent || 0) / 100;

  // Calculate sum of all perimeter exclusions (taras, schody, wjazd do garażu, itp.)
  const exclusionsList = params.exclusions && params.exclusions.length > 0
    ? params.exclusions
    : [{ id: 'default', name: 'Wyłączenie opaski', length: terraceExclusionWidth || 0 }];

  // Exclusion lengths are in cm -> convert sum to meters
  const totalExclusionLengthCm = exclusionsList.reduce((sum, item) => sum + (Number(item.length) || 0), 0);
  const totalExclusionLengthM = totalExclusionLengthCm / 100;
  const activeExclusionsCount = exclusionsList.filter((item) => Number(item.length) > 0).length;

  // Effective net perimeter for band along house walls in meters
  const netPerimeterM = Math.max(0, housePerimeterM - totalExclusionLengthM);

  // Band Net Area (adding 4 external corners geometry: 4 * W^2)
  const cornerArea = 4 * Math.pow(bandWidthM, 2);
  const bandAreaNet = Math.max(0, netPerimeterM * bandWidthM + cornerArea);

  // Outer edging length around the band
  // Adding 8 * W for external corners + 2 * W for each exclusion side cap
  const outerEdgingLength = Math.max(0, netPerimeterM + 8 * bandWidthM + activeExclusionsCount * 2 * bandWidthM);
  const edgingPiecesCount = edgingLengthM > 0 ? Math.ceil((outerEdgingLength / edgingLengthM) * wasteMultiplier) : 0;

  // Surface layer thickness depending on material type
  let surfaceThicknessCm = 4; // default
  if (surfaceType === 'plyty') {
    surfaceThicknessCm = params.tileThickness;
  } else if (surfaceType === 'kostka') {
    surfaceThicknessCm = 6;
  } else if (surfaceType === 'zwir') {
    surfaceThicknessCm = gravelLayerThickness;
  }

  // Total excavation depth
  const totalExcavationDepth = surfaceThicknessCm + beddingThickness + subBaseThickness;
  const excavationVolume = bandAreaNet * (totalExcavationDepth / 100);
  const excavationVolumeLoose = excavationVolume * 1.25; // 25% swell factor

  // Surface material quantities
  let tilesCount: number | undefined;
  let pavingArea: number | undefined;
  let gravelVolume: number | undefined;
  let gravelWeightTons: number | undefined;

  if (surfaceType === 'plyty') {
    const tileAreaM2 = (tileLength / 100) * (tileWidth / 100);
    if (tileAreaM2 > 0) {
      tilesCount = Math.ceil((bandAreaNet / tileAreaM2) * wasteMultiplier);
    }
  } else if (surfaceType === 'kostka') {
    pavingArea = Math.round(bandAreaNet * wasteMultiplier * 100) / 100;
  } else if (surfaceType === 'zwir') {
    gravelVolume = Math.round(bandAreaNet * (gravelLayerThickness / 100) * 100) / 100;
    gravelWeightTons = Math.round(gravelVolume * 1.6 * 100) / 100; // ~1.6 t/m3
  }

  // Sub-base (tłuczeń) & Bedding
  const subBaseVolume = bandAreaNet * (subBaseThickness / 100);
  const subBaseWeightTons = Math.round(subBaseVolume * 1.85 * 100) / 100;

  const beddingVolume = bandAreaNet * (beddingThickness / 100);
  const beddingWeightTons = Math.round(beddingVolume * 1.6 * 100) / 100;
  // ~300kg cement per m3 sand-cement bedding (1:4 ratio) -> 12 bags of 25kg
  const cementBags25kg = Math.ceil((beddingVolume * 300) / 25);

  // Concrete for edging lean/backing (opór betonu)
  // ~0.035 m3 concrete per linear meter of edging
  const concreteLeanForEdging = Math.round(outerEdgingLength * 0.035 * 100) / 100;

  // Geotextile area (+15% overlap)
  const geotextileArea = Math.round(bandAreaNet * 1.15 * 10) / 10;

  return {
    bandAreaNet: Math.round(bandAreaNet * 100) / 100,
    outerEdgingLength: Math.round(outerEdgingLength * 100) / 100,
    edgingPiecesCount,
    totalExcavationDepth: Math.round(totalExcavationDepth * 10) / 10,
    excavationVolume: Math.round(excavationVolume * 100) / 100,
    excavationVolumeLoose: Math.round(excavationVolumeLoose * 100) / 100,
    tilesCount,
    pavingArea,
    gravelVolume,
    gravelWeightTons,
    subBaseVolume: Math.round(subBaseVolume * 100) / 100,
    subBaseWeightTons,
    beddingVolume: Math.round(beddingVolume * 100) / 100,
    beddingWeightTons,
    cementBags25kg,
    concreteLeanForEdging,
    geotextileArea,
  };
}

/**
 * Calculations for Terrace Foundation & Excavation (Wykop i Tłuczeń Pod Taras)
 */
export function calculateTerraceFoundation(params: TerraceFoundationParams): TerraceFoundationResults {
  const {
    terraceShape = 'prostokat',
    terraceLength,
    terraceWidth,
    sideBLength = 0,
    sideBWidth = 0,
    chamferCorner = false,
    chamferSize = 0,
    soilType,
    surfaceType,
    customSurfaceThickness,
    beddingThickness,
    subBaseThickness,
    useCustomSubBase,
    wasteBufferPercent,
    compactedDensityTonsM3,
  } = params;

  // Convert inputs from cm to meters for area and volume calculations
  const terraceLengthM = (terraceLength || 0) / 100;
  const terraceWidthM = (terraceWidth || 0) / 100;
  const sideBLengthM = (sideBLength || 0) / 100;
  const sideBWidthM = (sideBWidth || 0) / 100;
  const chamferSizeM = (chamferSize || 0) / 100;

  // Calculate area according to terrace shape (in m2)
  let terraceArea = terraceLengthM * terraceWidthM;
  if (terraceShape === 'narozny_L') {
    // L-shape internal: sum of main section and side leg
    terraceArea = (terraceLengthM * terraceWidthM) + (sideBLengthM * sideBWidthM);
  } else if (terraceShape === 'narozny_L_zewnetrzny') {
    // L-shape external: Arm A + Arm B + Corner Junction
    const cornerArea = terraceWidthM * sideBWidthM;
    terraceArea = (terraceLengthM * terraceWidthM) + (sideBLengthM * sideBWidthM) + cornerArea;
  } else if (terraceShape === 'trapez') {
    // Trapezoid: average width * depth
    const base2M = sideBLengthM > 0 ? sideBLengthM : terraceLengthM * 0.7;
    terraceArea = ((terraceLengthM + base2M) / 2) * terraceWidthM;
  }

  // Deduct chamfered corner triangle area if chamfer is enabled
  if (chamferCorner && chamferSizeM > 0) {
    const maxChamferM = Math.min(terraceWidthM, sideBWidthM > 0 ? sideBWidthM : terraceWidthM);
    const actualChamferM = Math.min(chamferSizeM, maxChamferM);
    const chamferTriangleArea = 0.5 * actualChamferM * actualChamferM;
    terraceArea = Math.max(0, terraceArea - chamferTriangleArea);
  }

  // Recommended sub-base thickness based on civil standards in Poland
  let recommendedSubBaseThickness = 25;
  if (soilType === 'piaskowy') {
    recommendedSubBaseThickness = 20;
  } else if (soilType === 'sredni') {
    recommendedSubBaseThickness = 30;
  } else if (soilType === 'gliniasty') {
    recommendedSubBaseThickness = 40;
  }

  const actualSubBaseThickness = useCustomSubBase ? subBaseThickness : recommendedSubBaseThickness;

  // Surface thickness determination
  let surfaceThicknessCm = customSurfaceThickness;
  if (surfaceType === 'plyty_betonowe') {
    surfaceThicknessCm = 4;
  } else if (surfaceType === 'gres_2cm') {
    surfaceThicknessCm = 2;
  } else if (surfaceType === 'kostka_6cm') {
    surfaceThicknessCm = 6;
  } else if (surfaceType === 'deska_kompozyt') {
    surfaceThicknessCm = 8.5; // deska + legar + podkładki
  }

  // Total excavation depth
  const totalExcavationDepth = surfaceThicknessCm + beddingThickness + actualSubBaseThickness;

  // Excavation volume
  const excavationVolume = terraceArea * (totalExcavationDepth / 100);
  const excavationVolumeLoose = excavationVolume * 1.25; // 25% loose soil swell
  const excavationWeightTons = excavationVolumeLoose * 1.5; // ~1.5 t/m3 loose soil

  // Sub-base (tłuczeń 0-31.5 mm)
  const subBaseVolumeCompacted = terraceArea * (actualSubBaseThickness / 100);
  const subBaseVolumeLoose = subBaseVolumeCompacted * 1.20; // 20% compaction shrinkage
  const subBaseWeightTons = subBaseVolumeCompacted * compactedDensityTonsM3;

  // Compaction layers (each max 12-15 cm)
  const compactionLayersCount = Math.max(1, Math.ceil(actualSubBaseThickness / 12));

  let compactorWeightRecommendation = "Zagęszczarka płytowa 90-110 kg";
  if (actualSubBaseThickness > 30) {
    compactorWeightRecommendation = "Zagęszczarka rewertowalna 180-250 kg (lub więcej)";
  } else if (actualSubBaseThickness > 20) {
    compactorWeightRecommendation = "Zagęszczarka płytowa 120-160 kg";
  }

  // Bedding
  const beddingVolume = terraceArea * (beddingThickness / 100);
  const beddingWeightTons = beddingVolume * 1.6;

  // Surface area with waste multiplier
  const wasteMultiplier = 1 + wasteBufferPercent / 100;
  const surfaceMaterialArea = terraceArea * wasteMultiplier;
  const tilesEstimateCount = Math.ceil(surfaceMaterialArea / 0.36); // e.g. 60x60 tiles

  return {
    terraceArea: Math.round(terraceArea * 100) / 100,
    recommendedSubBaseThickness,
    actualSubBaseThickness,
    totalExcavationDepth: Math.round(totalExcavationDepth * 10) / 10,
    excavationVolume: Math.round(excavationVolume * 100) / 100,
    excavationVolumeLoose: Math.round(excavationVolumeLoose * 100) / 100,
    excavationWeightTons: Math.round(excavationWeightTons * 100) / 100,
    subBaseVolumeCompacted: Math.round(subBaseVolumeCompacted * 100) / 100,
    subBaseVolumeLoose: Math.round(subBaseVolumeLoose * 100) / 100,
    subBaseWeightTons: Math.round(subBaseWeightTons * 100) / 100,
    compactionLayersCount,
    compactorWeightRecommendation,
    beddingVolume: Math.round(beddingVolume * 100) / 100,
    beddingWeightTons: Math.round(beddingWeightTons * 100) / 100,
    surfaceMaterialArea: Math.round(surfaceMaterialArea * 100) / 100,
    tilesEstimateCount,
  };
}

/**
 * Calculations for Wooden Roof Structure (Zadaszenie Tarasu z Drewna)
 */
export function calculateWoodenRoof(params: WoodenRoofParams): WoodenRoofResults {
  const {
    width,
    depth,
    heightAtWall,
    heightAtFront,
    frontOverhang,
    roofCoverType,
    postDimension,
    frontBeamDimension,
    wallBeamDimension,
    rafterDimension,
    braceDimension,
    targetRafterSpacing,
  } = params;

  // Convert inputs in cm to meters for structural calculations
  const widthM = (width || 0) / 100;
  const depthM = (depth || 0) / 100;
  const heightAtWallM = (heightAtWall || 0) / 100;
  const heightAtFrontM = (heightAtFront || 0) / 100;

  // Slope calculations
  const heightDiffM = Math.max(0.001, heightAtWallM - heightAtFrontM);
  const roofAngleRad = depthM > 0 ? Math.atan2(heightDiffM, depthM) : 0;
  const roofAngleDegrees = Math.round((roofAngleRad * (180 / Math.PI)) * 10) / 10;
  const roofSlopePercent = depthM > 0 ? Math.round(((heightDiffM / depthM) * 100) * 10) / 10 : 0;

  // Rafter length (hypotenuse + front overhang)
  const rafterLengthBaseM = Math.sqrt(Math.pow(depthM, 2) + Math.pow(heightDiffM, 2));
  const rafterLengthM = rafterLengthBaseM + (frontOverhang || 0) / 100;
  const roofArea = widthM * rafterLengthM;

  // Posts calculation (max recommended span 2.5m - 3.0m between posts)
  const postsCount = widthM > 0 ? Math.max(2, Math.ceil(widthM / 2.5) + 1) : 0;
  const postSpanDistance = postsCount > 1 ? Math.round((widthM / (postsCount - 1)) * 100) / 100 : 0;

  // Rafters calculation
  const rafterSpacingM = (targetRafterSpacing || 70) / 100;
  const raftersCount = rafterSpacingM > 0 && widthM > 0 ? Math.max(2, Math.ceil(widthM / rafterSpacingM) + 1) : 0;
  const actualRafterSpacingCm = raftersCount > 1 ? Math.round((widthM / (raftersCount - 1)) * 100 * 10) / 10 : 0;

  // Braces (miecze) count (2 per post)
  const bracesCount = postsCount * 2;
  const braceLengthM = 0.75; // average length of a 45 degree brace

  // Volume calculations for Bill of Materials
  const postVolSingle = ((postDimension.width || 0) / 100) * ((postDimension.height || 0) / 100) * heightAtFrontM;
  const postVolTotal = postVolSingle * postsCount;

  const frontBeamVolTotal = ((frontBeamDimension.width || 0) / 100) * ((frontBeamDimension.height || 0) / 100) * widthM;
  const wallBeamVolTotal = ((wallBeamDimension.width || 0) / 100) * ((wallBeamDimension.height || 0) / 100) * widthM;

  const rafterVolSingle = ((rafterDimension.width || 0) / 100) * ((rafterDimension.height || 0) / 100) * rafterLengthM;
  const rafterVolTotal = rafterVolSingle * raftersCount;

  const braceVolSingle = ((braceDimension.width || 0) / 100) * ((braceDimension.height || 0) / 100) * braceLengthM;
  const braceVolTotal = braceVolSingle * bracesCount;

  const totalWoodVolumeM3 = Math.round((postVolTotal + frontBeamVolTotal + wallBeamVolTotal + rafterVolTotal + braceVolTotal) * 1000) / 1000;

  // Detailed Bill of Materials
  const woodBillOfMaterials = [
    {
      name: 'Słupy nośne (pionowe)',
      count: postsCount,
      dimensionsCm: `${postDimension.width} x ${postDimension.height}`,
      lengthM: Math.round(heightAtFrontM * 100) / 100,
      volumeM3: Math.round(postVolTotal * 1000) / 1000,
    },
    {
      name: 'Płatew przednia (belka oczepowa)',
      count: 1,
      dimensionsCm: `${frontBeamDimension.width} x ${frontBeamDimension.height}`,
      lengthM: Math.round(widthM * 100) / 100,
      volumeM3: Math.round(frontBeamVolTotal * 1000) / 1000,
    },
    {
      name: 'Belka przyścienna (murłata)',
      count: 1,
      dimensionsCm: `${wallBeamDimension.width} x ${wallBeamDimension.height}`,
      lengthM: Math.round(widthM * 100) / 100,
      volumeM3: Math.round(wallBeamVolTotal * 1000) / 1000,
    },
    {
      name: 'Krokwie dachowe',
      count: raftersCount,
      dimensionsCm: `${rafterDimension.width} x ${rafterDimension.height}`,
      lengthM: Math.round(rafterLengthM * 100) / 100,
      volumeM3: Math.round(rafterVolTotal * 1000) / 1000,
    },
    {
      name: 'Miecze usztywniające (zastrzały)',
      count: bracesCount,
      dimensionsCm: `${braceDimension.width} x ${braceDimension.height}`,
      lengthM: braceLengthM,
      volumeM3: Math.round(braceVolTotal * 1000) / 1000,
    },
  ];

  // Foundation & Footings
  const foundationFootingsCount = postsCount;
  const footingDepthCm = 90; // Standard frost depth in Poland
  const footingConcreteVolumeM3 = Math.round(postsCount * (0.4 * 0.4 * 0.9) * 100) / 100;

  // Roof Cover Description
  let roofCoverPanelsEstimate = '';
  if (roofCoverType === 'poliwęglan_komorowy' || roofCoverType === 'poliwęglan_lity') {
    const panelsCount = widthM > 0 ? Math.ceil(widthM / 1.05) : 0; // standard panel width 1050 mm or 2100 mm
    roofCoverPanelsEstimate = `${panelsCount} arkuszy poliwęglanu (szer. 1.05m lub 2.10m x dł. ${Math.ceil(rafterLengthM)}m) + profile łączeniowe z uszczelkami.`;
  } else if (roofCoverType === 'blachodachówka') {
    const m2WithWaste = Math.round(roofArea * 1.15 * 10) / 10;
    roofCoverPanelsEstimate = `${m2WithWaste} m² blachodachówki / blachy trapezowej (z zapasem na zakładki).`;
  } else if (roofCoverType === 'szkło_vsg') {
    const panelsCount = Math.max(0, raftersCount - 1);
    roofCoverPanelsEstimate = `${panelsCount} tafli szkła hartowanego/klejonego VSG ESG (dopasowane w światło krokwi) + system profili do szkła.`;
  } else {
    roofCoverPanelsEstimate = `${Math.round(roofArea * 1.1 * 10) / 10} m² gontu bitumicznego + płyty OSB-3 / deskowanie.`;
  }

  // Fasteners & Anchors estimate
  const chemicalAnchorsWall = widthM > 0 ? Math.max(4, Math.ceil(widthM / 0.8) + 1) : 0;
  const postAnchors = postsCount;
  const rafterScrews = raftersCount * 4; // 2 talerzowe na każdy koniec
  const roofScrews = Math.ceil(roofArea * 14); // ~14 wkrętów z uszczelką EPDM na m2

  return {
    roofArea: Math.round(roofArea * 100) / 100,
    roofAngleDegrees,
    roofSlopePercent,
    rafterLength: Math.round(rafterLengthM * 100) / 100,
    postsCount,
    postSpanDistance: Math.round(postSpanDistance * 100) / 100,
    raftersCount,
    actualRafterSpacing: actualRafterSpacingCm,
    bracesCount,
    totalWoodVolumeM3,
    woodBillOfMaterials,
    foundationFootingsCount,
    footingDepthCm,
    footingConcreteVolumeM3,
    roofCoverPanelsEstimate,
    screwsAndAnchorsEstimate: {
      chemicalAnchorsWall,
      postAnchors,
      rafterScrews,
      roofScrews,
    },
  };
}

/**
 * Calculations for Driveway (Podjazd)
 */
export function calculateDriveway(params: DrivewayParams): DrivewayResults {
  const lengthM = (params.length || 0) / 100;
  const widthM = (params.width || 0) / 100;
  let baseArea = lengthM * widthM;

  if (params.shape === 'poszerzony_garaz') {
    const extraW = (params.extraWidthGarage || 0) / 100;
    const extraL = (params.extraLengthGarage || 0) / 100;
    baseArea += extraW * extraL;
  } else if (params.shape === 'nawrotka') {
    baseArea *= 1.25; // +25% powierzchni na pętlę nawrotową
  }

  const wasteMultiplier = 1 + (params.wasteBufferPercent || 0) / 100;
  const areaNet = Math.round(baseArea * 100) / 100;
  const areaGross = Math.round(areaNet * wasteMultiplier * 100) / 100;

  const surfaceThick = params.customSurfaceThickness || 8;
  const subBaseThick = params.subBaseThickness || 30;
  const beddingThick = params.beddingThickness || 4;
  const filterSandThick = params.useFilterSandLayer ? (params.filterSandThickness || 10) : 0;

  const totalExcavationDepth = surfaceThick + subBaseThick + beddingThick + filterSandThick;
  const excavationVolume = Math.round(areaNet * (totalExcavationDepth / 100) * 100) / 100;

  let soilSwellFactor = 1.25;
  if (params.soilType === 'piaskowy') soilSwellFactor = 1.15;
  if (params.soilType === 'gliniasty') soilSwellFactor = 1.35;

  const excavationVolumeLoose = Math.round(excavationVolume * soilSwellFactor * 100) / 100;
  const excavationWeightTons = Math.round(excavationVolume * 1.65 * 100) / 100;

  const subBaseVolumeCompacted = Math.round(areaNet * (subBaseThick / 100) * 100) / 100;
  const subBaseVolumeLoose = Math.round(subBaseVolumeCompacted * 1.20 * 100) / 100;
  const subBaseWeightTons = Math.round(subBaseVolumeCompacted * 1.90 * 100) / 100;

  const beddingVolume = Math.round(areaNet * (beddingThick / 100) * 100) / 100;
  const beddingWeightTons = Math.round(beddingVolume * 1.60 * 100) / 100;
  const cementBags25kg = Math.ceil(beddingVolume * 250 / 25); // ~250 kg cementu na m3 podsypki 1:4

  const filterSandVolume = Math.round(areaNet * (filterSandThick / 100) * 100) / 100;
  const filterSandWeightTons = Math.round(filterSandVolume * 1.60 * 100) / 100;

  let edgingLength = 0;
  if (params.edgingSides === 'oba') {
    edgingLength = lengthM * 2;
  } else if (params.edgingSides === 'jeden') {
    edgingLength = lengthM;
  }

  const edgingPiecesCount = edgingLength > 0 ? Math.ceil((edgingLength / 1.0) * wasteMultiplier) : 0;
  const concreteLeanForEdging = Math.round(edgingLength * 0.15 * 0.20 * 1.2 * 100) / 100; // m3 betonu B15
  const geotextileArea = Math.round(areaNet * 1.15 * 100) / 100;

  return {
    areaNet,
    areaGross,
    totalExcavationDepth,
    excavationVolume,
    excavationVolumeLoose,
    excavationWeightTons,
    subBaseVolumeCompacted,
    subBaseVolumeLoose,
    subBaseWeightTons,
    beddingVolume,
    beddingWeightTons,
    cementBags25kg,
    filterSandVolume,
    filterSandWeightTons,
    edgingLength: Math.round(edgingLength * 100) / 100,
    edgingPiecesCount,
    concreteLeanForEdging,
    geotextileArea,
  };
}

/**
 * Calculations for Parking Spaces (Miejsca Parkingowe)
 */
export function calculateParking(params: ParkingParams): ParkingResults {
  const spacesCount = params.spacesCount || 1;
  const spaceLengthM = (params.spaceLength || 0) / 100;
  const spaceWidthM = (params.spaceWidth || 0) / 100;

  const totalAreaNet = Math.round(spacesCount * spaceLengthM * spaceWidthM * 100) / 100;
  const wasteMultiplier = 1 + (params.wasteBufferPercent || 0) / 100;
  const totalAreaGross = Math.round(totalAreaNet * wasteMultiplier * 100) / 100;

  const surfaceThick = params.customSurfaceThickness || 8;
  const subBaseThick = params.subBaseThickness || 25;
  const beddingThick = params.beddingThickness || 4;

  const totalExcavationDepth = surfaceThick + subBaseThick + beddingThick;
  const excavationVolume = Math.round(totalAreaNet * (totalExcavationDepth / 100) * 100) / 100;

  let soilSwellFactor = 1.25;
  if (params.soilType === 'piaskowy') soilSwellFactor = 1.15;
  if (params.soilType === 'gliniasty') soilSwellFactor = 1.35;

  const excavationVolumeLoose = Math.round(excavationVolume * soilSwellFactor * 100) / 100;
  const excavationWeightTons = Math.round(excavationVolume * 1.65 * 100) / 100;

  const subBaseVolumeCompacted = Math.round(totalAreaNet * (subBaseThick / 100) * 100) / 100;
  const subBaseVolumeLoose = Math.round(subBaseVolumeCompacted * 1.20 * 100) / 100;
  const subBaseWeightTons = Math.round(subBaseVolumeCompacted * 1.85 * 100) / 100;

  const beddingVolume = Math.round(totalAreaNet * (beddingThick / 100) * 100) / 100;
  const beddingWeightTons = Math.round(beddingVolume * 1.60 * 100) / 100;
  const cementBags25kg = Math.ceil(beddingVolume * 250 / 25);

  // Perimeter of parking slots
  const totalWidthM = spaceWidthM * spacesCount;
  const edgingLength = Math.round((2 * spaceLengthM + 2 * totalWidthM) * 100) / 100;
  const edgingPiecesCount = Math.ceil((edgingLength / 1.0) * wasteMultiplier);
  const concreteLeanForEdging = Math.round(edgingLength * 0.15 * 0.20 * 1.2 * 100) / 100;
  const geotextileArea = Math.round(totalAreaNet * 1.15 * 100) / 100;
  const stoppersCount = params.addStoppers ? spacesCount : 0;

  return {
    totalAreaNet,
    totalAreaGross,
    totalExcavationDepth,
    excavationVolume,
    excavationVolumeLoose,
    excavationWeightTons,
    subBaseVolumeCompacted,
    subBaseVolumeLoose,
    subBaseWeightTons,
    beddingVolume,
    beddingWeightTons,
    cementBags25kg,
    edgingLength,
    edgingPiecesCount,
    concreteLeanForEdging,
    geotextileArea,
    stoppersCount,
  };
}

/**
 * Calculations for Fence (Ogrodzenie)
 */
export function calculateFence(params: FenceParams): FenceResults {
  const totalLengthM = (params.totalLength || 0) / 100;
  const spanLengthM = (params.spanLength || 250) / 100;

  const wicketsCount = params.wicketsCount || 0;
  const wicketWidthM = (params.wicketWidth || 0) / 100;
  const gatesCount = params.gatesCount || 0;
  const gateWidthM = (params.gateWidth || 0) / 100;

  const wicketsTotalWidthM = Math.round(wicketsCount * wicketWidthM * 100) / 100;
  const gatesTotalWidthM = Math.round(gatesCount * gateWidthM * 100) / 100;

  const netFenceLength = Math.max(0, Math.round((totalLengthM - wicketsTotalWidthM - gatesTotalWidthM) * 100) / 100);

  const spansCount = spanLengthM > 0 && netFenceLength > 0 ? Math.ceil(netFenceLength / spanLengthM) : 0;

  const startPostsCount = 2 + wicketsCount * 2 + gatesCount * 2;
  const cornerPostsCount = 2; // Szacunek narożnych
  const intermediatePostsCount = Math.max(0, spansCount - 1);
  const postsCountTotal = spansCount > 0 ? spansCount + 1 + wicketsCount * 2 + gatesCount * 2 : 0;

  // Concrete for post holes
  const holeRadiusM = ((params.postHoleDiameter || 25) / 2) / 100;
  const holeDepthM = (params.postHoleDepth || 80) / 100;
  const volPerHole = Math.PI * Math.pow(holeRadiusM, 2) * holeDepthM;
  const concreteHolesVolumeM3 = Math.round(postsCountTotal * volPerHole * 100) / 100;
  const concreteB20Bags = Math.ceil(concreteHolesVolumeM3 * 2200 / 25); // ~2200 kg betonu B20 w m3

  const concreteBoardsCount = params.useConcreteBoard ? spansCount : 0;
  const concreteConnectorsCount = params.useConcreteBoard ? (spansCount > 0 ? spansCount + 1 : 0) : 0;

  const clampsTotalCount = postsCountTotal * (params.clampsPerPost || 3);
  const postCapsCount = postsCountTotal;

  return {
    netFenceLength,
    spansCount,
    postsCountTotal,
    startPostsCount,
    cornerPostsCount,
    intermediatePostsCount,
    concreteBoardsCount,
    concreteConnectorsCount,
    concreteHolesVolumeM3,
    concreteB20Bags,
    clampsTotalCount,
    postCapsCount,
    wicketsTotalWidthM,
    gatesTotalWidthM,
  };
}

