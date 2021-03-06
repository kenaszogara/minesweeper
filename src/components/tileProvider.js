import React from "react";

const Context = React.createContext({});

export default function TileProvider({ children }) {
  const [isRevealMines, setRevealMines] = React.useState(false);
  // const ref = React.useRef(null);

  const revealMines = React.useCallback(() => {
    setRevealMines((prevState) => !prevState);
  }, []);

  return (
    <Context.Provider value={{ isRevealMines, revealMines }}>
      {children}
    </Context.Provider>
  );
}

export function useTile() {
  return React.useContext(Context);
}
