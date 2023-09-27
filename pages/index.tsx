import Head from "next/head";
import { SyntheticEvent, useEffect, useState, MouseEvent } from "react";
import Tile from "../src/components/tile";
import { useAtom } from "jotai";
import { revealMinesAtom } from "../src/components/tileProvider";

export default function Board() {
  const [_row, setRow] = useState(6);
  const [_col, setCol] = useState(6);
  const [mineCount, setMineCount] = useState(5);
  const [level, setLevel] = useState("easy");
  const [board, setBoard] = useState<any>([]);
  const [isGameStart, setGameStart] = useState(false);
  const [isGameOver, setGameOver] = useState(false);
  const [showScore, setShowScore] = useState(false);
  const [count, setCount] = useState(0);
  const [isRevealMines, setIsRevealMines] = useAtom(revealMinesAtom);

  // logic for ending the game
  useEffect(() => {
    // console.log(count);
    if (count == _row * _col - mineCount) {
      alert("Congratulations, You have won!");
      setIsRevealMines((prev) => !prev);
      setGameOver(true);
    }
  }, [count]);

  const startNewGame = () => {
    const { row, col, mine } = levelSettings(level);
    const b = generateBoard(row, col);
    setRow(row);
    setCol(col);
    setMineCount(mine);
    setBoard(b);
    setCount(0);
    setGameOver(false);
    setGameStart(false);
    setShowScore(true);
    isRevealMines ? setIsRevealMines((prev) => !prev) : null;
    // console.log(board);
  };

  const levelSettings = (level) => {
    switch (level) {
      case "easy":
        return { row: 6, col: 6, mine: 5 };
      case "normal":
        return { row: 8, col: 8, mine: 10 };
      case "hard":
        return { row: 10, col: 10, mine: 15 };
      case "master":
        return { row: 10, col: 10, mine: 20 };

      default:
        return { row: 6, col: 6, mine: 5 };
    }
  };

  const generateBoard = (row = 0, col = 0) => {
    const board = [];
    for (let i = 0; i < row; i++) {
      const cols = [];
      for (let j = 0; j < col; j++) {
        cols.push({
          value: 0,
          isFlagged: false,
          isOpen: false,
        });
      }
      board.push(cols);
    }
    return board;
  };

  const addMines = (
    count = 0,
    row = 0,
    col = 0,
    grid = [],
    coordinates = [] // to track record of used coordinates
  ) => {
    let deployedMines = 0;

    while (deployedMines < count) {
      const x = Math.floor(Math.random() * row);
      const y = Math.floor(Math.random() * col);

      if (!coordinates.includes(`${x}.${y}`)) {
        grid[x][y] = {
          value: -1,
        };
        coordinates.push(`${x}.${y}`);
        deployedMines++;
        // console.log(`${deployedMines}: [${x}][${y}]`);
      }
    }
  };

  const traverseAllCellAndAssignValue = (row = 0, col = 0, board = []) => {
    for (let i = 0; i < row; i++) {
      for (let j = 0; j < col; j++) {
        if (board[i][j].value !== -1) {
          let count = 0;
          for (let k = Math.max(i - 1, 0); k <= Math.min(i + 1, row - 1); k++) {
            for (
              let l = Math.max(j - 1, 0);
              l <= Math.min(j + 1, col - 1);
              l++
            ) {
              if (board[k][l].value == -1) count++;
            }
          }
          board[i][j].value = count;
        }
      }
    }
  };

  const traverse = (value, row, col) => {
    // if empty mines open all adjacent tiles
    // console.log(`ITEM => [${row}, ${col}]: `);
    if (value === 0) {
      for (
        let i = Math.max(row - 1, 0);
        i <= Math.min(row + 1, _row - 1);
        i++
      ) {
        for (
          let j = Math.max(col - 1, 0);
          j <= Math.min(col + 1, _col - 1);
          j++
        ) {
          let tileValue = board[i][j].value;
          let isOpen = board[i][j].isOpen;
          let isFlagged = board[i][j].isFlagged;

          // open adjacent tiles if its not yet opened
          if (!isOpen && tileValue !== -1 && !isFlagged) {
            board[i][j].isOpen = true;
            setCount((prev) => prev + 1);
          }

          // use recursion to traverse all empty Tileses
          if (
            tileValue === 0 &&
            (row !== i || col !== j) &&
            !isOpen &&
            !isFlagged
          ) {
            // console.log(`v: ${tileValue}, r: ${i}, c: ${j}`);
            traverse(tileValue, i, j);
          }
        }
      }
    }

    // open current tile if its not yet opened
    if (!board[row][col].isOpen) {
      board[row][col].isOpen = true;
      setCount((prev) => prev + 1);
    }
  };

  const handleOpenTiles = (row, col) => {
    // on first click, ensure not to add mines on the first tile
    if (!isGameStart) {
      addMines(mineCount, _row, _col, board, [`${row}.${col}`]);
      traverseAllCellAndAssignValue(_row, _col, board);
      setGameStart(true);
    }

    // if mine setGameOver, else open tiles
    const value = board[row][col].value;
    if (value === -1) {
      !isRevealMines ? setIsRevealMines((prev) => !prev) : null;
      setGameOver(true);
      window.alert("Mine! Game Over");
    } else {
      // console.log(`[${value}] => r: ${row}, c: ${col}`);
      traverse(value, row, col);

      // copy old board and update
      const newBoard = [...board];
      setBoard(newBoard);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <Head>
        <title>MineSweeper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="flex flex-col items-center justify-center w-full flex-1 px-20 text-center">
        <h1 className="text-6xl font-bold">
          Welcome to{" "}
          <a className="text-blue-600">
            <span className="text-red-500">Mine</span>Sweeper!
          </a>
        </h1>

        {/* inputs */}
        <div className="mt-8">
          <select
            className={`${styles.select}`}
            onChange={(event) => setLevel(event.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
            <option value="master">Master</option>
          </select>
          <button
            className={`bg-blue-500 ${styles.button}`}
            onClick={() => startNewGame()}
          >
            Play {isGameOver && "Again"}
          </button>
          {/* <button
            className={`bg-yellow-500 ml-2 ${styles.button}`}
            onClick={() => revealMines()}
          >
            {isRevealMines ? "Hide" : "Reveal"}
          </button> */}
        </div>

        {/* Board */}
        <div className={`flex flex-col mt-1 ${isGameOver ? "opacity-50" : ""}`}>
          {/* show score */}
          {showScore && (
            <div id="score" className="my-4 flex justify-end">
              <span className="mr-4">
                🚩 = {isGameStart ? _row * _col - mineCount - count : "-"}
              </span>
              <span>💣 = {mineCount}</span>
            </div>
          )}

          {/* show tiles */}
          {!board.isEmpty &&
            board.map((rows, i) => {
              return (
                <div className="flex flex-row" key={i}>
                  {rows.map((items, j) => {
                    return (
                      <span
                        key={`[${i}][${j}]`}
                        onContextMenu={(event: MouseEvent<HTMLSpanElement>) => {
                          event.preventDefault();

                          if (isGameOver) return;
                          if (items.isOpen && items.value === 0) return;

                          setBoard((prev) => {
                            const newBoard = [...prev];
                            newBoard[i][j].isFlagged = !items.isFlagged;
                            return newBoard;
                          });
                        }}
                        onClick={(event: SyntheticEvent<HTMLSpanElement>) => {
                          if (isGameOver) return;
                          if (items.isFlagged) return;

                          handleOpenTiles(i, j);
                        }}
                      >
                        <Tile
                          value={items.value}
                          open={items.isOpen}
                          isFlagged={items.isFlagged}
                        />
                      </span>
                    );
                  })}
                </div>
              );
            })}
        </div>
      </main>
    </div>
  );
}

const styles = {
  button: "px-6 py-1 shadow text-gray-100 font-bold uppercase rounded",
  select: "mr-4 w-36 border shadow rounded px-2 py-1 text-base text-gray-800",
};
