import React from "react";
import "./ControlPanel.css";
function ControlPanel(props){
    
    const {gameStarted, onGameStart, onNameChange} = props;
    const gameStartedClass = gameStarted ? " gameStarted" : "";

    return (

        <div className="dashboard">
            <div className="setup-section">
                <h3>Configuração</h3>
                <input 
                type="text" 
                placeholder="Nome do Almirante" 
                className="name-input"
                disabled={gameStarted}
                onChange={(e) => onNameChange(e.target.value)}
                />
                <button className="start-button" 
                onClick={onGameStart}>
                {gameStarted ? "Parar jogo" : "Iniciar jogo"}
                </button>
            </div>
            <div className={"hidden information_game"+gameStartedClass}>
            <dl className="stats-list">
                <dt>Tempo:</dt>
                <dd id="gameTime">
                15s
                </dd>
            
                <dt>Combustível:</dt>
                <dd id="fuelLevel">100</dd>
            </dl>

            <button className="view-bot-button">
                <span className="icon">👁️</span>
            </button>

            <button className="radar-button">
                Radar Inteligente
            </button>
            </div>
        
        </div>
    );
}

export default ControlPanel;