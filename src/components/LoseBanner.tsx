type LoseBannerProps = {
  playAgain: () => void;
};

export default function LoseBanner({ playAgain }: LoseBannerProps) {
  return (
    <div className="absolute top-20 left-1/2 translate-x-min-1/2 transform flex flex-col items-center p-4 bg-gray-200 rounded-md shadow-md">
      <div>💣💥🧨</div>
      <div>You Lose!</div>
      <div className="flex justify-between">
        <button
          onClick={() => {
            playAgain();
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
