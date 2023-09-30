export const levelSettings = (level) => {
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

export const generateBoard = (row = 0, col = 0) => {
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

export const getDurationFromSeconds = (givenSeconds: number) => {
  const hours = Math.floor(givenSeconds / 3600);
  const minutes = Math.floor((givenSeconds - hours * 3600) / 60);
  const seconds = givenSeconds - hours * 3600 - minutes * 60;

  return `${hours > 0 ? hours.toString().padStart(2, "0") + ":" : ""}${
    minutes.toString().padStart(2, "0") + ":"
  }${seconds.toString().padStart(2, "0")}`;
};
