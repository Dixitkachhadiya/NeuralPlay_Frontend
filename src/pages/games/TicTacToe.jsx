import { useState, useEffect } from 'react';
import { Loader2, RefreshCw, Trophy, X, Circle } from 'lucide-react';
import api from '../../services/api';

const WINNING_COMBINATIONS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
  [0, 4, 8], [2, 4, 6]             // Diagonals
];

export const TicTacToe = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner] = useState(null); // 'X', 'O', 'Draw', null
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [winningLine, setWinningLine] = useState([]);
  const [scoreChange, setScoreChange] = useState(null);

  const recordResult = async (finalWinner) => {
    try {
      let status = 'draw';
      if (finalWinner === 'X') status = 'win';
      if (finalWinner === 'O') status = 'lose';
      
      const res = await api.post('/game/play', {
        game: 'tic_tac_toe',
        user_move: status
      });
      setScoreChange(res.data.score_awarded);
    } catch (err) {
      console.error('Failed to record game result', err);
    }
  };

  const checkWinner = (squares) => {
    for (let i = 0; i < WINNING_COMBINATIONS.length; i++) {
      const [a, b, c] = WINNING_COMBINATIONS[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return { winner: squares[a], line: [a, b, c] };
      }
    }
    if (!squares.includes(null)) {
      return { winner: 'Draw', line: [] };
    }
    return null;
  };

  const handleSquareClick = async (index) => {
    if (board[index] || winner || !isPlayerTurn || loading) return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);
    setIsPlayerTurn(false);
    setError('');

    const winStatus = checkWinner(newBoard);
    if (winStatus) {
      setWinner(winStatus.winner);
      setWinningLine(winStatus.line);
      recordResult(winStatus.winner);
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/game/ai-move', { 
        game: 'tic_tac_toe',
        user_move: newBoard 
      });
      const aiMove = response.data.ai_move;
      
      if (aiMove !== null && aiMove !== undefined) {
        newBoard[aiMove] = 'O';
        setBoard([...newBoard]);
        
        const afterAiWinStatus = checkWinner(newBoard);
        if (afterAiWinStatus) {
          setWinner(afterAiWinStatus.winner);
          setWinningLine(afterAiWinStatus.line);
          recordResult(afterAiWinStatus.winner);
        }
      }
    } catch (err) {
      setError('AI failed to make a move. Please reset and try again.');
    } finally {
      setIsPlayerTurn(true);
      setLoading(false);
    }
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setWinner(null);
    setWinningLine([]);
    setScoreChange(null);
    setIsPlayerTurn(true);
    setError('');
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-2">
         <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent inline-block">
          Tic Tac Toe
        </h1>
        <p className="text-slate-400">Can you defeat the unbeatable AI?</p>
      </div>

      {error && (
        <div className="rounded-lg bg-red-500/10 p-4 text-sm text-red-500 border border-red-500/20 text-center">
          {error}
        </div>
      )}

      {/* Game Header */}
      <div className="flex justify-between items-center bg-dark-800/50 p-4 rounded-xl border border-dark-700/50">
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${isPlayerTurn && !winner ? 'bg-primary/20 text-primary' : 'text-slate-400'}`}>
          <X size={20} /> <span className="font-medium">You (X)</span>
        </div>
        <div className="flex items-center gap-2">
           {loading && <Loader2 className="animate-spin text-secondary" size={20}/>}
           <span className="text-2xl font-bold text-slate-600">VS</span>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-lg ${!isPlayerTurn && !winner && !loading ? 'bg-secondary/20 text-secondary' : 'text-slate-400'}`}>
           <span className="font-medium">AI (O)</span> <Circle size={20} />
        </div>
      </div>

      {/* Board */}
      <div className="mx-auto w-full max-w-[400px] aspect-square">
        <div className="grid grid-cols-3 grid-rows-3 gap-3 h-full">
          {board.map((square, i) => {
            const isWinningSquare = winningLine.includes(i);
            return (
              <button
                key={i}
                onClick={() => handleSquareClick(i)}
                disabled={square || winner || !isPlayerTurn}
                className={`
                  relative flex items-center justify-center rounded-xl text-5xl transition-all duration-300
                  ${!square && !winner && isPlayerTurn ? 'hover:bg-dark-700 cursor-pointer bg-dark-800' : 'bg-dark-800'}
                  ${isWinningSquare ? 'bg-green-500/20 border-2 border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.3)]' : 'border border-dark-700/50 hover:border-primary/50'}
                  ${square === 'X' ? 'text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.5)]' : ''}
                  ${square === 'O' ? 'text-secondary drop-shadow-[0_0_8px_rgba(236,72,153,0.5)]' : ''}
                `}
              >
                {square === 'X' && <X size={64} strokeWidth={2.5} className="animate-in zoom-in duration-200" />}
                {square === 'O' && <Circle size={56} strokeWidth={3} className="animate-in zoom-in duration-200" />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Result Area */}
      {winner && (
        <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
           <div className={`inline-flex flex-col items-center gap-2 p-6 rounded-2xl border bg-dark-800/80 backdrop-blur-sm shadow-xl
             ${winner === 'X' ? 'border-primary/50 text-primary' : winner === 'O' ? 'border-secondary/50 text-secondary' : 'border-slate-500/50 text-slate-300'}
           `}>
             {winner === 'X' ? <Trophy size={48} className="text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)]" /> : null}
             <h2 className="text-3xl font-bold uppercase tracking-widest">
               {winner === 'Draw' ? "It's a Draw!" : `${winner === 'X' ? 'You Win!' : 'AI Wins!'}`}
             </h2>
             {scoreChange !== null && (
                <div className="mt-2 text-lg">
                  <span className="text-slate-400">Score Change: </span>
                  <span className={scoreChange > 0 ? 'text-green-400 font-bold' : scoreChange < 0 ? 'text-red-400 font-bold' : 'text-slate-400 font-bold'}>
                    {scoreChange > 0 ? '+' : ''}{scoreChange}
                  </span>
                </div>
             )}
           </div>
           
           <button
             onClick={resetGame}
             className="mx-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-secondary px-8 py-3 font-medium text-white transition-transform hover:scale-105 shadow-lg"
           >
             <RefreshCw className="h-5 w-5" />
             Play Again
           </button>
        </div>
      )}
      
      {!winner && board.some(s => s !== null) && (
        <div className="text-center">
           <button
             onClick={resetGame}
             className="text-slate-400 hover:text-white transition-colors text-sm underline underline-offset-4"
           >
             Restart Game
           </button>
        </div>
      )}
    </div>
  );
};
