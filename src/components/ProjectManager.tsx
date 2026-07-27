import React, { useState, useRef } from 'react';
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
  CustomPreset,
} from '../types';
import { PRESETS } from '../data/defaults';
import {
  FolderOpen,
  Save,
  Plus,
  Copy,
  Trash2,
  Edit3,
  Download,
  Upload,
  Check,
  BookOpen,
  X,
  FileText,
  Clock,
  Calculator,
  Car,
  SquareParking,
  Shield,
  Shovel,
  Trees,
  CheckSquare,
  Square,
  Sparkles,
  Layers,
} from 'lucide-react';

interface ProjectManagerProps {
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
}

const MODULE_CONFIGS: {
  key: ProjectModuleKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  accentColor: string;
}[] = [
  {
    key: 'houseBand',
    label: 'Opaska wokół domu',
    description: 'Płyty/kostka/żwir, obrzeża, tłuczeń i podsypka cementowa',
    icon: Calculator,
    accentColor: 'border-slate-800 text-slate-800 bg-slate-50',
  },
  {
    key: 'driveway',
    label: 'Podjazd do garażu',
    description: 'Kostka 8cm, krawężniki drogowe, podbudowa pod obciążenia',
    icon: Car,
    accentColor: 'border-blue-600 text-blue-700 bg-blue-50/80',
  },
  {
    key: 'parking',
    label: 'Miejsca parkingowe',
    description: 'Płyty ażurowe eko, krawężniki, odbojniki i podbudowa',
    icon: SquareParking,
    accentColor: 'border-emerald-600 text-emerald-700 bg-emerald-50/80',
  },
  {
    key: 'fence',
    label: 'Ogrodzenie posesji',
    description: 'Panele 3D/2D, słupki, podmurówka, furtki i bramy',
    icon: Shield,
    accentColor: 'border-purple-600 text-purple-700 bg-purple-50/80',
  },
  {
    key: 'terraceFoundation',
    label: 'Wykop i podbudowa pod taras',
    description: 'Wykop masowy, korytowanie, tłuczeń, grysik i geowłóknina',
    icon: Shovel,
    accentColor: 'border-amber-600 text-amber-700 bg-amber-50/80',
  },
  {
    key: 'woodenRoof',
    label: 'Zadaszenie drewniane',
    description: 'Konstrukcja C24/BSH, krokwie, pokrycie poliwęglanem',
    icon: Trees,
    accentColor: 'border-indigo-600 text-indigo-700 bg-indigo-50/80',
  },
];

