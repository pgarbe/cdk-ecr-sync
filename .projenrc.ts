import { NodePackage } from "projen";

const project = new NodePackage({
  name: "cdk-ecr-sync",
  defaultReleaseBranch: "main",
  nodeVersion: "20.x", // Set Node.js to the new 20.x version
  // other configurations...
});

project.synth();