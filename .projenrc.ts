import * as pj from 'projen';

const project = new pj.awscdk.AwsCdkConstructLibrary({
  name: '@pgarbe/cdk-ecr-sync',
  repositoryUrl: 'https://github.com/pgarbe/cdk-ecr-sync.git',
  keywords: ['cdk', 'ecr'],
  defaultReleaseBranch: 'main',
  description:
    'An CDK Construct to synchronizes Docker images from Docker Hub to ECR.',

  author: 'Philipp Garbe',
  authorAddress: 'https://github.com/pgarbe',

  minNodeVersion: '14.17.0',
  projenrcTs: true,

  releaseEveryCommit: true,

  catalog: {
    twitter: 'pgarbe',
  },

  // creates PRs for projen upgrades
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  cdkVersion: '2.12.0',
  cdkVersionPinning: true,
  // cdkDependenciesAsDeps: false,

  // cdkDependencies: ['aws-cdk-lib'],
  devDeps: ['constructs', 'esbuild', 'pre-commit'],
  deps: ['aws-sdk', 'jszip'],
  bundledDeps: ['aws-sdk', 'jszip'],

  // antitamper: true,
  // jsii publishing

  // java: {
  //   javaPackage: 'com.github.pgarbe.cdk-ecr-sync',
  //   mavenGroupId: 'com.github.pgarbe',
  //   mavenArtifactId: 'cdk-ecr-sync'
  // },
  // python: {
  //   distName: 'cdk-ecr-sync',
  //   module: 'cdk_ecr_sync'
  // }
});

project.gitignore.exclude('cdk.out');
project.npmignore!.exclude('examples');
project.synth();
