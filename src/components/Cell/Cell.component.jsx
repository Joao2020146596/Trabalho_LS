import React from "react";
import "./Cell.css";

function Cell({ state, onClick }) {
  return (
    <div
      className={`cell cell-${state}`}
      onClick={onClick}
    />
  );
}

export default Cell;
