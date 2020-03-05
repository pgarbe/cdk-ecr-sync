import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import EcrSync = require('../lib/index');

test('Creates ECR repository', () => {
    const app = new cdk.App();
    const stack = new cdk.Stack(app, "TestStack");

    // WHEN
    new EcrSync.EcrSync(stack, 'MyTestConstruct', { dockerImages: [{ imageName: 'datadog/agent' }] });

    // THEN
    expectCDK(stack).to(haveResource("AWS::ECR::Repository", {
        RepositoryName: 'datadog/agent'
    }));
});
