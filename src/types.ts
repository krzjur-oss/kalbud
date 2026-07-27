export type TabType = 'opaska' | 'podjazd' | 'parking' | 'ogrodzenie' | 'taras-wykop' | 'zadaszenie' | 'kosztorys';

// --- OPASKA WOKÓŁ DOMU ---
export interface BandExclusion {
  id: string;
  name: string; // np. "Taras ogrodowy", "Schody wejściowe", "Wjazd do garażu"
  length: number; // Długość wyłączenia w cm (np. 450)
}

export interface HouseBandParams {
  housePerimeter: number; // Obwód domu w cm (np. 4000)
  bandWidth: number; // Szerokość opaski w cm (np. 80)
  terraceExclusionWidth: number; // Łączna długość wyłączeń w cm (np. 450)
  exclusions?: BandExclusion[]; // Lista poszczególnych wyłączeń z opaski
  
  // Obrzeża / Krawężniki
  edgingLength: number; // Długość obrzeża w cm (np. 100)
  edgingHeight: number; // Wysokość obrzeża w cm (np. 20)
  edgingThickness: number; // Grubość obrzeża w cm (np. 6)
  
  // Materiał nawierzchniowy
  surfaceType: 'plyty' | 'kostka' | 'zwir';
  tileLength: number; // Długość płyty w cm (np. 50)
  tileWidth: number; // Szerokość płyty w cm (np. 50)
  tileThickness: number; // Grubość płyty w cm (np. 4)
  gravelLayerThickness: number; // Grubość warstwy żwiru w cm (np. 5)

  // Warstwy podbudowy
  beddingThickness: number; // Grubość podsypki piaskowo-cementowej w cm (np. 4)
  subBaseThickness: number; // Grubość tłucznia pod opaskę w cm (np. 15)
  wasteBufferPercent: number; // Zapas na docięcia w % (np. 8%)
}

export interface HouseBandResults {
  bandAreaNet: number; // Powierzchnia opaski netto (m2)
  outerEdgingLength: number; // Łączna długość obrzeży zewnętrznych (m)
  edgingPiecesCount: number; // Liczba sztuk obrzeży z zapasem
  
  // Wykop
  totalExcavationDepth: number; // Głębokość wykopu w cm
  excavationVolume: number; // Objętość wykopu w m3
  excavationVolumeLoose: number; // Objętość ziemi ze spęcznieniem (m3)

  // Materiały
  tilesCount?: number; // Liczba płyt (szt) jeśli opcja 'plyty'
  pavingArea?: number; // Powierzchnia kostki z zapasem (m2) jeśli 'kostka'
  gravelVolume?: number; // Objętość żwiru w m3 jeśli 'zwir'
  gravelWeightTons?: number; // Masa żwiru w tonach
  
  // Tłuczeń i Podsypka
  subBaseVolume: number; // m3 tłucznia
  subBaseWeightTons: number; // tony tłucznia
  beddingVolume: number; // m3 podsypki
  beddingWeightTons: number; // tony podsypki
  cementBags25kg: number; // liczba worków cementu 25kg do podsypki 1:4
  concreteLeanForEdging: number; // m3 betonu B10/B15 na opór pod obrzeża
  geotextileArea: number; // m2 geowłókniny
}

// --- WYKOP I TŁUCZEŃ POD TARAS ---
export type SoilType = 'piaskowy' | 'sredni' | 'gliniasty';
export type TerraceSurfaceType = 'plyty_betonowe' | 'gres_2cm' | 'kostka_6cm' | 'deska_kompozyt';
export type TerraceShape = 'prostokat' | 'narozny_L' | 'narozny_L_zewnetrzny' | 'trapez';

export interface TerraceFoundationParams {
  terraceShape?: TerraceShape; // Kształt tarasu
  terraceLength: number; // Długość ramienia A wzdłuż ściany 1 w cm (np. 450)
  terraceWidth: number; // Wysięg ramienia A w teren w cm (np. 350)
  
