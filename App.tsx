import React, { useState, useEffect } from 'react';
import { GameScreen, Mission, PlayerState, MissionContent } from './types';
import { generateMissionContent } from './services/geminiService';
import { Aristoteles } from './components/Aristoteles';
import { MissionCard } from './components/MissionCard';
import { Certificate } from './components/Certificate';
import { Trophy, ArrowLeft, Heart, Star, BookOpen, Volume2, HelpCircle } from 'lucide-react';

// --- Constants & Data ---

const INITIAL_MISSIONS: Mission[] = [
  { id: 1, title: "¿Qué es la Edad Antigua?", topic: "Identificar características principales", description: "Descubre cuándo empezó todo.", iconName: "scroll", isLocked: false, isCompleted: false },
  { id: 2, title: "Sociedad Antigua", topic: "Comprender la sociedad de la época", description: "Reyes, faraones y campesinos.", iconName: "pyramid", isLocked: true, isCompleted: false },
  { id: 3, title: "Vida Cotidiana", topic: "Comprender cómo vivían", description: "¿Qué comían? ¿Cómo vestían?", iconName: "vase", isLocked: true, isCompleted: false },
  { id: 4, title: "Mitos y Leyendas", topic: "Entender mitos y leyendas", description: "Héroes contra monstruos.", iconName: "helmet", isLocked: true, isCompleted: false },
  { id: 5, title: "Grandes Inventos", topic: "Avances de cada civilización", description: "Ruedas, papel y acueductos.", iconName: "wonder", isLocked: true, isCompleted: false },
  { id: 6, title: "Dioses y Creencias", topic: "Entender los dioses", description: "Zeus, Ra y Júpiter.", iconName: "temple", isLocked: true, isCompleted: false },
];

const POINTS_PER_QUESTION = 50;

