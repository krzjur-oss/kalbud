import {
  SavedProject,
  ProjectModuleKey,
  HouseBandParams,
  TerraceFoundationParams,
  WoodenRoofParams,
  DrivewayParams,
  ParkingParams,
  FenceParams,
  PriceList,
} from '../types';
import {
  DEFAULT_HOUSE_BAND_PARAMS,
  DEFAULT_TERRACE_FOUNDATION_PARAMS,
  DEFAULT_WOODEN_ROOF_PARAMS,
  DEFAULT_DRIVEWAY_PARAMS,
  DEFAULT_PARKING_PARAMS,
  DEFAULT_FENCE_PARAMS,
  DEFAULT_PRICE_LIST,
} from '../data/defaults';

const STORAGE_KEY_PROJECTS = 'planer_dom_taras_projects_v1';
const STORAGE_KEY_ACTIVE_ID = 'planer_dom_taras_active_project_id_v1';

export const ALL_PROJECT_MODULES: ProjectModuleKey[] = [
  'houseBand',
  'driveway',
  'parking',
  'fence',
  'terraceFoundation',
  'woodenRoof',
];

export const INITIAL_DEFAULT_PROJECT: SavedProject = {
  id: 'proj-default-1',
  name: 'Projekt Domyślny - Kompleksowy Zagospodarowanie',
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  description: 'Standardowy projekt opaski, podjazdu, parkingów, ogrodzenia, wykopu pod taras i zadaszenia.',
  selectedModules: ALL_PROJECT_MODULES,
  houseBand: DEFAULT_HOUSE_BAND_PARAMS,
  terraceFoundation: DEFAULT_TERRACE_FOUNDATION_PARAMS,
  woodenRoof: DEFAULT_WOODEN_ROOF_PARAMS,
  driveway: DEFAULT_DRIVEWAY_PARAMS,
  parking: DEFAULT_PARKING_PARAMS,
  fence: DEFAULT_FENCE_PARAMS,
  priceList: DEFAULT_PRICE_LIST,
};

export function getSavedProjects(): SavedProject[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROJECTS);
    if (!raw) {
      // Initialize with default project
      const initialList = [INITIAL_DEFAULT_PROJECT];
      saveSavedProjects(initialList);
      return initialList;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed.map((p) => ({
        ...p,
        driveway: p.driveway || DEFAULT_DRIVEWAY_PARAMS,
        parking: p.parking || DEFAULT_PARKING_PARAMS,
        fence: p.fence || DEFAULT_FENCE_PARAMS,
        priceList: p.priceList ? { ...DEFAULT_PRICE_LIST, ...p.priceList } : DEFAULT_PRICE_LIST,
      }));
    }
    return [INITIAL_DEFAULT_PROJECT];
  } catch (err) {
    console.error('Błąd odczytu projektów z localStorage:', err);
    return [INITIAL_DEFAULT_PROJECT];
  }
}

export function saveSavedProjects(projects: SavedProject[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_PROJECTS, JSON.stringify(projects));
  } catch (err) {
    console.error('Błąd zapisu projektów do localStorage:', err);
  }
}

export function getActiveProjectId(): string {
  try {
    const activeId = localStorage.getItem(STORAGE_KEY_ACTIVE_ID);
    if (activeId) {
      const projects = getSavedProjects();
      if (projects.some((p) => p.id === activeId)) {
        return activeId;
      }
    }
  } catch (err) {
    console.error('Błąd odczytu activeProjectId z localStorage:', err);
  }
  const projects = getSavedProjects();
  return projects[0]?.id || INITIAL_DEFAULT_PROJECT.id;
}

export function setActiveProjectId(id: string): void {
  try {
    localStorage.setItem(STORAGE_KEY_ACTIVE_ID, id);
  } catch (err) {
    console.error('Błąd zapisu activeProjectId do localStorage:', err);
  }
}

export function createNewProjectObject(
  name: string,
  params?: {
    selectedModules?: ProjectModuleKey[];
    houseBand?: HouseBandParams;
    terraceFoundation?: TerraceFoundationParams;
    woodenRoof?: WoodenRoofParams;
    driveway?: DrivewayParams;
    parking?: ParkingParams;
    fence?: FenceParams;
    priceList?: PriceList;
    description?: string;
  }
): SavedProject {
  const now = new Date().toISOString();
  return {
    id: `proj-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    name: name.trim() || 'Nowy Projekt',
    createdAt: now,
    updatedAt: now,
    description: params?.description || 'Własny projekt budowlany',
    selectedModules: params?.selectedModules || ALL_PROJECT_MODULES,
    houseBand: params?.houseBand ? JSON.parse(JSON.stringify(params.houseBand)) : DEFAULT_HOUSE_BAND_PARAMS,
    terraceFoundation: params?.terraceFoundation
      ? JSON.parse(JSON.stringify(params.terraceFoundation))
      : DEFAULT_TERRACE_FOUNDATION_PARAMS,
    woodenRoof: params?.woodenRoof
      ? JSON.parse(JSON.stringify(params.woodenRoof))
      : DEFAULT_WOODEN_ROOF_PARAMS,
    driveway: params?.driveway ? JSON.parse(JSON.stringify(params.driveway)) : DEFAULT_DRIVEWAY_PARAMS,
    parking: params?.parking ? JSON.parse(JSON.stringify(params.parking)) : DEFAULT_PARKING_PARAMS,
    fence: params?.fence ? JSON.parse(JSON.stringify(params.fence)) : DEFAULT_FENCE_PARAMS,
    priceList: params?.priceList ? JSON.parse(JSON.stringify(params.priceList)) : DEFAULT_PRICE_LIST,
  };
}