  // Dla tarasu narożnego L-kształtnego (przylegającego do dwóch ścian)
  sideBLength?: number; // Długość ramienia B wzdłuż ściany 2 w cm (np. 300)
  sideBWidth?: number; // Wysięg ramienia B w teren w cm (np. 250)

  // Ścięty narożnik zewnętrzny (skos 45°)
  chamferCorner?: boolean; // Czy zewnętrzny narożnik jest ścięty
  chamferSize?: number; // Wielkość przyprostokątnej ścięcia w cm (np. 120 cm)

  soilType: SoilType; // Typ gruntu
  surfaceType: TerraceSurfaceType; // Rodzaj nawierzchni
  
  customSurfaceThickness: number; // cm (np. 4 cm płyta, 2 cm gres, 8.5 cm deska na legarach)
  beddingThickness: number; // cm (podsypka grysikowa lub cementowo-piaskowa, np. 4 cm)
  subBaseThickness: number; // cm (tłuczeń 0-31.5 mm, np. 25 cm)
  useCustomSubBase: boolean; // czy własna grubość czy automatycznie rekomendowana dla gruntu
  
  wasteBufferPercent: number; // % zapasu na docięcia (np. 8%)
  compactedDensityTonsM3: number; // gęstość tłucznia po ubiciu (default 1.85 t/m3)
}

export interface TerraceFoundationResults {
  terraceArea: number; // m2
  recommendedSubBaseThickness: number; // cm rekomendowane
  actualSubBaseThickness: number; // cm zastosowane
  totalExcavationDepth: number; // cm całkowita głębokość wykopu
  
  // Wykop
  excavationVolume: number; // m3 w gruncie
  excavationVolumeLoose: number; // m3 do wywiezienia (spęcznienie ~1.25)
  excavationWeightTons: number; // t
  
  // Tłuczeń / Kruszywo
  subBaseVolumeCompacted: number; // m3 po ubiciu
  subBaseVolumeLoose: number; // m3 sypkiego przed zagęszczeniem (+20%)
  subBaseWeightTons: number; // tony tłucznia
  compactionLayersCount: number; // liczba warstw ubijania (po max 12-15 cm)
  compactorWeightRecommendation: string; // rekomendacja tonażu zagęszczarki

  // Podsypka
  beddingVolume: number; // m3
  beddingWeightTons: number; // tony podsypki grys/piasek
  
  // Nawierzchnia
  surfaceMaterialArea: number; // m2 z zapasem
  tilesEstimateCount?: number; // szacunkowa ilość płyt przy standardowym rozmiarze 60x60
}

// --- ZADASZENIE TARASU Z KONSTRUKCJI DREWNIANEJ ---
export type RoofCoverType = 'poliwęglan_komorowy' | 'poliwęglan_lity' | 'blachodachówka' | 'szkło_vsg' | 'gont';
export type WoodGrade = 'C24' | 'KVH' | 'BSH' | 'sosna_surowa';

export interface WoodenRoofParams {
  width: number; // Szerokość zadaszenia wzdłuż ściany w cm (np. 450)
  depth: number; // Wysięg zadaszenia od ściany w cm (np. 350)
  heightAtWall: number; // Wysokość montażu przy ścianie w cm (np. 270)
  heightAtFront: number; // Wysokość przedniej belki w cm (np. 220)
  frontOverhang: number; // Okap krokwi z przodu w cm (np. 30)
  
  roofCoverType: RoofCoverType;
  woodGrade: WoodGrade;

  // Przekroje elementów drewnianych (szerokość x wysokość w cm)
  postDimension: { width: number; height: number }; // Słupy (np. 12x12 lub 14x14)
  frontBeamDimension: { width: number; height: number }; // Płatew przednia (np. 12x14 lub 14x18)
  wallBeamDimension: { width: number; height: number }; // Belka przyścienna (np. 6x14 lub 8x16)
  rafterDimension: { width: number; height: number }; // Krokwie (np. 6x14 lub 8x16)
  braceDimension: { width: number; height: number }; // Zastrzały / miecze (np. 8x8 lub 10x10)
  
