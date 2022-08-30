import { dirname, parse, resolve } from 'path';
import GasPlugin from 'gas-webpack-plugin';
import projectMeta from './project.json' assert { type: 'json' };

const ROOT_PATH = dirname(dirname(process.cwd()));
const SOURCE_ROOT_PATH = resolve(ROOT_PATH, projectMeta.sourceRoot);
const OUTPUT_PATH = resolve(
  ROOT_PATH,
  projectMeta.targets.build.options.outputPath
);
const MAIN_FILE_PATH = resolve(
  ROOT_PATH,
  projectMeta.targets.build.options.main
);

export default {
  context: SOURCE_ROOT_PATH,
  entry: {
    [parse(MAIN_FILE_PATH).name]: MAIN_FILE_PATH,
  },
  module: {
    rules: [
      {
        test: /(\.ts)$/,
        loader: 'ts-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.ts'],
  },
  output: {
    path: OUTPUT_PATH,
    filename: '[name].js',
  },
  plugins: [
    new GasPlugin({
      autoGlobalExportsFiles: ['**/*.ts'],
    }),
  ],
};
