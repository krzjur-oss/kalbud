import {
  HouseBandParams,
  TerraceFoundationParams,
  WoodenRoofParams,
  DrivewayParams,
  ParkingParams,
  FenceParams,
  PriceList,
  CustomPreset,
} from '../types';

export const DEFAULT_HOUSE_BAND_PARAMS: HouseBandParams = {
  housePerimeter: 0, // cm
  bandWidth: 0, // cm
  terraceExclusionWidth: 0, // cm
  exclusions: [],
  edgingLength: 0, // cm
  edgingHeight: 0, // cm
  edgingThickness: 0, // cm
  surfaceType: 'plyty',
  tileLength: 0, // cm
  tileWidth: 0, // cm
  tileThickness: 0, // cm
  gravelLayerThickness: 0, // cm
  beddingThickness: 0, // cm
  subBaseThickness: 0, // cm
  wasteBufferPercent: 0, // %
};

export const DEFAULT_TERRACE_FOUNDATION_PARAMS: TerraceFoundationParams = {
  terraceShape: 'prostokat',
  terraceLength: 0, // cm
  terraceWidth: 0, // cm
  sideBLength: 0, // cm
  sideBWidth: 0, // cm
  chamferCorner: false,
  chamferSize: 0, // cm
  soilType: 'sredni',
  surfaceType: 'plyty_betonowe',
  customSurfaceThickness: 0, // cm
  beddingThickness: 0, // cm
  subBaseThickness: 0, // cm
  useCustomSubBase: false,
  wasteBufferPercent: 0,
  compactedDensityTonsM3: 1.85,
};

export const DEFAULT_WOODEN_ROOF_PARAMS: WoodenRoofParams = {
  width: 0, // cm
  depth: 0, // cm
  heightAtWall: 0, // cm
  heightAtFront: 0, // cm
  frontOverhang: 0, // cm
  roofCoverType: 'poliwęglan_komorowy',
  woodGrade: 'C24',
  postDimension: { width: 0, height: 0 },
  frontBeamDimension: { width: 0, height: 0 },
  wallBeamDimension: { width: 0, height: 0 },
  rafterDimension: { width: 0, height: 0 },
  braceDimension: { width: 0, height: 0 },
  targetRafterSpacing: 0, // cm
};

export const DEFAULT_DRIVEWAY_PARAMS: DrivewayParams = {
  length: 0, // cm
  width: 0, // cm
  shape: 'prosty',
  extraWidthGarage: 0,
  extraLengthGarage: 0,
  surfaceType: 'kostka_8cm',
  customSurfaceThickness: 8,
  subBaseThickness: 0, // cm
  beddingThickness: 0, // cm
  useFilterSandLayer: false,
  filterSandThickness: 0, // cm
  soilType: 'sredni',
  edgingType: 'kraweznik_drogowy_100x30x15',
  edgingSides: 'oba',
  wasteBufferPercent: 0,
};

export const DEFAULT_PARKING_PARAMS: ParkingParams = {
  spacesCount: 0, // szt
  spaceLength: 0, // cm
  spaceWidth: 0, // cm
  layout: 'prostopadle',
  surfaceType: 'plyty_azurowe',
  customSurfaceThickness: 8,
  subBaseThickness: 0, // cm
  beddingThickness: 0, // cm
  soilType: 'sredni',
  edgingType: 'kraweznik_drogowy_100x30x15',
  addStoppers: false,
  wasteBufferPercent: 0,
};

export const DEFAULT_FENCE_PARAMS: FenceParams = {
  totalLength: 0, // cm
  fenceHeight: 0, // cm
  spanLength: 0, // cm
  postWidth: 0, // cm
  postDepth: 0, // cm
  postHoleDepth: 0, // cm
  postHoleDiameter: 0, // cm
  useConcreteBoard: false,
  concreteBoardHeight: 0, // cm
  fenceType: 'panelowe_3d',
  wicketsCount: 0,
  wicketWidth: 0, // cm
  gatesCount: 0,
  gateWidth: 0, // cm
  clampsPerPost: 0,
};

