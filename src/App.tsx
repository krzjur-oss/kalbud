import React, { useState, useMemo, useEffect } from 'react';
import {
  TabType,
  HouseBandParams,
  TerraceFoundationParams,
  WoodenRoofParams,
  DrivewayParams,
  ParkingParams,
  FenceParams,
  PriceList,
  CustomPreset,
  SavedProject,
  ProjectModuleKey,
} from './types';
import {
  DEFAULT_HOUSE_BAND_PARAMS,
  DEFAULT_TERRACE_FOUNDATION_PARAMS,
  DEFAULT_WOODEN_ROOF_PARAMS,
  DEFAULT_DRIVEWAY_PARAMS,
  DEFAULT_PARKING_PARAMS,
  DEFAULT_FENCE_PARAMS,
  DEFAULT_PRICE_LIST,
} from './data/defaults';
import {
  calculateHouseBand,
  calculateTerraceFoundation,
  calculateWoodenRoof,
  calculateDriveway,
  calculateParking,
  calculateFence,
} from './utils/calculations';
import {
  getSavedProjects,
  saveSavedProjects,
  getActiveProjectId,
  setActiveProjectId,
  createNewProjectObject,
  ALL_PROJECT_MODULES,
} from './utils/projectStorage';
import { Header } from './components/Header';
import { PWAInstallBanner } from './components/PWAInstallBanner';
import { HouseBandCalculator } from './components/HouseBandCalculator';
import { TerraceFoundationCalculator } from './components/TerraceFoundationCalculator';
import { WoodenRoofCalculator } from './components/WoodenRoofCalculator';
import { DrivewayCalculator } from './components/DrivewayCalculator';
import { ParkingCalculator } from './components/ParkingCalculator';
import { FenceCalculator } from './components/FenceCalculator';
import { SummaryShoppingList } from './components/SummaryShoppingList';
import { AboutModal } from './components/AboutModal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('opaska');
  const [isAboutOpen, setIsAboutOpen] = useState<boolean>(false);
  const [aboutTab, setAboutTab] = useState<'info' | 'licencja' | 'regulamin'>('info');

  const handleOpenAbout = (tab: 'info' | 'licencja' | 'regulamin' = 'info') => {
    setAboutTab(tab);
    setIsAboutOpen(true);
  };

  // PROJECTS STATE FROM LOCALSTORAGE
  const [projects, setProjects] = useState<SavedProject[]>(() => getSavedProjects());
  const [activeProjectId, setActiveIdState] = useState<string>(() => getActiveProjectId());

  // Find active project or fallback to first
  const activeProject = useMemo(() => {
    return projects.find((p) => p.id === activeProjectId) || projects[0];
  }, [projects, activeProjectId]);

  // PARAMETERS STATE
  const [bandParams, setBandParams] = useState<HouseBandParams>(
    activeProject?.houseBand || DEFAULT_HOUSE_BAND_PARAMS
  );
  const [terraceParams, setTerraceParams] = useState<TerraceFoundationParams>(
    activeProject?.terraceFoundation || DEFAULT_TERRACE_FOUNDATION_PARAMS
  );
  const [roofParams, setRoofParams] = useState<WoodenRoofParams>(
    activeProject?.woodenRoof || DEFAULT_WOODEN_ROOF_PARAMS
  );
  const [drivewayParams, setDrivewayParams] = useState<DrivewayParams>(
    activeProject?.driveway || DEFAULT_DRIVEWAY_PARAMS
  );
  const [parkingParams, setParkingParams] = useState<ParkingParams>(
    activeProject?.parking || DEFAULT_PARKING_PARAMS
  );
  const [fenceParams, setFenceParams] = useState<FenceParams>(
    activeProject?.fence || DEFAULT_FENCE_PARAMS
  );
  const [priceList, setPriceList] = useState<PriceList>(
    activeProject?.priceList || DEFAULT_PRICE_LIST
  );

  // AUTO-SYNC CURRENT PARAMS TO ACTIVE PROJECT IN LOCALSTORAGE WHEN THEY CHANGE
  useEffect(() => {
    setProjects((prevProjects) => {
      const updated = prevProjects.map((p) => {
        if (p.id === activeProjectId) {
          return {
            ...p,
            updatedAt: new Date().toISOString(),
            houseBand: bandParams,
            terraceFoundation: terraceParams,
            woodenRoof: roofParams,
            driveway: drivewayParams,
            parking: parkingParams,
            fence: fenceParams,
            priceList: priceList,
          };
        }
        return p;
      });
      saveSavedProjects(updated);
      return updated;
    });
  }, [bandParams, terraceParams, roofParams, drivewayParams, parkingParams, fenceParams, priceList, activeProjectId]);

  // REAL-TIME COMPUTED RESULTS
  const bandResults = useMemo(() => calculateHouseBand(bandParams), [bandParams]);
  const terraceResults = useMemo(
    () => calculateTerraceFoundation(terraceParams),
    [terraceParams]
  );
  const roofResults = useMemo(() => calculateWoodenRoof(roofParams), [roofParams]);
  const drivewayResults = useMemo(() => calculateDriveway(drivewayParams), [drivewayParams]);
  const parkingResults = useMemo(() => calculateParking(parkingParams), [parkingParams]);
  const fenceResults = useMemo(() => calculateFence(fenceParams), [fenceParams]);

  // PROJECT MANAGEMENT HANDLERS
  const handleSelectProject = (project: SavedProject) => {
    setActiveIdState(project.id);
    setActiveProjectId(project.id);
    setBandParams(project.houseBand || DEFAULT_HOUSE_BAND_PARAMS);
    setTerraceParams(project.terraceFoundation || DEFAULT_TERRACE_FOUNDATION_PARAMS);
    setRoofParams(project.woodenRoof || DEFAULT_WOODEN_ROOF_PARAMS);
    setDrivewayParams(project.driveway || DEFAULT_DRIVEWAY_PARAMS);
    setParkingParams(project.parking || DEFAULT_PARKING_PARAMS);
    setFenceParams(project.fence || DEFAULT_FENCE_PARAMS);
    if (project.priceList) setPriceList(project.priceList);
  };

  const handleSaveCurrentProject = () => {
    const now = new Date().toISOString();
    const updated = projects.map((p) => {
      if (p.id === activeProjectId) {
        return {
          ...p,
          updatedAt: now,
          houseBand: bandParams,
          terraceFoundation: terraceParams,
          woodenRoof: roofParams,
          driveway: drivewayParams,
          parking: parkingParams,
          fence: fenceParams,
          priceList: priceList,
        };
      }
      return p;
    });
    setProjects(updated);
    saveSavedProjects(updated);
  };

  const handleCreateNewProject = (
    name: string,
    selectedModules: ProjectModuleKey[] = ALL_PROJECT_MODULES,
    description?: string
  ) => {
    const newProj = createNewProjectObject(name, {
      description,
      selectedModules,
      houseBand: DEFAULT_HOUSE_BAND_PARAMS,
      terraceFoundation: DEFAULT_TERRACE_FOUNDATION_PARAMS,
      woodenRoof: DEFAULT_WOODEN_ROOF_PARAMS,
      driveway: DEFAULT_DRIVEWAY_PARAMS,
      parking: DEFAULT_PARKING_PARAMS,
      fence: DEFAULT_FENCE_PARAMS,
      priceList: DEFAULT_PRICE_LIST,
    });
    const updated = [newProj, ...projects];
    setProjects(updated);
    saveSavedProjects(updated);
    handleSelectProject(newProj);

    if (selectedModules && selectedModules.length > 0) {
      const first = selectedModules[0];
      const tabMap: Record<ProjectModuleKey, TabType> = {
        houseBand: 'opaska',
        driveway: 'podjazd',
        parking: 'parking',
        fence: 'ogrodzenie',
        terraceFoundation: 'taras-wykop',
        woodenRoof: 'zadaszenie',
      };
      if (tabMap[first]) {
        setActiveTab(tabMap[first]);
      }
    }
  };

  const handleSaveAsNewProject = (name: string) => {
    const newProj = createNewProjectObject(name, {
      houseBand: bandParams,
      terraceFoundation: terraceParams,
      woodenRoof: roofParams,
      driveway: drivewayParams,
      parking: parkingParams,
      fence: fenceParams,
      priceList: priceList,
    });
    const updated = [newProj, ...projects];
    setProjects(updated);
    saveSavedProjects(updated);
    handleSelectProject(newProj);
  };

  const handleRenameProject = (id: string, newName: string) => {
    const updated = projects.map((p) => (p.id === id ? { ...p, name: newName, updatedAt: new Date().toISOString() } : p));
    setProjects(updated);
    saveSavedProjects(updated);
  };

  const handleDeleteProject = (id: string) => {
    if (projects.length <= 1) return;
    const filtered = projects.filter((p) => p.id !== id);
    setProjects(filtered);
    saveSavedProjects(filtered);
    if (activeProjectId === id) {
      handleSelectProject(filtered[0]);
    }
  };

  const handleDuplicateProject = (id: string) => {
    const target = projects.find((p) => p.id === id);
    if (!target) return;
    const duplicated = createNewProjectObject(`${target.name} (kopia)`, {
      description: target.description,
      houseBand: target.houseBand,
      terraceFoundation: target.terraceFoundation,
      woodenRoof: target.woodenRoof,
      driveway: target.driveway,
      parking: target.parking,
      fence: target.fence,
      priceList: target.priceList,
    });
    const updated = [duplicated, ...projects];
    setProjects(updated);
    saveSavedProjects(updated);
    handleSelectProject(duplicated);
  };

  const handleImportProjectJSON = (jsonString: string) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.houseBand && parsed.terraceFoundation && parsed.woodenRoof) {
        const imported = createNewProjectObject(parsed.name || 'Zaimportowany Projekt', {
          description: parsed.description,
          houseBand: parsed.houseBand,
          terraceFoundation: parsed.terraceFoundation,
          woodenRoof: parsed.woodenRoof,
          driveway: parsed.driveway || DEFAULT_DRIVEWAY_PARAMS,
          parking: parsed.parking || DEFAULT_PARKING_PARAMS,
          fence: parsed.fence || DEFAULT_FENCE_PARAMS,
          priceList: parsed.priceList || DEFAULT_PRICE_LIST,
        });
        const updated = [imported, ...projects];
        setProjects(updated);
        saveSavedProjects(updated);
        handleSelectProject(imported);
      } else {
        alert('Plik JSON nie zawiera poprawnych danych projektu.');
      }
    } catch (err) {
      alert('Błąd odczytu pliku JSON. Upewnij się, że plik ma prawidłowy format.');
    }
  };

  const handleSelectPresetTemplate = (preset: CustomPreset) => {
    setBandParams(preset.houseBand);
    setTerraceParams(preset.terraceFoundation);
    setRoofParams(preset.woodenRoof);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-500 selection:text-white">
      
      {/* PWA INSTALLATION & OFFLINE BANNER */}
      <PWAInstallBanner />

      {/* HEADER & PROJECT MANAGER TOOLBAR */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projects={projects}
        activeProjectId={activeProjectId}
        currentBandParams={bandParams}
        currentTerraceParams={terraceParams}
        currentRoofParams={roofParams}
        currentDrivewayParams={drivewayParams}
        currentParkingParams={parkingParams}
        currentFenceParams={fenceParams}
        currentPriceList={priceList}
        onSelectProject={handleSelectProject}
        onSaveCurrentProject={handleSaveCurrentProject}
        onCreateNewProject={handleCreateNewProject}
        onSaveAsNewProject={handleSaveAsNewProject}
        onRenameProject={handleRenameProject}
        onDeleteProject={handleDeleteProject}
        onDuplicateProject={handleDuplicateProject}
        onImportProjectJSON={handleImportProjectJSON}
        onSelectPresetTemplate={handleSelectPresetTemplate}
        onOpenAboutModal={handleOpenAbout}
      />

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* TAB 1: OPASKA WOKÓŁ DOMU */}
        {activeTab === 'opaska' && (
          <HouseBandCalculator
            params={bandParams}
            onChange={setBandParams}
            results={bandResults}
          />
        )}

        {/* TAB 2: PODJAZD */}
        {activeTab === 'podjazd' && (
          <DrivewayCalculator
            params={drivewayParams}
            onChange={setDrivewayParams}
            results={drivewayResults}
          />
        )}

        {/* TAB 3: PARKING */}
        {activeTab === 'parking' && (
          <ParkingCalculator
            params={parkingParams}
            onChange={setParkingParams}
            results={parkingResults}
          />
        )}

        {/* TAB 4: OGRODZENIE */}
        {activeTab === 'ogrodzenie' && (
          <FenceCalculator
            params={fenceParams}
            onChange={setFenceParams}
            results={fenceResults}
          />
        )}

        {/* TAB 5: WYKOP I TŁUCZEŃ POD TARAS */}
        {activeTab === 'taras-wykop' && (
          <TerraceFoundationCalculator
            params={terraceParams}
            onChange={setTerraceParams}
            results={terraceResults}
            roofParams={roofParams}
            roofResults={roofResults}
          />
        )}

        {/* TAB 6: ZADASZENIE DREWNIANE */}
        {activeTab === 'zadaszenie' && (
          <WoodenRoofCalculator
            params={roofParams}
            onChange={setRoofParams}
            results={roofResults}
            terraceParams={terraceParams}
            terraceResults={terraceResults}
          />
        )}

        {/* TAB 7: ZBIORCZY KOSZTORYS I LISTA ZAKUPÓW */}
        {activeTab === 'kosztorys' && (
          <SummaryShoppingList
            projectName={activeProject?.name}
            bandParams={bandParams}
            bandResults={bandResults}
            terraceParams={terraceParams}
            terraceResults={terraceResults}
            roofParams={roofParams}
            roofResults={roofResults}
            drivewayParams={drivewayParams}
            drivewayResults={drivewayResults}
            parkingParams={parkingParams}
            parkingResults={parkingResults}
            fenceParams={fenceParams}
            fenceResults={fenceResults}
            priceList={priceList}
            onPriceListChange={setPriceList}
          />
        )}

      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500 print:hidden">
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p>
            <strong>KALBUD</strong> — Kalkulator Budowlany v2.0 © {new Date().getFullYear()} mgr Krzysztof Jureczek. Wszelkie prawa zastrzeżone.
          </p>
          <div className="flex items-center gap-4 text-xs font-medium">
            <button
              onClick={() => handleOpenAbout('info')}
              className="hover:text-blue-600 transition-colors cursor-pointer"
            >
              O programie
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenAbout('licencja')}
              className="hover:text-emerald-600 transition-colors cursor-pointer"
            >
              Licencja (WLDE)
            </button>
            <span>•</span>
            <button
              onClick={() => handleOpenAbout('regulamin')}
              className="hover:text-purple-600 transition-colors cursor-pointer"
            >
              Regulamin & RODO
            </button>
          </div>
        </div>
      </footer>

      {/* ABOUT / LICENSE / TERMS MODAL */}
      <AboutModal
        isOpen={isAboutOpen}
        onClose={() => setIsAboutOpen(false)}
        defaultTab={aboutTab}
      />
    </div>
  );
}


