import React from "react";

const MagicButton = ({
  title,
  icon,
  position,
  onClick,
  otherClasses,
  disabled,
}: {
  title: string;
  icon: React.ReactNode;
  position: string;
  onClick?: () => void;
  otherClasses?: string;
  disabled?: boolean;
}) => {
  return (
    <button
      className={`relative inline-flex h-12 w-full sm:w-60 overflow-hidden rounded-lg p-[1px] focus:outline-none ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      } ${otherClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className={`absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)] ${
        disabled ? 'opacity-50' : ''
      }`} />

      <span
        className={`inline-flex h-full w-full cursor-pointer items-center justify-center rounded-lg
             bg-slate-950 px-3 sm:px-7 text-sm font-medium text-white backdrop-blur-3xl gap-2 ${
               disabled ? 'cursor-not-allowed' : ''
             }`}
      >
        {position === "left" && icon}
        {title}
        {position === "right" && icon}
      </span>
    </button>
  );
};

export default MagicButton;