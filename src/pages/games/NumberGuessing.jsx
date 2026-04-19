import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Hash, ArrowUp, ArrowDown, Target, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

export const NumberGuessing = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [targetNumber, setTargetNumber] = useState(null);
  
  const [guessInput, setGuessInput] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [result, setResult] = useState(null); // 'win', 'lose'
  const [scoreChange, setScoreChange] = useState(null);
  const [error, setError] = useState('');
  
  const MAX_ATTEMPTS = 7;

  const startGame = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setGuesses([]);
    setGuessInput('');
    setScoreChange(null);
    
    try {
      const response = await api.post('/game/ai-move', {
        game: 'number_guessing'
      });
      setTargetNumber(response.data.ai_move);
    } catch (err) {
      console.error(err);
      setError('Failed to start a new game.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startGame();
  }, []);

  const saveResult = async (status) => {
    setSubmitting(true);
    try {
      const response = await api.post('/game/play', {
        game: 'number_guessing',
        user_move: status
      });
      setScoreChange(response.data.score_awarded);
    } catch (err) {
      setError('Failed to save score.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleGuess = (e) => {
    e.preventDefault();
    if (result || submitting || !targetNumber) return;

    const guess = parseInt(guessInput, 10);
    if (isNaN(guess) || guess < 1 || guess > 100) {
      setError('Please enter a valid number between 1 and 100.');
      return;
    }
    
    setError('');

    if (guess === targetNumber) {
      const newGuesses = [...guesses, { value: guess, hint: 'Correct!' }];
      setGuesses(newGuesses);
      setResult('win');
      saveResult('win');
      return;
    }

    const hint = guess > targetNumber ? 'Too High' : 'Too Low';
    const newGuesses = [...guesses, { value: guess, hint }];
    setGuesses(newGuesses);
    setGuessInput('');

    if (newGuesses.length >= MAX_ATTEMPTS) {
      setResult('lose');
      saveResult('lose');
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <Hash className="text-blue-400" size={32} />
          Number Guesser
        </h1>
        <p className="text-slate-400">The AI selected a number between 1 and 100. You have {MAX_ATTEMPTS} attempts.</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 text-center mx-auto max-w-lg">
          {error}
        </div>
      )}

      {/* Game Area */}
      <div className="bg-dark-800/80 border border-dark-700/50 rounded-2xl p-8 shadow-lg backdrop-blur-sm min-h-[400px]">
        {loading ? (
           <div className="flex flex-col items-center justify-center text-primary animate-pulse py-12">
             <Loader2 className="h-12 w-12 animate-spin mb-4" />
             <span className="font-bold text-xl tracking-widest text-primary">AI is picking a number...</span>
           </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-8 animate-in fade-in zoom-in duration-300">
            
            {/* Left Side: Guesses History */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-300 border-b border-dark-600 pb-2">Your Guesses</h3>
              
              {guesses.length === 0 ? (
                <div className="text-slate-500 italic text-center py-8 bg-dark-900/50 rounded-xl border border-dark-600 border-dashed">
                  No guesses yet
                </div>
              ) : (
                <div className="space-y-3">
                  {guesses.map((g, i) => (
                    <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-dark-900 border border-dark-600">
                      <div className="flex items-center gap-3">
                        <span className="text-slate-500 font-mono text-sm">#{i + 1}</span>
                        <span className="text-xl font-bold text-slate-200">{g.value}</span>
                      </div>
                      <div className={`flex items-center gap-1 font-semibold text-sm px-3 py-1 rounded-full
                        ${g.hint === 'Too High' ? 'bg-orange-500/10 text-orange-400' : 
                          g.hint === 'Too Low' ? 'bg-blue-500/10 text-blue-400' : 'bg-green-500/10 text-green-400'}
                      `}>
                        {g.hint === 'Too High' && <ArrowUp size={16} />}
                        {g.hint === 'Too Low' && <ArrowDown size={16} />}
                        {g.hint === 'Correct!' && <Target size={16} />}
                        {g.hint}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!result && (
                <p className="text-sm font-medium text-slate-400 text-center py-2">
                  Attempts remaining: <span className="text-slate-200">{MAX_ATTEMPTS - guesses.length}</span>
                </p>
              )}
            </div>

            {/* Right Side: Input & Results */}
            <div className="flex flex-col justify-center border-t md:border-t-0 md:border-l border-dark-600 pt-8 md:pt-0 md:pl-8">
              {!result ? (
                <form onSubmit={handleGuess} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-slate-400 block text-center">Enter your guess (1-100)</label>
                    <input
                      type="number"
                      min="1"
                      max="100"
                      value={guessInput}
                      onChange={(e) => setGuessInput(e.target.value)}
                      disabled={submitting}
                      className="w-full text-center text-4xl font-bold bg-dark-900 border-2 border-dark-600 rounded-2xl py-6 hover:border-dark-500 focus:border-blue-500 outline-none transition-colors text-slate-200"
                      placeholder="?"
                      autoFocus
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!guessInput || submitting}
                    className="w-full flex items-center justify-center gap-2 py-4 rounded-xl font-bold text-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-white shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                  >
                    {submitting ? <Loader2 className="animate-spin h-5 w-5" /> : 'Guess!'}
                  </button>
                </form>
              ) : (
                <div className="text-center space-y-6 animate-in slide-in-from-right-4 duration-500">
                   <div className={`p-6 rounded-2xl border ${result === 'win' ? 'bg-green-500/10 border-green-500/50' : 'bg-red-500/10 border-red-500/50'}`}>
                      <div className="flex justify-center mb-4">
                        {result === 'win' ? (
                          <CheckCircle size={48} className="text-green-500 drop-shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                        ) : (
                          <XCircle size={48} className="text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
                        )}
                      </div>
                      <h2 className="text-2xl font-bold text-slate-200 mb-2">
                        {result === 'win' ? 'You Found It!' : 'Out of Attempts!'}
                      </h2>
                      <p className="text-slate-400 text-sm">
                        {result === 'win' ? `You guessed it in ${guesses.length} tries.` : `The secret number was ${targetNumber}.`}
                      </p>
                   </div>

                   {scoreChange !== null && (
                      <div className="flex justify-center items-center gap-2 text-xl font-bold bg-dark-900 py-3 rounded-xl border border-dark-600">
                        <span className="text-slate-400">Score:</span>
                        <span className={scoreChange > 0 ? 'text-green-400' : 'text-red-400'}>
                          {scoreChange > 0 ? '+' : ''}{scoreChange}
                        </span>
                      </div>
                   )}

                   <button
                     onClick={startGame}
                     className="w-full flex items-center justify-center gap-2 py-4 rounded-full font-bold bg-dark-700 hover:bg-dark-600 transition-colors text-white"
                   >
                     <RefreshCw className="h-5 w-5" />
                     Play Again
                   </button>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
};
