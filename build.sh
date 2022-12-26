#!/usr/bin/env bash

set -euo pipefail

CDK_PROJECT_PATH=""
LAMBDAS_PROJECT_PATH=""

config() {
  echo "Checking config file local.properties"
  if [ -e local.properties ]
  then
      echo "Configuration exists"
      cat local.properties
  else
      echo "Configuration not found. Creating configuration file: local.properties"
      echo "Set CDK_PROJECT_PATH:"
      read -r CDK_PROJECT_PATH

      echo "Set LAMBDAS_PROJECT_PATH:"
      read -r LAMBDAS_PROJECT_PATH
      printf "path.cdk=%s\n" "$CDK_PROJECT_PATH" >> local.properties
      printf "path.lambdas=%s\n" "$LAMBDAS_PROJECT_PATH" >> local.properties
  fi
}

change-dir() {
  local paths
  paths=(cdk lambdas)
  if [[ ! " ${paths[*]} " =~ $1 ]]; then
      echo "Wrong value $1"
      exit 1
  fi

  echo "Changing to $1"
  local path
  path=$(sed -n "s/^path.$1=\(.*\)/\1/p" local.properties)

  cd "$path" || exit
}

build-kotlin() {
  echo "Building Kotlin lambdas..."
  change-dir lambdas
  gradle clean makeDeploymentBundle
  cd ..
}

build-stacks() {
  change-dir cdk
  echo "Removing previous artifacts"
  rm -rf ./cdk.out/*.zip || true
  rm -rf ./cdk.out/*.jar || true
  cdk synth
  sam build -t ./cdk.out/CdkStack.template.json
  cd ..
}

build-all() {
  build-kotlin
  build-stacks
}

invoke() {
  change-dir cdk
  sam local invoke CdkSamInputFunction -e events/apiProxy.json
#  sam local invoke CdkSamComputeFunction -e events/receiveMessage.json
  cd ..
}

logs() {
  change-dir cdk
  sam logs -n CdkSamInputFunction --stack-name CdkStack -t
  cd ..
}

start-api() {
  change-dir cdk
  sam local start-api --warm-containers EAGER
  cd ..
}

test-api() {
  curl --location --request POST 'http://localhost:3000/items' \
  --header 'Content-Type: application/json' \
  --data-raw '{"text":"Hello from Api Gateway!"}'
}

deploy() {
  echo "Deploying application..."
  change-dir cdk
  cdk bootstrap
  local output
  output=$(cdk deploy --require-approval never --all)
  cd ..
  echo "$output"
}

destroy() {
  echo "Destroying application..."
  change-dir cdk
  cdk destroy --all --require-approval never
  cd ..
}

help() {
    set +x
    echo "Available commands:"
    declare -F | awk '{print $NF}' | sort
}

set -x
eval "$@"
