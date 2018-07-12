import {
  ValidatorConstraint,
  ValidatorConstraintInterface
} from "class-validator";
import { Board, Symbol, Row, WinnerCells } from "./entities";

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

export const calculateWinner = (board:Board) => { //: Symbol | null => {

  let winnersLength = 4 //5
  let winnerCells=[[0,0],[0,0],[0,0],[0,0]] // dummy init needed!?
  console.log('calculate winner new!')
  // let winnerObj={
  //   winner:board[0][0],
  //   cells:[[0,0],[0,1],[0,2],[0,3]]
  // }
  // console.log(winnerObj)
  // Check rows
  for (let r=0;r<board.length;r++) {
    let playSymbol=board[r][0]
    let adjSymbols=1
    winnerCells.splice(0,winnerCells.length)
    winnerCells.push([r,0])
    for (let c=1;c<board[0].length;c++) {
      if (board[r][c] && board[r][c] === playSymbol) {
        adjSymbols++
        winnerCells.push([r,c])
        console.log(winnerCells)
        if (adjSymbols === winnersLength) {
          console.log("row winner");
          //return board[r][c];
          return ({winner:board[r][c],
                  cells:winnerCells})
        }
      }
      else {
        playSymbol=board[r][c]
        adjSymbols=1
        winnerCells.splice(0,winnerCells.length)
        winnerCells.push([r,c])
      }
    }
  }
  console.log("no row winner");

  // Check columns
  for (let c = 0; c < board[0].length; c++) {
    let playSymbol = board[0][c];
    let adjSymbols=1
    winnerCells.splice(0,winnerCells.length)
    winnerCells.push([0,c])
    for (let r=1;r<board.length;r++) {
      if (board[r][c] && board[r][c] === playSymbol) {
        adjSymbols++
        winnerCells.push([r,c])
        console.log(winnerCells)
        if (adjSymbols === winnersLength) {
          console.log("col winner");
          //return board[r][c];
          return ({winner:board[r][c],
            cells:winnerCells})
        }
      }
      else {
        playSymbol=board[r][c]
        adjSymbols=1
        winnerCells.splice(0,winnerCells.length)
        winnerCells.push([r,c])
      }
    }
  }
  console.log("no col winner");

  // Check diagonals left to right
  for (let r=0;r<=board.length-winnersLength;r++) {
    for (let c=0;c<=board[0].length-winnersLength;c++) {
    let playSymbol=board[r][c]
    //console.log('row ',r,' col ', c, ' playSymbol ',playSymbol)
    let adjSymbols=1
    winnerCells.splice(0,winnerCells.length)
    winnerCells.push([r,c])
    for (let diagOffset=1;diagOffset<winnersLength;diagOffset++) {
      if (board[r+diagOffset][c+diagOffset] && 
          board[r+diagOffset][c+diagOffset] === playSymbol) {
          adjSymbols++
          winnerCells.push([r+diagOffset,c+diagOffset])
          console.log(winnerCells)
          // console.log(r+diagOffset,'row')
          // console.log(c+diagOffset,'col')
          // console.log(playSymbol,'playSymbol')
          // console.log(adjSymbols,'adjSymbols')
          if (adjSymbols === winnersLength) {
            console.log("diagonal winner left to right");
            //return board[r + diagOffset][c + diagOffset];
            return ({winner:board[r + diagOffset][c + diagOffset],
              cells:winnerCells})
          }
        }
        else {
          playSymbol=board[r+diagOffset][c+diagOffset]
          adjSymbols=1
          winnerCells.splice(0,winnerCells.length)
          winnerCells.push([r+diagOffset,c+diagOffset])
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
    winnerCells.splice(0,winnerCells.length)
    winnerCells.push([r,c])
    for (let diagOffset=1;diagOffset<4;diagOffset++) {
      if (board[r+diagOffset][c-diagOffset] && 
          board[r+diagOffset][c-diagOffset] === playSymbol) {
          adjSymbols++
          winnerCells.push([r+diagOffset,c-diagOffset])
          console.log(winnerCells)
          // console.log(r+diagOffset,'row')
          // console.log(c-diagOffset,'col')
          // console.log(playSymbol,'playSymbol')
          // console.log(adjSymbols,'adjSymbols')
          if (adjSymbols === winnersLength) {
            console.log("diagonal winner right to left");
            //return board[r + diagOffset][c - diagOffset];
            return ({winner:board[r + diagOffset][c - diagOffset],
              cells:winnerCells})            
          }
        }
        else {
          playSymbol=board[r+diagOffset][c-diagOffset]
          adjSymbols=1
          winnerCells.splice(0,winnerCells.length)
          winnerCells.push([r+diagOffset,c-diagOffset])
        }
      }
    }
  }

  console.log("no (diagonal) winner");

  // No winner
  //return null;
  return ({winner:null,
           cells:[[null,null],[null,null],[null,null],[null,null]]
          })
};

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
