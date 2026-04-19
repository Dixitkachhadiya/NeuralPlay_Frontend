import { useState, useEffect } from 'react';
import { Trophy, Medal, Award, Loader2 } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Leaderboard = () => {
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const response = await api.get('/game/leaderboard');
        setLeaderboard(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        setError('Failed to load leaderboard.');
      } finally {
        setLoading(false);
      }
    };

    fetchLeaderboard();
  }, []);

  const getRankIcon = (index) => {
    switch(index) {
      case 0: return <Trophy className="h-6 w-6 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]" />;
      case 1: return <Medal className="h-6 w-6 text-slate-300 drop-shadow-[0_0_8px_rgba(203,213,225,0.5)]" />;
      case 2: return <Award className="h-6 w-6 text-amber-600 drop-shadow-[0_0_8px_rgba(217,119,6,0.5)]" />;
      default: return <span className="font-bold text-slate-500 text-lg w-6 text-center block">{index + 1}</span>;
    }
  };

  const getRowStyle = (index, isCurrentUser) => {
    let baseStyle = "transition-all duration-300 border-b border-dark-700/50 hover:bg-dark-700/30 ";
    
    if (isCurrentUser) {
      baseStyle += "bg-primary/10 border-primary/20 ";
    }
    
    if (index === 0) baseStyle += "bg-gradient-to-r from-yellow-500/10 to-transparent ";
    else if (index === 1) baseStyle += "bg-gradient-to-r from-slate-400/10 to-transparent ";
    else if (index === 2) baseStyle += "bg-gradient-to-r from-amber-600/10 to-transparent ";
    
    return baseStyle;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
         <div className="p-4 bg-primary/20 rounded-full text-primary shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <Trophy size={48} />
         </div>
         <div>
           <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Global Leaderboard</h1>
           <p className="text-slate-400 mt-2">The best of the best. Where do you stand?</p>
         </div>
      </div>

      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
        </div>
      ) : error ? (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 text-center">
          {error}
        </div>
      ) : (
        <div className="bg-dark-800/80 border border-dark-700/50 rounded-2xl shadow-xl backdrop-blur-sm overflow-hidden">
           <div className="p-6 bg-dark-900/50 border-b border-dark-700/50 flex justify-between text-xs font-bold uppercase tracking-widest text-slate-400">
             <div className="w-20 pl-4">Rank</div>
             <div className="flex-1">Player</div>
             <div className="w-32 text-right pr-6">Score</div>
           </div>
           
           <div className="divide-y divide-dark-700/50">
             {leaderboard.map((entry, index) => {
               const isCurrentUser = user && user.id === entry.id; // Change `user.id` depending on exactly what is in your JWT
               
               return (
                 <div key={entry.id || index} className={`flex items-center p-4 ${getRowStyle(index, isCurrentUser)}`}>
                   <div className="w-20 flex justify-center items-center">
                     {getRankIcon(index)}
                   </div>
                   <div className="flex-1 pl-4 flex items-center gap-3">
                     <div className="h-10 w-10 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-lg shadow-inner">
                       {entry.name?.charAt(0).toUpperCase()}
                     </div>
                     <div>
                       <p className={`font-semibold text-lg ${isCurrentUser ? 'text-primary' : 'text-slate-200'}`}>
                         {entry.name} {isCurrentUser && <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full ml-2">You</span>}
                       </p>
                     </div>
                   </div>
                   <div className="w-32 text-right pr-6">
                     <p className={`font-bold text-xl ${index === 0 ? 'text-yellow-400' : index === 1 ? 'text-slate-300' : index === 2 ? 'text-amber-500' : 'text-primary'}`}>
                       {entry.total_score}
                     </p>
                   </div>
                 </div>
               );
             })}
           </div>
           
           {leaderboard.length === 0 && (
             <div className="p-12 text-center text-slate-400">
               No players on the leaderboard yet.
             </div>
           )}
        </div>
      )}
    </div>
  );
};
