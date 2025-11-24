import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import PracticeArea from './components/PracticeArea';
import Dashboard from './components/Dashboard';
import { ViewState, Difficulty } from './types';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewState>(ViewState.DASHBOARD);
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.BEGINNER);

  const handleStartPractice = (level: Difficulty) => {
    setSelectedDifficulty(level);
    setCurrentView(ViewState.PRACTICE);
  };

  const renderContent = () => {
    switch (currentView) {
      case ViewState.DASHBOARD:
        return <Dashboard onStartPractice={handleStartPractice} />;
      case ViewState.PRACTICE:
        return <PracticeArea initialDifficulty={selectedDifficulty} />;
      case ViewState.HISTORY:
        return (
          <div className="p-10 text-gray-400 flex items-center justify-center h-full">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-200 mb-2">학습 기록 (History)</h2>
              <p>지난 코딩 연습 기록이 이곳에 표시됩니다.</p>
            </div>
          </div>
        );
      case ViewState.SETTINGS:
        return (
          <div className="p-10 text-gray-400 flex items-center justify-center h-full">
             <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-200 mb-2">설정 (Settings)</h2>
              <p>API 키 및 에디터 설정을 관리합니다.</p>
            </div>
          </div>
        );
      default:
        return <Dashboard onStartPractice={handleStartPractice} />;
    }
  };

  return (
    <div className="flex h-screen w-screen bg-gray-950 text-white overflow-hidden font-sans">
      <Sidebar currentView={currentView} onChangeView={setCurrentView} />
      <main className="flex-1 flex flex-col h-full overflow-hidden relative">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;