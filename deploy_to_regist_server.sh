#!/bin/sh

if [ $# -ne 1 ]; then
  echo "Please specify 1 argument ($# arguments are given)." 1>&2
  echo "" 1>&2
  echo "USAGE: ./deploy_to_regist_server.sh 1" 1>&2
  echo "(e.g. ./deploy_to_regist_server.sh 1)" 1>&2
  exit 1
fi

ORIGINAL=$(pwd)
CURRENT=$(cd $(dirname $0) && pwd)

cd $CURRENT

npm install
grunt setup

mkdir -p ../../public/contests
rm -Rf "../../public/contests/$1"
cp -R client "../../public/contests/$1"
mv "../../public/contests/$1/replayer" "../../public/contests/$1/battle_results"

cd $ORIGINAL
