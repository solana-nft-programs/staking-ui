import { MainRuntime } from '@teambit/cli';
import { ReactAspect, ReactMain } from '@teambit/react';
import { EnvsAspect, EnvsMain } from '@teambit/envs';
import { React18EnvAspect } from './react-18-env.aspect';
// import { previewConfigTransformer, devServerConfigTransformer } from './webpack/webpack-transformers';
// import { previewConfigTransformer, devServerConfigTransformer } from '@bit-foundations/env-configs.webpack.webpack-analyzer';

/**
 * Uncomment to include config files for overrides of Typescript or Webpack
 */
// const tsconfig = require('./typescript/tsconfig');

export class React18EnvMain {
  static slots = [];

  static dependencies = [ReactAspect, EnvsAspect];

  static runtime = MainRuntime;

  static async provider([react, envs]: [ReactMain, EnvsMain]) {
    const templatesReactEnv = envs.compose(react.reactEnv, [
      /**
       * Uncomment to override the config files for TypeScript, Webpack or Jest
       * Your config gets merged with the defaults
       */

      // react.overrideTsConfig(tsconfig),
      // react.useWebpack({
      //   previewConfig: [previewConfigTransformer],
      //   devServerConfig: [devServerConfigTransformer],
      // }),
      // react.overrideJestConfig(require.resolve('./jest/jest.config')),

      /**
       * override the ESLint default config here then check your files for lint errors
       * @example
       * bit lint
       * bit lint --fix
       */
      // react.useEslint({
      //   transformers: [
      //     (config) => {
      //       config.setRule('no-console', ['error']);
      //       return config;
      //     }
      //   ]
      // }),

      /**
       * override the Prettier default config here the check your formatting
       * @example
       * bit format --check
       * bit format
       */
      // react.usePrettier({
      //   transformers: [
      //     (config) => {
      //       config.setKey('tabWidth', 2);
      //       return config;
      //     }
      //   ]
      // }),

      /**
       * override dependencies here
       */
      react.overrideDependencies({
        devDependencies: {
          '@types/react': '^18.0.17',
          '@types/react-dom': '^18.0.6',
        },
        peers: [
          {
            name: 'react',
            version: '18.2.0',
            supportedRange: '^18.2.0',
          },
          {
            name: 'react-dom',
            version: '18.2.0',
            supportedRange: '^18.2.0',
          },
        ],
      })
    ]);
    envs.registerEnv(templatesReactEnv);
    return new React18EnvMain();
  }
}

React18EnvAspect.addRuntime(React18EnvMain);
