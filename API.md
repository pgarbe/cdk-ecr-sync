# API Reference

**Classes**

Name|Description
----|-----------
[EcrSync](#pgarbe-cdk-ecr-sync-ecrsync)|Construct to sync Docker images from DockerHub into ECR Repos.


**Structs**

Name|Description
----|-----------
[EcrSyncProps](#pgarbe-cdk-ecr-sync-ecrsyncprops)|Properties for EcrSync.
[Image](#pgarbe-cdk-ecr-sync-image)|Properties of a EcrSync image.



## class EcrSync  <a id="pgarbe-cdk-ecr-sync-ecrsync"></a>

Construct to sync Docker images from DockerHub into ECR Repos.

__Implements__: [IConstruct](#constructs-iconstruct), [IConstruct](#aws-cdk-core-iconstruct), [IConstruct](#constructs-iconstruct), [IDependable](#aws-cdk-core-idependable)
__Extends__: [Construct](#aws-cdk-core-construct)

### Initializer




```ts
new EcrSync(scope: Construct, id: string, props: EcrSyncProps)
```

* **scope** (<code>[Construct](#aws-cdk-core-construct)</code>)  *No description*
* **id** (<code>string</code>)  *No description*
* **props** (<code>[EcrSyncProps](#pgarbe-cdk-ecr-sync-ecrsyncprops)</code>)  *No description*
  * **dockerImages** (<code>Array<[Image](#pgarbe-cdk-ecr-sync-image)></code>)  Images from Docker Hub that should be pulled into ECR. 
  * **lifcecyleRule** (<code>[LifecycleRule](#aws-cdk-aws-ecr-lifecyclerule)</code>)  An ECR lifecycle rule which is applied to all repositories. __*Default*__: No lifecycle rules.
  * **repoPrefix** (<code>string</code>)  A prefix for all ECR repository names. __*Default*__: Empty.
  * **schedule** (<code>[Schedule](#aws-cdk-aws-events-schedule)</code>)  Optional. __*Default*__: is once a day.


### Methods


#### grantPull(grantee) <a id="pgarbe-cdk-ecr-sync-ecrsync-grantpull"></a>

Grant the given identity permissions to use the images in this repository.

```ts
grantPull(grantee: IGrantable): void
```

* **grantee** (<code>[IGrantable](#aws-cdk-aws-iam-igrantable)</code>)  *No description*






## struct EcrSyncProps  <a id="pgarbe-cdk-ecr-sync-ecrsyncprops"></a>


Properties for EcrSync.



Name | Type | Description 
-----|------|-------------
**dockerImages** | <code>Array<[Image](#pgarbe-cdk-ecr-sync-image)></code> | Images from Docker Hub that should be pulled into ECR.
**lifcecyleRule**? | <code>[LifecycleRule](#aws-cdk-aws-ecr-lifecyclerule)</code> | An ECR lifecycle rule which is applied to all repositories.<br/>__*Default*__: No lifecycle rules.
**repoPrefix**? | <code>string</code> | A prefix for all ECR repository names.<br/>__*Default*__: Empty.
**schedule**? | <code>[Schedule](#aws-cdk-aws-events-schedule)</code> | Optional.<br/>__*Default*__: is once a day.



## struct Image  <a id="pgarbe-cdk-ecr-sync-image"></a>


Properties of a EcrSync image.



Name | Type | Description 
-----|------|-------------
**imageName** | <code>string</code> | The name of the image that should be proxied by ECR.
**excludeTags**? | <code>Array<string></code> | A list of regular expression which tags should be included. Only one of the defined tags must match.<br/>__*Default*__: Empty. No tags are excluded
**includeTags**? | <code>Array<string></code> | A list of regular expression which tags should be included. Only one of the defined tags must match.<br/>__*Default*__: Emtpy. All tags are included



