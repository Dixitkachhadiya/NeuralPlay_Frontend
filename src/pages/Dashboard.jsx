import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Trophy, Swords, Sparkles, Loader2, Target, Activity, HelpCircle, Hash } from 'lucide-react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

export const Dashboard = () => {
  const { user } = useAuth();
  const [score, setScore] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        const response = await api.get('/game/score');
        setScore(response.data?.total_score || 0);
      } catch (error) {
        console.error('Failed to fetch score', error);
        setScore(0);
      } finally {
        setLoading(false);
      }
    };

    fetchScore();
  }, []);

  const games = [
    {
      id: 'rps',
      name: 'Rock Paper Scissors',
      description: 'The classic battle of minds against the AI.',
      path: '/dashboard/games/rps',
      icon: <Target className="h-8 w-8 text-primary" />,
      color: 'from-purple-500/20 to-purple-500/5',
      borderColor: 'border-purple-500/20',
    },
    {
      id: 'tictactoe',
      name: 'Tic Tac Toe',
      description: 'Strategic grid combat. Can you beat the perfect AI?',
      path: '/dashboard/games/tictactoe',
      icon: <Swords className="h-8 w-8 text-secondary" />,
      color: 'from-pink-500/20 to-pink-500/5',
      borderColor: 'border-pink-500/20',
    },
    {
      id: 'swg',
      name: 'Snake Water Gun',
      description: 'Survive the wild in this enhanced classic against the AI.',
      path: '/dashboard/games/swg',
      icon: <Activity className="h-8 w-8 text-emerald-400" />,
      color: 'from-emerald-500/20 to-emerald-500/5',
      borderColor: 'border-emerald-500/20',
    },
    {
      id: 'quiz',
      name: 'Trivia Quiz',
      description: 'Test your knowledge across millions of questions.',
      path: '/dashboard/games/quiz',
      icon: <HelpCircle className="h-8 w-8 text-orange-400" />,
      color: 'from-orange-500/20 to-orange-500/5',
      borderColor: 'border-orange-500/20',
    },
    {
      id: 'guess',
      name: 'Number Guesser',
      description: 'Use logic and hints to find the AI\'s secret number.',
      path: '/dashboard/games/guess',
      icon: <Hash className="h-8 w-8 text-blue-400" />,
      color: 'from-blue-500/20 to-blue-500/5',
      borderColor: 'border-blue-500/20',
    }
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row gap-6 justify-between items-start md:items-center">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            Welcome back, <span className="text-primary">{user?.name || 'Player'}</span> <Sparkles className="h-6 w-6 text-yellow-400" />
          </h1>
          <p className="text-slate-400 mt-2">What would you like to play today?</p>
        </div>
        
        {/* Score Card */}
        <div className="w-full sm:w-auto bg-dark-800/80 border border-dark-700/50 rounded-2xl p-6 shadow-lg backdrop-blur-sm flex items-center gap-4 min-w-[200px]">
          <div className="p-3 bg-primary/20 rounded-xl text-primary">
            <Trophy size={28} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-400">Total Score</p>
            {loading ? (
              <Loader2 className="h-6 w-6 animate-spin text-slate-300 mt-1" />
            ) : (
              <p className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                {score}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Games Selection */}
      <div>
        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
          Available Games
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {games.map((game) => (
            <Link
              key={game.id}
              to={game.path}
              className={`group relative overflow-hidden rounded-2xl border ${game.borderColor} bg-dark-800/50 p-6 transition-all hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(139,92,246,0.1)]`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${game.color} opacity-0 transition-opacity group-hover:opacity-100`}></div>
              <div className="relative z-10">
                <div className="mb-4 inline-block rounded-xl bg-dark-900/80 p-3 shadow-inner">
                  {game.icon}
                </div>
                <h3 className="mb-2 text-2xl font-bold text-slate-200">{game.name}</h3>
                <p className="text-slate-400">{game.description}</p>
                <div className="mt-6 flex items-center text-sm font-medium text-primary group-hover:text-secondary transition-colors">
                  Play Now <span className="ml-2 group-hover:translate-x-1 transition-transform">→</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};
