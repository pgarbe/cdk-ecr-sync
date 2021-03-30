import '@aws-cdk/assert/jest';
import * as evt from '@aws-cdk/aws-events';
import * as cdk from '@aws-cdk/core';
import * as EcrSync from '../src/index';

test('Defaults are correctly set', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // WHEN
  new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'foo/bar' }] });

  // THEN
  // Repository is created
  expect(stack).toHaveResource('AWS::ECR::Repository', {
    RepositoryName: 'foo/bar',
  });

  // Rule is set
  expect(stack).toHaveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 day)',
  });

  // includeLatest is not set
  expect(stack).toHaveResourceLike('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        AWS_ACCOUNT_ID: {
          Ref: 'AWS::AccountId',
        },
        REGION: {
          Ref: 'AWS::Region',
        },
        IMAGES: '[{"imageName":"foo/bar"}]',
        BUCKET_NAME: {
          Ref: 'MyTestConstructArtifactBucket864F78F1',
        },
      },
    },
  });
});

test('excludeTags is included when it is set to true', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // WHEN
  new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'foo/bar', excludeTags: ['latest'] }] });

  // THEN
  expect(stack).toHaveResourceLike('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        AWS_ACCOUNT_ID: {
          Ref: 'AWS::AccountId',
        },
        REGION: {
          Ref: 'AWS::Region',
        },
        IMAGES: '[{"imageName":"foo/bar","excludeTags":["latest"]}]',
        BUCKET_NAME: {
          Ref: 'MyTestConstructArtifactBucket864F78F1',
        },
      },
    },
  });
});


test('Reponame prefix is set when available', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // WHEN
  new EcrSync.EcrSync(stack, 'MyTestConstruct', { repoPrefix: 'myprefix', dockerImages: [{ imageName: 'foo/bar', excludeTags: ['latest'] }] });

  // THEN
  expect(stack).toHaveResourceLike('AWS::ECR::Repository', {
    RepositoryName: 'myprefix/foo/bar',
  });
  expect(stack).toHaveResourceLike('AWS::Lambda::Function', {
    Environment: {
      Variables: {
        REPO_PREFIX: 'myprefix',
      },
    },
  });
});

test('Reponame is used from image name', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // WHEN
  new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'foo/bar', excludeTags: ['latest'] }] });

  // THEN
  expect(stack).toHaveResourceLike('AWS::ECR::Repository', {
    RepositoryName: 'foo/bar',
  });
});

test('multiple repositories', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // WHEN
  new EcrSync.EcrSync(stack, 'ecrSync', {
    schedule: evt.Schedule.rate(cdk.Duration.hours(6)),
    dockerImages: [
      { imageName: 'alpine', includeTags: ['^3'] },
      { imageName: 'datadog/agent', excludeTags: ['-rc', '-beta'] },
      { imageName: 'node', includeTags: ['^12', '^14'] },
      { imageName: 'python', includeTags: ['^3.6'] },
      { imageName: 'mongo', includeTags: ['^4'], excludeTags: ['windowsservercore', '4.2.4', '-rc'] },
      { imageName: 'amazon/dynamodb-local' },
      { imageName: 'localstack/localstack' },
      { imageName: 'amazonlinux', includeTags: ['^2\.'], excludeTags: ['with-sources', '^2016', '^2017', '^2018', '^2.0.2018', '^2.0.2019'] },
      { imageName: 'confluentinc/cp-zookeeper', includeTags: ['^5'], excludeTags: ['-ubi8', '-deb8', '-beta'] },
      { imageName: 'confluentinc/cp-kafka', includeTags: ['^5'], excludeTags: ['-ubi8', '-deb8', '-beta'] },
      { imageName: 'confluentinc/cp-schema-registry', includeTags: ['^5.3.2'] },
      { imageName: 'confluentinc/cp-kafka-rest', includeTags: ['^5.3.2'] },
    ],
    lifcecyleRule: {
      maxImageAge: cdk.Duration.days(365),
    },
  });

  expect(stack).toHaveResourceLike('AWS::ECR::Repository', {
    RepositoryName: 'amazonlinux',
  });

});