import * as handler from '../src/lambda/get-image-tags-handler';

test('Docker image tags are loaded through pagination', async (done) => {

  // WHEN
  let tags = await handler.getDockerImageTags('datadog/agent');

  // THEN
  expect(tags.length).toBeGreaterThan(100);

  done();

}, 30000);

test('Docker library image tags are loaded through pagination', async (done) => {

  // WHEN
  let tags = await handler.getDockerImageTags('amazonlinux');

  // THEN
  expect(tags.length).toBeGreaterThan(0);

  done();

}, 30000);