const App: React.FC = () => {
  // --- State ---
  const [screen, setScreen] = useState<GameScreen>(GameScreen.HOME);
  const [player, setPlayer] = useState<PlayerState>({ name: '', points: 0, completedMissions: [] });
  const [missions, setMissions] = useState<Mission[]>(INITIAL_MISSIONS);
  
  // Mission Flow State
  const [activeMission, setActiveMission] = useState<Mission | null>(null);
  const [missionContent, setMissionContent] = useState<MissionContent | null>(null);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);

  // --- Helpers ---

  const handleStartGame = (name: string) => {
    if(!name.trim()) return;
    setPlayer(prev => ({ ...prev, name }));
    setScreen(GameScreen.MAP);
  };

  const unlockNextMission = (currentId: number) => {
    setMissions(prev => prev.map(m => {
      if (m.id === currentId) return { ...m, isCompleted: true };
      if (m.id === currentId + 1) return { ...m, isLocked: false };
      return m;
    }));
  };

  const handleMissionSelect = async (mission: Mission) => {
    setActiveMission(mission);
    setScreen(GameScreen.MISSION);
    setIsLoading(true);
    setFeedback(null);
    setMissionContent(null);
    setCurrentQuestionIdx(0);

    try {
      const data = await generateMissionContent(`${mission.title}: ${mission.topic}`);
      setMissionContent(data);
    } catch (e) {
      console.error("Failed to load mission", e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (index: number) => {
    if (!missionContent || feedback) return;

    const currentQuestion = missionContent.questions[currentQuestionIdx];
    const isCorrect = index === currentQuestion.correctAnswerIndex;

    if (isCorrect) {
      setFeedback('correct');
      // Add points
      setPlayer(prev => ({ ...prev, points: prev.points + POINTS_PER_QUESTION }));
      
      // Delay before next question or finish
      setTimeout(() => {
        if (currentQuestionIdx < missionContent.questions.length - 1) {
          // Next question
          setCurrentQuestionIdx(prev => prev + 1);
          setFeedback(null);
        } else {
          // Mission Complete
          finishMission();
        }
      }, 3000); // 3 seconds to read the explanation

    } else {
      setFeedback('incorrect');
      // Simple mechanic: try again after short delay
      setTimeout(() => {
         setFeedback(null);
      }, 2000);
    }
  };

  const finishMission = () => {
    if (activeMission) {
      unlockNextMission(activeMission.id);
      setPlayer(prev => ({ ...prev, completedMissions: [...prev.completedMissions, activeMission.id] }));
    }
    
    // Check if all missions completed
    const completedCount = missions.filter(m => m.isCompleted).length + 1;
    
    if (completedCount === missions.length) {
      setScreen(GameScreen.CERTIFICATE);
    } else {
      setScreen(GameScreen.MAP);
    }
    setFeedback(null);
  };

  const restartGame = () => {
    setMissions(INITIAL_MISSIONS);
    setPlayer({ name: '', points: 0, completedMissions: [] });
    setScreen(GameScreen.HOME);
  };

  // --- Renders ---

  const renderHome = () => (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 relative overflow-hidden bg-gradient-to-b from-orange-50 to-orange-100">
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
      
      <div className="z-10 text-center max-w-md w-full bg-white/80 backdrop-blur-sm p-8 rounded-3xl shadow-2xl border-4 border-white">
        <div className="flex justify-center -mt-20 mb-4">
          <Aristoteles className="w-40 h-40" />
        </div>
        
        <h1 className="text-4xl font-extrabold text-orange-600 mb-2 leading-tight">
          Exploradores de la <br/><span className="text-pixar-red">Edad Antigua</span>
        </h1>
        
        <p className="text-gray-600 mb-8 text-lg">
          ¡Hola! Soy Aristóteles. Tienes 6 misiones por delante. ¡Prepárate para pensar como un historiador!
        </p>
        
        <input 
          type="text" 
          placeholder="Escribe tu nombre..." 
          className="w-full p-4 rounded-xl border-2 border-orange-200 focus:border-orange-500 focus:outline-none text-center text-xl mb-4 text-gray-700 placeholder-gray-400"
          value={player.name}
          onChange={(e) => setPlayer({...player, name: e.target.value})}
          onKeyDown={(e) => e.key === 'Enter' && handleStartGame(player.name)}
        />
        
        <button 
          onClick={() => handleStartGame(player.name)}
          className="w-full bg-pixar-red hover:bg-red-600 text-white font-bold py-4 rounded-xl shadow-lg transform transition hover:scale-105 active:scale-95 text-xl flex items-center justify-center gap-2"
        >
          ¡Empezar Aventura! 🚀
        </button>
      </div>
    </div>
  );

  const renderMap = () => (
    <div className="min-h-screen p-6 bg-lab-bg flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center bg-white p-4 rounded-2xl shadow-md mb-8 border-b-4 border-orange-100 sticky top-4 z-20">
        <div className="flex items-center gap-3">
          <div className="bg-orange-100 p-2 rounded-full">
            <Aristoteles className="w-10 h-10" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 leading-tight">{player.name}</h2>
            <div className="text-xs text-orange-500 font-bold uppercase tracking-wide">Nivel: {player.completedMissions.length} / 6</div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-yellow-50 px-4 py-2 rounded-xl border border-yellow-200">
          <Heart className="text-red-500 fill-current" size={24} />
          <span className="font-extrabold text-xl text-yellow-600">{player.points} pts</span>
        </div>
      </header>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full pb-10">
        {missions.map(mission => (
          <MissionCard 
            key={mission.id} 
            mission={mission} 
            onClick={handleMissionSelect} 
          />
        ))}
      </div>
    </div>
  );

  const renderMission = () => {
    if (isLoading) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-lab-bg">
          <Aristoteles emotion="thinking" className="w-32 h-32 mb-6" />
          <p className="text-2xl font-bold text-orange-500 animate-pulse">Aristóteles está investigando...</p>
          <div className="mt-4 w-48 h-4 bg-gray-200 rounded-full overflow-hidden">
             <div className="h-full bg-pixar-orange animate-[loading_1.5s_ease-in-out_infinite] w-1/2"></div>
          </div>
          <style>{`
            @keyframes loading {
              0% { transform: translateX(-100%); }
              100% { transform: translateX(200%); }
            }
          `}</style>
        </div>
      );
    }

    if (!missionContent) return <div>Error cargando misión</div>;

    const currentQ = missionContent.questions[currentQuestionIdx];
    const progressPercent = ((currentQuestionIdx) / missionContent.questions.length) * 100;

    return (
      <div className="min-h-screen bg-lab-bg flex flex-col">
        {/* Top Bar */}
        <div className="p-4 flex items-center bg-white shadow-sm z-10">
          <button 
            onClick={() => setScreen(GameScreen.MAP)} 
            className="bg-gray-100 p-2 rounded-full hover:bg-gray-200 text-gray-600 mr-4"
          >
            <ArrowLeft size={24} />
          </button>
          
          <div className="flex-1">
             <div className="flex justify-between text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">
                <span>Misión {activeMission?.id}</span>
                <span>Pregunta {currentQuestionIdx + 1}/{missionContent.questions.length}</span>
             </div>
             <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-pixar-orange h-2.5 rounded-full transition-all duration-500" 
                  style={{ width: `${((currentQuestionIdx + 1) / missionContent.questions.length) * 100}%` }}
                ></div>
             </div>
          </div>
        </div>

        {/* Content Container */}
        <div className="flex-1 max-w-3xl mx-auto w-full p-4 pb-10 flex flex-col">
          
          {/* Info Card - Only show fully on first question, small summary on others? 
              For simplicity and context, let's keep the main info always accessible but less dominant 
              after Q1, OR just keep it. Given it's for kids, repetition is okay.
          */}
          <div className="bg-white rounded-3xl p-6 shadow-xl mb-6 border-l-8 border-pixar-coral relative">
            <div className="absolute -top-6 right-6 w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-pixar-coral">
              <BookOpen className="text-pixar-coral" size={32} />
            </div>
            
            <h2 className="text-xl font-extrabold text-gray-800 mb-2 pr-12">{missionContent.introTitle}</h2>
            <div className="prose text-gray-600 leading-relaxed text-sm sm:text-base">
              <p>{missionContent.introText}</p>
            </div>
            
            {/* Fun Fact - Show only if we are not in feedback mode to reduce clutter, or always? Always is fine. */}
            <div className="mt-4 bg-yellow-50 rounded-xl p-3 flex gap-3 items-start border border-yellow-200">
               <div className="min-w-[30px] text-xl">💡</div>
               <div>
                 <p className="text-yellow-800 italic text-sm font-medium">{missionContent.funFact}</p>
               </div>
            </div>
          </div>

          {/* Question Section */}
          <div className="flex-1 flex flex-col justify-end animate-fade-in-up">
            <div className="mb-4 flex items-center gap-3">
              <Aristoteles emotion={feedback === 'incorrect' ? 'thinking' : 'happy'} className="w-16 h-16" />
              <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-md text-gray-800 font-bold border-2 border-orange-100 flex-1 text-lg">
                {currentQ.text}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3">
              {currentQ.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={feedback !== null}
                  className={`
                    p-4 rounded-xl font-bold text-left transition-all duration-300 border-b-4 relative overflow-hidden
                    ${feedback === null 
                      ? 'bg-white border-gray-200 hover:border-pixar-orange hover:bg-orange-50 text-gray-700 hover:translate-x-1 hover:shadow-md' 
                      : idx === currentQ.correctAnswerIndex
                        ? 'bg-green-100 border-green-500 text-green-900'
                        : feedback === 'incorrect' && idx !== currentQ.correctAnswerIndex // Just visually disable others
                          ? 'opacity-40 bg-gray-100 grayscale' 
                          : 'opacity-40 bg-gray-100'
                    }
                  `}
                >
                  <span className="mr-2 opacity-60 font-mono bg-black/5 px-2 py-1 rounded text-sm">{String.fromCharCode(65 + idx)}</span> 
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feedback Overlay */}
        {feedback && (
          <div className="fixed inset-0 flex items-center justify-center z-50 px-4 bg-black/20 backdrop-blur-sm">
            <div className={`
              max-w-md w-full
              transform transition-all duration-300 scale-100
              ${feedback === 'correct' ? 'bg-white border-b-8 border-green-500' : 'bg-white border-b-8 border-red-500'} 
              p-6 rounded-3xl shadow-2xl flex flex-col items-center animate-bounce-slow
            `}>
              {feedback === 'correct' ? (
                <>
                  <div className="bg-green-100 p-4 rounded-full mb-4">
                    <Star size={40} className="fill-yellow-400 text-yellow-500" />
                  </div>
                  <h3 className="text-2xl font-black text-green-600 mb-2">¡Correcto!</h3>
                  <p className="text-gray-600 text-center mb-4">{currentQ.explanation}</p>
                  <div className="bg-yellow-100 text-yellow-800 px-4 py-1 rounded-full font-bold text-sm">
                    +{POINTS_PER_QUESTION} Puntos
                  </div>
                  {currentQuestionIdx < missionContent.questions.length - 1 && (
                     <div className="mt-4 text-xs text-gray-400">Siguiente pregunta en breve...</div>
                  )}
                </>
              ) : (
                <>
                   <div className="bg-red-100 p-4 rounded-full mb-4">
                    <HelpCircle size={40} className="text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-red-600 mb-1">¡Casi!</h3>
                  <p className="text-gray-500 text-center text-sm">Piénsalo un poco más, seguro que lo sabes.</p>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {screen === GameScreen.HOME && renderHome()}
      {screen === GameScreen.MAP && renderMap()}
      {screen === GameScreen.MISSION && renderMission()}
      {screen === GameScreen.CERTIFICATE && <Certificate player={player} onRestart={restartGame} />}
    </>
  );
};

export default App;