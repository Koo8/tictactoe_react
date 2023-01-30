import { useState, memo } from 'react';
import './App.css';

//map (row,col) of each Square
const position = [];
for (let r = 0; r < 3; r++) {
  for (let c = 0; c < 3; c++) {
    position.push([r, c]);
  }
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]); // record each rendered Board data
  const [currentMove, setCurrentMove] = useState(0); // for determin rightTable list movement # and position
  const [pairMoveId, setPairMoveId] = useState({}); // to pair each movement with its relavent Square ID
  const isX = currentMove % 2 === 0;
  const currentSquares = history[currentMove]; // this is used for draw each rendered Board

  function updateBoard(newSquares, id) {
    setHistory([...history.slice(0, currentMove + 1), newSquares]); // slice to help remove the list below the currentMove so that a REDO of game is possible
    // pair the move and id for list on rightTable
    const newObj = pairMoveId;
    newObj[currentMove] = id;
    setPairMoveId(newObj);

    setCurrentMove(currentMove + 1);
  }

  function jumpTo(index) {
    redAllSqs(); // if any squares turned 'blue' after a winner is found, change the colors to 'red' again.
    setCurrentMove(index);
  }

  function redAllSqs() {
    for (let i = 0; i < 9; i++) {
      document.getElementById(i).style.color = 'red';
    }
  }

  //draw rightTable list
  const lists = history.map((item, index) => {
    let text;
    if (index === 0) {
      text = `Go to game start`;
    } else {
      text = `Go to move # ${index} @ (${position[pairMoveId[index - 1]]}) `;
    }

    return (
      <li key={index}>
        <button onClick={() => jumpTo(index)}>{text}</button>
      </li>
    );
  });

  return (
    <div>
      <h2 style={{ textAlign: 'center', marginTop: 20 }}>Tic Tac Toe Game</h2>
      <div className='main'>
        <div className='leftTable'>
          <Board
            currentSq={currentSquares}
            showX={isX}
            passNewSquare={updateBoard}
          />
        </div>
        <div className='rightTable'>
          <ol>{lists}</ol>
        </div>
      </div>
    </div>
  );
}

function Board({ currentSq, showX, passNewSquare }) {
  // export a new SquaresBoard Squares array to its parent component
  function handleClickSquare(id) {
    if (getWinner() || currentSq[id]) return;
    const newarr = currentSq.slice();
    newarr[id] = showX ? 'X' : 'O';
    passNewSquare(newarr, id);
  }

  function getWinner() {
    const options = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (let i = 0; i < options.length; i++) {
      const [a, b, c] = options[i];
      if (
        currentSq[a] &&
        currentSq[a] === currentSq[b] &&
        currentSq[a] === currentSq[c]
      ) {
        colorTheThreeSquares(a, b, c);
        return currentSq[a];
      }
    }
    return null;
  }

  function colorTheThreeSquares(a, b, c) {
    // use arguments
    for (let a = 0; a < arguments.length; a++) {
      document.getElementById(arguments[a]).style.color = 'blue';
    }
  }

  let winner = getWinner();
  const title = winner
    ? `Winner is ${winner}`
    : `Next player is ${showX ? 'X' : 'O'}`;

  // use loop to draw squares
  const rows = [];
  for (let row = 0; row < 3; row++) {
    rows.push(
      <div key={row} className='tttrow'>
        {getCols(row)}
      </div>
    );
  }

  // draw the three Squares in each row
  function getCols(row) {
    const cols = [];
    for (let col = 0; col < 3; col++) {
      cols.push(
        <Square
          key={col}
          id={row * 3 + col}
          value={currentSq[row * 3 + col]}
          showPlayer={() => handleClickSquare(row * 3 + col)}
        />
      );
    }
    return cols;
  }

  return (
    <div>
      <h3>{title}</h3>
      <div className='board'>{rows}</div>
    </div>
  );
}

// use memo for efficiency
const Square = memo(({ id, value, showPlayer }) => {
  return (
    <button id={id} className='tttsquare' onClick={showPlayer}>
      {value}
    </button>
  );
});
