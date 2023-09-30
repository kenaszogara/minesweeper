import { SyntheticEvent, useEffect, useState, MouseEvent, useRef } from "react";
import { useAtom } from "jotai";
import { revealMinesAtom } from "@/components/tileProvider";
import Tile from "@/components/tile";
import { generateBoard, getDurationFromSeconds } from "@/lib/utility";
import { LevelEnum } from "./HomePage";
import WinBanner from "./WinBanner";
import LoseBanner from "./LoseBanner";

type GameBoardTypes = {
  row: number;
  col: number;
  mines: number;
  level: LevelEnum;
};

export default function GameBoard({
  row: _row,
  col: _col,
  mines: mineCount,
  level,
}: GameBoardTypes) {
  const [board, setBoard] = useState<any>(generateBoard(_row, _col));
  const [isGameStart, setGameStart] = useState(false);
  const [isGameOver, setGameOver] = useState(false);
  const [isWin, setIsWin] = useState(false);
  const [count, setCount] = useState(0);
  const [isRevealMines, setIsRevealMines] = useAtom(revealMinesAtom);
  const durationIntervalRef = useRef<NodeJS.Timeout>(null);
  const [duration, setDuration] = useState(0);

  // once game board mounted, start game duration
  // logic for dismounting interval
  useEffect(() => {
    if (!durationIntervalRef.current) {
      durationIntervalRef.current = setInterval(() => {
        setDuration((prev) => prev + 1);
      }, 1000);
    }

    return () => {
      if (durationIntervalRef.current) {
        clearInterval(durationIntervalRef.current);
      }
    };
  }, []);

  const retryGame = () => {
    console.log("retry");
    setBoard(generateBoard(_row, _col));
    setGameStart(false);
    setGameOver(false);
    setIsWin(false);
    setCount(0);
    setIsRevealMines(false);
    setDuration(0);

    durationIntervalRef.current = setInterval(() => {
      setDuration((prev) => prev + 1);
    }, 1000);
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

            setCount((prev) => {
              const newCount = prev + 1;

              if (newCount == _row * _col - mineCount) {
                setIsRevealMines((prev) => !prev);

                setGameOver(() => {
                  setIsWin(true);
                  return true;
                });

                clearInterval(durationIntervalRef.current); // stop time interval
              }

              return newCount;
            });
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
      setCount((prev) => {
        const newCount = prev + 1;

        if (newCount == _row * _col - mineCount) {
          setIsRevealMines((prev) => !prev);
          setGameOver(() => {
            setIsWin(true);
            return true;
          });
          clearInterval(durationIntervalRef.current); // stop time interval
        }

        return newCount;
      });
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
      clearInterval(durationIntervalRef.current); // stop time interval
    } else {
      // console.log(`[${value}] => r: ${row}, c: ${col}`);
      traverse(value, row, col);

      // copy old board and update
      const newBoard = [...board];
      setBoard(newBoard);
    }
  };

  return (
    <div className={`mt-1 ${isGameOver ? "opacity-50" : ""}`}>
      <div id="score" className="my-4 flex justify-end">
        <div className="border-md shadow-sm mr-auto">
          ⏳ {getDurationFromSeconds(duration)}
        </div>

        <div className="mr-auto">{level}</div>

        <span className="mr-4">
          🚩 = {isGameStart ? _row * _col - mineCount - count : "-"}
        </span>
        <span>💣 = {mineCount}</span>
      </div>

      {/* show tiles */}
      <div className="relative">
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

        {isGameOver && isWin && (
          <WinBanner
            duration={duration}
            playAgain={() => {
              retryGame();
            }}
          />
        )}

        {isGameOver && !isWin && (
          <LoseBanner
            playAgain={() => {
              retryGame();
            }}
          />
        )}
      </div>
    </div>
  );
}
