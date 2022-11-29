import React from "react";
import * as typeEntities from "./ui";
import JSONPretty from "react-json-pretty";

export function composition() {
  return (
    <div>
      <JSONPretty id="json-pretty" data={typeEntities}></JSONPretty>
    </div>
  );
}
