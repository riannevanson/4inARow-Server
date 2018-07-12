import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Board, Symbol, Row } from "./entities";

@ValidatorConstraint()
export class IsBoard implements ValidatorConstraintInterface {
  validate(board: Board) {
    const symbols = ["x", "o", null];
    return (
      board.length === 6 &&
      board.every(
        row => row.length === 7 && row.every(symbol => symbols.includes(symbol))
      )
    );
  }
}

export const isValidTransition = (
  playerSymbol: Symbol,
  from: Board,
  to: Board
) => {
  const changes = from
    .map((row, rowIndex) =>
      row.map((symbol, columnIndex) => ({
        from: symbol,
        to: to[rowIndex][columnIndex]
      }))
    )
    .reduce((a, b) => a.concat(b))
    .filter(change => change.from !== change.to);

  return (
    changes.length === 1 &&
    changes[0].to === playerSymbol &&
    changes[0].from === null
  );
};

export const calculateWinner = (board:Board): Symbol | null => {

  let winnersLength = 4 //5
  let winnerCells=[]
  console.log('calculate winner new')
  // Check rows
  for (let r=0;r<board.length;r++) {
  //for (let r=board.length-1;r>0;r--) {
    let playSymbol=board[r][0]
    let adjSymbols=1
    for (let c=1;c<board[0].length;c++) {
      if (board[r][c] && board[r][c] === playSymbol) {
        adjSymbols++
        if (adjSymbols === winnersLength) {
          console.log('row winner')
          return board[r][c]
        }
      }
      else {
        playSymbol=board[r][c]
        adjSymbols=1
      }
    }
  }
  console.log('no row winner')

  // Check columns
  for (let c=0;c<board[0].length;c++) {
    let playSymbol=board[0][c]
    //let playSymbol=board[board.length-1][c]
    let adjSymbols=1
    for (let r=1;r<board.length;r++) {
    //for (let r=board.length-2;r>0;r--) {
      if (board[r][c] && board[r][c] === playSymbol) {
        adjSymbols++
        if (adjSymbols === winnersLength) {
          console.log('col winner')
          return board[r][c]
        }
      }
      else {
        playSymbol=board[r][c]
        adjSymbols=1
      }
    }
  }
  console.log('no col winner')

  // Check diagonals left to right
  for (let r=0;r<=board.length-winnersLength;r++) {
    for (let c=0;c<=board[0].length-winnersLength;c++) {
    let playSymbol=board[r][c]
    //console.log('row ',r,' col ', c, ' playSymbol ',playSymbol)
    let adjSymbols=1
    for (let diagOffset=1;diagOffset<winnersLength;diagOffset++) {
      if (board[r+diagOffset][c+diagOffset] && 
          board[r+diagOffset][c+diagOffset] === playSymbol) {
          adjSymbols++
          // console.log(r+diagOffset,'row')
          // console.log(c+diagOffset,'col')
          // console.log(playSymbol,'playSymbol')
          // console.log(adjSymbols,'adjSymbols')
          if (adjSymbols === winnersLength) {
            console.log('diagonal winner left to right')
            return board[r+diagOffset][c+diagOffset]
          }
        }
        else {
          playSymbol=board[r+diagOffset][c+diagOffset]
          adjSymbols=1
        }
      }
    }
  }

  // Check diagonals right to left
  for (let r=0;r<=board.length-winnersLength;r++) {
    for (let c=winnersLength-1;c<board[0].length;c++) {
    let playSymbol=board[r][c]
    // console.log('row ',r,' col ', c, ' playSymbol ',playSymbol)
    let adjSymbols=1
    for (let diagOffset=1;diagOffset<4;diagOffset++) {
      if (board[r+diagOffset][c-diagOffset] && 
          board[r+diagOffset][c-diagOffset] === playSymbol) {
          adjSymbols++
          // console.log(r+diagOffset,'row')
          // console.log(c-diagOffset,'col')
          // console.log(playSymbol,'playSymbol')
          // console.log(adjSymbols,'adjSymbols')
          if (adjSymbols === winnersLength) {
            console.log('diagonal winner right to left')
            return board[r+diagOffset][c-diagOffset]
          }
        }
        else {
          playSymbol=board[r+diagOffset][c-diagOffset]
          adjSymbols=1
        }
      }
    }
  }

  console.log('no (diagonal) winner')

  // No winner
  return null
}

export const calculateWinnerOrig = (board: Board): Symbol | null =>
  board
    .concat(
      // vertical winner
      [0, 1, 2].map(n => board.map(row => row[n])) as Row[]
    )
    .concat([
      // diagonal winner ltr
      [0, 1, 2].map(n => board[n][n]),
      // diagonal winner rtl
      [0, 1, 2].map(n => board[2 - n][n])
    ] as Row[])
    .filter(row => row[0] && row.every(symbol => symbol === row[0]))
    .map(row => row[0])[0] || null;

export const finished = (board: Board): boolean =>
  board.reduce((a, b) => a.concat(b) as Row).every(symbol => symbol !== null);
