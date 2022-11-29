import { ButtonColors } from "@cardinal-labs/shared.types.colors";
import React from "react";
import { ButtonSecondary } from "./button-secondary";

export const BasicButtonSecondary = () => {
  return (
    <ButtonSecondary onClick={() => {}} color={ButtonColors.ORANGE}>
      hello world!
    </ButtonSecondary>
  );
};
