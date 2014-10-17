#!/bin/sh

ORIGINAL=$(pwd)
CURRENT=$(cd $(dirname $0) && pwd)

cd $CURRENT

npm install
grunt setup

rm -Rf ../../public/contests/1
cp -R client ../../public/contests/1
mv ../../public/contests/1/replayer ../../public/contests/1/battle_results

cd $ORIGINAL
