import { useState, useEffect } from 'react';
import { History as HistoryIcon, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import api from '../services/api';

export const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  const totalPages = Math.ceil(history.length / itemsPerPage);
  const currentItems = history.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await api.get('/game/history');
        setHistory(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to load game history.');
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const getResultColor = (result) => {
    switch(result?.toLowerCase()) {
      case 'win': return 'text-green-400 bg-green-400/10 border border-green-400/20';
      case 'lose': return 'text-red-400 bg-red-400/10 border border-red-400/20';
      case 'draw': return 'text-slate-400 bg-slate-400/10 border border-slate-400/20';
      default: return 'text-slate-200 bg-slate-800 border border-dark-700';
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 border-b border-dark-700/50 pb-6">
         <div className="p-3 bg-primary/20 rounded-xl text-primary">
            <HistoryIcon size={28} />
         </div>
         <div>
           <h1 className="text-2xl font-bold text-slate-200">Match History</h1>
           <p className="text-slate-400 text-sm">Review your past decisions against the AI</p>
         </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 text-center">
          {error}
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-20 bg-dark-800/50 rounded-2xl border border-dark-700/50">
           <HistoryIcon className="h-12 w-12 text-slate-600 mx-auto mb-4" />
           <p className="text-slate-400 font-medium">No games played yet. Time to start your first match!</p>
        </div>
      ) : (
        <>
          <div className="overflow-hidden rounded-2xl border border-dark-700/50 bg-dark-800/80 backdrop-blur-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-slate-300">
                <thead className="bg-dark-900/80 text-xs font-semibold uppercase text-slate-400 border-b border-dark-700/50">
                  <tr>
                    <th className="px-6 py-4">Game</th>
                    <th className="px-6 py-4">Your Move</th>
                    <th className="px-6 py-4">AI Move</th>
                    <th className="px-6 py-4">Result</th>
                    <th className="px-6 py-4 text-right">Score</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-700/50">
                  {currentItems.map((record, index) => (
                    <tr key={index} className="hover:bg-dark-700/20 transition-colors">
                      <td className="px-6 py-4 font-medium capitalize text-slate-200">
                        {record.game_name === 'rps' ? 'Rock Paper Scissors' : record.game_name || 'Tic Tac Toe'}
                      </td>
                      <td className="px-6 py-4 capitalize">{record.user_move || '-'}</td>
                      <td className="px-6 py-4 capitalize">{record.ai_move || '-'}</td>
                      <td className="px-6 py-4 uppercase font-bold text-xs">
                        <span className={`px-2.5 py-1 rounded-md ${getResultColor(record.result)}`}>
                          {record.result}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-right font-bold ${record.score > 0 ? 'text-green-400' : record.score < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                        {record.score > 0 ? '+' : ''}{record.score}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          {totalPages > 1 && (
            <div className="flex items-center justify-between bg-dark-800/50 p-4 rounded-xl border border-dark-700/50 mt-6">
              <p className="text-sm text-slate-400">
                Showing <span className="font-medium text-slate-200">{((currentPage - 1) * itemsPerPage) + 1}</span> to <span className="font-medium text-slate-200">{Math.min(currentPage * itemsPerPage, history.length)}</span> of <span className="font-medium text-slate-200">{history.length}</span> results
              </p>
              <div className="flex gap-2">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 rounded-lg border border-dark-600 bg-dark-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} /> Prev
                </button>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="flex items-center gap-1 rounded-lg border border-dark-600 bg-dark-700 px-3 py-1.5 text-sm text-slate-300 transition-colors hover:bg-dark-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
