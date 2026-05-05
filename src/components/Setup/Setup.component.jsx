import React from "react";
import "./Setup.css";

const FLEET = [
  { name: "Porta-Aviões",      size: 5, quantity: 1 },
  { name: "Couraçado",         size: 4, quantity: 1 },
  { name: "Cruzador",          size: 3, quantity: 2 },
  { name: "Contratorpedeiro",  size: 2, quantity: 2 },
];

// Quantos navios de cada tipo existem no total
const TOTAL_BY_NAME = Object.fromEntries(
  FLEET.map(s => [s.name, s.quantity])
);

function Setup({ gameStarted, selectedShip, onSelectedShip, orientation, onOrientationChange, placedShips }) {
  const gameStartedClass = gameStarted ? "" : " gameStarted";

  // Conta quantos já foram colocados por nome
  const countPlaced = (name) => placedShips.filter(n => n === name).length;

  // Um navio ainda disponível = colocados < quantidade total
  const isAvailable = (ship) => countPlaced(ship.name) < TOTAL_BY_NAME[ship.name];

  return (
    <div className={"hidden setup-container" + gameStartedClass}>
      <h2 className="setup-title">Preparar Frota</h2>

      {/* Seletor de orientação */}
      <div className="orientation-selector">
        <span className="label">Orientação:</span>
        <button
          className={`opt-btn ${orientation === "horizontal" ? "active" : ""}`}
          onClick={() => onOrientationChange("horizontal")}
        >
          Horizontal
        </button>
        <button
          className={`opt-btn ${orientation === "vertical" ? "active" : ""}`}
          onClick={() => onOrientationChange("vertical")}
        >
          Vertical
        </button>
      </div>

      {/* Lista de navios */}
      <div className="fleet-list">
        <p className="instruction">Selecione um navio para posicionar:</p>
        <div className="ship-item">
          {FLEET.map((ship, index) => {
            const available = isAvailable(ship);
            const isSelected = selectedShip?.name === ship.name;
            return (
              <div
                key={index}
                className={`ship-visual ${!available ? "ship-placed" : ""} ${isSelected ? "ship-selected" : ""}`}
                onClick={() => available && onSelectedShip(ship)}
              >
                <span className="ship-name">
                  {ship.name} ({ship.size})
                </span>
                <span className="ship-segment">
                  {countPlaced(ship.name)}/{TOTAL_BY_NAME[ship.name]}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="setup-footer">
        {selectedShip
          ? <p>A colocar: <strong>{selectedShip.name}</strong> — clica no tabuleiro ({orientation})</p>
          : <p>Clique num navio para o selecionar.</p>
        }
      </div>
    </div>
  );
}

export default Setup;
