import React from 'react';
import Cell from './Cell';

export default function Board({ board, onCellClick }) {
  return (
    <div className="flex flex-col border-2 border-black w-max">
      {board.map((row, rowIndex) => (
        <div key={rowIndex} className="flex">
          {row.map((cell, colIndex) => (
            <Cell 
              key={`${rowIndex}-${colIndex}`}
              hasShip={cell.hasShip}
              onClick={() => onCellClick(rowIndex, colIndex)}
            />
          ))}
        </div>
      ))}
    </div>
  );
}