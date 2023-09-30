import { levelSettings } from "@/lib/utility";
import Head from "next/head";
import { useState } from "react";
import GameBoard from "./GameBoard";

export type LevelEnum = "easy" | "normal" | "hard" | "master";

export type Game = {
  row: number;
  col: number;
  mine: number;
};

export default function HomePage() {
  const [game, setGame] = useState<Game>(null);
  const [level, setLevel] = useState<LevelEnum>("easy");

  const startNewGame = () => {
    const { row, col, mine } = levelSettings(level);
    setGame({
      row,
      col,
      mine,
    });
  };

  return (
    <div className="min-h-screen py-8 px-8 flex flex-col ">
      <Head>
        <title>MineSweeper</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full">
        <div className="text-2xl font-bold">
          <a className="text-blue-600">
            <span className="text-red-500">Mine</span>Sweeper!
          </a>
        </div>
      </div>

      <div>
        {/* inputs */}
        {!game && (
          <div className="mt-8 text-center">
            <select
              className={`${styles.select}`}
              onChange={(e) => {
                setLevel(e.target.value as LevelEnum);
              }}
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
              Start Game
            </button>
          </div>
        )}

        {game && level && (
          <div className="flex flex-col items-center">
            <GameBoard
              row={game.row}
              col={game.col}
              mines={game.col}
              level={level}
            />
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  button: "px-6 py-1 shadow text-gray-100 font-bold uppercase rounded",
  select: "mr-4 w-36 border shadow rounded px-2 py-1 text-base text-gray-800",
};
