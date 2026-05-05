import React from "react";
import "./Setup.css";

function Setup(props){
    
    const {gameStarted, SelectedChip, orientation, onSelectedChip} = props;
    const gameStartedClass = gameStarted ? "" : " gameStarted";
    const fleet = [
    { name: "Porta-Aviões", size: 5, quantity:1},
    { name: "Couraçado", size: 4, quantity:1},
    { name: "Cruzador", size: 3, quantity:2 },
    { name: "Contratorpedeiro", size: 2 , quantity:2},
    ];

    return (
        <div className={" hidden setup-container"+gameStartedClass}>
            <h2 className="setup-title">Preparar Frota</h2>
      
            <div className="orientation-selector">
                <span className="label">Orientação:</span>
                <button className="opt-btn active">Horizontal</button>
                <button className="opt-btn">Vertical</button>
            </div>

            <div className="fleet-list">
                <p className="instruction">Selecione um navio para posicionar:</p>
                <div className="ship-item">
                    {fleet.map((chip,index)=> (
                    <div key={index} className="ship-visual">
                        <span className="ship-name">{chip.name}</span>
                        <div className="ship-segment" onClick={() => onSelectedChip(chip)}>{chip.quantity}</div>
                    </div>
                    ))}
                </div>
            </div>

            <div className="setup-footer">
                <p>Clique no tabuleiro para colocar o navio selecionado.</p>
            </div>
        </div>
  );
    
}

export default Setup;