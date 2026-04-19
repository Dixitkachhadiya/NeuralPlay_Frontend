import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Gamepad2, History, Trophy, LogOut, LayoutDashboard, BrainCircuit } from 'lucide-react';

export const Layout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Play Game', path: '/dashboard/games', icon: <Gamepad2 size={20} /> },
    { name: 'History', path: '/dashboard/history', icon: <History size={20} /> },
    { name: 'Leaderboard', path: '/dashboard/leaderboard', icon: <Trophy size={20} /> },
  ];

  return (
    <div className="flex h-[100dvh] w-full overflow-hidden bg-dark-900 text-slate-200">
      {/* Sidebar */}
      <aside className="w-64 border-r border-dark-700/50 bg-dark-800/50 p-6 flex flex-col backdrop-blur-sm hidden md:flex">
        <div className="flex items-center mb-10 gap-3 text-primary">
          <BrainCircuit size={32} />
          <h2 className="text-2xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">NeuralPlay</h2>
        </div>
        
        <nav className="flex-1 space-y-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 transition-all ${
                  isActive
                    ? 'bg-primary/20 text-primary border border-primary/20'
                    : 'text-slate-400 hover:bg-dark-700/50 hover:text-slate-200'
                }`}
              >
                {link.icon}
                <span className="font-medium">{link.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-dark-700/50 pt-6">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Logged in as</p>
            <p className="font-medium text-slate-300 truncate">{user?.name}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-4 py-3 text-red-500 transition-colors hover:bg-red-500/10"
          >
            <LogOut size={20} />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-x-hidden overflow-y-auto w-full relative">
        {/* Mobile Header */}
        <header className="md:hidden flex items-center justify-between border-b border-dark-700/50 bg-dark-800/80 p-4 backdrop-blur-md sticky top-0 z-10">
           <div className="flex items-center gap-2 text-primary">
             <BrainCircuit size={24} />
             <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">NeuralPlay</h1>
           </div>
           <button onClick={handleLogout} className="text-red-500 p-2">
             <LogOut size={20} />
           </button>
        </header>
        
        {/* Mobile Nav Scroll (Simple variant) */}
        <div className="md:hidden flex overflow-x-auto border-b border-dark-700/50 bg-dark-800/50 hide-scrollbar">
           {navLinks.map((link) => {
             const isActive = location.pathname === link.path || (link.path !== '/' && location.pathname.startsWith(link.path));
             return (
               <Link
                 key={link.name}
                 to={link.path}
                 className={`flex items-center gap-2 px-4 py-3 whitespace-nowrap border-b-2 text-sm ${
                   isActive ? 'border-primary text-primary' : 'border-transparent text-slate-400'
                 }`}
               >
                 {link.icon}
                 {link.name}
               </Link>
             );
           })}
        </div>

        <div className="p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