  targetRafterSpacing: number; // Domyślny rozstaw krokwi w cm (np. 70 cm)
}

export interface WoodenRoofResults {
  roofArea: number; // Powierzchnia dachu po skosie w m2
  roofAngleDegrees: number; // Kąt spadku dachu w stopniach
  roofSlopePercent: number; // Spadek dachu w %
  rafterLength: number; // Długość pojedynczej krokwi w metrach
  
  // Elementy konstrukcyjne
  postsCount: number; // Liczba słupów skrajnych i środkowych
  postSpanDistance: number; // Rozstaw między słupami w m
  raftersCount: number; // Liczba krokwi
  actualRafterSpacing: number; // Rzeczywisty rozstaw krokwi w cm
  bracesCount: number; // Liczba mieczy/zastrzałów
  
  // Zestawienie drewna
  totalWoodVolumeM3: number; // Całkowita objętość drewna w m3
  woodBillOfMaterials: Array<{
    name: string;
    count: number;
    dimensionsCm: string;
    lengthM: number;
    volumeM3: number;
  }>;

  // Fundamenty i kotwy
  foundationFootingsCount: number; // Liczba stóp fundamentowych pod słupy
  footingDepthCm: number; // Zalecana głębokość stóp w cm (strefa przemarzania)
  footingConcreteVolumeM3: number; // m3 betonu na stopy

  // Elementy zadaszenia i montażowe
  roofCoverPanelsEstimate: string; // Opis ilości paneli/arkuszy zadaszenia
  screwsAndAnchorsEstimate: {
    chemicalAnchorsWall: number; // Kotwy chemiczne M12 do ściany
    postAnchors: number; // Kotwy regulowane w beton
    rafterScrews: number; // Wkręty ciesielskie do krokwi (np. 8x240)
    roofScrews: number; // Wkręty do pokrycia dachu
  };
}

// --- PODJAZD (DRIVEWAY) ---
export type DrivewaySurfaceType = 'kostka_6cm' | 'kostka_8cm' | 'plyty_azurowe' | 'geokrata' | 'kruszywo' | 'plyty_betonowe_duze';
export type DrivewayShape = 'prosty' | 'poszerzony_garaz' | 'nawrotka';

export interface DrivewayParams {
  length: number; // Długość podjazdu w cm (np. 1200)
  width: number; // Szerokość podstawowa w cm (np. 350)
  shape: DrivewayShape;
  extraWidthGarage?: number; // Dodatkowa szerokość przed garażem dwustanowiskowym w cm (np. 250)
  extraLengthGarage?: number; // Długość poszerzonego odcinka w cm (np. 400)
  
  surfaceType: DrivewaySurfaceType;
  customSurfaceThickness: number; // cm (np. 8)
  
  subBaseThickness: number; // cm tłucznia 0-31.5 mm (np. 30 cm dla cięższych aut)
  beddingThickness: number; // cm podsypki piaskowo-cementowej/grysikowej (np. 4 cm)
  useFilterSandLayer: boolean; // czy stosować warstwową podsypkę piaskową odcinającą pod tłuczeń
  filterSandThickness: number; // cm piasku (np. 10 cm)
  
  soilType: SoilType;
  edgingType: 'kraweznik_drogowy_100x30x15' | 'obrzeze_100x20x6' | 'palisada';
  edgingSides: 'oba' | 'jeden' | 'brak';
  wasteBufferPercent: number; // % zapasu (np. 8%)
}

export interface DrivewayResults {
  areaNet: number; // m2
  areaGross: number; // m2 z zapasem
  totalExcavationDepth: number; // cm
  excavationVolume: number; // m3
  excavationVolumeLoose: number; // m3
  excavationWeightTons: number; // tony
  
