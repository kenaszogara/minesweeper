import { getDurationFromSeconds } from "@/lib/utility";

type WinBannerProps = {
  duration: number;
  playAgain: () => void;
};

export default function WinBanner({ duration, playAgain }: WinBannerProps) {
  return (
    <div className="absolute top-20 left-1/2 translate-x-min-1/2 transform flex flex-col items-center p-4 bg-gray-200 rounded-md shadow-md">
      <div>😎👌🔥</div>
      <div>You Win!</div>
      <div>Completed in {getDurationFromSeconds(duration)}</div>
      <div className="flex justify-between">
        <button
          onClick={() => {
            playAgain;
          }}
        >
          Play Again
        </button>
      </div>
    </div>
  );
}
