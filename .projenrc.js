const { AwsCdkConstructLibrary } = require('projen');

const project = new AwsCdkConstructLibrary({
  name: '@pgarbe/cdk-ecr-sync',
  description:
    'An CDK Construct to synchronizes Docker images from Docker Hub to ECR.',
  authorName: 'Philipp Garbe',
  authorUrl: 'https://garbe.io',
  repository: 'https://github.com/pgarbe/cdk-ecr-sync.git',
  keywords: ['cdk', 'ecr'],
  defaultReleaseBranch: 'main',
  minNodeVersion: '14.15.0',

  releaseEveryCommit: true,

  catalog: {
    twitter: 'pgarbe',
  },

  // creates PRs for projen upgrades
  projenUpgradeSecret: 'PROJEN_GITHUB_TOKEN',

  cdkVersion: '2.0.0-rc.29',

  cdkDependencies: ['aws-cdk-lib'],
  devDeps: ['constructs', 'esbuild', 'pre-commit', 'aws-cdk-lib@2.0.0-rc.29'],
  deps: ['aws-sdk', 'jszip'],
  bundledDeps: ['aws-sdk', 'jszip'],

  antitamper: true,
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
project.npmignore.exclude('examples');
project.synth();