  subBaseVolumeCompacted: number; // m3
  subBaseVolumeLoose: number; // m3
  subBaseWeightTons: number; // tony
  
  beddingVolume: number; // m3
  beddingWeightTons: number; // tony
  cementBags25kg: number; // worki
  
  filterSandVolume: number; // m3 piasku filtracyjnego
  filterSandWeightTons: number; // tony piasku
  
  edgingLength: number; // m
  edgingPiecesCount: number; // szt
  concreteLeanForEdging: number; // m3 betonu B15/B20 na opór
  geotextileArea: number; // m2
}

// --- MIEJSCE PARKINGOWE (PARKING SPACE) ---
export type ParkingLayout = 'prostopadle' | 'rownolegle' | 'skosne';
export type ParkingSurfaceType = 'plyty_azurowe' | 'geokrata' | 'kostka_8cm' | 'kruszywo';

export interface ParkingParams {
  spacesCount: number; // Liczba stanowisk (szt., np. 2)
  spaceLength: number; // Długość stanowiska w cm (np. 500)
  spaceWidth: number; // Szerokość stanowiska w cm (np. 280)
  layout: ParkingLayout;
  
  surfaceType: ParkingSurfaceType;
  customSurfaceThickness: number; // cm (np. 8 cm)
  subBaseThickness: number; // cm (np. 25 cm)
  beddingThickness: number; // cm (np. 4 cm)
  
  soilType: SoilType;
  edgingType: 'kraweznik_drogowy_100x30x15' | 'obrzeze_100x20x6';
  addStoppers: boolean; // Czy dodać gumowe odbojniki parkingowe
  wasteBufferPercent: number; // %
}

export interface ParkingResults {
  totalAreaNet: number; // m2
  totalAreaGross: number; // m2
  totalExcavationDepth: number; // cm
  excavationVolume: number; // m3
  excavationVolumeLoose: number; // m3
  excavationWeightTons: number; // tony
  
  subBaseVolumeCompacted: number; // m3
  subBaseVolumeLoose: number; // m3
  subBaseWeightTons: number; // tony
  
  beddingVolume: number; // m3
  beddingWeightTons: number; // tony
  cementBags25kg: number;
  
  edgingLength: number; // m
  edgingPiecesCount: number; // szt
  concreteLeanForEdging: number; // m3
  geotextileArea: number; // m2
  stoppersCount: number; // szt odbojników
}

// --- OGRODZENIE (FENCE) ---
export type FenceType = 'panelowe_3d' | 'panelowe_2d' | 'palisada' | 'siatka' | 'sztachety' | 'bloczki_lupane';

export interface FenceParams {
  totalLength: number; // Długość ogrodzenia w cm (np. 4000)
  fenceHeight: number; // Wysokość panela/ogrodzenia w cm (np. 153)
  spanLength: number; // Długość pojedynczego panela/przęsła w cm (np. 250)
  
  postWidth: number; // Przekrój słupka w cm (np. 6 cm)
  postDepth: number; // Przekrój słupka w cm (np. 4 cm)
  postHoleDepth: number; // Głębokość dołka pod słupek w cm (np. 80 cm)
  postHoleDiameter: number; // Średnica/szerokość dołka w cm (np. 25 cm)
  
  useConcreteBoard: boolean; // Podmurówka betonowa prefabrykowana
  concreteBoardHeight: number; // Wysokość podmurówki w cm (np. 25 cm)
  
  fenceType: FenceType;
  wicketsCount: number; // Liczba furtek (szt, np. 1)
  wicketWidth: number; // Szerokość furtki w cm (np. 100)
  gatesCount: number; // Liczba bram wjazdowych (szt, np. 1)
  gateWidth: number; // Szerokość bramy w cm (np. 400)
  
  clampsPerPost: number; // Liczba obejm/mocowań na słupek (szt, np. 3)
}

