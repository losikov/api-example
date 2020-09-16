#!/bin/sh
#
# Usage: run from project directory: ./scripts/open_swagger_ui.sh
# Description: run docker with openapi.yml & open browser with swagger ui
# Prerequirements: docker
#

. $(dirname "$0")/common.sh

# run swagger-ui container with the yaml, if not running yet
name='swagger-ui'
command -v docker >/dev/null 2>&1 || { echo >&2 "'docker' is not install installed. Aborting."; exit 1; }
[[ $(docker ps -f "name=$name" --format '{{.Names}}') == $name ]] ||
docker run --rm -d -p 8045:8080 --name "$name" -e SWAGGER_JSON=/config/openapi.yml -v $(PWD)/config:/config swaggerapi/swagger-ui

wait_container_to_be_running "$name" & sleep 2

# open swagger-ui in browser
open http://localhost:8045
