import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Note, NavTab } from '../types';
import Card from '../components/ui/Card';
import { Plus, Trash2, Save, X, ArrowLeft, Loader2 } from 'lucide-react';

interface NotesProps {
  navigate: (tab: NavTab) => void;
}

const Notes: React.FC<NotesProps> = ({ navigate }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentNote, setCurrentNote] = useState<Partial<Note>>({});
  const [loading, setLoading] = useState(true);

  if (!user) return null;

  useEffect(() => {
    loadNotes();
  }, [user.rollNumber]);

  const loadNotes = async () => {
    setLoading(true);
    const data = await api.getNotes(user.rollNumber);
    setNotes(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Delete this note?')) {
      await api.deleteNote(id);
      loadNotes();
    }
  };

  const handleSave = async () => {
    if (!currentNote.title || !currentNote.content) return;
    
    const notePayload: Note = {
      id: currentNote.id || Date.now().toString(),
      userRoll: user.rollNumber,
      title: currentNote.title,
      content: currentNote.content,
      updatedAt: new Date().toISOString()
    };

    await api.saveNote(notePayload);
    setIsEditing(false);
    setCurrentNote({});
    loadNotes();
  };

  const openEditor = (note?: Note) => {
    setCurrentNote(note || { title: '', content: '' });
    setIsEditing(true);
  };

  return (
    <div className="p-4 min-h-full">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(NavTab.HOME)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <h2 className="text-2xl font-bold text-gray-900">My Notes</h2>
        </div>
        <button 
          onClick={() => openEditor()}
          className="bg-blue-900 text-white p-2 rounded-full hover:bg-blue-800 transition-colors shadow-lg shadow-blue-900/20"
        >
          <Plus size={24} />
        </button>
      </div>

      {isEditing ? (
        <Card className="p-4 animate-in slide-in-from-bottom-10 duration-300">
           <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-gray-700">{currentNote.id ? 'Edit Note' : 'New Note'}</h3>
              <button onClick={() => setIsEditing(false)} className="text-gray-400"><X size={20}/></button>
           </div>
           <input 
              className="w-full text-lg font-bold mb-4 border-b border-gray-100 pb-2 focus:outline-none focus:border-blue-500 bg-transparent"
              placeholder="Title"
              value={currentNote.title}
              onChange={e => setCurrentNote({...currentNote, title: e.target.value})}
           />
           <textarea 
              className="w-full h-64 resize-none focus:outline-none bg-transparent text-gray-600 leading-relaxed"
              placeholder="Write your thoughts here..."
              value={currentNote.content}
              onChange={e => setCurrentNote({...currentNote, content: e.target.value})}
           />
           <button 
             onClick={handleSave}
             className="w-full bg-teal-500 text-white py-3 rounded-xl font-bold mt-4 flex items-center justify-center gap-2 hover:bg-teal-600 transition-colors"
           >
             <Save size={18} /> Save Note
           </button>
        </Card>
      ) : (
        <div className="columns-2 gap-4 space-y-4">
           {loading ? (
             <div className="col-span-2 flex justify-center py-10"><Loader2 className="animate-spin text-blue-500" /></div>
           ) : notes.length === 0 ? (
             <div className="col-span-2 text-center py-10 text-gray-400">
               <p>No notes yet. Tap + to create one.</p>
             </div>
           ) : (
             notes.map(note => (
               <div key={note.id} className="break-inside-avoid">
                 <Card className="p-4 group relative hover:shadow-md transition-shadow bg-yellow-50/50 border-yellow-100">
                   <div onClick={() => openEditor(note)} className="cursor-pointer">
                      <h3 className="font-bold text-gray-800 mb-2 leading-tight">{note.title}</h3>
                      <p className="text-xs text-gray-600 line-clamp-4 leading-relaxed">{note.content}</p>
                      <p className="text-[10px] text-gray-400 mt-3">{new Date(note.updatedAt).toLocaleDateString()}</p>
                   </div>
                   <button 
                     onClick={(e) => { e.stopPropagation(); handleDelete(note.id); }}
                     className="absolute top-2 right-2 p-1.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                   >
                     <Trash2 size={14} />
                   </button>
                 </Card>
               </div>
             ))
           )}
        </div>
      )}
    </div>
  );
};

export default Notes;