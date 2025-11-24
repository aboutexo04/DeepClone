import React from 'react';
import { Difficulty, ViewState } from '../types';
import { Trophy, Code, Zap, BarChart } from 'lucide-react';

interface DashboardProps {
  onStartPractice: (level: Difficulty) => void;
}

const levels = [
  {
    id: Difficulty.BEGINNER,
    title: '초급 (Beginner)',
    desc: '텐서 조작, 기본 연산, 선형 회귀, 기초 신경망',
    color: 'bg-green-500',
    icon: Code
  },
  {
    id: Difficulty.INTERMEDIATE,
    title: '중급 (Intermediate)',
    desc: 'CNN, RNN, LSTM, 커스텀 데이터로더, 전이 학습',
    color: 'bg-blue-500',
    icon: Zap
  },
  {
    id: Difficulty.ADVANCED,
    title: '고급 (Advanced)',
    desc: '트랜스포머(Transformer), GAN, 고급 최적화 전략',
    color: 'bg-purple-500',
    icon: Trophy
  },
  {
    id: Difficulty.MASTER,
    title: '마스터 (Master)',
    desc: '최신 논문 구현, 커스텀 CUDA 커널, 모델 경량화',
    color: 'bg-red-500',
    icon: BarChart
  }
];

const Dashboard: React.FC<DashboardProps> = ({ onStartPractice }) => {
  return (
    <div className="p-8 h-full overflow-y-auto bg-gray-950 text-white">
      <header className="mb-10">
        <h1 className="text-3xl font-bold mb-2">환영합니다, 개발자님</h1>
        <p className="text-gray-400">딥러닝 클론 코딩을 시작할 난이도를 선택하세요.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {levels.map((level) => {
          const Icon = level.icon;
          return (
            <button
              key={level.id}
              onClick={() => onStartPractice(level.id)}
              className="group relative bg-gray-900 border border-gray-800 rounded-2xl p-6 text-left hover:border-indigo-500 hover:shadow-2xl hover:shadow-indigo-900/20 transition-all duration-300 flex flex-col h-64"
            >
              <div className={`w-12 h-12 rounded-xl ${level.color} bg-opacity-20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-6 h-6 ${level.color.replace('bg-', 'text-')}`} />
              </div>
              <h3 className="text-xl font-bold text-gray-100 mb-2">{level.title}</h3>
              <p className="text-sm text-gray-400 flex-1">{level.desc}</p>
              
              <div className="mt-4 flex items-center text-sm font-medium text-gray-500 group-hover:text-white transition-colors">
                세션 시작 
                <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          );
        })}
      </div>

      <div className="mt-12">
        <h2 className="text-xl font-bold mb-6">추천 토픽 (Popular)</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {['PyTorch 기초 (Basics)', 'MNIST 분류기', 'ResNet 구현'].map((topic, i) => (
            <div key={i} className="bg-gray-900/50 border border-gray-800 rounded-lg p-4 flex items-center justify-between">
              <span className="text-gray-300">{topic}</span>
              <span className="px-2 py-1 rounded bg-gray-800 text-xs text-gray-500">인기</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;