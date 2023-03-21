#!/usr/bin/env sh

# abort on errors
set -e

# build
npm install
npm run build

# navigate into the build output directory
cd build

# if you are deploying to a custom domain
# echo 'www.example.com' > CNAME

git init
git add -A
git commit -m 'deploy'

# if you are deploying to https://<USERNAME>.github.io
git push -f git@github.com:a2xvodoi/a2xvodoi.github.io.git main
