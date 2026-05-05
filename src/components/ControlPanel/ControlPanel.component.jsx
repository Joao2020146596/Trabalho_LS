import React from "react";
import "./ControlPanel.css";

function ControlPanel({
  gameStarted, onGameStart, onNameChange,
  fleetChoice, onFleetChoiceChange,
  isPlayerTurn,
  showEnemyShips, onShowEnemyShipsChange
}) {
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

        {/* Seleção de frota do computador (só antes do jogo) */}
        {!gameStarted && (
          <select
            className="fleet-select"
            value={fleetChoice}
            onChange={(e) => onFleetChoiceChange(e.target.value)}
          >
            <option value="random">🎲 Frota Aleatória</option>
            <option value="0">Frota 1 – Linha de Frente</option>
            <option value="1">Frota 2 – Defesa Dispersa</option>
            <option value="2">Frota 3 – Coluna Vertical</option>
          </select>
        )}

        <button className="start-button" onClick={onGameStart}>
          {gameStarted ? "Reiniciar Jogo" : "Iniciar Jogo"}
        </button>
      </div>

      {/* Painel de jogo (visível durante o jogo) */}
      <div className={"hidden information_game" + gameStartedClass}>
        <dl className="stats-list">
          <dt>Tempo:</dt>
          <dd id="gameTime">15s</dd>
          <dt>Combustível:</dt>
          <dd id="fuelLevel">100</dd>
        </dl>

        {/* Debug: mostrar frota inimiga */}
        <label className="debug-label">
          <input
            type="checkbox"
            checked={showEnemyShips}
            onChange={(e) => onShowEnemyShipsChange(e.target.checked)}
          />
          👁️ Ver frota inimiga (debug)
        </label>

        <button className="radar-button" disabled>
          Radar Inteligente
        </button>
      </div>
    </div>
  );
}

export default ControlPanel;
