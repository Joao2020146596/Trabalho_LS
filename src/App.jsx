import React, { useState, useEffect } from 'react';
import { ControlPanel, Board, Header, Setup } from "./components/";
import './assets/App.css'

// ─── Frota ────────────────────────────────────────────────────────────────────
const FLEET = [
  { name: "Porta-Aviões",     size: 5 },
  { name: "Couraçado",        size: 4 },
  { name: "Cruzador",         size: 3 },
  { name: "Cruzador",         size: 3 },
  { name: "Contratorpedeiro", size: 2 },
  { name: "Contratorpedeiro", size: 2 },
];

const PREDEFINED_FLEETS = [
  [
    { name: "Porta-Aviões",     size: 5, row: 0, col: 0, orientation: "horizontal" },
    { name: "Couraçado",        size: 4, row: 2, col: 3, orientation: "horizontal" },
    { name: "Cruzador",         size: 3, row: 4, col: 0, orientation: "horizontal" },
    { name: "Cruzador",         size: 3, row: 6, col: 5, orientation: "horizontal" },
    { name: "Contratorpedeiro", size: 2, row: 8, col: 1, orientation: "horizontal" },
    { name: "Contratorpedeiro", size: 2, row: 8, col: 7, orientation: "horizontal" },
  ],
  [
    { name: "Porta-Aviões",     size: 5, row: 1, col: 5, orientation: "vertical" },
    { name: "Couraçado",        size: 4, row: 0, col: 0, orientation: "horizontal" },
    { name: "Cruzador",         size: 3, row: 5, col: 2, orientation: "horizontal" },
    { name: "Cruzador",         size: 3, row: 3, col: 7, orientation: "vertical" },
    { name: "Contratorpedeiro", size: 2, row: 7, col: 0, orientation: "horizontal" },
    { name: "Contratorpedeiro", size: 2, row: 9, col: 8, orientation: "horizontal" },
  ],
  [
    { name: "Porta-Aviões",     size: 5, row: 0, col: 9, orientation: "vertical" },
    { name: "Couraçado",        size: 4, row: 0, col: 6, orientation: "vertical" },
    { name: "Cruzador",         size: 3, row: 0, col: 3, orientation: "vertical" },
    { name: "Cruzador",         size: 3, row: 5, col: 0, orientation: "vertical" },
    { name: "Contratorpedeiro", size: 2, row: 5, col: 6, orientation: "vertical" },
    { name: "Contratorpedeiro", size: 2, row: 8, col: 3, orientation: "horizontal" },
  ],
];

// ─── Helpers ──────────────────────────────────────────────────────────────────
const createEmptyBoard = () =>
  Array(10).fill(null).map(() =>
    Array(10).fill(null).map(() => ({ shipId: null, hit: false, sunk: false }))
  );

const placeShipOnBoard = (board, row, col, size, orientation, shipId) => {
  const nb = board.map(r => r.map(c => ({ ...c })));
  for (let i = 0; i < size; i++) {
    const r = orientation === "horizontal" ? row : row + i;
    const c = orientation === "horizontal" ? col + i : col;
    nb[r][c] = { ...nb[r][c], shipId };
  }
  return nb;
};

const generateRandomBoard = () => {
  let board = createEmptyBoard();
  for (const ship of FLEET) {
    let placed = false, attempts = 0;
    while (!placed && attempts < 2000) {
      attempts++;
      const ori = Math.random() < 0.5 ? "horizontal" : "vertical";
      const maxRow = ori === "horizontal" ? 10 : 10 - ship.size + 1;
      const maxCol = ori === "horizontal" ? 10 - ship.size + 1 : 10;
      const row = Math.floor(Math.random() * maxRow);
      const col = Math.floor(Math.random() * maxCol);
      let valid = true;
      for (let i = 0; i < ship.size; i++) {
        const r = ori === "horizontal" ? row : row + i;
        const c = ori === "horizontal" ? col + i : col;
        if (board[r][c].shipId !== null) { valid = false; break; }
      }
      if (valid) { board = placeShipOnBoard(board, row, col, ship.size, ori, ship.name); placed = true; }
    }
  }
  return board;
};

const buildBoardFromFleet = (fleetConfig) => {
  let board = createEmptyBoard();
  for (const s of fleetConfig)
    board = placeShipOnBoard(board, s.row, s.col, s.size, s.orientation, s.name);
  return board;
};

const checkAndMarkSunk = (board, shipId) => {
  const nb = board.map(r => r.map(c => ({ ...c })));
  const allHit = nb.every(row => row.every(c => c.shipId !== shipId || c.hit));
  if (allHit)
    for (let r = 0; r < 10; r++)
      for (let c = 0; c < 10; c++)
        if (nb[r][c].shipId === shipId) nb[r][c].sunk = true;
  return nb;
};

const isFleetDestroyed = (board) =>
  board.every(row => row.every(c => c.shipId === null || c.hit));

