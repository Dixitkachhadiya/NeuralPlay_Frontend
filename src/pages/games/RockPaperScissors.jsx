import { useState } from 'react';
import { Hand, File, Scissors, Loader2, Sparkles, RefreshCw } from 'lucide-react';
import api from '../../services/api';

export const RockPaperScissors = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [animationText, setAnimationText] = useState('');

  const choices = [
    { id: 'rock', name: 'Rock', icon: <Hand className="h-10 w-10" />, color: 'hover:border-red-500/50 hover:bg-red-500/10 hover:text-red-400' },
    { id: 'paper', name: 'Paper', icon: <File className="h-10 w-10" />, color: 'hover:border-blue-500/50 hover:bg-blue-500/10 hover:text-blue-400' },
    { id: 'scissors', name: 'Scissors', icon: <Scissors className="h-10 w-10" />, color: 'hover:border-yellow-500/50 hover:bg-yellow-500/10 hover:text-yellow-400' },
  ];

  const handlePlay = async (choice) => {
    setLoading(true);
    setError('');
    
    // Start intense 3 second animation sequence
    setAnimationText('Rock...');
    setTimeout(() => setAnimationText('Paper...'), 750);
    setTimeout(() => setAnimationText('Scissors...'), 1500);
    setTimeout(() => setAnimationText('Shoot!'), 2250);
    
    try {
      const response = await api.post('/game/play', {
        game: 'rps',
        user_move: choice
      });
      
      // Let animation finish before showing result (3 seconds total)
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setResult({
        userMove: choice,
        aiMove: response.data.ai_move,
        outcome: response.data.result,
        scoreChange: response.data.score_awarded,
        totalScore: response.data.total_score // Note: not fully supported by endpoint without extra call, but shouldn't break UI
      });
    } catch (err) {
      setError('Failed to process game move. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getOutcomeColor = (outcome) => {
    switch(outcome?.toLowerCase()) {
      case 'win': return 'text-green-400';
      case 'lose': return 'text-red-400';
      default: return 'text-slate-400';
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
          Rock Paper Scissors
        </h1>
        <p className="text-slate-400">Can you predict what the AI will choose?</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 text-center mx-auto max-w-lg">
          {error}
        </div>
      )}

      {/* Game Area */}
      <div className="bg-dark-800/80 border border-dark-700/50 rounded-2xl p-8 shadow-lg backdrop-blur-sm">
        
        {result ? (
          <div className="text-center space-y-8 animate-in fade-in zoom-in duration-300">
            <h2 className={`text-4xl font-bold uppercase tracking-wider ${getOutcomeColor(result.outcome)}`}>
              You {result.outcome}!
            </h2>
            
            <div className="flex justify-center items-center gap-12">
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-400 uppercase">You</p>
                <div className="h-24 w-24 mx-auto rounded-full bg-dark-900 border-2 border-primary/50 flex items-center justify-center text-primary shadow-[0_0_20px_rgba(139,92,246,0.2)]">
                  {choices.find(c => c.id === result.userMove)?.icon}
                </div>
                <p className="font-semibold capitalize text-lg">{result.userMove}</p>
              </div>
              
              <div className="text-2xl font-bold text-slate-500">VS</div>
              
              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-400 uppercase">AI</p>
                 <div className="h-24 w-24 mx-auto rounded-full bg-dark-900 border-2 border-secondary/50 flex items-center justify-center text-secondary shadow-[0_0_20px_rgba(236,72,153,0.2)]">
                  {choices.find(c => c.id === result.aiMove)?.icon}
                </div>
                <p className="font-semibold capitalize text-lg">{result.aiMove}</p>
              </div>
            </div>

            <div className="flex justify-center items-center gap-4 text-lg">
              <span className="text-slate-400">Score Change: </span>
              <span className={result.scoreChange > 0 ? 'text-green-400 font-bold' : result.scoreChange < 0 ? 'text-red-400 font-bold' : 'text-slate-400 font-bold'}>
                {result.scoreChange > 0 ? '+' : ''}{result.scoreChange}
              </span>
            </div>

            <button
               onClick={() => setResult(null)}
               className="mx-auto flex items-center justify-center gap-2 rounded-full bg-dark-700 px-6 py-3 font-medium text-white transition-all hover:bg-dark-600 hover:scale-105"
            >
              <RefreshCw className="h-5 w-5" />
              Play Again
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            <div className="text-center">
              <h3 className="text-xl font-medium text-slate-200 mb-8">Choose your move</h3>
              <div className="flex flex-wrap justify-center gap-6">
                {choices.map((choice) => (
                  <button
                    key={choice.id}
                    onClick={() => handlePlay(choice.id)}
                    disabled={loading}
                    className={`group relative flex h-28 w-28 md:h-40 md:w-40 flex-col items-center justify-center gap-2 md:gap-4 rounded-2xl border-2 border-dark-700 bg-dark-900/50 p-2 md:p-6 text-slate-400 transition-all ${choice.color} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <div className="transition-transform group-hover:scale-110 group-hover:-translate-y-2 scale-75 md:scale-100">
                       {choice.icon}
                    </div>
                    <span className="font-semibold text-xs md:text-base">{choice.name}</span>
                  </button>
                ))}
              </div>
              
              {loading && (
                <div className="mt-12 flex flex-col items-center justify-center text-primary animate-pulse">
                  <div className="relative">
                    <Loader2 className="h-8 w-8 animate-spin" />
                    <Sparkles className="h-4 w-4 absolute -top-2 -right-2 text-secondary animate-bounce" />
                  </div>
                  <span className="mt-4 font-bold text-xl uppercase tracking-widest text-primary animate-pulse">{animationText || 'AI is thinking...'}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
