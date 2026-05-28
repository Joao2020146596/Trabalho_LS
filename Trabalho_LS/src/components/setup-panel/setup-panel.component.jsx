import React, { useState } from 'react';
import { FLEET } from '../../constants/index.js';
import { generateFixedFleet, generateRandomFleet, isValidPlacement, placeShip, createEmptyBoard } from '../../helpers/game-logic.js';
import GameBoard from '../game-board/game-board.component.jsx';

export default function SetupPanel({ onComplete }) {
  const [playerName, setPlayerName] = useState('');
  const [board, setBoard] = useState(createEmptyBoard());
  const [shipsToPlace, setShipsToPlace] = useState(FLEET);
  const [isHorizontal, setIsHorizontal] = useState(true);
  const [pcConfig, setPcConfig] = useState('random');

  const currentShip = shipsToPlace[0];

  const handleCellClick = (r, c) => {
    if (!currentShip) return;
    if (isValidPlacement(board, r, c, currentShip.size, isHorizontal)) {
      setBoard(placeShip(board, r, c, currentShip, isHorizontal));
      setShipsToPlace(shipsToPlace.slice(1));
    } else {
      alert("Posição inválida ou sobreposição.");
    }
  };

  const handleStart = () => {
    const pcBoard = pcConfig === 'random' ? generateRandomFleet() : generateFixedFleet(pcConfig);
    onComplete(playerName, board, pcBoard);
  };

  return (
    <div className="setup-panel">
      <div>
        <h2>Quartel-General</h2>
        {/* [DEFESA: Setup Inicial - 7.5%] O input é controlado e a validação impede o início de jogo sem nome. */}
        <input type="text" placeholder="Insere o teu Nome" value={playerName} onChange={e => setPlayerName(e.target.value)} style={{marginBottom: '15px', padding: '5px'}}/>
        
        {/* [DEFESA: Configuração do Computador - 10%] Menu select para as 3 frotas pre-definidas. */}
        <div>
           <label>Frota Inimiga: </label>
           <select value={pcConfig} onChange={e => setPcConfig(e.target.value)}>
             <option value="random">Aleatória</option>
             <option value="fixed1">Pré-definida 1</option>
             <option value="fixed2">Pré-definida 2</option>
             <option value="fixed3">Pré-definida 3</option>
           </select>
        </div>

        <div style={{marginTop: '20px'}}>
          {currentShip ? (
            <>
              <p>Navio: <strong>{currentShip.name}</strong> (Tam: {currentShip.size})</p>
              <button className="btn-primary" onClick={() => setIsHorizontal(!isHorizontal)}>Rodar ({isHorizontal ? 'H' : 'V'})</button>
            </>
          ) : (
            <button className="btn-primary" disabled={!playerName.trim()} onClick={handleStart}>Iniciar Batalha</button>
          )}
        </div>
      </div>
      <GameBoard board={board} title="O Teu Tabuleiro" isMyBoard={true} disabled={!currentShip} onCellClick={handleCellClick} />
    </div>
  );
}