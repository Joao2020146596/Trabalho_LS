import React from 'react';
export default function Cell({ state, isDebug, isMyShip, hasShip, isRadarTarget, isPreview, isValidPreview, onClick, onMouseEnter }) {
  let statusClass = "cell-water";
  if (state === 'MISS') statusClass = "cell-miss";
  if (state === 'HIT') statusClass = "cell-hit";
  if (state === 'SUNK') statusClass = "cell-sunk";

  const debugClass = (isDebug && hasShip && state === 'WATER') ? "cell-debug" : "";
  const myShipClass = (isMyShip && hasShip && state === 'WATER') ? "cell-my-ship" : "";
  const radarClass = isRadarTarget ? "cell-radar-target" : "";
  
  // cor da preview
  let previewClass = "";
  if (isPreview) {
    previewClass = isValidPreview ? "cell-preview-valid" : "cell-preview-invalid";
  }

  return (
    <div 
      className={`cell ${statusClass} ${debugClass} ${myShipClass} ${radarClass} ${previewClass}`} 
      onClick={onClick} 
      onMouseEnter={onMouseEnter}
    />
  );
}