// ─── App ──────────────────────────────────────────────────────────────────────
function App() {
  const [playerName, setPlayerName]     = useState("Jogador");
  const [gameStarted, setGameStarted]   = useState(false);
  const [fleetChoice, setFleetChoice]   = useState("random");
  const [showEnemyShips, setShowEnemyShips] = useState(false);

  const [playerBoard, setPlayerBoard]     = useState(createEmptyBoard());
  const [computerBoard, setComputerBoard] = useState(createEmptyBoard());
  const [placedShips, setPlacedShips]     = useState([]);

  const [selectedShip, setSelectedShip] = useState(null);
  const [orientation, setOrientation]   = useState("horizontal");

  const [isPlayerTurn, setIsPlayerTurn] = useState(true);
  const [winner, setWinner]             = useState(null);

  // ── Iniciar / Parar ──────────────────────────────────────────────────────────
  const handleGameStarted = () => {
    if (gameStarted) {
      setPlayerBoard(createEmptyBoard());
      setComputerBoard(createEmptyBoard());
      setPlacedShips([]);
      setSelectedShip(null);
      setIsPlayerTurn(true);
      setWinner(null);
      setGameStarted(false);
      return;
    }
    const compBoard = fleetChoice === "random"
      ? generateRandomBoard()
      : buildBoardFromFleet(PREDEFINED_FLEETS[parseInt(fleetChoice)]);
    setComputerBoard(compBoard);
    setIsPlayerTurn(true);
    setWinner(null);
    setGameStarted(true);
  };

  // ── Posicionar navio (antes do jogo) ─────────────────────────────────────────
  const handlePlayerCellClick = (row, col) => {
    if (gameStarted || !selectedShip) return;
    const size = selectedShip.size;
    if (orientation === "horizontal" && col + size > 10) { alert("Fora do tabuleiro!"); return; }
    if (orientation === "vertical"   && row + size > 10) { alert("Fora do tabuleiro!"); return; }
    for (let i = 0; i < size; i++) {
      const r = orientation === "horizontal" ? row : row + i;
      const c = orientation === "horizontal" ? col + i : col;
      if (playerBoard[r][c].shipId !== null) { alert("Posição ocupada!"); return; }
    }
    setPlayerBoard(placeShipOnBoard(playerBoard, row, col, size, orientation, selectedShip.name));
    setPlacedShips(prev => [...prev, selectedShip.name]);
    setSelectedShip(null);
  };

  // ── Tiro do jogador ──────────────────────────────────────────────────────────
  const handleEnemyCellClick = (row, col) => {
    if (!gameStarted || !isPlayerTurn || winner) return;
    if (computerBoard[row][col].hit) return;

    let nb = computerBoard.map(r => r.map(c => ({ ...c })));
    nb[row][col] = { ...nb[row][col], hit: true };
    if (nb[row][col].shipId !== null) nb = checkAndMarkSunk(nb, nb[row][col].shipId);
    setComputerBoard(nb);

    if (isFleetDestroyed(nb)) { setWinner("player"); return; }
    setIsPlayerTurn(false);
  };

  // ── Turno do computador ──────────────────────────────────────────────────────
  useEffect(() => {
    if (!gameStarted || isPlayerTurn || winner) return;
    const timeout = setTimeout(() => {
      const available = [];
      for (let r = 0; r < 10; r++)
        for (let c = 0; c < 10; c++)
          if (!playerBoard[r][c].hit) available.push([r, c]);
      if (!available.length) return;

      const [r, c] = available[Math.floor(Math.random() * available.length)];
      let nb = playerBoard.map(row => row.map(cell => ({ ...cell })));
      nb[r][c] = { ...nb[r][c], hit: true };
      if (nb[r][c].shipId !== null) nb = checkAndMarkSunk(nb, nb[r][c].shipId);
      setPlayerBoard(nb);

      if (isFleetDestroyed(nb)) { setWinner("computer"); return; }
      setIsPlayerTurn(true);
    }, 1000);
    return () => clearTimeout(timeout);
  }, [isPlayerTurn, gameStarted, winner]);

  return (
    <div id="container">
      <Header />
      <ControlPanel
        gameStarted={gameStarted}
        onGameStart={handleGameStarted}
        onNameChange={setPlayerName}
        fleetChoice={fleetChoice}
        onFleetChoiceChange={setFleetChoice}
        isPlayerTurn={isPlayerTurn}
        showEnemyShips={showEnemyShips}
        onShowEnemyShipsChange={setShowEnemyShips}
      />

      {winner && (
        <div className="winner-banner">
          {winner === "player" ? `🏆 Vitória, ${playerName}!` : "💀 O computador venceu!"}
        </div>
      )}
      {gameStarted && !winner && (
        <div className="turn-indicator">
          {isPlayerTurn ? "🎯 A tua vez — ataca o tabuleiro inimigo!" : "⏳ O computador está a pensar..."}
        </div>
      )}

      <div id="game-boards-container">
        <Board
          title={`Frota de ${playerName}`}
          board={playerBoard}
          showShips={true}
          onCellClick={handlePlayerCellClick}
        />
        <Board
          title="Frota Inimiga"
          board={computerBoard}
          showShips={showEnemyShips}
          onCellClick={handleEnemyCellClick}
        />
      </div>

      <Setup
        gameStarted={gameStarted}
        selectedShip={selectedShip}
        onSelectedShip={setSelectedShip}
        orientation={orientation}
        onOrientationChange={setOrientation}
        placedShips={placedShips}
      />
    </div>
  );
}

export default App;
