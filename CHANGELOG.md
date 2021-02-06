# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.5.8](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.5.7...v0.5.8) (2021-02-06)

### [0.5.7](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.5.6...v0.5.7) (2020-12-10)

### [0.5.6](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.5.5...v0.5.6) (2020-11-20)

### [0.5.5](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.5.4...v0.5.5) (2020-11-18)


### Bug Fixes

* Repo prefix has not been used in sync ([ef04119](https://github.com/pgarbe/cdk-ecr-sync/commit/ef0411980f06fc6202fc9a792fcb544de79aea34))

### [0.5.4](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.5.3...v0.5.4) (2020-11-18)


### Features

* ability to prefix ECR repositories ([30e38d6](https://github.com/pgarbe/cdk-ecr-sync/commit/30e38d6badf53758435a13ec6370caf49a4c19e4)), closes [#414](https://github.com/pgarbe/cdk-ecr-sync/issues/414)


### Bug Fixes

* Ignore tags where no matching manifest exists for linux/amd64 ([a41716d](https://github.com/pgarbe/cdk-ecr-sync/commit/a41716d548945ca7597dee396309224e5a655f30))

### [0.5.3](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.5.2...v0.5.3) (2020-10-09)

### [0.5.2](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.5.1...v0.5.2) (2020-10-09)


### Bug Fixes

* only exclude filters were not applied ([a102bba](https://github.com/pgarbe/cdk-ecr-sync/commit/a102bba433fcb6301778555e2f43d66ee8bbe037))

### [0.5.1](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.5.0...v0.5.1) (2020-10-07)

## [0.5.0](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.4.2...v0.5.0) (2020-10-07)


### Features

* Support multiple include and exclude tags ([db684c7](https://github.com/pgarbe/cdk-ecr-sync/commit/db684c7920193750fda1c34f55353472cc73938e))

### [0.4.2](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.4.1...v0.4.2) (2020-10-02)


### Bug Fixes

* log image tag and digest properly ([d5d1d36](https://github.com/pgarbe/cdk-ecr-sync/commit/d5d1d36386cb37deaa52b64fbcfc5dc0e9985389))
* write tags to trigger file ([de10af4](https://github.com/pgarbe/cdk-ecr-sync/commit/de10af44eb198b638486920ad8f86018c2e3f6d9))

### [0.4.1](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.4.0...v0.4.1) (2020-10-02)


### Bug Fixes

* Pagination with ECR and digest comparison ([af452ae](https://github.com/pgarbe/cdk-ecr-sync/commit/af452aed4cd146ddb96b013be6cffe8848501a50)), closes [#331](https://github.com/pgarbe/cdk-ecr-sync/issues/331)

## [0.4.0](https://github.com/pgarbe/cdk-ecr-sync/compare/v0.3.2...v0.4.0) (2020-10-01)


### Features

* Better support for official images from Docker ([c2f1af0](https://github.com/pgarbe/cdk-ecr-sync/commit/c2f1af018adc108fb25549a684d61ccd0f74aa3f)), closes [#321](https://github.com/pgarbe/cdk-ecr-sync/issues/321)
* Useful option to reduce number of tags ([e2ced6b](https://github.com/pgarbe/cdk-ecr-sync/commit/e2ced6b7aa6de3a686b24676df33ee8b073715bb)), closes [#73](https://github.com/pgarbe/cdk-ecr-sync/issues/73)

### 0.3.2 (2020-09-06)

### 0.3.1 (2020-09-06)


### Bug Fixes

* wrong dependency in example ([e3bcf71](https://github.com/pgarbe/cdk-ecr-sync/commit/e3bcf71f4fa74f5d40c8a4f210fe59b91a15f3bd))
