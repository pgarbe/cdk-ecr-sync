// eslint-disable-next-line
import { expect as expectCDK, haveResource, haveResourceLike } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as EcrSync from '../src/index';

test('Defaults are correctly set', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // WHEN
  new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'foo/bar' }] });

  // THEN
  // Repository is created
  expectCDK(stack).to(haveResource('AWS::ECR::Repository', {
    RepositoryName: 'foo/bar',
  }));

  // Rule is set
  expectCDK(stack).to(haveResource('AWS::Events::Rule', {
    ScheduleExpression: 'rate(1 day)',
  }));

  // includeLatest is not set
  expectCDK(stack).to(haveResourceLike('AWS::Lambda::Function', {
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
  }));
});

test('excludeTags is included when it is set to true', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // WHEN
  new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'foo/bar', excludeTags: ['latest'] }] });

  // THEN
  expectCDK(stack).to(haveResourceLike('AWS::Lambda::Function', {
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
  }));
});


test('Reponame prefix is set when available', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // WHEN
  new EcrSync.EcrSync(stack, 'MyTestConstruct', { repoPrefix: 'myprefix', dockerImages: [{ imageName: 'foo/bar', excludeTags: ['latest'] }] });

  // THEN
  expectCDK(stack).to(haveResourceLike('AWS::ECR::Repository', {
    RepositoryName: 'myprefix/foo/bar',
  }));
});

test('Reponame is used from image name', () => {
  const app = new cdk.App();
  const stack = new cdk.Stack(app, 'TestStack');

  // WHEN
  new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'foo/bar', excludeTags: ['latest'] }] });

  // THEN
  expectCDK(stack).to(haveResourceLike('AWS::ECR::Repository', {
    RepositoryName: 'foo/bar',
  }));
});
