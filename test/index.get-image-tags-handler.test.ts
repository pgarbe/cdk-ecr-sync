import { Image } from '../src/image';
import * as handler from '../src/lambda/get-image-tags-handler';

test('Only included tags', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: '' }, { tag: '1.5', lastUpdated: '', digest: '' }, { tag: '2.0', lastUpdated: '', digest: '' }, { tag: 'latest', lastUpdated: '', digest: '' }];
  const ecrImageTags: handler.ContainerImage[] = [];
  const image: Image = { imageName: 'myImage', includeTags: ['^1'] };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(2);
  expect(tags[0].tag).toBe('1.0.0');
  expect(tags[1].tag).toBe('1.5');

  done();
});

test('Exclude wins over include', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: '' }, { tag: '1.5', lastUpdated: '', digest: '' }, { tag: '2.0', lastUpdated: '', digest: '' }, { tag: 'latest', lastUpdated: '', digest: '' }];
  const ecrImageTags: handler.ContainerImage[] = [];

  const image: Image = { imageName: 'myImage', includeTags: ['^1'], excludeTags: ['1.5'] };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(1);
  expect(tags[0].tag).toBe('1.0.0');

  done();
});

test('Only excluded tags', async (done) => {

  // WHEN
  const dockerImageTags = [
    { tag: '4.2.10-windowsservercore-ltsc2016 ', lastUpdated: '', digest: undefined },
    { tag: '4.2.10-windowsservercore', lastUpdated: '', digest: undefined },
    { tag: '4.2.10', lastUpdated: '', digest: 'sha256:2fc6a72a6e563f51f5fcc9e997eed996cec4db45aa0d415ff61928a9ecbbee95' },
    { tag: '3.6', lastUpdated: '', digest: 'sha256:32ee79b2b3a29600f1cd7cb99f2089e750420de52b4afa1a72f99c35ef259688' },
    { tag: '3', lastUpdated: '', digest: 'sha256:32ee79b2b3a29600f1cd7cb99f2089e750420de52b4afa1a72f99c35ef259688' },
    { tag: '3.6.20', lastUpdated: '', digest: undefined },
  ];
  const ecrImageTags = [] as handler.ContainerImage[];
  const image: Image = { imageName: 'myImage', excludeTags: ['windowsservercore', '^3'] };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(1);
  expect(tags[0].tag).toBe('4.2.10');

  done();
});

test('No include and no exclude returns all', async (done) => {

  // WHEN
  const dockerImageTags = [
    { tag: '4.2.10-windowsservercore-ltsc2016 ', lastUpdated: '', digest: undefined },
    { tag: '4.2.10-windowsservercore', lastUpdated: '', digest: undefined },
    { tag: '4.2.10', lastUpdated: '', digest: 'sha256:2fc6a72a6e563f51f5fcc9e997eed996cec4db45aa0d415ff61928a9ecbbee95' },
    { tag: '3.6', lastUpdated: '', digest: 'sha256:32ee79b2b3a29600f1cd7cb99f2089e750420de52b4afa1a72f99c35ef259688' },
    { tag: '3', lastUpdated: '', digest: 'sha256:32ee79b2b3a29600f1cd7cb99f2089e750420de52b4afa1a72f99c35ef259688' },
    { tag: '3.6.20', lastUpdated: '', digest: undefined },
  ];
  const ecrImageTags = [] as handler.ContainerImage[];
  const image: Image = { imageName: 'myImage' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(6);

  done();
});

test('Images missing in ECR are added', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: '' }, { tag: '1.5', lastUpdated: '', digest: '' }, { tag: '2.0', lastUpdated: '', digest: '' }, { tag: 'latest', lastUpdated: '', digest: '' }];
  const ecrImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: '' }];

  const image: Image = { imageName: 'myImage' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(3);
  expect(tags[0].tag).toBe('1.5');
  expect(tags[1].tag).toBe('2.0');
  expect(tags[2].tag).toBe('latest');

  done();
});

