import React from "react";
import "./Board.css";
import { Cell } from "../";

function Board({ title, board, showShips, onCellClick }) {
  return (
    <div className="board-container">
      <h2 className="board-title">{title}</h2>
      <div className="board-grid">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => {
            // Calcular o estado visual da célula
            let state = "water";
            if (cell.sunk)                          state = "sunk";
            else if (cell.hit && cell.shipId)       state = "hit";
            else if (cell.hit && !cell.shipId)      state = "miss";
            else if (!cell.hit && cell.shipId && showShips) state = "ship";

            return (
              <Cell
                key={`${rowIndex}-${colIndex}`}
                state={state}
                onClick={() => onCellClick(rowIndex, colIndex)}
              />
            );
          })
        )}
      </div>
    </div>
  );
}

export default Board;
