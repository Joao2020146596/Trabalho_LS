import React, { useState } from 'react';
import Setup from './components/Setup';
// O componente 'Game' será criado nas próximas semanas
// import Game from './components/Game'; 

export default function App() {
  const [gameState, setGameState] = useState('setup'); // 'setup' ou 'playing'
  const [playerData, setPlayerData] = useState(null);

  const handleSetupComplete = (name, finalBoard) => {
    setPlayerData({
      name: name,
      board: finalBoard
    });
    setGameState('playing');
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans">
      <header className="bg-blue-900 text-white p-4 text-center">
        <h1 className="text-3xl font-bold">Batalha Naval Avançada</h1>
      </header>

      <main className="container mx-auto mt-8">
        {gameState === 'setup' && (
          <Setup onSetupComplete={handleSetupComplete} />
        )}

        {gameState === 'playing' && (
          <div className="text-center p-8">
            <h2 className="text-2xl font-bold text-green-600">O jogo começa agora, Comandante {playerData.name}!</h2>
            <p className="mt-4">Nesta fase, avançarás para o desenvolvimento do adversário e inteligência artificial (Semana 2).</p>
          </div>
          /*{ <Game playerData={playerData} /> }*/
        )}
      </main>
    </div>
  );
}