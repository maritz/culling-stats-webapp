#!/bin/sh

rm -rf ./docs/
mkdir docs
cp -r ./src/client/index.html ./docs
cp -r ./src/client/style.css ./docs
cp -r ./src/client/images ./docs
NODE_ENV=production webpack -p
