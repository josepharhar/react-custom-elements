#!/bin/bash
set -e
set -x

npm install
npm run build

rm -rf deploy

mkdir -p deploy
cp script.jsx deploy
cp index.html deploy
mkdir -p deploy/build
cp build/script.js deploy/build
mkdir -p deploy/node_modules/react
cp -r node_modules/react/umd deploy/node_modules/react
mkdir -p deploy/node_modules/react-patched
cp -r node_modules/react-patched/umd deploy/node_modules/react-patched
mkdir -p deploy/node_modules/react-dom
cp -r node_modules/react-dom/umd deploy/node_modules/react-dom
mkdir -p deploy/node_modules/react-dom-patched
cp -r node_modules/react-dom-patched/umd deploy/node_modules/react-dom-patched
mkdir -p deploy/node_modules/preact
cp -r node_modules/preact/dist deploy/node_modules/preact
mkdir -p deploy/node_modules/preact-render-to-string
cp -r node_modules/preact-render-to-string/dist deploy/node_modules/preact-render-to-string

touch deploy/.nojekyll

cd deploy
git init
git add -f .
git commit -m "generated for github pages"
git checkout -b ghpages
git remote add origin git@github.com:josepharhar/react-custom-elements
git push -f origin ghpages

cd ..
rm -rf deploy
