import { BOARD_SIZE, CELL_STATES, FLEET } from '../constants/index.js';

export const createEmptyBoard = () => {
  return Array(BOARD_SIZE).fill(null).map(() =>
    Array(BOARD_SIZE).fill(null).map(() => ({ 
      hasShip: false, 
      shipId: null, 
      state: CELL_STATES.WATER 
    }))
  );
};

// Defesa Posicionamento da Frota/Validações (15%)
// Validamos limites do tabuleiro e colisões num único bloco
export const isValidPlacement = (board, r, c, size, isHorizontal) => {
  if (isHorizontal && c + size > BOARD_SIZE) return false;
  if (!isHorizontal && r + size > BOARD_SIZE) return false;
  for (let i = 0; i < size; i++) {
    if (board[isHorizontal ? r : r + i][isHorizontal ? c + i : c].hasShip) return false;
  }
  return true;
};

export const placeShip = (board, r, c, ship, isHorizontal) => {
  const newBoard = board.map(row => [...row]);
  for (let i = 0; i < ship.size; i++) {
    newBoard[isHorizontal ? r : r + i][isHorizontal ? c + i : c] = { hasShip: true, shipId: ship.id, state: CELL_STATES.WATER };
  }
  return newBoard;
};

export const generateRandomFleet = () => {
  let board = createEmptyBoard();
  FLEET.forEach(ship => {
    let placed = false;
    while (!placed) {
      const isHorizontal = Math.random() > 0.5;
      const r = Math.floor(Math.random() * BOARD_SIZE);
      const c = Math.floor(Math.random() * BOARD_SIZE);
      if (isValidPlacement(board, r, c, ship.size, isHorizontal)) {
        board = placeShip(board, r, c, ship, isHorizontal);
        placed = true;
      }
    }
  });
  return board;
};

// Defesa Configuração do PC Frotas Pré-definidas (10%)
export const generateFixedFleet = (type) => {
  const board = createEmptyBoard();
  // Simulação de configuração fixa válida
  // Para garantir validade, usamos um seed fixo ou posições manuais conhecidas
  const configs = {
    fixed1: [ {r:0, c:0, h:true, s:FLEET[0]}, {r:2, c:0, h:true, s:FLEET[1]}, {r:4, c:0, h:true, s:FLEET[2]}, {r:6, c:0, h:true, s:FLEET[3]}, {r:8, c:0, h:true, s:FLEET[4]}, {r:8, c:5, h:true, s:FLEET[5]} ],
    fixed2: [ {r:0, c:9, h:false, s:FLEET[0]}, {r:0, c:7, h:false, s:FLEET[1]}, {r:0, c:5, h:false, s:FLEET[2]}, {r:5, c:5, h:false, s:FLEET[3]}, {r:9, c:0, h:true, s:FLEET[4]}, {r:9, c:3, h:true, s:FLEET[5]} ],
    fixed3: [ {r:0, c:0, h:false, s:FLEET[0]}, {r:0, c:9, h:false, s:FLEET[1]}, {r:9, c:0, h:true, s:FLEET[2]}, {r:9, c:6, h:true, s:FLEET[3]}, {r:5, c:4, h:true, s:FLEET[4]}, {r:7, c:4, h:true, s:FLEET[5]} ]
  };
  let newBoard = board;
  configs[type].forEach(cfg => { newBoard = placeShip(newBoard, cfg.r, cfg.c, cfg.s, cfg.h); });
  return newBoard;
};

// Defesa Inteligência do Computador Nível Avançado (17.5%)
export const calculatePCMove = (board, aiState) => {
  let r, c;
  const isValidTarget = (row, col) => row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE && board[row][col].state === CELL_STATES.WATER;

  if (aiState.mode === 'random') {
    do { r = Math.floor(Math.random() * BOARD_SIZE); c = Math.floor(Math.random() * BOARD_SIZE); } while (!isValidTarget(r, c));
  } else {
    const dirs = [[-1,0], [1,0], [0,-1], [0,1]];
    let found = false;
    for (let [dr, dc] of dirs) {
      if (isValidTarget(aiState.lastHit.r + dr, aiState.lastHit.c + dc)) {
        r = aiState.lastHit.r + dr; c = aiState.lastHit.c + dc; found = true; break;
      }
    }
    if (!found) {
      do { r = Math.floor(Math.random() * BOARD_SIZE); c = Math.floor(Math.random() * BOARD_SIZE); } while (!isValidTarget(r, c));
      aiState.mode = 'random';
    }
  }
  return { r, c, aiState };
};

// Defesa Radar Inteligente (10%) Identifica área 2x2 com pelo menos uma célula do navio vivo
export const getRadarArea = (board) => {
  for (let r = 0; r < BOARD_SIZE - 1; r++) {
    for (let c = 0; c < BOARD_SIZE - 1; c++) {
      const area = [ board[r][c], board[r+1][c], board[r][c+1], board[r+1][c+1] ];
      if (area.some(cell => cell.hasShip && cell.state === CELL_STATES.WATER)) {
        return { startR: r, startC: c };
      }
    }
  }
  return null;
};