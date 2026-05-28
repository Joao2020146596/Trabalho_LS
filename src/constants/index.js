export const BOARD_SIZE = 10;
export const INITIAL_FUEL = 100;
export const TURN_TIME = 15;

export const FLEET = [
  { id: 'S5', size: 5, name: 'Porta-Aviões' },
  { id: 'S4', size: 4, name: 'Couraçado' },
  { id: 'S3_1', size: 3, name: 'Cruzador 1' },
  { id: 'S3_2', size: 3, name: 'Cruzador 2' },
  { id: 'S2_1', size: 2, name: 'Contratorpedeiro 1' },
  { id: 'S2_2', size: 2, name: 'Contratorpedeiro 2' }
];

export const CELL_STATES = { WATER: 'WATER', MISS: 'MISS', HIT: 'HIT', SUNK: 'SUNK' };