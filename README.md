# JS Bundler Benchmark

Performance benchmark for most popular javascript bundlers in various configurations

- [esbuild](https://esbuild.github.io/)
- [parcel](https://parceljs.org/) (babel + terser)
- [rollup](https://rollupjs.org/) (babel + terser, esbuild, swc)
- [rspack](https://rspack.dev/) (swc)
- [vite](https://vitejs.dev/) (esbuild)
- [webpack](https://webpack.js.org/) (babel + terser, esbuild, swc)

Available test projects (all of them based on React):

- empty project
- project containing five big libraries
- all components from Material UI
- synthetic test with 5000 small components

## Results

All tests were done on 2023 MacBook Pro 12-core M2 Pro with 32gb of RAM, Mac OS 14.5 and Node 20.9.0, production build, no cache, configs are as close as possible

![Build time in sec](images/build-time-in-sec.png "Build time in sec")

Time in sec (average time for 5 runs)

|                             | **react-empty** | **react-libraries** | **react-mui** | **react-synthetic** |
| --------------------------- | --------------- | ------------------- | ------------- | ------------------- |
| **Esbuild**                 | 0.036           | 0.094               | 0.110         | 0.394               |
| **Parcel: babel + terser**  | 1.223           | 4.545               | 2.950         | 17.353              |
| **Rollup: babel + terser**  | 1.482           | 5.705               | 4.316         | 13.806              |
| **Rollup: esbuild**         | 0.725           | 2.297               | 2.494         | 6.056               |
| **Rollup: swc**             | 0.799           | 2.877               | 2.864         | 5.533               |
| **Rspack**                  | 0.102           | 0.608               | 0.297         | 1.106               |
| **Vite**                    | 0.401           | 1.819               | 1.372         | 5.654               |
| **Webpack: babel + terser** | 1.116           | 5.664               | 3.035         | 9.691               |
| **Webpack: esbuild**        | 0.416           | 1.826               | 1.334         | 4.104               |
| **Webpack: swc**            | 0.444           | 2.220               | 1.480         | 3.961               |

Bundle size in KiB

|                             | **react-empty** | **react-libraries** | **react-mui** | **react-synthetic** |
| --------------------------- | --------------- | ------------------- | ------------- | ------------------- |
| **Esbuild**                 | 164.86          | 1310.72             | 666.33        | 1008.75             |
| **Parcel: babel + terser**  | 169.44          | 1433.60             | 714.51        | 1167.36             |
| **Rollup: babel + terser**  | 157.56          | 1290.24             | 615.93        | 786.49              |
| **Rollup: esbuild**         | 163.65          | 1310.72             | 668.09        | 816.64              |
| **Rollup: swc**             | 157.16          | 1269.76             | 611.67        | 790.97              |
| **Rspack**                  | 162.00          | 1648.64             | 689.53        | 1413.12             |
| **Vite**                    | 160.37          | 1300.48             | 622.57        | 832.99              |
| **Webpack: babel + terser** | 158.17          | 1536.00             | 623.89        | 868.34              |
| **Webpack: esbuild**        | 163.51          | 1689.60             | 646.26        | 889.73              |
| **Webpack: swc**            | 160.64          | 1525.76             | 627.59        | 875.75              |

Bundle size after gzip in KiB

|                             | **react-empty** | **react-libraries** | **react-mui** | **react-synthetic** |
| --------------------------- | --------------- | ------------------- | ------------- | ------------------- |
| **Esbuild**                 | 54.86           | 382.85              | 198.44        | 132.22              |
| **Parcel: babel + terser**  | 55.07           | 388.59              | 200.82        | 87.30               |
| **Rollup: babel + terser**  | 52.84           | 368.05              | 180.59        | 67.36               |
| **Rollup: esbuild**         | 54.74           | 383.65              | 200.59        | 84.29               |
| **Rollup: swc**             | 52.47           | 365.06              | 180.74        | 66.92               |
| **Rspack**                  | 53.35           | 446.25              | 195.97        | 133.46              |
| **Vite**                    | 53.49           | 381.16              | 186.54        | 82.93               |
| **Webpack: babel + terser** | 52.97           | 423.02              | 183.62        | 84.60               |
| **Webpack: esbuild**        | 55.03           | 460.51              | 194.42        | 86.04               |
| **Webpack: swc**            | 53.61           | 423.99              | 185.13        | 92.30               |

## How to run it

First you must install the npm dependencies (don't forget to install them for each project), after that you can use following commands

- `npm run build:esbuild`
- `npm run build:parcel`
- `npm run build:rollup`
- `npm run build:rspack`
- `npm run build:vite`
- `npm run build:webpack`

Common options

- `--project <string>` project from `./projects` directory
- `--entrypoint <string>` project entry point, default `src/index.tsx`

Rollup and Webpack support various presets

- `--preset <babel|esbuild|swc>` preset used for bundling, default `babel`

Examples

```shell
npm run build:esbuild -- --project react-empty --entrypoint src/index.tsx
npm run build:webpack -- --project react-empty --preset swc --entrypoint src/index.tsx
```

Don't forget to add `--` after npm script to [pass arguments](https://docs.npmjs.com/cli/v6/commands/npm-run-script#description)
