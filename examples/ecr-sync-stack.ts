import * as cdk from '@aws-cdk/core';
import { EcrSync } from '../src';
import { Duration } from '@aws-cdk/core';
// import { EcrSync } from '@pgarbe/cdk-ecr-sync';

export class EcrSyncStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // The code that defines your stack goes here
    new EcrSync(this, 'ecrSync', {
      dockerImages: [
        { imageName: 'datadog/agent' },
      ],
      lifcecyleRule: {
        maxImageAge: Duration.days(365),  
      },
    });
  }
}
