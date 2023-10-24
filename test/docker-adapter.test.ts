import * as docker from '../src/lambda/docker-adapter';

test('Docker image tags are loaded through pagination', async () => {
  // WHEN
  const tags = await docker.getDockerImageTags('datadog/agent');

  // THEN
  expect(tags.length).toBeGreaterThan(100);
  expect(tags[0].digest?.length).toBeGreaterThan(0);
  expect(tags[0].tag.length).toBeGreaterThan(0);
}, 30000);

test('Docker library image tags are loaded through pagination', async () => {
  // WHEN
  const tags = await docker.getDockerImageTags('amazonlinux');

  // THEN
  expect(tags.length).toBeGreaterThan(100);
  expect(tags[0].digest?.length).toBeGreaterThan(0);
  expect(tags[0].tag.length).toBeGreaterThan(0);
}, 30000);

test('Docker library image tags include only amd64/linux images or arm64/linux images', async () => {
  // WHEN
  const tags = await docker.getDockerImageTags('mongo');

  // THEN
  expect(tags.filter((t) => t.tag === '4.2.4').length).toBe(0); // mongo:4.2.4 has only amd64/windows images
}, 30000);
