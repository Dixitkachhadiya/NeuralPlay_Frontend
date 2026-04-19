import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  BrainCircuit, 
  Gamepad2, 
  Trophy, 
  History, 
  ShieldCheck, 
  Zap,
  Target,
  Swords,
  HelpCircle,
  Hash,
  Activity,
  ArrowRight
} from 'lucide-react';

export const Home = () => {
  const { user } = useAuth();

  // If user is logged in, securely bump them to the dashboard inside the application bounds
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  const features = [
    {
      title: "Adaptive AI Gameplay",
      description: "Algorithms that learn and adapt, pushing you to rethink your strategies continuously.",
      icon: <BrainCircuit className="h-6 w-6 text-primary" />,
    },
    {
      title: "Multiple Games",
      description: "From classic grid combat to complex trivia puzzles, the hub supports expansive variety.",
      icon: <Gamepad2 className="h-6 w-6 text-secondary" />,
    },
    {
      title: "Real-time Leaderboard",
      description: "Global scoring across all active players. See exactly where you rank in the top 10.",
      icon: <Trophy className="h-6 w-6 text-yellow-400" />,
    },
    {
      title: "Game History Tracking",
      description: "Review your past mistakes and AI responses round-by-round to secure future points.",
      icon: <History className="h-6 w-6 text-emerald-400" />,
    },
    {
      title: "Secure Authentication",
      description: "State-of-the-art JWT encryptions guaranteeing your scores and profile remain yours.",
      icon: <ShieldCheck className="h-6 w-6 text-blue-400" />,
    }
  ];

  const games = [
    {
      name: 'Rock Paper Scissors',
      description: 'The classic battle of minds against the AI.',
      icon: <Target className="h-10 w-10 text-purple-400" />,
      bg: 'bg-purple-500/10 border-purple-500/20 hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)]'
    },
    {
      name: 'Tic Tac Toe',
      description: 'Strategic grid combat. Can you beat the perfect AI?',
      icon: <Swords className="h-10 w-10 text-pink-400" />,
      bg: 'bg-pink-500/10 border-pink-500/20 hover:border-pink-500/50 hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]'
    },
    {
      name: 'Trivia Quiz',
      description: 'Test your knowledge across millions of questions.',
      icon: <HelpCircle className="h-10 w-10 text-orange-400" />,
      bg: 'bg-orange-500/10 border-orange-500/20 hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.15)]'
    },
    {
      name: 'Number Guesser',
      description: 'Use logic and hints to find the AI\'s secret number.',
      icon: <Hash className="h-10 w-10 text-blue-400" />,
      bg: 'bg-blue-500/10 border-blue-500/20 hover:border-blue-500/50 hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]'
    }
  ];

  const steps = [
    { num: '1', title: 'Register / Login', desc: 'Securely create your NeuralPlay account.' },
    { num: '2', title: 'Choose a Game', desc: 'Select from our library of AI-powered games.' },
    { num: '3', title: 'Play against AI', desc: 'Match your wits against intelligent logic.' },
    { num: '4', title: 'Track Progress', desc: 'Check your match history and view the leaderboard.' }
  ];

  return (
    <div className="min-h-screen bg-dark-900 text-slate-200 overflow-x-hidden selection:bg-primary selection:text-white font-sans">
      
      {/* 1. Hero Section */}
      <section className="relative px-6 py-32 md:py-48 flex flex-col items-center text-center">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none"></div>
        <div className="absolute top-10 flex gap-2 items-center text-primary/80 backdrop-blur-md bg-dark-800/30 px-6 py-2 rounded-full border border-dark-700/50 shadow-xl z-20">
          <BrainCircuit size={20} />
          <span className="font-bold tracking-widest text-sm">NEURALPLAY</span>
        </div>

        <div className="relative z-10 max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            Play Smart. <br className="hidden md:block"/> 
            Play with <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-secondary to-pink-500">AI.</span>
          </h1>
          <p className="text-lg md:text-2xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Experience intelligent games that adapt to your strategy and improve with every single move.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
              to="/register" 
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-primary to-secondary hover:scale-105 transition-all rounded-xl font-bold text-white shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_60px_rgba(139,92,246,0.5)] flex items-center justify-center gap-2"
            >
              Get Started <ArrowRight size={20} />
            </Link>
            <Link 
              to="/login" 
              className="w-full sm:w-auto px-8 py-4 bg-dark-800 border border-dark-600 hover:bg-dark-700 hover:border-dark-500 transition-all rounded-xl font-bold text-slate-300 flex items-center justify-center"
            >
              Login to Account
            </Link>
          </div>
        </div>
      </section>

      {/* 2. About Section */}
      <section className="px-6 py-24 bg-dark-800/30 border-y border-dark-700/30 relative">
        <div className="max-w-6xl mx-auto text-center space-y-6">
          <Zap className="h-12 w-12 text-yellow-400 mx-auto opacity-80" />
          <h2 className="text-3xl md:text-4xl font-bold">What is NeuralPlay?</h2>
          <p className="text-lg text-slate-400 max-w-3xl mx-auto leading-relaxed">
            NeuralPlay is a next-generation platform where users play multiple games powered by adaptive AI logic. The AI evaluates conditions, features dynamic difficulty adjustments, and feeds immediately into a real-time scoring and global leaderboard system to keep things highly competitive.
          </p>
        </div>
      </section>

      {/* 3. Features Section */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Platform Features</h2>
          <p className="text-slate-400">Everything you need to challenge the machine.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, idx) => (
            <div key={idx} className="bg-dark-800/40 border border-dark-700/50 p-8 rounded-3xl hover:bg-dark-700/30 transition-colors group">
              <div className="bg-dark-900/80 w-14 h-14 rounded-2xl flex items-center justify-center mb-6 shadow-inner group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-200">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Games Preview Section */}
      <section className="px-6 py-32 bg-dark-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Available Games</h2>
              <p className="text-slate-400">A rotating library of computational challenges.</p>
            </div>
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors">
              Play all games <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {games.map((game, idx) => (
              <div key={idx} className={`border rounded-3xl p-8 transition-all flex flex-col items-start ${game.bg}`}>
                <div className="mb-6">{game.icon}</div>
                <h3 className="text-xl font-bold mb-3 text-slate-200">{game.name}</h3>
                <p className="text-slate-400 text-sm mb-8 flex-1">{game.description}</p>
                <Link to="/login" className="py-2.5 px-6 rounded-lg bg-dark-900/50 font-semibold text-sm hover:bg-dark-900 w-full text-center transition-colors">
                  Play Now
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. How It Works Section */}
      <section className="px-6 py-32 max-w-7xl mx-auto">
         <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">How It Works</h2>
          <p className="text-slate-400">Four simple steps to join the fray.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8">
          {steps.map((step, idx) => (
            <div key={idx} className="relative">
              {/* Connecting line for desktop */}
              {idx !== steps.length - 1 && (
                <div className="hidden md:block absolute top-8 left-[60%] w-full h-[2px] bg-gradient-to-r from-primary/30 to-transparent"></div>
              )}
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-dark-800 border-2 border-primary/50 flex items-center justify-center text-2xl font-bold text-primary shadow-[0_0_20px_rgba(139,92,246,0.15)] z-10">
                  {step.num}
                </div>
                <h3 className="text-lg font-bold text-slate-200">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. Leaderboard Preview */}
      <section className="px-6 py-32 bg-dark-800/30 border-y border-dark-700/30 overflow-hidden relative">
         <div className="absolute top-1/2 -right-64 -translate-y-1/2 w-[500px] h-[500px] bg-secondary/10 blur-[120px] rounded-full pointer-events-none"></div>
         <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16 relative z-10">
            <div className="flex-1 space-y-6 text-center lg:text-left">
              <Trophy className="h-16 w-16 text-yellow-400 mx-auto lg:mx-0 drop-shadow-[0_0_15px_rgba(250,204,21,0.3)]" />
              <h2 className="text-4xl md:text-5xl font-bold">Rise to the Top</h2>
              <p className="text-xl text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
                Compete with other players and climb the global ranks. Every game awards competitive points directly correlating to the strategic complexity. 
              </p>
              <div className="pt-4">
                 <Link to="/login" className="inline-flex items-center gap-2 font-bold text-secondary hover:text-pink-400 transition-colors text-lg">
                   View Live Leaderboard <ArrowRight size={20} />
                 </Link>
              </div>
            </div>
            
            <div className="flex-1 w-full max-w-md bg-dark-900 border border-dark-700/50 rounded-2xl shadow-2xl p-6 backdrop-blur-xl">
               <div className="flex justify-between items-center mb-6 pb-4 border-b border-dark-700/50">
                 <span className="font-bold uppercase tracking-widest text-xs text-slate-500">Rank</span>
                 <span className="font-bold uppercase tracking-widest text-xs text-slate-500">Player</span>
                 <span className="font-bold uppercase tracking-widest text-xs text-slate-500">Score</span>
               </div>
               <div className="space-y-4">
                 {[
                   { rank: 1, name: "Alexander", score: 9550, color: "text-yellow-400" },
                   { rank: 2, name: "Sarah", score: 8420, color: "text-slate-300" },
                   { rank: 3, name: "David M.", score: 7100, color: "text-amber-500" },
                 ].map(mock => (
                   <div key={mock.rank} className="flex justify-between items-center p-3 rounded-lg bg-dark-800/50 hover:bg-dark-700/30 transition-colors">
                     <span className={`font-bold w-12 ${mock.color}`}>#{mock.rank}</span>
                     <span className="font-semibold flex-1 text-slate-200">{mock.name}</span>
                     <span className="font-bold text-primary">{mock.score}</span>
                   </div>
                 ))}
               </div>
            </div>
         </div>
      </section>

      {/* 7. Call To Action Finale */}
      <section className="px-6 py-40 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent pointer-events-none"></div>
        <h2 className="text-4xl md:text-6xl font-extrabold mb-8 relative z-10">Ready to challenge AI?</h2>
        <Link 
          to="/register" 
          className="relative z-10 inline-flex px-10 py-5 bg-slate-100 hover:bg-white text-dark-900 transition-all rounded-full font-bold text-xl items-center gap-3 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_50px_rgba(255,255,255,0.4)]"
        >
          Start Playing <Gamepad2 size={24} />
        </Link>
      </section>

      {/* 8. Footer */}
      <footer className="border-t border-dark-700/50 bg-dark-900 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2 text-slate-300">
            <BrainCircuit size={24} className="text-primary" />
            <span className="font-bold text-xl tracking-tight">NeuralPlay</span>
          </div>
          <div className="flex gap-6 text-sm font-medium text-slate-400">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Games</Link>
            <Link to="/login" className="hover:text-primary transition-colors">Leaderboard</Link>
          </div>
          <div className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} NeuralPlay. All rights reserved.
          </div>
        </div>
      </footer>

    </div>
  );
};
