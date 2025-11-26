import React from 'react';
import { Mission } from '../types';
import { Lock, CheckCircle, Star } from 'lucide-react';

interface MissionCardProps {
  mission: Mission;
  onClick: (mission: Mission) => void;
}

export const MissionCard: React.FC<MissionCardProps> = ({ mission, onClick }) => {
  return (
    <button
      onClick={() => !mission.isLocked && onClick(mission)}
      disabled={mission.isLocked && !mission.isCompleted}
      className={`
        relative group w-full p-4 rounded-3xl transition-all duration-300 transform hover:-translate-y-2
        flex flex-col items-center justify-between min-h-[160px] text-center border-b-8
        ${mission.isCompleted 
          ? 'bg-green-100 border-green-400 text-green-800' 
          : mission.isLocked 
            ? 'bg-gray-100 border-gray-300 text-gray-400 cursor-not-allowed' 
            : 'bg-white border-pixar-orange text-orange-900 shadow-xl hover:shadow-2xl hover:bg-orange-50'
        }
      `}
    >
      {mission.isCompleted && (
        <div className="absolute top-2 right-2 text-green-500">
          <CheckCircle size={24} fill="white" />
        </div>
      )}
      
      <div className={`
        p-3 rounded-full mb-3 
        ${mission.isLocked ? 'bg-gray-200' : 'bg-orange-100'}
      `}>
         {/* Simple icon mapping based on mission iconName */}
         {mission.iconName === 'temple' && <span className="text-3xl">🏛️</span>}
         {mission.iconName === 'pyramid' && <span className="text-3xl">🏜️</span>}
         {mission.iconName === 'scroll' && <span className="text-3xl">📜</span>}
         {mission.iconName === 'helmet' && <span className="text-3xl">⚔️</span>}
         {mission.iconName === 'vase' && <span className="text-3xl">🏺</span>}
         {mission.iconName === 'wonder' && <span className="text-3xl">🗿</span>}
      </div>

      <h3 className="font-bold text-lg leading-tight mb-1">{mission.title}</h3>
      <p className="text-xs opacity-80">{mission.topic}</p>
      
      {mission.isLocked && !mission.isCompleted && (
        <div className="absolute inset-0 bg-gray-50/50 backdrop-blur-[1px] rounded-3xl flex items-center justify-center">
          <Lock className="text-gray-400" size={32} />
        </div>
      )}
    </button>
  );
};