export const ProjectManager: React.FC<ProjectManagerProps> = ({
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
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveSuccessToast, setSaveSuccessToast] = useState(false);
  const [showSaveAsInput, setShowSaveAsInput] = useState(false);
  const [saveAsName, setSaveAsName] = useState('');
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editNameValue, setEditNameValue] = useState('');

  // NEW PROJECT CREATION STATE
  const [showNewProjectModal, setShowNewProjectModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState('Nowy Projekt');
  const [selectedModulesForNew, setSelectedModulesForNew] = useState<ProjectModuleKey[]>([
    'houseBand',
    'driveway',
    'parking',
    'fence',
    'terraceFoundation',
    'woodenRoof',
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const handleQuickSave = () => {
    onSaveCurrentProject();
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  const handleOpenNewProjectModal = () => {
    setNewProjectName(`Projekt ${projects.length + 1}`);
    setSelectedModulesForNew([
      'houseBand',
      'driveway',
      'parking',
      'fence',
      'terraceFoundation',
      'woodenRoof',
    ]);
    setShowNewProjectModal(true);
  };

  const toggleModuleSelection = (key: ProjectModuleKey) => {
    if (selectedModulesForNew.includes(key)) {
      setSelectedModulesForNew(selectedModulesForNew.filter((k) => k !== key));
    } else {
      setSelectedModulesForNew([...selectedModulesForNew, key]);
    }
  };

  const handleCreateNewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProjectName.trim()) return;
    if (selectedModulesForNew.length === 0) {
      alert('Zaznacz co najmniej jeden element do zaprojektowania.');
      return;
    }
    onCreateNewProject(newProjectName.trim(), selectedModulesForNew);
    setShowNewProjectModal(false);
    setIsModalOpen(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  const handleSaveAsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!saveAsName.trim()) return;
    onSaveAsNewProject(saveAsName.trim());
    setSaveAsName('');
    setShowSaveAsInput(false);
    setSaveSuccessToast(true);
    setTimeout(() => setSaveSuccessToast(false), 2000);
  };

  const handleStartRename = (project: SavedProject) => {
    setEditingProjectId(project.id);
    setEditNameValue(project.name);
  };

  const handleSaveRename = (id: string) => {
    if (editNameValue.trim()) {
      onRenameProject(id, editNameValue.trim());
    }
    setEditingProjectId(null);
  };

  const handleExportJSON = (project: SavedProject) => {
    const isCurrentActive = project.id === activeProjectId;
    const projectToExport: SavedProject = isCurrentActive
      ? {
          ...project,
          houseBand: currentBandParams,
          terraceFoundation: currentTerraceParams,
          woodenRoof: currentRoofParams,
          driveway: currentDrivewayParams || project.driveway,
          parking: currentParkingParams || project.parking,
          fence: currentFenceParams || project.fence,
          priceList: currentPriceList,
          updatedAt: new Date().toISOString(),
        }
      : project;

    const jsonString = JSON.stringify(projectToExport, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchor = document.createElement('a');
    downloadAnchor.href = url;
    downloadAnchor.download = `${projectToExport.name.replace(/[^a-z0-9]/gi, '_')}_projekt.json`;
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    document.body.removeChild(downloadAnchor);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        onImportProjectJSON(content);
        setSaveSuccessToast(true);
        setTimeout(() => setSaveSuccessToast(false), 2000);
      }
    };
    reader.readAsText(file);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* ACTIVE PROJECT DROPDOWN & STATUS */}
      <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200">
        <FolderOpen className="w-4 h-4 text-blue-600 ml-1" />
        <span className="text-xs font-semibold text-slate-600 hidden sm:inline">Projekt:</span>

        <select
          value={activeProjectId}
          onChange={(e) => {
            const found = projects.find((p) => p.id === e.target.value);
            if (found) onSelectProject(found);
          }}
          className="bg-white text-slate-800 text-xs font-bold rounded-lg px-2.5 py-1.5 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer max-w-[180px] sm:max-w-[220px] truncate shadow-2xs"
        >
          {projects.map((proj) => (
            <option key={proj.id} value={proj.id}>
              {proj.name}
            </option>
          ))}
        </select>

        {/* BUTTON: NOWY PROJEKT */}
        <button
          type="button"
          onClick={handleOpenNewProjectModal}
          title="Stwórz nowy czysty projekt z wybranym zakresem prac"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Nowy Projekt</span>
        </button>

        {/* QUICK SAVE BUTTON */}
        <button
          type="button"
          onClick={handleQuickSave}
          title="Zapisz aktualne parametry w tym projekcie"
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
            saveSuccessToast
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-slate-800 hover:bg-slate-900 text-white shadow-2xs'
          }`}
        >
          {saveSuccessToast ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
          <span className="hidden sm:inline">{saveSuccessToast ? 'Zapisano!' : 'Zapisz'}</span>
        </button>

        {/* QUICK EXPORT JSON BUTTON */}
        <button
          type="button"
          onClick={() => activeProject && handleExportJSON(activeProject)}
          title="Eksportuj obecny projekt do pliku JSON"
          className="flex items-center gap-1.5 px-2.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg text-xs font-bold transition cursor-pointer shadow-2xs"
        >
          <Download className="w-3.5 h-3.5" />
          <span className="hidden md:inline">JSON</span>
        </button>

        {/* MANAGE PROJECTS MODAL TRIGGER */}
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          title="Otwórz menedżer wszystkich projektów"
          className="bg-white hover:bg-slate-50 text-slate-700 p-1.5 rounded-lg border border-slate-200 text-xs font-medium cursor-pointer shadow-2xs"
        >
          <FolderOpen className="w-4 h-4 text-slate-600" />
        </button>
      </div>

      {/* DEDICATED MODAL: NOWY PROJEKT Z WYBOREM ELEMENTÓW */}
      {showNewProjectModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* HEADER */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-blue-600 text-white rounded-xl">
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base">Nowy Projekt Budowlany</h3>
                  <p className="text-xs text-slate-300">Zaznacz elementy do zaprojektowania (czyste wartości startowe)</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowNewProjectModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* BODY FORM */}
            <form onSubmit={handleCreateNewSubmit} className="p-6 overflow-y-auto space-y-5 flex-1 text-slate-800">
              
              {/* INPUT NAZWA */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Nazwa Nowego Projektu:
                </label>
                <input
                  type="text"
                  placeholder="np. Podjazd i Ogrodzenie - Posesja..."
                  value={newProjectName}
                  onChange={(e) => setNewProjectName(e.target.value)}
                  autoFocus
                  className="w-full bg-slate-50 border border-slate-300 focus:bg-white rounded-xl px-3.5 py-2.5 text-sm font-bold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none transition shadow-2xs"
                />
              </div>

              {/* PRESET COMBINATIONS & SELECT ALL/NONE */}
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-blue-600" />
                    Szybki Wybór Zakresu Prac:
                  </span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedModulesForNew([
                        'houseBand',
                        'driveway',
                        'parking',
                        'fence',
                        'terraceFoundation',
                        'woodenRoof',
                      ])}
                      className="text-[11px] font-bold text-blue-600 hover:text-blue-800 hover:underline cursor-pointer"
                    >
                      Zaznacz wszystkie
                    </button>
                    <span className="text-slate-300">•</span>
                    <button
                      type="button"
                      onClick={() => setSelectedModulesForNew([])}
                      className="text-[11px] font-bold text-slate-500 hover:text-slate-700 hover:underline cursor-pointer"
                    >
                      Odznacz wszystkie
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    type="button"
                    onClick={() => setSelectedModulesForNew(['houseBand', 'driveway'])}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer border border-slate-200"
                  >
                    Opaska + Podjazd
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModulesForNew(['terraceFoundation', 'woodenRoof'])}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer border border-slate-200"
                  >
                    Taras + Zadaszenie
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModulesForNew(['fence', 'driveway'])}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer border border-slate-200"
                  >
                    Ogrodzenie + Podjazd
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedModulesForNew(['driveway', 'parking'])}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-lg transition cursor-pointer border border-slate-200"
                  >
                    Podjazd + Parking
                  </button>
                </div>
              </div>

              {/* GRID OF MODULE CARDS */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Zaznacz elementy budowlane, które projektujesz:
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {MODULE_CONFIGS.map((mod) => {
                    const isSelected = selectedModulesForNew.includes(mod.key);
                    const IconComp = mod.icon;

                    return (
                      <div
                        key={mod.key}
                        onClick={() => toggleModuleSelection(mod.key)}
                        className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex items-start gap-3 relative ${
                          isSelected
                            ? 'bg-blue-50/70 border-blue-600 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300 opacity-60 hover:opacity-100'
                        }`}
                      >
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          <IconComp className="w-5 h-5" />
                        </div>

                        <div className="flex-1 min-w-0 pr-6">
                          <div className="font-bold text-xs text-slate-900 leading-snug">{mod.label}</div>
                          <div className="text-[11px] text-slate-500 mt-0.5 leading-snug">{mod.description}</div>
                        </div>

                        <div className="absolute top-3.5 right-3.5">
                          {isSelected ? (
                            <CheckSquare className="w-5 h-5 text-blue-600" />
                          ) : (
                            <Square className="w-5 h-5 text-slate-300" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* NOTICE ABOUT CLEAN VALUES */}
              <div className="p-3.5 bg-amber-50/80 rounded-xl border border-amber-200 flex items-start gap-2.5 text-xs text-amber-900">
                <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Czysty start:</strong> Nowy projekt zostanie utworzony z <strong>pustymi (wyzerowanymi) wartościami</strong>. Będziesz mógł spokojnie wpisać dokładne wymiary i parametry swoich prac od zera.
                </span>
              </div>

              {/* FOOTER ACTIONS */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewProjectModal(false)}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={!newProjectName.trim() || selectedModulesForNew.length === 0}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Utwórz Projekt ({selectedModulesForNew.length})
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* MODAL FOR MANAGING ALL PROJECTS & PRESETS */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            
            {/* MODAL HEADER */}
            <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <FolderOpen className="w-5 h-5 text-blue-400" />
                <h3 className="font-bold text-base">Zarządzanie Projektami i Szablonami</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-800">
              
              {/* ACTION BUTTONS ROW */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5">
                <button
                  onClick={() => {
                    handleOpenNewProjectModal();
                  }}
                  className="flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-2.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
                >
                  <Plus className="w-4 h-4" />
                  Stwórz Projekt
                </button>

                <button
                  onClick={() => {
                    setShowSaveAsInput(true);
                    setSaveAsName(`${activeProject?.name || 'Projekt'} (kopia)`);
                  }}
                  className="flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-900 text-white font-bold py-2.5 px-2.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
                >
                  <Copy className="w-4 h-4 text-blue-300" />
                  Zapisz Kopię
                </button>

                <button
                  onClick={() => activeProject && handleExportJSON(activeProject)}
                  className="flex items-center justify-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-2.5 px-2.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
                >
                  <Download className="w-4 h-4" />
                  Eksportuj JSON
                </button>

                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center gap-1.5 bg-slate-700 hover:bg-slate-800 text-white font-bold py-2.5 px-2.5 rounded-xl text-xs transition cursor-pointer shadow-2xs"
                >
                  <Upload className="w-4 h-4" />
                  Importuj z JSON
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".json"
                  className="hidden"
                />
              </div>

              {/* INPUT: SAVE AS NEW PROJECT */}
              {showSaveAsInput && (
                <form onSubmit={handleSaveAsSubmit} className="bg-slate-100 p-4 rounded-xl border border-slate-300 space-y-3">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">Zapisz Obecne Parametry Jako Nowy Projekt</h4>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Nazwa kopii..."
                      value={saveAsName}
                      onChange={(e) => setSaveAsName(e.target.value)}
                      autoFocus
                      className="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    />
                    <button
                      type="submit"
                      className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Zapisz Kopię
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowSaveAsInput(false)}
                      className="bg-slate-200 text-slate-700 px-3 py-2 rounded-lg text-xs font-medium cursor-pointer"
                    >
                      Anuluj
                    </button>
                  </div>
                </form>
              )}

              {/* LIST OF SAVED USER PROJECTS */}
              <div>
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 flex items-center justify-between">
                  <span>Moje Zapisane Projekty ({projects.length})</span>
                  <span className="text-[10px] text-slate-400 font-normal">Pamięć przeglądarki (localStorage)</span>
                </h4>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {projects.map((proj) => {
                    const isActive = proj.id === activeProjectId;
                    const isEditing = editingProjectId === proj.id;

                    return (
                      <div
                        key={proj.id}
                        className={`p-3.5 rounded-xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                          isActive
                            ? 'bg-blue-50/80 border-blue-300 shadow-2xs'
                            : 'bg-white border-slate-200 hover:border-slate-300'
                        }`}
                      >
                        {/* LEFT: PROJECT TITLE, MODULE TAGS & DATE */}
                        <div className="flex-1 min-w-0">
                          {isEditing ? (
                            <div className="flex items-center gap-2">
                              <input
                                type="text"
                                value={editNameValue}
                                onChange={(e) => setEditNameValue(e.target.value)}
                                className="bg-white border border-blue-400 rounded px-2 py-1 text-xs font-bold text-slate-800"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveRename(proj.id)}
                                className="bg-blue-600 text-white text-[11px] px-2.5 py-1 rounded font-bold cursor-pointer"
                              >
                                Zapisz
                              </button>
                            </div>
                          ) : (
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-xs text-slate-800 truncate">{proj.name}</span>
                              {isActive && (
                                <span className="text-[10px] bg-blue-600 text-white font-bold px-2 py-0.5 rounded-full">
                                  Aktywny
                                </span>
                              )}
                            </div>
                          )}

                          {/* MODULE TAGS */}
                          <div className="flex flex-wrap gap-1 mt-1.5">
                            {(proj.selectedModules || ['houseBand', 'driveway', 'parking', 'fence', 'terraceFoundation', 'woodenRoof']).map((modKey) => {
                              const mod = MODULE_CONFIGS.find((m) => m.key === modKey);
                              if (!mod) return null;
                              return (
                                <span key={modKey} className="text-[10px] font-semibold bg-white text-slate-600 border border-slate-200 px-1.5 py-0.5 rounded-md">
                                  {mod.label}
                                </span>
                              );
                            })}
                          </div>

                          <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1.5">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              Edycja: {new Date(proj.updatedAt).toLocaleDateString('pl-PL')} {new Date(proj.updatedAt).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>
                        </div>

                        {/* RIGHT: ACTION BUTTONS */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center">
                          {!isActive && (
                            <button
                              onClick={() => {
                                onSelectProject(proj);
                                setIsModalOpen(false);
                              }}
                              className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                            >
                              Otwórz
                            </button>
                          )}

                          <button
                            onClick={() => handleStartRename(proj)}
                            title="Zmień nazwę"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => onDuplicateProject(proj.id)}
                            title="Duplikuj projekt"
                            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg cursor-pointer"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>

                          <button
                            onClick={() => handleExportJSON(proj)}
                            title="Pobierz plik JSON projektu"
                            className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg cursor-pointer"
                          >
                            <Download className="w-3.5 h-3.5" />
                          </button>

                          {projects.length > 1 && (
                            <button
                              onClick={() => {
                                if (confirm(`Czy na pewno chcesz usunąć projekt "${proj.name}"?`)) {
                                  onDeleteProject(proj.id);
                                }
                              }}
                              title="Usuń projekt"
                              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* BUILT-IN TEMPLATES / PRESETS SECTION */}
              <div className="pt-4 border-t border-slate-200">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-600" />
                  Wczytaj Gotowy Szablon Wzorcowy
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        if (confirm(`Czy chcesz wczytać wzorzec "${preset.name}" do obecnego projektu?`)) {
                          onSelectPresetTemplate(preset);
                          setIsModalOpen(false);
                          setSaveSuccessToast(true);
                          setTimeout(() => setSaveSuccessToast(false), 2000);
                        }
                      }}
                      className="text-left bg-slate-50 hover:bg-blue-50/60 border border-slate-200 hover:border-blue-300 p-3 rounded-xl transition cursor-pointer group"
                    >
                      <span className="block text-xs font-bold text-slate-800 group-hover:text-blue-700">
                        {preset.name}
                      </span>
                      <span className="block text-[11px] text-slate-500 mt-1 leading-snug">
                        {preset.description}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* MODAL FOOTER */}
            <div className="px-6 py-3 bg-slate-50 border-t border-slate-200 text-right">
              <button
                onClick={() => setIsModalOpen(false)}
                className="bg-slate-800 text-white font-bold px-4 py-2 rounded-xl text-xs hover:bg-slate-900 transition cursor-pointer"
              >
                Zamknij
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
