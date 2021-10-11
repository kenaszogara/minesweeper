import { useTile } from "./tileProvider";

export default function Tile({ value, open }) {
  const { isRevealMines } = useTile();

  const getColor = (value) => {
    if (value == 0) return `hidden`;
    if (value == 1) return `text-green-400`;
    if (value == 2) return `text-blue-400`;
    if (value == 3) return `text-red-400`;
    if (value == 4) return `text-red-800`;
    if (value > 4) return `text-red-800`;
  };

  return (
    <div
      className={`
        ${styles.container} 
        ${open ? styles.open : styles.close}
        ${value === -1 && isRevealMines ? styles.bomb : ""}
      `}
    >
      {open && <p className={`font-bold ${getColor(value)}`}>{value}</p>}
    </div>
  );
}

const styles = {
  container: `flex justify-center items-center w-20 h-20 m-sm border rounded`,
  bomb: `bg-red-400`,
  close: `bg-gray-300`,
  open: `bg-gray-100`,
};
