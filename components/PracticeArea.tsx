import React, { useState, useEffect } from 'react';
import { Difficulty, CodeTask, FeedbackResult } from '../types';
import { generateCodingTask, evaluateSubmission } from '../services/geminiService';
import CodeBlock from './CodeBlock';
import { Play, CheckCircle, RefreshCw, AlertCircle, ChevronRight, Loader2 } from 'lucide-react';

interface PracticeAreaProps {
  initialDifficulty?: Difficulty;
}

const difficultyLabels: Record<Difficulty, string> = {
  [Difficulty.BEGINNER]: "초급",
  [Difficulty.INTERMEDIATE]: "중급",
  [Difficulty.ADVANCED]: "고급",
  [Difficulty.MASTER]: "마스터",
};

const PracticeArea: React.FC<PracticeAreaProps> = ({ initialDifficulty = Difficulty.BEGINNER }) => {
  const [difficulty, setDifficulty] = useState<Difficulty>(initialDifficulty);
  const [task, setTask] = useState<CodeTask | null>(null);
  const [userCode, setUserCode] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isEvaluating, setIsEvaluating] = useState<boolean>(false);
  const [feedback, setFeedback] = useState<FeedbackResult | null>(null);

  // Fetch new task
  const loadNewTask = async () => {
    setIsLoading(true);
    setFeedback(null);
    setUserCode('');
    try {
      const newTask = await generateCodingTask(difficulty);
      setTask(newTask);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadNewTask();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [difficulty]);

  const handleSubmit = async () => {
    if (!task) return;
    setIsEvaluating(true);
    try {
      const result = await evaluateSubmission(task.code, userCode);
      setFeedback(result);
    } catch (e) {
      console.error(e);
    } finally {
      setIsEvaluating(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-950">
      {/* Header / Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-800 bg-gray-900/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <div className="flex items-center bg-gray-800 rounded-lg p-1">
            {Object.values(Difficulty).map((d) => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${
                  difficulty === d
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-gray-400 hover:text-white'
                }`}
              >
                {difficultyLabels[d]}
              </button>
            ))}
          </div>
          {task && (
             <h2 className="text-sm font-medium text-gray-300 border-l border-gray-700 pl-4">
               과제: <span className="text-white">{task.title}</span>
             </h2>
          )}
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={loadNewTask}
            disabled={isLoading}
            className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
            <span>다음 문제</span>
          </button>
          <button
            onClick={handleSubmit}
            disabled={isEvaluating || isLoading || !userCode}
            className={`flex items-center space-x-2 px-4 py-2 text-sm font-medium rounded-lg shadow-lg transition-all ${
              isEvaluating || !userCode
                ? 'bg-gray-800 text-gray-500 cursor-not-allowed'
                : 'bg-green-600 hover:bg-green-500 text-white shadow-green-900/20'
            }`}
          >
            {isEvaluating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
            <span>실행 및 채점</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden relative">
        {isLoading && !task ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-950/80 z-20">
            <Loader2 className="w-10 h-10 text-indigo-500 animate-spin mb-4" />
            <p className="text-gray-400">딥러닝 과제 생성 중...</p>
          </div>
        ) : (
          <div className="flex h-full">
            
            {/* Left: Source Code */}
            <div className="w-1/2 h-full border-r border-gray-800 flex flex-col">
              <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">참조 코드 (Reference)</span>
                <span className="text-xs text-indigo-400">Python / PyTorch</span>
              </div>
              <div className="flex-1 overflow-auto bg-gray-950 relative group">
                 {task && <CodeBlock code={task.code} className="min-h-full" />}
              </div>
              {task?.explanation && (
                <div className="p-3 bg-gray-900/50 border-t border-gray-800 text-sm text-gray-400 flex items-start space-x-2">
                  <strong className="text-gray-300 whitespace-nowrap">핵심 개념:</strong>
                  <span className="text-gray-400 line-clamp-2">{task.explanation}</span>
                </div>
              )}
            </div>

            {/* Right: User Input */}
            <div className="w-1/2 h-full flex flex-col relative bg-[#0d1117]">
              <div className="px-4 py-2 bg-gray-900 border-b border-gray-800 flex justify-between items-center">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">작성 공간 (Editor)</span>
                <span className="text-xs text-gray-500">{userCode.length} 자</span>
              </div>
              <textarea
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
                spellCheck={false}
                className="flex-1 w-full h-full bg-transparent text-gray-200 font-mono text-sm p-4 resize-none focus:outline-none leading-6 selection:bg-indigo-500/30"
                placeholder="# 왼쪽의 코드를 똑같이 따라 치세요..."
                onKeyDown={(e) => {
                  if (e.key === 'Tab') {
                    e.preventDefault();
                    const target = e.target as HTMLTextAreaElement;
                    const start = target.selectionStart;
                    const end = target.selectionEnd;
                    const spaces = '    '; // 4칸 스페이스 (Python 표준)
                    setUserCode(userCode.substring(0, start) + spaces + userCode.substring(end));
                    // 커서 위치 조정
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + spaces.length;
                    }, 0);
                  }
                }}
                onPaste={(e) => {
                  e.preventDefault();
                  alert("클론 코딩은 직접 타이핑해야 합니다! 붙여넣기는 금지되어 있습니다.");
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Feedback Panel (Overlay or Bottom Sheet) */}
      {feedback && (
        <div className="absolute bottom-0 inset-x-0 bg-gray-900 border-t border-gray-800 shadow-2xl p-6 transform transition-transform duration-300 z-30 max-h-1/3 overflow-y-auto">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-start gap-6">
              <div className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold border-4 ${
                feedback.score >= 90 ? 'border-green-500 text-green-400 bg-green-500/10' :
                feedback.score >= 70 ? 'border-yellow-500 text-yellow-400 bg-yellow-500/10' :
                'border-red-500 text-red-400 bg-red-500/10'
              }`}>
                {feedback.score}
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className={`text-lg font-bold ${feedback.isCorrect ? 'text-green-400' : 'text-gray-200'}`}>
                    {feedback.isCorrect ? "참 잘했어요!" : "조금 더 분발하세요!"}
                  </h3>
                  <button onClick={() => setFeedback(null)} className="text-gray-500 hover:text-white">
                    <ChevronRight className="w-5 h-5 rotate-90" />
                  </button>
                </div>
                <p className="text-gray-300 mb-3">{feedback.feedback}</p>
                {feedback.suggestions.length > 0 && (
                  <div className="bg-gray-800 rounded-lg p-3">
                    <p className="text-xs text-gray-500 uppercase mb-2 font-bold">조언 (Suggestions)</p>
                    <ul className="list-disc list-inside text-sm text-gray-400 space-y-1">
                      {feedback.suggestions.map((s, i) => (
                        <li key={i}>{s}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PracticeArea;