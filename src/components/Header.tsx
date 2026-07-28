import React from 'react';
import {
  TabType,
  SavedProject,
  ProjectModuleKey,
  HouseBandParams,
  TerraceFoundationParams,
  WoodenRoofParams,
  DrivewayParams,
  ParkingParams,
  FenceParams,
  PriceList,
  CustomPreset,
} from '../types';
import { ProjectManager } from './ProjectManager';
import { Calculator, Shovel, Trees, ShoppingBag, Car, SquareParking, Shield, Info } from 'lucide-react';

interface HeaderProps {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
  projects: SavedProject[];
  activeProjectId: string;
  currentBandParams: HouseBandParams;
  currentTerraceParams: TerraceFoundationParams;
  currentRoofParams: WoodenRoofParams;
  currentDrivewayParams?: DrivewayParams;
  currentParkingParams?: ParkingParams;
  currentFenceParams?: FenceParams;
  currentPriceList: PriceList;
  onSelectProject: (project: SavedProject) => void;
  onSaveCurrentProject: () => void;
  onCreateNewProject: (name: string, selectedModules?: ProjectModuleKey[], description?: string) => void;
  onSaveAsNewProject: (name: string) => void;
  onRenameProject: (id: string, newName: string) => void;
  onDeleteProject: (id: string) => void;
  onDuplicateProject: (id: string) => void;
  onImportProjectJSON: (jsonString: string) => void;
  onSelectPresetTemplate: (preset: CustomPreset) => void;
  onOpenAboutModal?: (tab?: 'info' | 'licencja' | 'regulamin') => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  projects,
  activeProjectId,
  currentBandParams,
  currentTerraceParams,
  currentRoofParams,
  currentDrivewayParams,
  currentParkingParams,
  currentFenceParams,
  currentPriceList,
  onSelectProject,
  onSaveCurrentProject,
  onCreateNewProject,
  onSaveAsNewProject,
  onRenameProject,
  onDeleteProject,
  onDuplicateProject,
  onImportProjectJSON,
  onSelectPresetTemplate,
  onOpenAboutModal,
}) => {
  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-50 backdrop-blur-md bg-white/90 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between py-3.5 gap-3">
          
          {/* LOGO & TITLE */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
              <Calculator className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg md:text-xl font-light tracking-tight text-slate-800 flex items-center gap-2">
                <span className="font-extrabold text-blue-600 tracking-wider uppercase text-xl">KALBUD</span>
                <span className="text-slate-400 font-normal">|</span>
                <span className="font-medium text-slate-700 text-sm md:text-base">kalkulator budowlany</span>
              </h1>
              <p className="text-[11px] text-slate-500">
                Kompleksowy kalkulator opaski, podjazdu, parkingów, ogrodzeń, tarasu i zadaszenia
              </p>
            </div>
          </div>

          {/* PROJECT MANAGER TOOLBAR */}
          <ProjectManager
            projects={projects}
            activeProjectId={activeProjectId}
            currentBandParams={currentBandParams}
            currentTerraceParams={currentTerraceParams}
            currentRoofParams={currentRoofParams}
            currentDrivewayParams={currentDrivewayParams}
            currentParkingParams={currentParkingParams}
            currentFenceParams={currentFenceParams}
            currentPriceList={currentPriceList}
            onSelectProject={onSelectProject}
            onSaveCurrentProject={onSaveCurrentProject}
            onCreateNewProject={onCreateNewProject}
            onSaveAsNewProject={onSaveAsNewProject}
            onRenameProject={onRenameProject}
            onDeleteProject={onDeleteProject}
            onDuplicateProject={onDuplicateProject}
            onImportProjectJSON={onImportProjectJSON}
            onSelectPresetTemplate={onSelectPresetTemplate}
          />
        </div>

        {/* TABS NAVIGATION */}
        <nav className="flex items-center gap-1 overflow-x-auto pb-2.5 pt-1 scrollbar-none text-xs md:text-sm font-medium border-t border-slate-100 mt-0.5">
          <button
            onClick={() => setActiveTab('opaska')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'opaska'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calculator className="w-4 h-4" />
            Opaska Domu
          </button>

          <button
            onClick={() => setActiveTab('podjazd')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'podjazd'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Car className="w-4 h-4" />
            Podjazd
          </button>

          <button
            onClick={() => setActiveTab('parking')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'parking'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <SquareParking className="w-4 h-4" />
            Parking
          </button>

          <button
            onClick={() => setActiveTab('ogrodzenie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'ogrodzenie'
                ? 'bg-purple-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shield className="w-4 h-4" />
            Ogrodzenie
          </button>

          <button
            onClick={() => setActiveTab('taras-wykop')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'taras-wykop'
                ? 'bg-amber-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Shovel className="w-4 h-4" />
            Wykop Tarasu
          </button>

          <button
            onClick={() => setActiveTab('zadaszenie')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'zadaszenie'
                ? 'bg-indigo-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Trees className="w-4 h-4" />
            Zadaszenie Drewniane
          </button>

          <button
            onClick={() => setActiveTab('kosztorys')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer ${
              activeTab === 'kosztorys'
                ? 'bg-slate-900 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4 text-emerald-400" />
            Kosztorys & Zakupy
          </button>

          {onOpenAboutModal && (
            <button
              onClick={() => onOpenAboutModal('info')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl transition-all whitespace-nowrap cursor-pointer text-slate-600 hover:text-blue-600 hover:bg-blue-50 border border-slate-200/80 ml-auto"
              title="Informacje o programie, licencja WLDE i regulamin"
            >
              <Info className="w-4 h-4 text-blue-600" />
              <span>O programie & Licencja</span>
            </button>
          )}
        </nav>
      </div>
    </header>
  );
};

