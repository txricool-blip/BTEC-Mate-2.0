import React from 'react';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { Book, MessageCircle, Edit3, Bell, Phone, MapPin, AlertTriangle } from 'lucide-react';
import Card from '../components/ui/Card';
import { NavTab } from '../types';

interface HomeProps {
  navigate: (tab: NavTab) => void;
}

const Home: React.FC<HomeProps> = ({ navigate }) => {
  const { user } = useAuth();
  
  if (!user) return null;

  const attendanceData = [
    { name: 'Present', value: user.attendancePercent },
    { name: 'Absent', value: 100 - user.attendancePercent }
  ];

  const COLORS = user.attendancePercent >= 75 ? ['#10B981', '#E2E8F0'] : ['#EF4444', '#E2E8F0'];

  const quickActions = [
    { icon: Book, label: 'PDF Library', action: () => navigate(NavTab.RESOURCES), color: 'bg-blue-100 text-blue-600' },
    { icon: MessageCircle, label: 'Batch Chat', action: () => navigate(NavTab.CHAT), color: 'bg-indigo-100 text-indigo-600' },
    { icon: Edit3, label: 'My Notes', action: () => navigate(NavTab.NOTES), color: 'bg-purple-100 text-purple-600' },
    { icon: Bell, label: 'Notices', action: () => alert('No new notices'), color: 'bg-orange-100 text-orange-600', hasBadge: true }
  ];

  return (
    <div className="p-4 space-y-6 animate-in fade-in duration-500">
      
      {/* Profile Header */}
      <div className="relative pt-4">
        <Card className="p-6 bg-gradient-to-br from-blue-900 to-indigo-900 text-white shadow-blue-900/20 shadow-xl border-none overflow-visible">
          <div className="flex items-start justify-between">
            <div className="flex gap-4 items-center">
              <div className="relative">
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  className="w-16 h-16 rounded-full border-2 border-white/30 object-cover bg-white/10"
                />
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-400 rounded-full border-2 border-blue-900"></div>
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold truncate">{user.fullName}</h2>
                <p className="text-blue-200 text-sm font-mono">{user.rollNumber}</p>
                <div className="flex gap-2 mt-2">
                   <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] uppercase font-bold tracking-wider">
                    {user.department}
                   </span>
                   <span className="px-2 py-0.5 bg-white/20 rounded text-[10px] uppercase font-bold tracking-wider">
                    {user.batch}
                   </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Stats Row */}
          <div className="mt-8 flex justify-between items-end">
             <div className="flex flex-col">
                <span className="text-blue-200 text-xs mb-1">Current CGPA</span>
                <div className="flex items-center gap-1">
                  <span className="text-2xl font-bold text-yellow-400">⭐ {user.cgpa.toFixed(2)}</span>
                </div>
             </div>
             
             <div className="flex items-center gap-3 bg-white/10 p-2 rounded-xl pr-4">
                <div className="w-12 h-12 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={attendanceData}
                        innerRadius={16}
                        outerRadius={22}
                        paddingAngle={0}
                        dataKey="value"
                        startAngle={90}
                        endAngle={-270}
                        stroke="none"
                      >
                        {attendanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center text-[10px] font-bold">
                    {user.attendancePercent}%
                  </div>
                </div>
                <div className="flex flex-col">
                    <span className="text-xs font-semibold">Attendance</span>
                    <span className="text-[10px] text-blue-200">Keep it up!</span>
                </div>
             </div>
          </div>

          {/* Failed Subjects Warning */}
          {user.failedSubjects && user.failedSubjects.length > 0 && (
            <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-lg p-2 flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-300" />
              <span className="text-xs text-white">Retake required: {user.failedSubjects.join(', ')}</span>
            </div>
          )}
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-4">
        {quickActions.map((item, idx) => (
          <button 
            key={idx}
            onClick={item.action}
            className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center gap-3 transition-transform active:scale-95 relative"
          >
            {item.hasBadge && (
               <span className="absolute top-3 right-3 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white"></span>
            )}
            <div className={`p-3 rounded-xl ${item.color}`}>
              <item.icon size={24} />
            </div>
            <span className="font-semibold text-gray-700 text-sm">{item.label}</span>
          </button>
        ))}
      </div>

      {/* Today's Classes (Mock) */}
      <div className="space-y-3 pb-6">
        <h3 className="font-bold text-gray-800 text-lg px-1">Upcoming Classes</h3>
        <Card className="p-4 flex gap-4 items-center">
           <div className="flex flex-col items-center justify-center bg-blue-50 w-14 h-14 rounded-xl text-blue-800">
              <span className="text-xs font-bold">10:00</span>
              <span className="text-[10px] uppercase">AM</span>
           </div>
           <div className="flex-1">
              <h4 className="font-bold text-gray-800">Data Structures</h4>
              <p className="text-xs text-gray-500">Room 402 • Prof. Rahman</p>
           </div>
           <div className="bg-gray-100 p-2 rounded-full">
              <MapPin size={18} className="text-gray-400" />
           </div>
        </Card>
        <Card className="p-4 flex gap-4 items-center opacity-60">
           <div className="flex flex-col items-center justify-center bg-gray-50 w-14 h-14 rounded-xl text-gray-800">
              <span className="text-xs font-bold">12:30</span>
              <span className="text-[10px] uppercase">PM</span>
           </div>
           <div className="flex-1">
              <h4 className="font-bold text-gray-800">Digital Logic</h4>
              <p className="text-xs text-gray-500">Lab 2 • Engr. Hasan</p>
           </div>
        </Card>
      </div>
    </div>
  );
};

export default Home;