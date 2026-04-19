import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, HelpCircle, CheckCircle, XCircle } from 'lucide-react';
import api from '../../services/api';

const decodeHTMLEntities = (text) => {
  const textArea = document.createElement('textarea');
  textArea.innerHTML = text || '';
  return textArea.value;
};

export const QuizGame = () => {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [questionData, setQuestionData] = useState(null);
  const [options, setOptions] = useState([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const fetchQuestion = async () => {
    setLoading(true);
    setError('');
    setResult(null);
    setQuestionData(null);
    
    try {
      const res = await fetch('https://opentdb.com/api.php?amount=1&type=multiple');
      const data = await res.json();
      
      if (data.results && data.results.length > 0) {
        const item = data.results[0];
        
        // Decode strings
        item.question = decodeHTMLEntities(item.question);
        item.correct_answer = decodeHTMLEntities(item.correct_answer);
        item.incorrect_answers = item.incorrect_answers.map(decodeHTMLEntities);
        
        // Shuffle options
        const allOptions = [...item.incorrect_answers, item.correct_answer];
        for (let i = allOptions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allOptions[i], allOptions[j]] = [allOptions[j], allOptions[i]];
        }
        
        setQuestionData(item);
        setOptions(allOptions);
      } else {
        setError('Failed to fetch a trivia question.');
      }
    } catch (err) {
      console.error(err);
      setError('Check your connection to OpenTDB.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
  }, []);

  const handleAnswer = async (selectedOption) => {
    if (submitting || result) return;
    
    setSubmitting(true);
    const isCorrect = selectedOption === questionData.correct_answer;
    
    try {
      const response = await api.post('/game/play', {
        game: 'quiz_game',
        user_move: isCorrect ? 'win' : 'lose'
      });
      
      setResult({
        selected: selectedOption,
        isCorrect,
        correctAnswer: questionData.correct_answer,
        scoreChange: response.data.score_awarded,
      });
    } catch (err) {
      setError('Failed to save your answer to the server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-400 to-rose-400 bg-clip-text text-transparent flex items-center justify-center gap-3">
          <HelpCircle className="text-orange-400" size={32} />
          Trivia Quiz
        </h1>
        <p className="text-slate-400">Test your knowledge against the world's longest trivia database!</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 text-center mx-auto max-w-lg">
          {error}
        </div>
      )}

      {/* Game Area */}
      <div className="bg-dark-800/80 border border-dark-700/50 rounded-2xl p-8 shadow-lg backdrop-blur-sm min-h-[400px] flex flex-col justify-center">
        
        {loading ? (
           <div className="flex flex-col items-center justify-center text-primary animate-pulse py-12">
             <Loader2 className="h-12 w-12 animate-spin mb-4" />
             <span className="font-bold text-xl tracking-widest text-primary">Summoning Question...</span>
           </div>
        ) : questionData && !result ? (
          <div className="space-y-8 animate-in fade-in zoom-in duration-300">
            <div className="text-center space-y-4">
              <span className="inline-block px-3 py-1 bg-dark-700 text-slate-300 rounded-full text-xs font-semibold uppercase tracking-wider">
                {questionData.category} &bull; {questionData.difficulty}
              </span>
              <h2 className="text-2xl font-bold text-slate-100 leading-relaxed px-4">
                {questionData.question}
              </h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-8">
              {options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleAnswer(option)}
                  disabled={submitting}
                  className="group relative flex items-center justify-center min-h-[80px] p-4 bg-dark-900 border border-dark-600 rounded-xl hover:bg-dark-700 hover:border-orange-500/50 hover:shadow-[0_0_15px_rgba(249,115,22,0.15)] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-lg font-medium text-slate-200 group-hover:text-white">{option}</span>
                </button>
              ))}
            </div>

            {submitting && (
               <div className="flex justify-center items-center mt-4 text-orange-400">
                  <Loader2 className="animate-spin h-6 w-6" />
               </div>
            )}
          </div>
        ) : result && (
          <div className="text-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 py-6">
            <div className={`inline-flex flex-col items-center gap-4 p-8 rounded-2xl border bg-dark-900/50 shadow-xl
              ${result.isCorrect ? 'border-green-500/50' : 'border-red-500/50'}
            `}>
              {result.isCorrect ? (
                <CheckCircle size={64} className="text-green-500 drop-shadow-[0_0_15px_rgba(34,197,94,0.4)] animate-in zoom-in" />
              ) : (
                <XCircle size={64} className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.4)] animate-in zoom-in" />
              )}
              
              <h2 className={`text-4xl font-bold uppercase tracking-widest ${result.isCorrect ? 'text-green-400' : 'text-red-400'}`}>
                {result.isCorrect ? 'Correct!' : 'Incorrect!'}
              </h2>

              {!result.isCorrect && (
                <div className="mt-4 p-4 rounded-xl bg-dark-800 border border-dark-600">
                   <p className="text-sm text-slate-400 mb-1">The correct answer was:</p>
                   <p className="text-lg font-bold text-slate-200">{result.correctAnswer}</p>
                </div>
              )}

              <div className="flex justify-center items-center gap-4 text-xl mt-4">
                <span className="text-slate-400">Score Change: </span>
                <span className={result.scoreChange > 0 ? 'text-green-400 font-bold' : 'text-red-400 font-bold'}>
                  {result.scoreChange > 0 ? '+' : ''}{result.scoreChange}
                </span>
              </div>
            </div>
            
            <button
               onClick={fetchQuestion}
               className="mx-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-orange-500 to-rose-500 px-8 py-4 font-bold text-white transition-transform hover:scale-105 shadow-lg"
            >
              <RefreshCw className="h-5 w-5" />
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
