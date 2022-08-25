#!/usr/bin/env bash

ROOT_PATH=$(realpath $(dirname $(dirname "$0")))
project_path=$(pwd)
args=()

while [ "$#" -gt 0 ]; do
  case "$1" in
    "--Mproject" | "-Mp")
      project_path="$ROOT_PATH/packages/$2"

      shift
      shift
    ;;
    *)
      args+=("$1")
      shift
    ;;
  esac
done

if [ ! -d "$project_path" ]; then
  echo ">> ERROR  :: project '$project_path' doesn't exist."
  exit 1
fi

# NOTE: This section is temporary
# clasp run doesn't use ~/.clasprc.json and requires .clasprc.json in local directory
# https://github.com/google/clasp/issues/916
cp $HOME/.clasprc.json $project_path

$ROOT_PATH/node_modules/.bin/clasp "${args[@]}" -P $project_path