export const DEFAULT_PRICE_LIST: PriceList = {
  edgingPricePerPiece: 18, // PLN / szt obrzeża 100x20x6
  tilePricePerPiece: 28, // PLN / szt płyta betonowa 50x50
  pavingPricePerM2: 65, // PLN / m2 kostki 6cm
  gravelPricePerTon: 110, // PLN / t żwiru ozdobnego
  subBasePricePerTon: 85, // PLN / t tłucznia 0-31.5 mm
  beddingSandPricePerTon: 55, // PLN / t piasku/grysiku
  cement25kgPricePerBag: 21, // PLN / worek cementu 25kg
  geotextilePricePerM2: 4.5, // PLN / m2 geowłókniny
  soilRemovalPricePerM3: 70, // PLN / m3 wywozu ziemi

  woodPricePerM3: 2300, // PLN / m3 drewna konstrukcyjnego C24/KVH
  roofCoverPricePerM2: 85, // PLN / m2 poliwęglanu / blachy
  postAnchorPricePerPiece: 38, // PLN / szt kotwy regulowanej
  chemicalAnchorPricePerPiece: 28, // PLN / szt kotwy chemicznej
  concreteBagPricePerBag: 18, // PLN / worek Suchy Beton B20 25kg

  roadCurbsPricePerPiece: 38, // PLN / szt krawężnika 100x30x15
  paving8cmPricePerM2: 78, // PLN / m2 kostki 8cm
  openworkPlatesPricePerM2: 52, // PLN / m2 płyt ażurowych
  fencePanelPricePerPiece: 120, // PLN / szt panela 3D
  fencePostPricePerPiece: 45, // PLN / szt słupka
  concreteBoardPricePerPiece: 38, // PLN / szt deski podmurówki
  concreteConnectorPricePerPiece: 16, // PLN / szt łącznika
  fenceWicketPrice: 450, // PLN / szt furtki
  fenceGatePrice: 1800, // PLN / szt bramy
  parkingStopperPricePerPiece: 120, // PLN / szt odbojnika
};

export const PRESETS: CustomPreset[] = [
  {
    id: 'standard-house',
    name: 'Standardowy Dom (12x9m) + Taras 4.5x3.5m',
    description: 'Klasyczny zestaw dla domu jednorodzinnego: opaska z płyt 50x50cm, wykop pod taras i zadaszenie z drewna C24 z poliwęglanem.',
    houseBand: { ...DEFAULT_HOUSE_BAND_PARAMS },
    terraceFoundation: { ...DEFAULT_TERRACE_FOUNDATION_PARAMS },
    woodenRoof: { ...DEFAULT_WOODEN_ROOF_PARAMS },
  },
  {
    id: 'modern-large',
    name: 'Nowoczesny Duży Taras 6x4m + Opaska Wielkoformatowa',
    description: 'Płyty wielkoformatowe 80x40cm na opasce, głębszy wykop na podbudowę 35cm oraz przestronna pergolka z drewna klejonego BSH.',
    houseBand: {
      ...DEFAULT_HOUSE_BAND_PARAMS,
      housePerimeter: 5200,
      bandWidth: 100,
      terraceExclusionWidth: 600,
      tileLength: 80,
      tileWidth: 40,
      tileThickness: 5,
    },
    terraceFoundation: {
      ...DEFAULT_TERRACE_FOUNDATION_PARAMS,
      terraceLength: 600,
      terraceWidth: 400,
      soilType: 'gliniasty',
      surfaceType: 'plyty_betonowe',
      customSurfaceThickness: 5,
      subBaseThickness: 35,
      useCustomSubBase: true,
    },
    woodenRoof: {
      ...DEFAULT_WOODEN_ROOF_PARAMS,
      width: 600,
      depth: 400,
      heightAtWall: 285,
      heightAtFront: 225,
      woodGrade: 'BSH',
      postDimension: { width: 14, height: 14 },
      frontBeamDimension: { width: 14, height: 20 },
      rafterDimension: { width: 8, height: 18 },
    },
  },
  {
    id: 'gravel-budget',
    name: 'Opaska ze Żwiru Ozdobnego + Taras z Kostki 4x3m',
    description: 'Ekonomiczna opaska żwirowa wokół domu, podbudowa pod kostkę brukową i proste zadaszenie z blachodachówką.',
    houseBand: {
      ...DEFAULT_HOUSE_BAND_PARAMS,
      housePerimeter: 3800,
      bandWidth: 60,
      surfaceType: 'zwir',
      gravelLayerThickness: 5,
    },
    terraceFoundation: {
      ...DEFAULT_TERRACE_FOUNDATION_PARAMS,
      terraceLength: 400,
      terraceWidth: 300,
      soilType: 'piaskowy',
      surfaceType: 'kostka_6cm',
      customSurfaceThickness: 6,
    },
    woodenRoof: {
      ...DEFAULT_WOODEN_ROOF_PARAMS,
      width: 400,
      depth: 300,
      roofCoverType: 'blachodachówka',
    },
  },
];
