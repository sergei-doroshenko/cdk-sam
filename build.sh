#!/usr/bin/env bash

set -euo pipefail

build-kotlin() {
  echo "Building Kotlin lambdas..."
  cd lambdas || exit
  gradle clean makeDeploymentBundle
  cd ..
}

build-stacks() {
  cd cdk
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
  cd cdk
  sam local invoke CdkSamInputFunction -e events/apiProxy.json
#  sam local invoke CdkSamComputeFunction -e events/receiveMessage.json
  cd ..
}

logs() {
  cd cdk
  sam logs -n CdkSamInputFunction --stack-name CdkStack -t
  cd ..
}

start-api() {
  cd cdk
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
  cd ./cdk
  cdk bootstrap
  local output
  output=$(cdk deploy --require-approval never --all)
  cd ..
  echo "$output"
}

destroy() {
  echo "Destroying application..."
  cd ./cdk
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
