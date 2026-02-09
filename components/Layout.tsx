import React from 'react';
import { Home, MessageCircle, Book, Edit3, User } from 'lucide-react';
import { NavTab } from '../types';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ activeTab, setActiveTab, children }) => {
  const { user } = useAuth();

  const navItems = [
    { id: NavTab.HOME, icon: Home, label: 'Home' },
    { id: NavTab.RESOURCES, icon: Book, label: 'Resources' },
    { id: NavTab.CHAT, icon: MessageCircle, label: 'Chat' },
    { id: NavTab.NOTES, icon: Edit3, label: 'Notes' },
    { id: NavTab.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="h-[100dvh] bg-[#F5F7FA] flex flex-col max-w-md mx-auto relative shadow-2xl overflow-hidden font-sans">
      {/* Content Area */}
      <main className="flex-1 overflow-y-auto pb-24 scroll-smooth w-full relative">
        {children}
      </main>

      {/* Bottom Navigation */}
      {user && (
        <div className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-sm border-t border-gray-100 px-2 py-2 flex justify-around items-center z-50 rounded-t-2xl shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center justify-center gap-1 transition-all duration-200 flex-1 py-2 rounded-xl active:scale-95 touch-manipulation cursor-pointer ${
                  isActive ? 'text-blue-900 bg-blue-50/50' : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
              >
                <div className={`p-1.5 rounded-full transition-all ${isActive ? 'bg-blue-100/50' : 'bg-transparent'}`}>
                  <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                </div>
                <span className={`text-[10px] font-medium tracking-wide ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Layout;