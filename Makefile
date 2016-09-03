#!/bin/sh

rm -rf ./dist/
mkdir dist
cp -r ./src/client/index.html ./dist
cp -r ./src/client/style.css ./dist
cp -r ./src/client/images ./dist
NODE_ENV=production webpack -p
