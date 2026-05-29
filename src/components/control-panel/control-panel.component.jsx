import React, { useState, useEffect } from 'react';
import { TURN_TIME } from '../../constants';

// Defesa Arquitetura Descentralização de Estado 
// Gerimos o temporizador aqui, libertando o App.jsx de renders segundo a segundo.
export default function ControlPanel({ turn, fuel, radarAvailable, showPcDebug, onToggleDebug, onUseRadar, onTimeout }) {
  const [timeLeft, setTimeLeft] = useState(TURN_TIME);

  useEffect(() => {
    if (turn !== 'player') {
      setTimeLeft(TURN_TIME); // Reseta e pausa no turno do PC
      return;
    }
    if (timeLeft === 0) {
      onTimeout();
      return;
    }
    const timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, turn, onTimeout]);

  return (
    <section className="control-panel">
      <label><input type="checkbox" checked={showPcDebug} onChange={onToggleDebug} /> Ver Frota Inimiga (Debug)</label>
      
      <div style={{display: 'flex', gap: '20px', alignItems: 'center'}}>
        {/* Defesa Cronómetro (10%) Escondido ou pausado durante o turno do adversário */}
        {turn === 'player' && <span>Tempo: <strong>{timeLeft}s</strong></span>}
        <span>Combustível: <strong>{fuel}</strong></span>
        
        {/* Defesa Radar Inteligente (10%) Botão reage à prop calculada no App e aciona callback */}
        <button className="btn-primary" disabled={!radarAvailable} onClick={onUseRadar}>
          {radarAvailable ? 'Usar Radar (Área 2x2)' : 'Radar Inativo'}
        </button>
      </div>
    </section>
  );
}