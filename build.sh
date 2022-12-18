#!/usr/bin/env bash

set -euo pipefail

build-kotlin() {
  cd lambdas || exit
  echo "Removing previous build artefacts"
  rm -rf ./app/build/libs/*.jar
  rm -rf ./*.zip
  echo "Building Kotlin lambdas..."
  gradle shadowJar
  echo "Coping artifacts..."
  cd ./app
  cp ./build/libs/app-all.jar ../lambdas-kotlin.zip
  # To address the error:
  # Error: Unable to find a supported build workflow for runtime 'java11'.
  # Reason: None of the supported manifests '['build.gradle', 'build.gradle.kts', 'pom.xml']'
  # were found in the following paths
  # '['/Users/sddorosh/Documents/Personal/projects/cdk-sam/cdk/cdk.out/asset.309c94a99c94e0d748671f8e4085397a34ab9b4d3da76b020b551c0b0bf46406.jar',
  # '/Users/sddorosh/Documents/Personal/projects/cdk-sam/cdk/cdk.out']'
  zip ../lambdas-kotlin.zip ./build.gradle.kts
  cd ../..
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
  sam local invoke CdkSamInputFunction -e events/receiveMessage.json
  cd ..
}

deploy() {
  echo "Deploying application..."
  cd ./cdk
  cdk bootstrap
  local output=$(cdk deploy --require-approval never --all)
  cd ..
  echo $output
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
