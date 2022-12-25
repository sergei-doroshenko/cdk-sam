# Welcome to CDK with SAM TypeScript project

The `cdk.json` file tells the CDK Toolkit how to execute your app.

## Useful commands

* `npm run build`   compile typescript to js
* `npm run watch`   watch for changes and compile
* `npm run test`    perform the jest unit tests
* `cdk deploy`      deploy this stack to your default AWS account/region
* `cdk diff`        compare deployed stack with current state
* `cdk synth`       emits the synthesized CloudFormation template

## How to init

### Install SAM

For the details see [link](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html#install-sam-cli-instructions)


➜  bin pwd
/usr/local/bin

➜  bin ll | grep sam
lrwxr-xr-x    1 root      admin                   26 Dec 18 10:31 sam -> /usr/local/aws-sam-cli/sam

```shell
$ sam --version
```
Output:
```text
SAM CLI, version 1.66.0
```

### Install CDK

```shell
$ cdk --version
```

Output:
```text
2.55.1 (build 30f1ae4)
```

### Install gradle

```shell
$ brew install gradle
$ gradle -v
```

The output:
```text
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
```

### Create and init CDK resources

```shell
$ mkdir cdk
$ cd cdk
$ cdk init app --language typescript
```

### Create and init Lambdas

```shell
$ mkdir lambdas
$ cd lambdas
$ gradle init
```

### Build Lambdas

```shell
$ ./build.sh build-kotlin
```

### Synthesize stacks
cd cdk
cdk synth

### Build with sam
More about [`sam build`](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk-building.html)

```shell
$ sam build -t ./cdk.out/CdkStack.template.json
```
The output will be:
```text
Build Succeeded

Built Artifacts  : .aws-sam/build
Built Template   : .aws-sam/build/template.yaml

Commands you can use next
=========================
[*] Validate SAM template: sam validate
[*] Invoke Function: sam local invoke
[*] Test Function in the Cloud: sam sync --stack-name {{stack-name}} --watch
[*] Deploy: sam deploy --guided
```

as a result you will have
.aws-sam/build/template.yaml with all the SAM resources

### Generate event
```shell
$ sam local generate-event sqs receive-message
$ sam local generate-event apigateway aws-proxy
```

### Invoke locally
For the details see the [link](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-cdk-testing.html)

```shell
$ sam local invoke CdkSamInputFunction -e events/receiveMessage.json
```

## Troubleshooting

Error: Running AWS SAM projects locally requires Docker. Have you got it installed and running?
Run docker



