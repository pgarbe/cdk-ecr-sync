import * as handler from '../src/ecr-sync.get-image-tags-handler';

test('Docker image tags are loaded through pagination', async () => {

  // WHEN
  let tags = await handler.getDockerImageTags('datadog/agent');

  // THEN
  expect(tags.length).toBeGreaterThan(100);
});
