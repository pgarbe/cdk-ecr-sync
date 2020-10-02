import { Image } from '../src/image';
import * as handler from '../src/lambda/get-image-tags-handler';

test('Latest images are ignored', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: 'latest', digest: '' }];
  const ecrImageTags: handler.ContainerImage[] = [];
  const image: Image = { imageName: 'myImage', includeLatest: true };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(1);
  expect(tags[0].tag).toBe('latest');

  done();
});

test('Only included tags', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', digest: '' }, { tag: '1.5', digest: '' }, { tag: '2.0', digest: '' }, { tag: 'latest', digest: '' }];
  const ecrImageTags: handler.ContainerImage[] = [];
  const image: Image = { imageName: 'myImage', includeTags: '^1' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(2);
  expect(tags[0].tag).toBe('1.0.0');
  expect(tags[1].tag).toBe('1.5');

  done();
});

test('Exclude wins over include', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', digest: '' }, { tag: '1.5', digest: '' }, { tag: '2.0', digest: '' }, { tag: 'latest', digest: '' }];
  const ecrImageTags: handler.ContainerImage[] = [];

  const image: Image = { imageName: 'myImage', includeTags: '^1', excludeTags: '1.5' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(1);
  expect(tags[0].tag).toBe('1.0.0');

  done();
});

test('Images missing in ECR are added', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', digest: '' }, { tag: '1.5', digest: '' }, { tag: '2.0', digest: '' }, { tag: 'latest', digest: '' }];
  const ecrImageTags = [{ tag: '1.0.0', digest: '' }];

  const image: Image = { imageName: 'myImage' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(2);
  expect(tags[0].tag).toBe('1.5');
  expect(tags[1].tag).toBe('2.0');

  done();
});

test('Additional images in ECR are ignored', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', digest: '' }, { tag: '1.5', digest: '' }, { tag: '2.0', digest: '' }, { tag: 'latest', digest: '' }];
  const ecrImageTags = [{ tag: '1.0.0', digest: '' }, { tag: '1.1', digest: '' }];

  const image: Image = { imageName: 'myImage' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(2);

  expect(tags[0].tag).toBe('1.5');
  expect(tags[1].tag).toBe('2.0');

  done();
});

test('Existing tags with same digest are ignored', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', digest: 'sha256:655ed9c3ae' }, { tag: '1.5', digest: 'sha256:b6b46bdc15' }];
  const ecrImageTags = [{ tag: '1.0.0', digest: 'sha256:655ed9c3ae' }, { tag: '1.5', digest: 'sha256:b6b46bdc15' }];
  const image: Image = { imageName: 'myImage' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(0);

  done();
});

test('Existing tags with different digest are synced', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', digest: 'sha256:655ed9c3ae' }, { tag: '1.5', digest: 'sha256:be7c1d95ac' }];
  const ecrImageTags = [{ tag: '1.0.0', digest: 'sha256:655ed9c3ae' }, { tag: '1.5', digest: 'sha256:b6b46bdc15' }];
  const image: Image = { imageName: 'myImage' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(1);
  expect(tags[0].tag).toBe('1.5');

  done();
});
