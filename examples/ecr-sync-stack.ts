import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
// import { EcrSync } from '@pgarbe/cdk-ecr-sync';
import { EcrSync } from '../src';

export class EcrSyncStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new EcrSync(this, 'ecrSync', {
      dockerImages: [
        { imageName: 'datadog/agent' },
      ],
      lifcecyleRule: {
        maxImageAge: cdk.Duration.days(365),
      },
    });
  }
}

const app = new cdk.App();
new EcrSyncStack(app, 'EcrSyncStack');
