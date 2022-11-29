import React from "react";
import classNames from "classnames";
import { ButtonColors } from "@cardinal-labs/shared.types.colors";

const { ORANGE, PURPLE, GREEN, BLUE } = ButtonColors;

export type ButtonPrimaryProps = {
  children: React.ReactNode;
  onClick: () => void;
  color?: ButtonColors;
  className?: string;
};

export const ButtonPrimary = ({
  children,
  color = ORANGE,
  onClick,
  className,
}: ButtonPrimaryProps) => {
  return (
    <button
      style={{ minWidth: `${230}px` }}
      className={classNames(className, [
        {
          "text-black px-8 py-2 rounded-lg min-w-[230px]": true,
          "bg-orange-500": color === ORANGE,
          "bg-green-500": color === GREEN,
          "bg-purple-500": color === PURPLE,
          "bg-blue-500": color === BLUE,
        },
      ])}
      onClick={onClick}
    >
      <div
        className={classNames({
          "text-white": color === PURPLE,
        })}
      >
        {children}
      </div>
    </button>
  );
};

export default ButtonPrimary;