test('Additional images in ECR are ignored', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: '' }, { tag: '1.5', lastUpdated: '', digest: '' }, { tag: '2.0', lastUpdated: '', digest: '' }, { tag: 'latest', lastUpdated: '', digest: '' }];
  const ecrImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: '' }, { tag: '1.1', lastUpdated: '', digest: '' }];

  const image: Image = { imageName: 'myImage' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(3);
  expect(tags[0].tag).toBe('1.5');
  expect(tags[1].tag).toBe('2.0');
  expect(tags[2].tag).toBe('latest');

  done();
});

test('Existing tags with same digest are ignored', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: 'sha256:655ed9c3ae' }, { tag: '1.5', lastUpdated: '', digest: 'sha256:b6b46bdc15' }];
  const ecrImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: 'sha256:655ed9c3ae' }, { tag: '1.5', lastUpdated: '', digest: 'sha256:b6b46bdc15' }];
  const image: Image = { imageName: 'myImage' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(0);

  done();
});

test('Existing tags with different digest are synced', async (done) => {

  // WHEN
  const dockerImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: 'sha256:655ed9c3ae' }, { tag: '1.5', lastUpdated: '', digest: 'sha256:be7c1d95ac' }];
  const ecrImageTags = [{ tag: '1.0.0', lastUpdated: '', digest: 'sha256:655ed9c3ae' }, { tag: '1.5', lastUpdated: '', digest: 'sha256:b6b46bdc15' }];
  const image: Image = { imageName: 'myImage' };

  let tags = await handler.filterTags(dockerImageTags, ecrImageTags, image);

  // THEN
  expect(tags.length).toBe(1);
  expect(tags[0].tag).toBe('1.5');

  done();
});

test('Format without prefix', async (done) => {

  // WHEN
  const missingTags = [{ tag: '1.0.0', lastUpdated: '', digest: 'sha256:655ed9c3ae' }];
  const image: Image = { imageName: 'myImage' };

  let triggerFile = await handler.formatTriggerLines(image, missingTags, '', '123456789012', 'eu-west-1');

  // THEN
  expect(triggerFile).toStrictEqual('myImage,123456789012.dkr.ecr.eu-west-1.amazonaws.com/myImage,1.0.0\n');

  done();
});

test('Format with prefix', async (done) => {

  // WHEN
  const missingTags = [{ tag: '1.0.0', lastUpdated: '', digest: 'sha256:655ed9c3ae' }];
  const image: Image = { imageName: 'myImage' };

  let triggerFile = await handler.formatTriggerLines(image, missingTags, 'myPrefix', '123456789012', 'eu-west-1');

  // THEN
  expect(triggerFile).toStrictEqual('myImage,123456789012.dkr.ecr.eu-west-1.amazonaws.com/myPrefix/myImage,1.0.0\n');

  done();
});

test('Should sort images in ascending time order', async (done) => {

  // GIVEN
  const dockerImageTags = [
    { tag: '2.0', lastUpdated: '2021-05-10T10:10:10.000000Z', digest: '' },
    { tag: '1.5', lastUpdated: '2021-05-09T10:10:10.000000Z', digest: '' },
    { tag: 'latest', lastUpdated: '2021-05-25T10:10:10.000000Z', digest: '' },
    { tag: '1.0.0', lastUpdated: '2021-04-12T19:48:11.852809Z', digest: '' },
  ];

  // WHEN
  let tags = await handler.orderTags(dockerImageTags);

  // THEN
  expect(tags.length).toBe(4);
  expect(tags[0].lastUpdated).toBe('2021-04-12T19:48:11.852809Z');
  expect(tags[1].lastUpdated).toBe('2021-05-09T10:10:10.000000Z');
  expect(tags[2].lastUpdated).toBe('2021-05-10T10:10:10.000000Z');
  expect(tags[3].lastUpdated).toBe('2021-05-25T10:10:10.000000Z');

  done();
});
