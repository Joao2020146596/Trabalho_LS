import React, { useState, useEffect, useRef } from 'react';
import { Header, Footer, SetupPanel, ControlPanel, GameBoard, GameOverModal } from './components/index.js';
import { INITIAL_FUEL, CELL_STATES } from './constants/index.js';
import { calculatePCMove, getRadarArea } from './helpers/game-logic.js';

export default function App() {
  const [gameState, setGameState] = useState('setup'); 
  const [playerInfo, setPlayerInfo] = useState({ name: '', board: [] });
  const [pcBoard, setPcBoard] = useState([]);
  
  const [turn, setTurn] = useState('player');
  const [fuel, setFuel] = useState(INITIAL_FUEL);
  const [radarAvailable, setRadarAvailable] = useState(false);
  const [radarArea, setRadarArea] = useState(null);
  const [showPcDebug, setShowPcDebug] = useState(false);
  const [moves, setMoves] = useState(0);
  const [winner, setWinner] = useState('');

  const turnStartRef = useRef(0);
  const aiStateRef = useRef({ mode: 'random', firstHit: null, lastHit: null });

  // Defesa Gestão de Combustível (10%) Monitorização constante que força o fim de jogo
  useEffect(() => {
    if (fuel <= 0 && gameState === 'playing') { setWinner('Computador'); setGameState('end'); }
  }, [fuel, gameState]);

  const checkVictory = (board) => board.every(row => row.every(cell => !cell.hasShip || cell.state === CELL_STATES.SUNK));

  const handleTimeout = () => {
    setFuel(f => Math.max(0, f - 5));
    setTurn('pc');
  };

  const handlePlayerAttack = (r, c) => {
    if (turn !== 'player' || pcBoard[r][c].state !== CELL_STATES.WATER) return;
    setRadarArea(null); // Limpa o destaque do radar ao jogar

    const timeTaken = (Date.now() - turnStartRef.current) / 1000;
    let newBoard = [...pcBoard];
    let newFuel = fuel - 5;

    if (newBoard[r][c].hasShip) {
      newBoard[r][c].state = CELL_STATES.HIT;
      newFuel = Math.min(100, newFuel + 10);
      if (timeTaken < 3) setRadarAvailable(true); // Ativa mérito do Radar (jogada acertada em menos de 3 segundos garante o uso)
      
      const sId = newBoard[r][c].shipId;
      const isSunk = newBoard.flat().filter(cell => cell.shipId === sId).every(cell => cell.state === CELL_STATES.HIT);
      if (isSunk) {
        newBoard = newBoard.map(row => row.map(cell => cell.shipId === sId ? {...cell, state: CELL_STATES.SUNK} : cell));
      }
    } else {
      newBoard[r][c].state = CELL_STATES.MISS;
    }

    setPcBoard(newBoard);
    setFuel(newFuel);
    setMoves(m => m + 1);

    if (checkVictory(newBoard)) {
      setWinner(playerInfo.name); setGameState('end');
    } else {
      setTurn('pc');
    }
  };

  useEffect(() => {
    if (turn === 'pc' && gameState === 'playing') {
      const pcTimer = setTimeout(() => {
        const { r, c, aiState } = calculatePCMove(playerInfo.board, aiStateRef.current);
        aiStateRef.current = aiState;
        
        let newBoard = [...playerInfo.board];
        if (newBoard[r][c].hasShip) {
          newBoard[r][c].state = CELL_STATES.HIT;
          aiStateRef.current.mode = 'hunt';
          aiStateRef.current.lastHit = { r, c };
          if (!aiStateRef.current.firstHit) aiStateRef.current.firstHit = { r, c };
          
          const sId = newBoard[r][c].shipId;
          const isSunk = newBoard.flat().filter(cell => cell.shipId === sId).every(cell => cell.state === CELL_STATES.HIT);
          if (isSunk) {
            newBoard = newBoard.map(row => row.map(cell => cell.shipId === sId ? {...cell, state: CELL_STATES.SUNK} : cell));
            aiStateRef.current.mode = 'random';
          }
        } else {
          newBoard[r][c].state = CELL_STATES.MISS;
        }

        setPlayerInfo({ ...playerInfo, board: newBoard });
        if (checkVictory(newBoard)) {
          setWinner('Computador'); setGameState('end');
        } else {
          setTurn('player');
          turnStartRef.current = Date.now();
        }
      }, 1000);
      return () => clearTimeout(pcTimer);
    }
  }, [turn, gameState]);

  // Defesa Fim de Jogo Botão de Restart (5%) Reset de estado via React puro sem recarregar a página
  const handleRestart = () => {
    setGameState('setup'); setFuel(INITIAL_FUEL); setMoves(0);
    setRadarAvailable(false); setRadarArea(null); setTurn('player');
    aiStateRef.current = { mode: 'random', firstHit: null, lastHit: null };
  };

  return (
    <div id="container">
      <Header />
      {gameState === 'setup' && (
        <SetupPanel onComplete={(name, pBoard, cBoard) => {
          setPlayerInfo({ name, board: pBoard }); setPcBoard(cBoard);
          setGameState('playing'); turnStartRef.current = Date.now();
        }} />
      )}
      {gameState === 'playing' && (
        <>
          <ControlPanel 
            turn={turn} fuel={fuel} radarAvailable={radarAvailable}
            showPcDebug={showPcDebug} onToggleDebug={() => setShowPcDebug(!showPcDebug)}
            onTimeout={handleTimeout}
            onUseRadar={() => { setRadarArea(getRadarArea(pcBoard)); setRadarAvailable(false); }}
          />
          <h3 style={{textAlign: 'center', margin:'10px 0', color: turn === 'player' ? '#27ae60' : '#c0392b'}}>
             Turno: {turn === 'player' ? playerInfo.name : 'Computador'}
          </h3>
          <div className="game-area">
            <GameBoard board={playerInfo.board} title="Tua Frota" isMyBoard={true} disabled={true} />
            <GameBoard board={pcBoard} title="Frota Inimiga" isDebug={showPcDebug} disabled={turn === 'pc'} radarArea={radarArea} onCellClick={handlePlayerAttack} />
          </div>
        </>
      )}
      {gameState === 'end' && <GameOverModal winner={winner} moves={moves} onRestart={handleRestart} />}
      <Footer />
    </div>
  );
}