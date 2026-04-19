import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Pages
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { History } from './pages/History';
import { Leaderboard } from './pages/Leaderboard';
import { RockPaperScissors } from './pages/games/RockPaperScissors';
import { TicTacToe } from './pages/games/TicTacToe';
import { SnakeWaterGun } from './pages/games/SnakeWaterGun';
import { QuizGame } from './pages/games/QuizGame';
import { NumberGuessing } from './pages/games/NumberGuessing';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/" element={<Home />} />
          
          {/* Protected Routes encapsulated in Layout */}
          <Route path="/dashboard" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            
            <Route path="games">
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="rps" element={<RockPaperScissors />} />
              <Route path="tictactoe" element={<TicTacToe />} />
              <Route path="swg" element={<SnakeWaterGun />} />
              <Route path="quiz" element={<QuizGame />} />
              <Route path="guess" element={<NumberGuessing />} />
            </Route>

            <Route path="history" element={<History />} />
            <Route path="leaderboard" element={<Leaderboard />} />
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
