import React from "react";
import "./Board.css";
import { Cell } from "../";

function Board(props){

    const {title} = props;
    const cells = Array(100).fill(null);

    return (
        <div className="board-container">
            <h2 className="board-title">{title}</h2>
            <div className="board-grid">
            {cells.map((_, index) => (
                <Cell Key={index}/>
            ))}
            </div>
        </div>
    );
}

export default Board;