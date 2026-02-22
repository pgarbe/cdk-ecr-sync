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
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSync.with">with</a></code> | Applies one or more mixins to this construct. |
| <code><a href="#@pgarbe/cdk-ecr-sync.EcrSync.grantPull">grantPull</a></code> | Grant the given identity permissions to use the images in this repository. |

---

##### `toString` <a name="toString" id="@pgarbe/cdk-ecr-sync.EcrSync.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

##### `with` <a name="with" id="@pgarbe/cdk-ecr-sync.EcrSync.with"></a>

```typescript
public with(mixins: ...IMixin[]): IConstruct
```

Applies one or more mixins to this construct.

Mixins are applied in order. The list of constructs is captured at the
start of the call, so constructs added by a mixin will not be visited.
Use multiple `with()` calls if subsequent mixins should apply to added
constructs.

###### `mixins`<sup>Required</sup> <a name="mixins" id="@pgarbe/cdk-ecr-sync.EcrSync.with.parameter.mixins"></a>

- *Type:* ...constructs.IMixin[]

The mixins to apply.

---

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

##### `isConstruct` <a name="isConstruct" id="@pgarbe/cdk-ecr-sync.EcrSync.isConstruct"></a>

```typescript
import { EcrSync } from '@pgarbe/cdk-ecr-sync'

EcrSync.isConstruct(x: any)
```

Checks if `x` is a construct.

Use this method instead of `instanceof` to properly detect `Construct`
instances, even when the construct library is symlinked.

Explanation: in JavaScript, multiple copies of the `constructs` library on
disk are seen as independent, completely different libraries. As a
consequence, the class `Construct` in each copy of the `constructs` library
is seen as a different class, and an instance of one class will not test as
`instanceof` the other class. `npm install` will not create installations
like this, but users may manually symlink construct libraries together or
use a monorepo tool: in those cases, multiple copies of the `constructs`
library can be accidentally installed, and `instanceof` will behave
unpredictably. It is safest to avoid using `instanceof`, and using
this type-testing method instead.

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



