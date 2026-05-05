import React from 'react'
import {useState} from "react";
import { ControlPanel, Board, Header, Setup } from "./components/";
import './assets/App.css'

function App() {
  //Select chip
  const [SelectedChip, setSelectedShip] = useState(null);
  const [orientation, setOrientation] = useState("horizontal");
  const handleSelectedChip=(ship)=>{console.log("Selecionaste o navio:", ship.name, "de tamanho:", ship.size);
    setSelectedShip(ship);}

  //PlayerName
  const [playerName, setPlayerName] = useState("Jogador");
  
  //Game started
  const [gameStarted, setGameStarted] = useState(false);
  const handleGameStarted = () => {
    if(gameStarted) setGameStarted(false);
    else setGameStarted(true);
  }

  return(
    <div id="container">
        <Header/>
        <ControlPanel gameStarted={gameStarted} 
                      onGameStart={handleGameStarted}
                      onNameChange={setPlayerName}
        />
        <div id="game-boards-container">
          <Board title={`Frota de ${playerName}`} />
          <Board title="Frota Inimiga"/>
        </div>
        <Setup gameStarted={gameStarted}
               SelectedChip={SelectedChip}
               onSelectedChip={handleSelectedChip}
               orientation={orientation}
        />
    </div>
  );
  
}

export default App;
