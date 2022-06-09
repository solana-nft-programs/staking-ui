// import resolve from '@rollup/plugin-node-resolve'
// import commonjs from '@rollup/plugin-commonjs'
// import typescript from '@rollup/plugin-typescript'
// import json from '@rollup/plugin-json'
// import { terser } from 'rollup-plugin-terser'
// import external from 'rollup-plugin-peer-deps-external'
// import postcss from 'rollup-plugin-postcss'
// import dts from 'rollup-plugin-dts'

// const packageJson = require('./package.json')

// export default [
//   {
//     input: 'src/index.ts',
//     output: [
//       {
//         file: packageJson.main,
//         format: 'cjs',
//         sourcemap: true,
//         name: 'react-ts-lib',
//       },
//       {
//         file: packageJson.module,
//         format: 'esm',
//         sourcemap: true,
//       },
//     ],
//     plugins: [
//       external(),
//       resolve(),
//       commonjs(),
//       typescript({ tsconfig: './tsconfig.lib.json' }),
//       postcss(),
//       terser(),
//       json(),
//     ],
//   },
//   {
//     input: 'dist/esm/types/index.d.ts',
//     output: [{ file: 'dist/src/index.d.ts', format: 'esm' }],
//     external: Object.keys(packageJson.peerDependencies || {}),
//     plugins: [dts()],
//   },
// ]

import typescript from 'rollup-plugin-typescript2'
import del from 'rollup-plugin-delete'
import pkg from './package.json'
import dts from 'rollup-plugin-dts'

export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'cjs',
        sourcemap: true,
        name: 'react-ts-lib',
      },
      {
        file: pkg.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      del({ targets: ['dist/*'] }),
      typescript({ tsconfig: './tsconfig.lib.json' }),
    ],

    external: Object.keys(pkg.peerDependencies || {}),
  },
  {
    input: 'dist/esm/types/index.d.ts',
    output: [{ file: 'dist/index.d.ts', format: 'esm' }],
    external: Object.keys(pkg.peerDependencies || {}),
    plugins: [dts()],
  },
]
