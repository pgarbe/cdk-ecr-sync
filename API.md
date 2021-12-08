# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="constructs"></a>

### EcrSync <a name="@pgarbe/cdk-ecr-sync.EcrSync" id="pgarbecdkecrsyncecrsync"></a>

Construct to sync Docker images from DockerHub into ECR Repos.

#### Initializers <a name="@pgarbe/cdk-ecr-sync.EcrSync.Initializer" id="pgarbecdkecrsyncecrsyncinitializer"></a>

```typescript
import { EcrSync } from '@pgarbe/cdk-ecr-sync'

new EcrSync(scope: Construct, id: string, props: EcrSyncProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| [`scope`](#pgarbecdkecrsyncecrsyncparameterscope)<span title="Required">*</span> | [`constructs.Construct`](#constructs.Construct) | *No description.* |
| [`id`](#pgarbecdkecrsyncecrsyncparameterid)<span title="Required">*</span> | `string` | *No description.* |
| [`props`](#pgarbecdkecrsyncecrsyncparameterprops)<span title="Required">*</span> | [`@pgarbe/cdk-ecr-sync.EcrSyncProps`](#@pgarbe/cdk-ecr-sync.EcrSyncProps) | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="@pgarbe/cdk-ecr-sync.EcrSync.parameter.scope" id="pgarbecdkecrsyncecrsyncparameterscope"></a>

- *Type:* [`constructs.Construct`](#constructs.Construct)

---

##### `id`<sup>Required</sup> <a name="@pgarbe/cdk-ecr-sync.EcrSync.parameter.id" id="pgarbecdkecrsyncecrsyncparameterid"></a>

- *Type:* `string`

---

##### `props`<sup>Required</sup> <a name="@pgarbe/cdk-ecr-sync.EcrSync.parameter.props" id="pgarbecdkecrsyncecrsyncparameterprops"></a>

- *Type:* [`@pgarbe/cdk-ecr-sync.EcrSyncProps`](#@pgarbe/cdk-ecr-sync.EcrSyncProps)

---

#### Methods <a name="Methods" id="methods"></a>

| **Name** | **Description** |
| --- | --- |
| [`grantPull`](#pgarbecdkecrsyncecrsyncgrantpull) | Grant the given identity permissions to use the images in this repository. |

---

##### `grantPull` <a name="@pgarbe/cdk-ecr-sync.EcrSync.grantPull" id="pgarbecdkecrsyncecrsyncgrantpull"></a>

```typescript
public grantPull(grantee: IGrantable)
```

###### `grantee`<sup>Required</sup> <a name="@pgarbe/cdk-ecr-sync.EcrSync.parameter.grantee" id="pgarbecdkecrsyncecrsyncparametergrantee"></a>

- *Type:* [`aws-cdk-lib.aws_iam.IGrantable`](#aws-cdk-lib.aws_iam.IGrantable)

---




## Structs <a name="Structs" id="structs"></a>

### EcrSyncProps <a name="@pgarbe/cdk-ecr-sync.EcrSyncProps" id="pgarbecdkecrsyncecrsyncprops"></a>

Properties for EcrSync.

#### Initializer <a name="[object Object].Initializer" id="object-objectinitializer"></a>

```typescript
import { EcrSyncProps } from '@pgarbe/cdk-ecr-sync'

