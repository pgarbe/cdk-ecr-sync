# CDK ECR Sync

An CDK Construct to synchronizes Docker images from Docker Hub to ECR.

![](https://github.com/pgarbe/cdk-ecr-sync/workflows/Build/badge.svg)

Why should you use it? 
1) Avoid [DockerHub throttling](TODO)
2) Better availability (ECR: [99.9%](https://aws.amazon.com/ecr/sla/), DockerHub: ["as is"](https://www.docker.com/sites/default/files/d8/2019-04/docker-master-subscription-and-services-agreement-april-2019.pdf))
3) Possible less data transfer costs (ECS pulls from ECR in same region are [free](https://aws.amazon.com/ecr/pricing/))

## How to use it

In your CDK application, run `npm install @pgarbe/cdk-ecr-sync` and add the following construct:

```typescript
const ecrSync = new EcrSync(this, 'ecrSync', {
  dockerImages: [
    { 
      imageName: 'datadog/agent', 
      excludeTags: [  // Use RegEx expressions to exclude specific tags
        'latest', 
        '^1.0' 
      ],
    }
  ],
  lifcecyleRule: {...} // Optional lifecycle rule for ECR repos
});

// Allow all accounts in your organization to pull
ecrSync.grantPull(new iam.OrganizationalPrincipal('o-123456'));
```

See also `examples` folder.


### Trigger the sync manually
Look up for a lambda called `*ecrSync*%*`, add an empty test event, and execute it. The lambda will check which images needs to be synced and trigger a CodePipeline.
