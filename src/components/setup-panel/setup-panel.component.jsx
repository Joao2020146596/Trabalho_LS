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
  const [hoverCell, setHoverCell] = useState(null);// para desenhar a preview do navio guarda a celula do houver

  //elemeto visual
//funcao navios laterais
  function ShipPreview({ ship, isActive, isPlaced }) {
  let stateClass = '';
  if (isActive) stateClass = 'active';
  else if (isPlaced) stateClass = 'placed';

  return (
    <div className={`ship-preview ${stateClass}`}>
      <div className="ship-preview-squares">
        {Array.from({ length: ship.size }).map((_, i) => (
          <div key={i} className="ship-square" />
        ))}
      </div>
      <span className="ship-name">{ship.name}</span>
      <span className="ship-status">
        {isPlaced ? 'Colocado' : isActive ? 'A colocar' : 'Por colocar'}
      </span>
    </div>
  );
}

  const currentShip = shipsToPlace[0];

//previews navios no tbuleiro
const getPreviewCells = (r, c) => {
  if (!currentShip || r === null) return new Set();
  const cells = new Set();
  // tamanho do navio
  for (let i = 0; i < currentShip.size; i++) {
    // calcula posicao navio horizontal ou vertical
    const pr = isHorizontal ? r : r + i;
    const pc = isHorizontal ? c + i : c;
    // guarda a cel do preview
    cells.add(`${pr}-${pc}`);
  }

  return cells;
};
  const previewCells = hoverCell ? getPreviewCells(hoverCell.r, hoverCell.c) : new Set();//preview navios
  const isValidHover = hoverCell ? isValidPlacement(board, hoverCell.r, hoverCell.c, currentShip?.size, isHorizontal) : false;//validar se pode por naviospreview

  const handleCellClick = (r, c) => {
    if (!currentShip) return;
    if (isValidPlacement(board, r, c, currentShip.size, isHorizontal)) {
      setBoard(placeShip(board, r, c, currentShip, isHorizontal));
      setShipsToPlace(shipsToPlace.slice(1));
      setHoverCell(null);
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
  {/* Lista lateral de navios */}
        <div style={{ marginTop: '15px' }}>
          {FLEET.map(ship => (
            <ShipPreview
              key={ship.id}
              ship={ship}
              isActive={currentShip && currentShip.id === ship.id}
              isPlaced={!shipsToPlace.find(s => s.id === ship.id)}
            />
          ))}
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
      <GameBoard
        board={board}
        title="O Teu Tabuleiro"
        isMyBoard={true}
        disabled={!currentShip}
        onCellClick={handleCellClick}
      // Atualiza a cel no hover// o preview visual do navio
        onCellHover={(r, c) =>
        setHoverCell(currentShip ? { r, c } : null)
        }
        onBoardLeave={() => setHoverCell(null)}// Remove o prevew quando o rato sai 
         previewCells={previewCells}// celulas a destacar no preview do navio
         isValidPreview={isValidHover}  //  o preview aparece verde ou vermelho
      />
    </div>
  );
}
