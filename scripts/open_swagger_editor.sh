#!/bin/sh
#
# Usage: run from project directory: ./scripts/open_swagger_editor.sh
# Description: run docker with openapi.yml & open browser with swagger editor
# Prerequirements: docker
#

. $(dirname "$0")/common.sh

# run swagger-editor container with the yaml, if not running yet
# opening specific file doesn't work with editor
name='swagger-editor'
command -v docker >/dev/null 2>&1 || { echo >&2 "'docker' is not install installed. Aborting."; exit 1; }
[[ $(docker ps -f "name=$name" --format '{{.Names}}') == $name ]] ||
docker run --rm -d -p 8044:8080 --name "$name" -e SWAGGER_JSON=/config/openapi.yaml -v $(PWD)/config:/config swaggerapi/swagger-editor

wait_container_to_be_running "$name" & sleep 2

# open swagger-ui in browser
open http://localhost:8044
