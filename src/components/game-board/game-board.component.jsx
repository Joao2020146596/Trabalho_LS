import React from 'react';
import Cell from '../cell/cell.component';

// [DEFESA: Aspeto Gráfico e Estados - 10%] O Tabuleiro renderiza células passando o estado visual e destaque de radar.
export default function GameBoard({ 
  board, title, onCellClick, disabled, isDebug, isMyBoard, radarArea,
  onCellHover, onBoardLeave, previewCells = new Set(), isValidPreview 
}) {
  const isRadarTarget = (r, c) => radarArea && r >= radarArea.startR && r <= radarArea.startR + 1 && c >= radarArea.startC && c <= radarArea.startC + 1;

  return (
    <div className={`game-board-container ${disabled ? 'board-disabled' : ''}`} onMouseLeave={onBoardLeave}>
      <h3 style={{ textAlign: 'center' }}>{title}</h3>
      <div className="board-grid">
        {board.map((row, r) => row.map((cell, c) => (
          <Cell 
            key={`${r}-${c}`} 
            state={cell.state} 
            hasShip={cell.hasShip} 
            isDebug={isDebug} 
            isMyShip={isMyBoard} 
            isRadarTarget={isRadarTarget(r, c)} 
            isPreview={previewCells.has(`${r}-${c}`)}
            isValidPreview={isValidPreview}
            onClick={() => !disabled && onCellClick && onCellClick(r, c)} 
            onMouseEnter={() => !disabled && onCellHover && onCellHover(r, c)}
          />
        )))}
      </div>
    </div>
  );
}