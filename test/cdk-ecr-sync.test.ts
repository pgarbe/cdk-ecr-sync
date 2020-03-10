import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
// import * as sns from '@aws-cdk/aws-sns';
import EcrSync = require('../lib/index');

test('Defaults are correctly set', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");

    // WHEN
    new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'foo/bar' }] });

    // THEN
    // Repository is created
    expectCDK(stack).to(haveResource("AWS::ECR::Repository", {
        RepositoryName: 'foo/bar'
    }));

    // Rule is set
    expectCDK(stack).to(haveResource("AWS::Events::Rule", {
      ScheduleExpression: "rate(1 day)"
    }));

    // includeLatest is not set
    expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
      "Environment": {
        "Variables": {
          "AWS_ACCOUNT_ID": {
            "Ref": "AWS::AccountId"
          },
          "REGION": {
            "Ref": "AWS::Region"
          },
          "IMAGES": "[{\"imageName\":\"foo/bar\"}]",
          "BUCKET_NAME": {
            "Ref": "MyTestConstructArtifactBucket864F78F1"
          }
        }
      }
    }));    
  });

test('IncludeLatest is included when it is set to true', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, "TestStack");

  // WHEN
  new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'foo/bar', includeLatest: true}] });

  // THEN
  expectCDK(stack).to(haveResource("AWS::Lambda::Function", {
    "Environment": {
      "Variables": {
        "AWS_ACCOUNT_ID": {
          "Ref": "AWS::AccountId"
        },
        "REGION": {
          "Ref": "AWS::Region"
        },
        "IMAGES": "[{\"imageName\":\"foo/bar\",\"includeLatest\":true}]",
        "BUCKET_NAME": {
          "Ref": "MyTestConstructArtifactBucket864F78F1"
        }
      }
    }
  }));
});

// test('Sends alerts to given SNS topic', () => {
//     const app = new cdk.App();
//     const stack = new cdk.Stack(app, "TestStack");

//     // WHEN
//     const topic = new sns.Topic(stack, 'AlarmTopic');
//     const sync = new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'datadog/agent' }] });
//     sync.sendAlarmsTo(topic)

//     // THEN
//     expectCDK(stack).to(haveResource("AWS::ECR::Repository", {
//         RepositoryName: 'datadog/agent'
//     }));
// });