export interface FenceResults {
  netFenceLength: number; // m (po odebraniu szerokości bram i furtek)
  spansCount: number; // szt przęseł/paneli
  postsCountTotal: number; // szt wszystkich słupków
  startPostsCount: number; // szt słupków początkowych/końcowych
  cornerPostsCount: number; // szt słupków narożnych
  intermediatePostsCount: number; // szt słupków przelotowych
  
  concreteBoardsCount: number; // szt płyt podmurówki
  concreteConnectorsCount: number; // szt łączników betonowych podmurówki
  
  concreteHolesVolumeM3: number; // m3 betonu pod słupki
  concreteB20Bags: number; // worki betonu B20 (25kg)
  
  clampsTotalCount: number; // szt obejm łącznie
  postCapsCount: number; // szt zaślepek słupka
  
  wicketsTotalWidthM: number; // m
  gatesTotalWidthM: number; // m
}

// --- CENNIK I KOSZTORYS ---
export interface PriceList {
  // Opaska & Wykop
  edgingPricePerPiece: number; // PLN / szt obrzeża
  tilePricePerPiece: number; // PLN / szt płyty
  pavingPricePerM2: number; // PLN / m2 kostki
  gravelPricePerTon: number; // PLN / t żwiru
  subBasePricePerTon: number; // PLN / t tłucznia 0-31.5
  beddingSandPricePerTon: number; // PLN / t podsypki piasek/grys
  cement25kgPricePerBag: number; // PLN / worek 25kg
  geotextilePricePerM2: number; // PLN / m2
  soilRemovalPricePerM3: number; // PLN / m3 wywozu ziemi

  // Drewno & Zadaszenie
  woodPricePerM3: number; // PLN / m3 drewna
  roofCoverPricePerM2: number; // PLN / m2 pokrycia dachowego
  postAnchorPricePerPiece: number; // PLN / szt kotwy słupa
  chemicalAnchorPricePerPiece: number; // PLN / zestaw kotwy do ściany
  concreteBagPricePerBag: number; // PLN / worek betonu B20 (25kg)

  // Podjazd, Parking & Ogrodzenie
  roadCurbsPricePerPiece: number; // PLN / szt krawężnika 100x30x15
  paving8cmPricePerM2: number; // PLN / m2 kostki 8cm
  openworkPlatesPricePerM2: number; // PLN / m2 płyt ażurowych
  fencePanelPricePerPiece: number; // PLN / szt panela ogrodzeniowego 3D/2D
  fencePostPricePerPiece: number; // PLN / szt słupka ogrodzeniowego
  concreteBoardPricePerPiece: number; // PLN / szt deski podmurówki
  concreteConnectorPricePerPiece: number; // PLN / szt łącznika podmurówki
  fenceWicketPrice: number; // PLN / szt furtki
  fenceGatePrice: number; // PLN / szt bramy wjazdowej
  parkingStopperPricePerPiece: number; // PLN / szt odbojnika parkingowego
}

export type ProjectModuleKey =
  | 'houseBand'
  | 'driveway'
  | 'parking'
  | 'fence'
  | 'terraceFoundation'
  | 'woodenRoof';

export interface CustomPreset {
  id: string;
  name: string;
  description: string;
  selectedModules?: ProjectModuleKey[];
  houseBand: HouseBandParams;
  terraceFoundation: TerraceFoundationParams;
  woodenRoof: WoodenRoofParams;
  driveway?: DrivewayParams;
  parking?: ParkingParams;
  fence?: FenceParams;
}

export interface SavedProject {
  id: string;
  name: string;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
  description?: string;
  selectedModules?: ProjectModuleKey[];
  houseBand: HouseBandParams;
  terraceFoundation: TerraceFoundationParams;
  woodenRoof: WoodenRoofParams;
  driveway?: DrivewayParams;
  parking?: ParkingParams;
  fence?: FenceParams;
  priceList?: PriceList;
}

