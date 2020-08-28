# CDK ECR Sync

An CDK Construct to synchronizes Docker images from Docker Hub to ECR.

![](https://github.com/pgarbe/cdk-ecr-sync/workflows/Build/badge.svg)

## How to use it

```typescript
new EcrSync(this, 'ecrSync', {
  dockerImages: [
    { imageName: 'datadog/agent' }
  ],
  lifcecyleRule: {...} // Optional lifecycle rule for ECR repos
});
```

See also `examples` folder.


## How to release

```
yarn release
```
