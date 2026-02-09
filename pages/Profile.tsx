import React, { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { NavTab } from '../types';
import { LogOut, User, Phone, Award, Grid, AlertTriangle, Edit2, Camera, Save, X, Upload, ArrowLeft } from 'lucide-react';

interface ProfileProps {
  navigate: (tab: NavTab) => void;
}

const Profile: React.FC<ProfileProps> = ({ navigate }) => {
  const { user, logout, updateProfile, isLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Local form state
  const [editForm, setEditForm] = useState({
    phoneNumber: '',
    profileImageUrl: '',
    batch: ''
  });

  if (!user) return null;

  const startEditing = () => {
    setEditForm({
      phoneNumber: user.phoneNumber || '',
      profileImageUrl: user.profileImageUrl || '',
      batch: user.batch
    });
    setIsEditing(true);
  };

  const handleSave = async () => {
    await updateProfile(editForm);
    setIsEditing(false);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (limit to ~2MB to prevent LocalStorage quota issues in this mock app)
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size too large. Please select an image under 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setEditForm(prev => ({ ...prev, profileImageUrl: reader.result as string }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    if (isEditing && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="p-4 space-y-4 pb-20">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
         <button onClick={() => navigate(NavTab.HOME)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
         </button>

        {!isEditing ? (
          <button 
            onClick={startEditing}
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg hover:bg-blue-100 transition-colors"
          >
            <Edit2 size={16} /> Edit Profile
          </button>
        ) : (
          <div className="flex gap-2">
            <button 
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-2 text-sm font-semibold text-gray-600 bg-gray-100 px-3 py-1.5 rounded-lg hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              <X size={16} /> Cancel
            </button>
            <button 
              onClick={handleSave}
              className="flex items-center gap-2 text-sm font-semibold text-white bg-green-600 px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors shadow-sm"
              disabled={isLoading}
            >
              {isLoading ? 'Saving...' : <><Save size={16} /> Save</>}
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-col items-center py-4">
        {/* Hidden File Input */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleImageUpload}
        />

        <div 
          className={`relative group ${isEditing ? 'cursor-pointer' : ''}`}
          onClick={triggerFileInput}
        >
          <div className={`w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-xl mb-4 bg-gray-100 relative ${isEditing ? 'ring-4 ring-blue-100' : ''}`}>
            <img 
              src={isEditing ? (editForm.profileImageUrl || user.profileImageUrl) : user.profileImageUrl} 
              alt="Profile" 
              className={`w-full h-full object-cover transition-opacity ${isEditing ? 'group-hover:opacity-70' : ''}`}
              onError={(e) => { e.currentTarget.src = 'https://api.dicebear.com/7.x/avataaars/svg?seed=fallback'; }}
            />
            
            {/* Overlay for Edit Mode */}
            {isEditing && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="text-white" size={24} />
              </div>
            )}
          </div>

          {/* Camera Icon Badge */}
          {isEditing && (
            <div className="absolute bottom-4 right-0 bg-blue-600 text-white p-2 rounded-full shadow-lg border-2 border-white animate-bounce-short">
              <Camera size={16} />
            </div>
          )}
        </div>

        {isEditing && (
           <div className="mb-4 text-center animate-in fade-in slide-in-from-top-2">
              <p className="text-xs font-semibold text-blue-600">Tap image to upload photo</p>
           </div>
        )}

        <h2 className="text-2xl font-bold text-gray-900 text-center">{user.fullName}</h2>
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1 rounded-full mt-2 uppercase tracking-wide">
          {user.role}
        </span>
      </div>

      {user.failedSubjects && user.failedSubjects.length > 0 && (
         <Card className="p-4 bg-red-50 border-red-100">
            <div className="flex items-start gap-3">
               <div className="bg-red-100 p-2 rounded-lg text-red-500">
                  <AlertTriangle size={20} />
               </div>
               <div>
                  <h3 className="font-bold text-red-700">Academic Alert</h3>
                  <p className="text-sm text-red-600 mt-1">
                     You have failed subjects in the last term: <br/>
                     <span className="font-semibold">{user.failedSubjects.join(', ')}</span>
                  </p>
               </div>
            </div>
         </Card>
      )}

      <Card className="p-0 overflow-hidden divide-y divide-gray-100">
         <div className="p-4 flex items-center gap-4">
            <div className="bg-gray-50 p-2 rounded-full text-gray-500"><User size={20} /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Roll Number</p>
              <p className="font-medium text-gray-900">{user.rollNumber}</p>
            </div>
         </div>
         <div className="p-4 flex items-center gap-4">
            <div className="bg-gray-50 p-2 rounded-full text-gray-500"><Grid size={20} /></div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase font-bold">Batch & Dept</p>
              {isEditing ? (
                 <div className="flex gap-2 mt-1">
                   <select
                      value={editForm.batch}
                      onChange={(e) => setEditForm({...editForm, batch: e.target.value})}
                      className="flex-1 px-3 py-1.5 text-sm bg-gray-50 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   >
                      <option value="12th Batch">12th Batch</option>
                      <option value="13th Batch">13th Batch</option>
                      <option value="14th Batch">14th Batch</option>
                      <option value="15th Batch">15th Batch</option>
                   </select>
                   <div className="px-3 py-1.5 text-sm bg-gray-100 border border-gray-200 rounded-lg text-gray-500 flex items-center whitespace-nowrap">
                     {user.department}
                   </div>
                 </div>
              ) : (
                <p className="font-medium text-gray-900">{user.batch} • {user.department}</p>
              )}
            </div>
         </div>
         <div className="p-4 flex items-center gap-4">
            <div className="bg-gray-50 p-2 rounded-full text-gray-500"><Phone size={20} /></div>
            <div className="flex-1">
              <p className="text-xs text-gray-400 uppercase font-bold">Phone</p>
              {isEditing ? (
                 <input 
                    type="tel"
                    value={editForm.phoneNumber}
                    onChange={(e) => setEditForm({...editForm, phoneNumber: e.target.value})}
                    placeholder="017..."
                    className="w-full mt-1 px-3 py-1.5 text-sm bg-gray-50 border border-blue-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    autoFocus
                 />
              ) : (
                 <p className="font-medium text-gray-900">{user.phoneNumber || <span className="text-gray-400 italic">Not set</span>}</p>
              )}
            </div>
         </div>
         <div className="p-4 flex items-center gap-4">
            <div className="bg-gray-50 p-2 rounded-full text-gray-500"><Award size={20} /></div>
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Current Standing</p>
              <p className="font-medium text-gray-900">Level {user.level}, Term {user.term}</p>
            </div>
         </div>
      </Card>

      {!isEditing && (
        <>
          <Button variant="danger" fullWidth onClick={logout} className="mt-8 flex items-center justify-center gap-2">
            <LogOut size={18} /> Logout
          </Button>
          
          <p className="text-center text-xs text-gray-300 mt-8">Version 1.0.0 • BTEC Inc.</p>
        </>
      )}
    </div>
  );
};

export default Profile;