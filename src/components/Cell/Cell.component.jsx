import React from "react";
import "./Cell.css";

function Cell({ hasShip, onClick }) {
  return (
    <div
      className={`cell ${hasShip ? "cell-ship" : ""}`}
      onClick={onClick}
    />
  );
}

export default Cell;
