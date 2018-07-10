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
  console.log('calculate winner new')
  // Check rows
  for (let r=0;r<board.length;r++) {
    let playSymbol=board[r][0]
    let adjSymbols=1
    for (let c=1;c<board[0].length;c++) {
      if (board[r][c] && board[r][c] === playSymbol) {
        adjSymbols++
        if (adjSymbols === 4) {
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
    let adjSymbols=1
    for (let r=1;r<board.length;r++) {
      if (board[r][c] && board[r][c] === playSymbol) {
        adjSymbols++
        if (adjSymbols === 4) {
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

  // Check diagonals left to right row 0 to 2
  for (let r=0;r<=board.length-4;r++) {
    let playSymbol=board[r][0]
    let adjSymbols=1
    for (let c=1;c<=board[0].length-4;c++) {
      if (board[r+c][c] && board[r+c][c] === playSymbol) {
        adjSymbols++
        console.log(r+c,'row')
        console.log(c,'col')
        console.log(playSymbol,'playSymbol')
        console.log(adjSymbols,'adjSymbols')
        if (adjSymbols === 4) {
          console.log('diagonal winner ltr')
          return board[r+c][c]
        }
      }
      else {
        playSymbol=board[r+c][c]
        adjSymbols=1
      }
    }
  }

  // Check diagonals left to right col 1 to 3
  for (let c=1;c<=board[0].length-4;c++) {
    let playSymbol=board[0][c]
    let adjSymbols=1
    for (let r=1;r<=board.length-4;r++) {
      if (board[r][r+c] && board[r][r+c] === playSymbol) {
        adjSymbols++
        console.log(r,'row')
        console.log(r+c,'col')
        console.log(playSymbol,'playSymbol')
        console.log(adjSymbols,'adjSymbols')
        if (adjSymbols === 4) {
          console.log('diagonal winner ltr')
          return board[r][r+c]
        }
      }
      else {
        playSymbol=board[r][r+c]
        adjSymbols=1
      }
    }
  }

  console.log('no diagonal winner')

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
