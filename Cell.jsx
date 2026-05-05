import React from 'react';

export default function Cell({ hasShip, onClick }) {
  // O estilo muda consoante tem um navio posicionado ou não
  const baseStyle = "w-8 h-8 border border-gray-400 cursor-pointer transition-colors";
  const bgStyle = hasShip ? "bg-gray-800" : "bg-blue-200 hover:bg-blue-300";

  return (
    <div 
      className={`${baseStyle} ${bgStyle}`} 
      onClick={onClick}
    ></div>
  );
}