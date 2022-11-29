import React from "react";
import { PreviewRuntime } from "@teambit/preview";
import { ReactAspect, ReactPreview } from "@teambit/react";
import { React18EnvAspect } from "./react-18-env.aspect";
// import "./tailwind/styles.css";

export class EnvWithTailwindPreviewMain {
  static runtime = PreviewRuntime;

  static dependencies = [ReactAspect];

  static async provider([react]: [ReactPreview]) {
    // react.registerProvider([
    //   ({ children }) => {
    //     return <WrapperWithTailwindStyles>{children}</WrapperWithTailwindStyles>
    //   }
    // ])
    const envWithTailwindPreviewMain = new EnvWithTailwindPreviewMain();

    return envWithTailwindPreviewMain;
  }
}

React18EnvAspect.addRuntime(EnvWithTailwindPreviewMain);
