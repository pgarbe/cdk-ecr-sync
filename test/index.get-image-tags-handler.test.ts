import * as handler from '../src/lambda/get-image-tags-handler';
import { Image } from '../src/image';

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

test('Latest images are ignored', async (done) => {

  // WHEN
  const dockerImageTags = ['latest'];
  const ecrImageTags = [''];
  const image: Image = { imageName: 'myImage', includeLatest: true };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(1);
  expect(tags[0]).toBe('latest');

  done();
});

test('Only included tags', async (done) => {

  // WHEN
  const dockerImageTags = ['1.0.0', '1.5', '2.0', 'latest'];
  const ecrImageTags = [''];
  const image: Image = { imageName: 'myImage', includeTags: '^1' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(2);
  expect(tags[0]).toBe('1.0.0');
  expect(tags[1]).toBe('1.5');

  done();
});

test('Exclude wins over include', async (done) => {

  // WHEN
  const dockerImageTags = ['1.0.0', '1.5', '2.0', 'latest'];
  const ecrImageTags = [''];
  const image: Image = { imageName: 'myImage', includeTags: '^1', excludeTags: '1.5' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(1);
  expect(tags[0]).toBe('1.0.0');

  done();
});
