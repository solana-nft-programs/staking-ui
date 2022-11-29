import React from "react";
import classNames from "classnames";
import { ButtonColors } from "@cardinal-labs/shared.types.colors";
import { MINIMUM_BUTTON_WIDTH_IN_PX } from "@cardinal-labs/shared.constants";

const { ORANGE, GREEN, PURPLE, BLUE } = ButtonColors;

export type ButtonSecondaryProps = {
  children: React.ReactNode;
  onClick: () => void;
  color: ButtonColors;
};

export const ButtonSecondary = ({
  children,
  color = ORANGE,
  onClick,
}: ButtonSecondaryProps) => {
  return (
    <button
      style={{ minWidth: `${MINIMUM_BUTTON_WIDTH_IN_PX}px` }}
      className={classNames({
        "text-white px-8 py-3 rounded-lg min-w-[230px]": true,
        "border border-orange-500": color === ORANGE,
        "border border-green-500": color === GREEN,
        "border border-purple-500": color === PURPLE,
        "border border-blue-500": color === BLUE,
      })}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default ButtonSecondary;
