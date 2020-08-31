import * as cdk from '@aws-cdk/core';
import { Duration } from '@aws-cdk/core';
import { EcrSync } from '@pgarbe/cdk-ecr-sync';
// import { EcrSync } from '../src';

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
