#!/usr/bin/env -S node --no-warnings --loader ts-node/esm

import { readFileSync, mkdirSync, rmdirSync, writeFileSync } from 'fs';
import { resolve, dirname, basename, extname } from 'path';
import ts2gas from 'ts2gas';
import minify from 'babel-minify';

// TODO: Use `nx:run-commands` executer options for
//        passing project meta information
import projectMeta from '../project.json' assert { type: 'json' };

const EXECUTER_OPTIONS = projectMeta.targets.build.options;
const ROOT_PATH = dirname(dirname(process.cwd()));
const OUTPUT_PATH = resolve(ROOT_PATH, EXECUTER_OPTIONS.outputPath);
const INPUT_FILE_PATH = resolve(ROOT_PATH, EXECUTER_OPTIONS.main);
const OUTPUT_FILE_PATH = resolve(
  OUTPUT_PATH,
  basename(INPUT_FILE_PATH).replace(extname(INPUT_FILE_PATH), '.gs')
);

const compileCode = (): string => {
  try {
    const raw_content = readFileSync(INPUT_FILE_PATH, { encoding: 'utf8' });
    const built_content = ts2gas(raw_content);
    const { code } = minify(built_content, {
      mangle: {
        keepClassName: true,
      },
    });

    return code;
  } catch (error) {
    console.log(error.message);
  }
};

const cleanOutput = () => {
  try {
    rmdirSync(OUTPUT_PATH, { recursive: true });
  } catch (_err) {}

  try {
    mkdirSync(OUTPUT_PATH, { recursive: true });
  } catch (err) {
    console.log(err.message);
  }
};

const build = () => {
  const code = compileCode();

  cleanOutput();

  try {
    writeFileSync(OUTPUT_FILE_PATH, code);
  } catch (error) {
    console.log(error.message);
  }
};

build();
