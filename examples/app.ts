#!/usr/bin/env node
import * as cdk from '@aws-cdk/core';
import { EcrSyncStack } from './ecr-sync-stack';

const app = new cdk.App();
new EcrSyncStack(app, 'EcrSyncStack');
