import React from "react";
import * as constants from "./constants";
import JSONPretty from "react-json-pretty";

export function composition() {
  return (
    <div>
      <JSONPretty id="json-pretty" data={constants}></JSONPretty>
    </div>
  );
}
