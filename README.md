# Welcome to your CDK TypeScript project

This is a blank project for CDK development with TypeScript.

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## How to init
Install sam
https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions

➜  bin pwd
/usr/local/bin

➜  bin ll | grep sam
lrwxr-xr-x    1 root      admin                   26 Dec 18 10:31 sam -> /usr/local/aws-sam-cli/sam

➜  ~ sam --version
SAM CLI, version 1.66.0

➜  cdk-sam cdk --version
2.55.1 (build 30f1ae4)

brew install gradle

➜  cdk-sam git:(master) ✗ gradle -v

Welcome to Gradle 7.6!

Here are the highlights of this release:
- Added support for Java 19.
- Introduced `--rerun` flag for individual task rerun.
- Improved dependency block for test suites to be strongly typed.
- Added a pluggable system for Java toolchains provisioning.

For more details see https://docs.gradle.org/7.6/release-notes.html


------------------------------------------------------------
Gradle 7.6
------------------------------------------------------------

Build time:   2022-11-25 13:35:10 UTC
Revision:     daece9dbc5b79370cc8e4fd6fe4b2cd400e150a8

Kotlin:       1.7.10
Groovy:       3.0.13
Ant:          Apache Ant(TM) version 1.10.11 compiled on July 10 2021
JVM:          16.0.2 (Amazon.com Inc. 16.0.2+7)
OS:           Mac OS X 12.6.1 x86_64

mkdir cdk
cd cdk
cdk init app --language typescript

mkdir lambdas
cd lambdas
gradle init
