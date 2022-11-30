import { PreviewRuntime } from '@teambit/preview';
import { ReactAspect, ReactPreview } from '@teambit/react';
// uncomment the line below and install the theme if you want to use our theme or create your own and import it here
// import { ThemeCompositions } from '@teambit/documenter.theme.theme-compositions';

import { React18EnvAspect } from './react-18-env.aspect';

export class React18EnvPreviewMain {
  static runtime = PreviewRuntime;

  static dependencies = [ReactAspect];

  static async provider([react]: [ReactPreview]) {
    const react18EnvPreviewMain = new React18EnvPreviewMain();
    // uncomment the line below to register a new provider to wrap all compositions using this environment with a custom theme.
    // react.registerProvider([ThemeCompositions]);

    return react18EnvPreviewMain;
  }
}

React18EnvAspect.addRuntime(React18EnvPreviewMain);