const ecrSyncProps: EcrSyncProps = { ... }
```

#### Properties <a name="Properties" id="properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| [`dockerImages`](#pgarbecdkecrsyncecrsyncpropspropertydockerimages)<span title="Required">*</span> | [`@pgarbe/cdk-ecr-sync.Image`](#@pgarbe/cdk-ecr-sync.Image)[] | Images from Docker Hub that should be pulled into ECR. |
| [`initScript`](#pgarbecdkecrsyncecrsyncpropspropertyinitscript) | `string` | Optional. |
| [`lifcecyleRule`](#pgarbecdkecrsyncecrsyncpropspropertylifcecylerule) | [`aws-cdk-lib.aws_ecr.LifecycleRule`](#aws-cdk-lib.aws_ecr.LifecycleRule) | An ECR lifecycle rule which is applied to all repositories. |
| [`repoPrefix`](#pgarbecdkecrsyncecrsyncpropspropertyrepoprefix) | `string` | A prefix for all ECR repository names. |
| [`schedule`](#pgarbecdkecrsyncecrsyncpropspropertyschedule) | [`aws-cdk-lib.aws_events.Schedule`](#aws-cdk-lib.aws_events.Schedule) | Optional. |

---

##### `dockerImages`<sup>Required</sup> <a name="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.dockerImages" id="pgarbecdkecrsyncecrsyncpropspropertydockerimages"></a>

```typescript
public readonly dockerImages: Image[];
```

- *Type:* [`@pgarbe/cdk-ecr-sync.Image`](#@pgarbe/cdk-ecr-sync.Image)[]

Images from Docker Hub that should be pulled into ECR.

---

##### `initScript`<sup>Optional</sup> <a name="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.initScript" id="pgarbecdkecrsyncecrsyncpropspropertyinitscript"></a>

```typescript
public readonly initScript: string;
```

- *Type:* `string`
- *Default:* Empty.

Optional.

Bash script injection for the docker image processing phase, in order to log in to Dockerhub or do other initialization.

---

##### `lifcecyleRule`<sup>Optional</sup> <a name="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.lifcecyleRule" id="pgarbecdkecrsyncecrsyncpropspropertylifcecylerule"></a>

```typescript
public readonly lifcecyleRule: LifecycleRule;
```

- *Type:* [`aws-cdk-lib.aws_ecr.LifecycleRule`](#aws-cdk-lib.aws_ecr.LifecycleRule)
- *Default:* No lifecycle rules.

An ECR lifecycle rule which is applied to all repositories.

---

##### `repoPrefix`<sup>Optional</sup> <a name="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.repoPrefix" id="pgarbecdkecrsyncecrsyncpropspropertyrepoprefix"></a>

```typescript
public readonly repoPrefix: string;
```

- *Type:* `string`
- *Default:* Empty.

A prefix for all ECR repository names.

---

##### `schedule`<sup>Optional</sup> <a name="@pgarbe/cdk-ecr-sync.EcrSyncProps.property.schedule" id="pgarbecdkecrsyncecrsyncpropspropertyschedule"></a>

```typescript
public readonly schedule: Schedule;
```

- *Type:* [`aws-cdk-lib.aws_events.Schedule`](#aws-cdk-lib.aws_events.Schedule)
- *Default:* is once a day.

Optional.

Schedule when images should be synchronized.

---

### Image <a name="@pgarbe/cdk-ecr-sync.Image" id="pgarbecdkecrsyncimage"></a>

Properties of a EcrSync image.

#### Initializer <a name="[object Object].Initializer" id="object-objectinitializer"></a>

```typescript
import { Image } from '@pgarbe/cdk-ecr-sync'

const image: Image = { ... }
```

#### Properties <a name="Properties" id="properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| [`imageName`](#pgarbecdkecrsyncimagepropertyimagename)<span title="Required">*</span> | `string` | The name of the image that should be proxied by ECR. |
| [`excludeTags`](#pgarbecdkecrsyncimagepropertyexcludetags) | `string`[] | A list of regular expression which tags should be included. Only one of the defined tags must match. |
| [`includeTags`](#pgarbecdkecrsyncimagepropertyincludetags) | `string`[] | A list of regular expression which tags should be included. Only one of the defined tags must match. |

---

##### `imageName`<sup>Required</sup> <a name="@pgarbe/cdk-ecr-sync.Image.property.imageName" id="pgarbecdkecrsyncimagepropertyimagename"></a>

```typescript
public readonly imageName: string;
```

- *Type:* `string`

The name of the image that should be proxied by ECR.

---

##### `excludeTags`<sup>Optional</sup> <a name="@pgarbe/cdk-ecr-sync.Image.property.excludeTags" id="pgarbecdkecrsyncimagepropertyexcludetags"></a>

```typescript
public readonly excludeTags: string[];
```

- *Type:* `string`[]
- *Default:* Empty. No tags are excluded

A list of regular expression which tags should be included. Only one of the defined tags must match.

If includeTags is also defined, excludeTags wins.

---

##### `includeTags`<sup>Optional</sup> <a name="@pgarbe/cdk-ecr-sync.Image.property.includeTags" id="pgarbecdkecrsyncimagepropertyincludetags"></a>

```typescript
public readonly includeTags: string[];
```

- *Type:* `string`[]
- *Default:* Emtpy. All tags are included

A list of regular expression which tags should be included. Only one of the defined tags must match.

If excludeTags is also defined, excludeTags wins.

---



