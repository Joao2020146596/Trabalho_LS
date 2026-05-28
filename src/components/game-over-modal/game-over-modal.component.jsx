import React from 'react';
export default function GameOverModal({ winner, moves, onRestart }) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Fim de Jogo</h2>
        <p style={{margin: '15px 0'}}>Vencedor: <strong>{winner}</strong></p>
        <p>Jogadas Totais: {moves}</p>
        <button className="btn-primary" onClick={onRestart} style={{marginTop: '20px'}}>Jogar Novamente</button>
      </div>
    </div>
  );
}