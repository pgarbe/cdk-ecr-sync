# CDK ECR Sync

An CDK Construct which synchronizes Docker images from Docker Hub to ECR.

![](https://github.com/pgarbe/cdk-ecr-sync/workflows/Build/badge.svg)

## How to use it

```typescript
new EcrSync(this, 'ecrSync', {
    dockerImages: [
        { imageName: 'datadog/agent' }
    ]
});
```

See also `examples` folder.

## Next ideas
- [ ] Build and publish with GitHub actions
- [ ] Have pagination for DockerHub image tags
- [ ] Implement `includeLatest` property
- [ ] Option to define schedule when sync should happen
- [ ] Options to provide CloudWatch alarms
