import React from "react";
import * as colors from "./colors";
import JSONPretty from "react-json-pretty";

export function composition() {
  return (
    <div>
      <JSONPretty id="json-pretty" data={colors}></JSONPretty>
    </div>
  );
}
