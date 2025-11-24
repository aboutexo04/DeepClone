import React from 'react';
import { ViewState } from '../types';
import { BookOpen, Terminal, History, Settings, BrainCircuit, ChevronLeft, ChevronRight } from 'lucide-react';

interface SidebarProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, isCollapsed, onToggleCollapse }) => {
  const menuItems = [
    { id: ViewState.DASHBOARD, label: '커리큘럼', icon: BookOpen },
    { id: ViewState.PRACTICE, label: '실전 연습', icon: Terminal },
    { id: ViewState.HISTORY, label: '학습 기록', icon: History },
    { id: ViewState.SETTINGS, label: '설정', icon: Settings },
  ];

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-64'} bg-gray-900 border-r border-gray-800 flex flex-col h-full flex-shrink-0 transition-all duration-300`}>
      <div className={`${isCollapsed ? 'p-3' : 'p-6'} flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} border-b border-gray-800`}>
        <div className="p-2 bg-indigo-600 rounded-lg">
          <BrainCircuit className="w-6 h-6 text-white" />
        </div>
        {!isCollapsed && (
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">DeepClone</h1>
            <p className="text-xs text-gray-400">AI Coding Tutor</p>
          </div>
        )}
      </div>

      <nav className={`flex-1 ${isCollapsed ? 'px-2' : 'px-4'} py-6 space-y-2`}>
        {menuItems.map((item) => {
          const isActive = currentView === item.id;
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'space-x-3'} ${isCollapsed ? 'px-2' : 'px-4'} py-3 rounded-xl transition-all duration-200 group ${
                isActive
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/20 shadow-lg shadow-indigo-900/20'
                  : 'text-gray-400 hover:bg-gray-800 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 flex-shrink-0 ${isActive ? 'text-indigo-400' : 'text-gray-500 group-hover:text-white'}`} />
              {!isCollapsed && <span className="font-medium">{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {!isCollapsed && (
        <div className="p-4 border-t border-gray-800">
          <div className="bg-gray-800 rounded-xl p-4">
            <p className="text-xs text-gray-400 mb-2">일일 목표 (Daily Goal)</p>
            <div className="w-full bg-gray-700 h-2 rounded-full overflow-hidden">
              <div className="bg-green-500 h-full w-[0%] rounded-full"></div>
            </div>
            <div className="flex justify-between mt-2 text-xs text-gray-300">
              <span>0/100 스니펫</span>
              <span>0%</span>
            </div>
          </div>
        </div>
      )}

      <button
        onClick={onToggleCollapse}
        className="p-3 border-t border-gray-800 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 transition-colors"
        title={isCollapsed ? '메뉴 펼치기' : '메뉴 접기'}
      >
        {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
      </button>
    </div>
  );
};

export default Sidebar;