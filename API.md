# CDK ECR Sync

An CDK Construct to synchronizes Docker images from Docker Hub to ECR.

![](https://github.com/pgarbe/cdk-ecr-sync/workflows/Build/badge.svg)

Why should you use it?

1. Avoid [DockerHub throttling](https://www.docker.com/increase-rate-limits)
2. Better availability (ECR: [99.9%](https://aws.amazon.com/ecr/sla/), DockerHub: ["as is"](https://www.docker.com/sites/default/files/d8/2019-04/docker-master-subscription-and-services-agreement-april-2019.pdf))
3. Possible less data transfer costs (ECS pulls from ECR in same region are [free](https://aws.amazon.com/ecr/pricing/))

See also my blog post: https://garbe.io/blog/2020/04/22/cdk-ecr-sync/

## How to use it

In your CDK application, run `npm install @pgarbe/cdk-ecr-sync` and add the following construct:

```typescript
const ecrSync = new EcrSync(this, 'ecrSync', {
  repoPrefix: 'dockerhub-mirror', // optional prefix
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

# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### EcrSync <a name="EcrSync" id="@pgarbe/cdk-ecr-sync.EcrSync"></a>

Construct to sync Docker images from DockerHub into ECR Repos.

#### Initializers <a name="Initializers" id="@pgarbe/cdk-ecr-sync.EcrSync.Initializer"></a>

```typescript
import { EcrSync } from '@pgarbe/cdk-ecr-sync'

new EcrSync(scope: Construct, id: string, props: EcrSyncProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSync.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSync.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSync.Initializer.parameter.props">props</a></code> | <code><a href="#@pgarbe/cdk-ecr-sync.EcrSyncProps">EcrSyncProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="@pgarbe/cdk-ecr-sync.EcrSync.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="@pgarbe/cdk-ecr-sync.EcrSync.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="@pgarbe/cdk-ecr-sync.EcrSync.Initializer.parameter.props"></a>

- *Type:* <a href="#@pgarbe/cdk-ecr-sync.EcrSyncProps">EcrSyncProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSync.toString">toString</a></code> | Returns a string representation of this construct. |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSync.grantPull">grantPull</a></code> | Grant the given identity permissions to use the images in this repository. |

---

##### `toString` <a name="toString" id="@pgarbe/cdk-ecr-sync.EcrSync.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `grantPull` <a name="grantPull" id="@pgarbe/cdk-ecr-sync.EcrSync.grantPull"></a>

```typescript
public grantPull(grantee: IGrantable): void
```

Grant the given identity permissions to use the images in this repository.

###### `grantee`<sup>Required</sup> <a name="grantee" id="@pgarbe/cdk-ecr-sync.EcrSync.grantPull.parameter.grantee"></a>

- *Type:* aws-cdk-lib.aws_iam.IGrantable

---

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSync.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="@pgarbe/cdk-ecr-sync.EcrSync.isConstruct"></a>

```typescript
import { EcrSync } from '@pgarbe/cdk-ecr-sync'

EcrSync.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="@pgarbe/cdk-ecr-sync.EcrSync.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSync.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="@pgarbe/cdk-ecr-sync.EcrSync.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### EcrSyncProps <a name="EcrSyncProps" id="@pgarbe/cdk-ecr-sync.EcrSyncProps"></a>

Properties for EcrSync.

#### Initializer <a name="Initializer" id="@pgarbe/cdk-ecr-sync.EcrSyncProps.Initializer"></a>

```typescript
import { EcrSyncProps } from '@pgarbe/cdk-ecr-sync'

const ecrSyncProps: EcrSyncProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSyncProps.property.dockerImages">dockerImages</a></code> | <code><a href="#@pgarbe/cdk-ecr-sync.Image">Image</a>[]</code> | Images from Docker Hub that should be pulled into ECR. |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSyncProps.property.initScript">initScript</a></code> | <code>string</code> | Optional. |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSyncProps.property.lifcecyleRule">lifcecyleRule</a></code> | <code>aws-cdk-lib.aws_ecr.LifecycleRule</code> | An ECR lifecycle rule which is applied to all repositories. |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSyncProps.property.repoPrefix">repoPrefix</a></code> | <code>string</code> | A prefix for all ECR repository names. |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSyncProps.property.schedule">schedule</a></code> | <code>aws-cdk-lib.aws_events.Schedule</code> | Optional. |

---

##### `dockerImages`<sup>Required</sup> <a name="dockerImages" id="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.dockerImages"></a>

```typescript
public readonly dockerImages: Image[];
```

- *Type:* <a href="#@pgarbe/cdk-ecr-sync.Image">Image</a>[]

Images from Docker Hub that should be pulled into ECR.

---

##### `initScript`<sup>Optional</sup> <a name="initScript" id="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.initScript"></a>

```typescript
public readonly initScript: string;
```

- *Type:* string
- *Default:* Empty.

Optional.

Bash script injection for the docker image processing phase,
in order to log in to Dockerhub or do other initialization.

---

##### `lifcecyleRule`<sup>Optional</sup> <a name="lifcecyleRule" id="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.lifcecyleRule"></a>

```typescript
public readonly lifcecyleRule: LifecycleRule;
```

- *Type:* aws-cdk-lib.aws_ecr.LifecycleRule
- *Default:* No lifecycle rules.

An ECR lifecycle rule which is applied to all repositories.

---

##### `repoPrefix`<sup>Optional</sup> <a name="repoPrefix" id="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.repoPrefix"></a>

```typescript
public readonly repoPrefix: string;
```

- *Type:* string
- *Default:* Empty.

A prefix for all ECR repository names.

---

##### `schedule`<sup>Optional</sup> <a name="schedule" id="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.schedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* aws-cdk-lib.aws_events.Schedule
- *Default:* is once a day.

Optional.

Schedule when images should be synchronized.

---

### Image <a name="Image" id="@pgarbe/cdk-ecr-sync.Image"></a>

Properties of a EcrSync image.

#### Initializer <a name="Initializer" id="@pgarbe/cdk-ecr-sync.Image.Initializer"></a>

```typescript
import { Image } from '@pgarbe/cdk-ecr-sync'

const image: Image = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#@pgarbe/cdk-ecr-sync.Image.property.imageName">imageName</a></code> | <code>string</code> | The name of the image that should be proxied by ECR. |
| <code><a href="#@pgarbe/cdk-ecr-sync.Image.property.excludeTags">excludeTags</a></code> | <code>string[]</code> | A list of regular expression which tags should be included. Only one of the defined tags must match. |
| <code><a href="#@pgarbe/cdk-ecr-sync.Image.property.includeTags">includeTags</a></code> | <code>string[]</code> | A list of regular expression which tags should be included. Only one of the defined tags must match. |

---

##### `imageName`<sup>Required</sup> <a name="imageName" id="@pgarbe/cdk-ecr-sync.Image.property.imageName"></a>

```typescript
public readonly imageName: string;
```

- *Type:* string

The name of the image that should be proxied by ECR.

---

##### `excludeTags`<sup>Optional</sup> <a name="excludeTags" id="@pgarbe/cdk-ecr-sync.Image.property.excludeTags"></a>

```typescript
public readonly excludeTags: string[];
```

- *Type:* string[]
- *Default:* Empty. No tags are excluded

A list of regular expression which tags should be included. Only one of the defined tags must match.

If includeTags is also defined, excludeTags wins.

---

##### `includeTags`<sup>Optional</sup> <a name="includeTags" id="@pgarbe/cdk-ecr-sync.Image.property.includeTags"></a>

```typescript
public readonly includeTags: string[];
```

- *Type:* string[]
- *Default:* Emtpy. All tags are included

A list of regular expression which tags should be included. Only one of the defined tags must match.

If excludeTags is also defined, excludeTags wins.

---



