#!/bin/bash

if [[ -z $1 ]]; then
  echo "Please provide the target environment. ex: rd or prod"
  exit 1
fi

java -jar -Dspring.profiles.active=$1 cooc-sign-server-1.0.0.jar &
