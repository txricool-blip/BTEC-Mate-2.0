import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { DEPARTMENTS } from '../constants';
import { PDFResource, UserRole, NavTab } from '../types';
import Card from '../components/ui/Card';
import { Folder, FileText, ChevronRight, ArrowLeft, Plus, ExternalLink, Loader2 } from 'lucide-react';
import Button from '../components/ui/Button';

// Navigation steps
enum Step {
  LEVEL,
  TERM,
  DEPT,
  SUBJECTS
}

interface ResourcesProps {
  navigate: (tab: NavTab) => void;
}

const Resources: React.FC<ResourcesProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [step, setStep] = useState<Step>(Step.LEVEL);
  
  // Selection State
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const [selectedTerm, setSelectedTerm] = useState<number | null>(null);
  const [selectedDept, setSelectedDept] = useState<string | null>(null);
  
  // Data State
  const [resources, setResources] = useState<PDFResource[]>([]);
  const [loading, setLoading] = useState(false);

  // For Adding New Resource
  const [isAdding, setIsAdding] = useState(false);
  const [newSubject, setNewSubject] = useState('');
  const [newLink, setNewLink] = useState('');

  if (!user) return null;

  const canAdd = user.role === UserRole.ADMIN || user.role === UserRole.CR;

  useEffect(() => {
    if (step === Step.SUBJECTS && selectedLevel && selectedTerm && selectedDept) {
      loadResources();
    }
  }, [step, selectedLevel, selectedTerm, selectedDept]);

  const loadResources = async () => {
    setLoading(true);
    const data = await api.getResources(selectedLevel!, selectedTerm!, selectedDept!);
    setResources(data);
    setLoading(false);
  };

  const handleBack = () => {
    if (step === Step.SUBJECTS) setStep(Step.DEPT);
    else if (step === Step.DEPT) setStep(Step.TERM);
    else if (step === Step.TERM) setStep(Step.LEVEL);
    else if (step === Step.LEVEL) navigate(NavTab.HOME);
  };

  const handleAddResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject || !newLink) return;

    const newRes: PDFResource = {
      id: Date.now().toString(),
      level: selectedLevel!,
      term: selectedTerm!,
      department: selectedDept!,
      subjectName: newSubject,
      driveLink: newLink,
      addedBy: user.rollNumber
    };

    await api.addResource(newRes);
    setIsAdding(false);
    setNewSubject('');
    setNewLink('');
    loadResources();
  };

  // Render Functions for each step
  const renderLevelSelect = () => (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(lvl => (
        <Card 
          key={lvl} 
          className="p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          onClick={() => { setSelectedLevel(lvl); setStep(Step.TERM); }}
        >
          <div className="bg-blue-100 p-3 rounded-full text-blue-600">
            <Folder size={24} />
          </div>
          <span className="font-bold text-gray-800">Level {lvl}</span>
        </Card>
      ))}
    </div>
  );

  const renderTermSelect = () => (
    <div className="grid grid-cols-2 gap-4">
      {[1, 2].map(term => (
        <Card 
          key={term} 
          className="p-6 flex flex-col items-center justify-center gap-2 hover:border-blue-500 hover:bg-blue-50 transition-colors"
          onClick={() => { setSelectedTerm(term); setStep(Step.DEPT); }}
        >
          <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
            <Folder size={24} />
          </div>
          <span className="font-bold text-gray-800">Term {term}</span>
        </Card>
      ))}
    </div>
  );

  const renderDeptSelect = () => (
    <div className="space-y-3">
      {DEPARTMENTS.map(dept => (
        <Card 
          key={dept} 
          className="p-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
          onClick={() => { setSelectedDept(dept); setStep(Step.SUBJECTS); }}
        >
          <div className="flex items-center gap-3">
            <div className="bg-purple-100 p-2 rounded-lg text-purple-600">
               <Folder size={20} />
            </div>
            <span className="font-bold text-gray-800">{dept} Department</span>
          </div>
          <ChevronRight size={20} className="text-gray-400" />
        </Card>
      ))}
    </div>
  );

  const renderSubjectList = () => (
    <div className="space-y-4">
      {/* List Header */}
      <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 mb-4">
         <h3 className="text-sm font-bold text-blue-900 uppercase tracking-wide">
            L{selectedLevel} T{selectedTerm} • {selectedDept}
         </h3>
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
      ) : resources.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
           <Folder size={48} className="mx-auto mb-2 opacity-50" />
           <p>No resources found in this folder.</p>
        </div>
      ) : (
        resources.map(res => (
          <Card key={res.id} className="p-4 group">
            <div className="flex justify-between items-start">
              <div className="flex gap-3">
                 <div className="bg-red-50 p-2.5 rounded-lg text-red-500 h-fit">
                    <FileText size={20} />
                 </div>
                 <div>
                    <h4 className="font-bold text-gray-800">{res.subjectName}</h4>
                    <p className="text-xs text-gray-500 mt-1">Google Drive Folder</p>
                 </div>
              </div>
              <a 
                href={res.driveLink} 
                target="_blank" 
                rel="noreferrer"
                className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
              >
                <ExternalLink size={20} />
              </a>
            </div>
          </Card>
        ))
      )}
      
      {/* Floating Action Button for CR/Admin */}
      {canAdd && (
        <button 
          onClick={() => setIsAdding(true)}
          className="fixed bottom-24 right-6 bg-blue-900 text-white p-4 rounded-full shadow-lg shadow-blue-900/40 hover:scale-110 transition-transform z-10"
        >
          <Plus size={24} />
        </button>
      )}

      {/* Add Modal */}
      {isAdding && (
         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-sm p-6 animate-in zoom-in-95 duration-200">
               <h3 className="font-bold text-lg mb-4">Add Resource</h3>
               <form onSubmit={handleAddResource} className="space-y-3">
                  <input 
                    className="w-full border p-3 rounded-xl bg-gray-50 text-sm"
                    placeholder="Subject Name"
                    value={newSubject}
                    onChange={e => setNewSubject(e.target.value)}
                    required
                  />
                  <input 
                    className="w-full border p-3 rounded-xl bg-gray-50 text-sm"
                    placeholder="Drive Link (https://...)"
                    value={newLink}
                    onChange={e => setNewLink(e.target.value)}
                    required
                  />
                  <div className="flex gap-2 mt-4">
                     <Button type="button" variant="ghost" onClick={() => setIsAdding(false)} className="flex-1">Cancel</Button>
                     <Button type="submit" className="flex-1">Add</Button>
                  </div>
               </form>
            </Card>
         </div>
      )}
    </div>
  );

  return (
    <div className="p-4 min-h-full">
      {/* Header with Back Button */}
      <div className="flex items-center gap-2 mb-6">
        <button onClick={handleBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-gray-600" />
        </button>
        <h2 className="text-xl font-bold text-gray-900">
          {step === Step.LEVEL && 'Select Level'}
          {step === Step.TERM && 'Select Term'}
          {step === Step.DEPT && 'Select Department'}
          {step === Step.SUBJECTS && 'Library'}
        </h2>
      </div>

      <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
        {step === Step.LEVEL && renderLevelSelect()}
        {step === Step.TERM && renderTermSelect()}
        {step === Step.DEPT && renderDeptSelect()}
        {step === Step.SUBJECTS && renderSubjectList()}
      </div>
    </div>
  );
};

export default Resources;