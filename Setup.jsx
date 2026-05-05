import React, { useState } from 'react';
import Board from './Board';

// Frota obrigatória segundo o guião
const INITIAL_SHIPS = [
  { id: 'S5', size: 5, name: 'Porta-Aviões' },
  { id: 'S4', size: 4, name: 'Couraçado' },
  { id: 'S3_1', size: 3, name: 'Cruzador 1' },
  { id: 'S3_2', size: 3, name: 'Cruzador 2' },
  { id: 'S2_1', size: 2, name: 'Contratorpedeiro 1' },
  { id: 'S2_2', size: 2, name: 'Contratorpedeiro 2' }
];

// Criação do tabuleiro 10x10 vazio
const createEmptyBoard = () => 
  Array(10).fill(null).map(() => 
    Array(10).fill({ hasShip: false })
  );

export default function Setup({ onSetupComplete }) {
  const [playerName, setPlayerName] = useState('');
  const [board, setBoard] = useState(createEmptyBoard());
  const [shipsToPlace, setShipsToPlace] = useState(INITIAL_SHIPS);
  const [isHorizontal, setIsHorizontal] = useState(true);

  const currentShip = shipsToPlace[0];

  const handleCellClick = (r, c) => {
    if (!currentShip || playerName.trim() === '') return;

    // Validação 1: Limites do Tabuleiro
    if (isHorizontal && c + currentShip.size > 10) {
      alert("Posição inválida! O navio sai fora do tabuleiro.");
      return;
    }
    if (!isHorizontal && r + currentShip.size > 10) {
      alert("Posição inválida! O navio sai fora do tabuleiro.");
      return;
    }

    // Validação 2: Sobreposição
    for (let i = 0; i < currentShip.size; i++) {
      const checkRow = isHorizontal ? r : r + i;
      const checkCol = isHorizontal ? c + i : c;
      if (board[checkRow][checkCol].hasShip) {
        alert("Posição inválida! Já existe um navio nessa posição.");
        return;
      }
    }

    // Posicionar Navio
    const newBoard = board.map(row => [...row]); // Cópia profunda (shallow a nível de linha)
    for (let i = 0; i < currentShip.size; i++) {
      const placeRow = isHorizontal ? r : r + i;
      const placeCol = isHorizontal ? c + i : c;
      newBoard[placeRow][placeCol] = { ...newBoard[placeRow][placeCol], hasShip: true };
    }

    setBoard(newBoard);
    
    // Atualizar navios disponíveis
    const remainingShips = shipsToPlace.slice(1);
    setShipsToPlace(remainingShips);
  };

  const handleFinishSetup = () => {
    if (shipsToPlace.length > 0) {
      alert("Tens de posicionar toda a tua frota antes de começar!");
      return;
    }
    // Passa o tabuleiro configurado e o nome para o componente principal
    onSetupComplete(playerName, board);
  };

  return (
    <div className="p-8 flex flex-col items-center gap-6">
      <h2 className="text-2xl font-bold">Configuração Inicial</h2>
      
      {/* Solicitar o nome do jogador antes da partida */}
      <div className="flex gap-4 items-center">
        <label className="font-semibold">Nome do Jogador:</label>
        <input 
          type="text" 
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
          className="border p-2 rounded"
          placeholder="Insere o teu nome"
        />
      </div>

      <div className="flex gap-8">
        <div>
          <Board board={board} onCellClick={handleCellClick} />
        </div>

        <div className="flex flex-col gap-4 bg-gray-100 p-4 rounded shadow">
          <h3 className="text-xl font-semibold">Quartel-General</h3>
          
          {currentShip ? (
            <>
              <p>A posicionar: <strong>{currentShip.name}</strong> (Tamanho: {currentShip.size})</p>
              
              {/* Opção para alternar orientação */}
              <button 
                onClick={() => setIsHorizontal(!isHorizontal)}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Mudar Orientação: {isHorizontal ? 'Horizontal' : 'Vertical'}
              </button>
            </>
          ) : (
            <p className="text-green-600 font-bold">Frota posicionada com sucesso!</p>
          )}

          <button 
            onClick={handleFinishSetup}
            disabled={shipsToPlace.length > 0 || playerName.trim() === ''}
            className="mt-4 bg-green-500 text-white px-4 py-2 rounded disabled:bg-gray-400 hover:bg-green-600"
          >
            Iniciar Batalha
          </button>
        </div>
      </div>
    </div>
  );
}