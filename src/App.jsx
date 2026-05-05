import React from 'react'
import { useState } from "react";
import { ControlPanel, Board, Header, Setup } from "./components/";
import './assets/App.css'

// Tabuleiro 10x10 vazio
const createEmptyBoard = () =>
  Array(10).fill(null).map(() =>
    Array(10).fill(null).map(() => ({ shipId: null }))
  );

function App() {
  // Nome do jogador
  const [playerName, setPlayerName] = useState("Jogador");

  // Jogo iniciado
  const [gameStarted, setGameStarted] = useState(false);
  const handleGameStarted = () => setGameStarted(prev => !prev);

  // Navio selecionado e orientação
  const [selectedShip, setSelectedShip] = useState(null);
  const [orientation, setOrientation] = useState("horizontal");

  // Tabuleiro do jogador (estado aqui para passar ao Board)
  const [playerBoard, setPlayerBoard] = useState(createEmptyBoard());

  // Navios já colocados (para saber quais ainda faltam)
  const [placedShips, setPlacedShips] = useState([]);

  const handleSelectedShip = (ship) => {
    setSelectedShip(ship);
  };

  // Lógica de colocação de navio ao clicar numa célula
  const handleCellClick = (row, col) => {
    if (!selectedShip || gameStarted) return;

    const size = selectedShip.size;

    // Verificar limites
    if (orientation === "horizontal" && col + size > 10) {
      alert("O navio sai fora do tabuleiro!");
      return;
    }
    if (orientation === "vertical" && row + size > 10) {
      alert("O navio sai fora do tabuleiro!");
      return;
    }

    // Verificar sobreposição
    for (let i = 0; i < size; i++) {
      const r = orientation === "horizontal" ? row : row + i;
      const c = orientation === "horizontal" ? col + i : col;
      if (playerBoard[r][c].shipId !== null) {
        alert("Já existe um navio nessa posição!");
        return;
      }
    }

    // Colocar navio no tabuleiro
    const newBoard = playerBoard.map(r => r.map(c => ({ ...c })));
    for (let i = 0; i < size; i++) {
      const r = orientation === "horizontal" ? row : row + i;
      const c = orientation === "horizontal" ? col + i : col;
      newBoard[r][c] = { shipId: selectedShip.name };
    }

    setPlayerBoard(newBoard);
    setPlacedShips(prev => [...prev, selectedShip.name]);
    setSelectedShip(null); // desseleciona após colocar
  };

  return (
    <div id="container">
      <Header />
      <ControlPanel
        gameStarted={gameStarted}
        onGameStart={handleGameStarted}
        onNameChange={setPlayerName}
      />
      <div id="game-boards-container">
        <Board
          title={`Frota de ${playerName}`}
          board={playerBoard}
          onCellClick={handleCellClick}
        />
        <Board title="Frota Inimiga" board={createEmptyBoard()} onCellClick={() => {}} />
      </div>
      <Setup
        gameStarted={gameStarted}
        selectedShip={selectedShip}
        onSelectedShip={handleSelectedShip}
        orientation={orientation}
        onOrientationChange={setOrientation}
        placedShips={placedShips}
      />
    </div>
  );
}

export default App;
