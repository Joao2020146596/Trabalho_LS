import React from "react";
import "./Board.css";
import { Cell } from "../";

function Board({ title, board, onCellClick }) {
  return (
    <div className="board-container">
      <h2 className="board-title">{title}</h2>
      <div className="board-grid">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <Cell
              key={`${rowIndex}-${colIndex}`}
              hasShip={cell.shipId !== null}
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Board;
