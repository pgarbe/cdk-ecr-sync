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

  projenrcTs: true,

  releaseEveryCommit: true,

  catalog: {
    twitter: 'pgarbe',
  },

  cdkVersion: '2.86.0',
  // cdkVersionPinning: true,
  // cdkDependenciesAsDeps: false,

  // cdkDependencies: ['aws-cdk-lib'],
  devDeps: ['constructs', 'esbuild', 'pre-commit'],
  deps: ['aws-sdk', 'jszip'],
  bundledDeps: ['aws-sdk', 'jszip'],
});


project.gitignore.exclude('cdk.out');
project.npmignore!.exclude('examples');
project.synth();
