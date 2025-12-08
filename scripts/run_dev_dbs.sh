#!/bin/sh
#
# Usage: run from project directory: ./scripts/run_dev_dbs.sh
# Description: kill/clear/run redis & mongo with docker for dev environment
# Prerequirements: docker
#

usage()
{
  echo "usage: ./scripts/run_dev_dbs.sh [-k|-c|-r]"
  echo "  -k|--kill  : kill redis and mongo docker containers"
  echo "  -c|--clear : ccreate/clear mongodb host folder"
  echo "  -r|--run   : run redis and mongo containers"
  echo "example: ./scripts/run_dev_dbs.sh -k -c -r"
}

clear=
kill=
run=

[ $# -eq 0 ] && { usage; exit 1; }
while [ "$1" != "" ]; do
  case $1 in
    -k | --kill )     kill=1
                      ;;
    -c | --clear )    clear=1
                      ;;
    -r | --run )      run=1
                      ;;
    -h | --help )     usage
                      exit
                      ;;
    * )               usage
                      exit 1
  esac
  shift
done

if [ "$kill" = "1" ]; then
  docker kill redis mongo
fi

if [ "$clear" = "1" ]; then
  mkdir -p ../docker/mongodb
  rm -rf ../docker/mongodb/*
fi

if [ "$run" = "1" ]; then
  command -v docker >/dev/null 2>&1 || { echo >&2 "'docker' is not installed. Aborting."; exit 1; }

  name='redis'
  [[ $(docker ps -f "name=$name" --format '{{.Names}}') == $name ]] ||
  docker run --rm -d -p 6379:6379 --name "$name" redis --save ''

  name='mongo'
  [[ $(docker ps -f "name=$name" --format '{{.Names}}') == $name ]] ||
  docker run --rm -d -p 27017-27019:27017-27019 -v $(PWD)/../docker/mongodb:/data/db --name "$name"  mongo:latest
fi
