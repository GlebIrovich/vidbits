const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video');
const {generateVideoObject, parseTextFromHTML, seedVideoToDatabase} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos/:id/updates', () => {
  let oldVideo;
  beforeEach(async() => {
    await connectDatabase();
    oldVideo = await seedVideoToDatabase();
  })
  afterEach(disconnectDatabase);

  describe('POST', () => {

    it('updates the record', async() => {
      const newVideo = {
        title: 'new title',
        description: 'new desc',
        url: 'new url'
      }
      const response = await request(app)
        .post(`/videos/${oldVideo._id}/updates`)
        .type('form')
        .send(newVideo);

      const result = await Video.findOne(newVideo);
      assert.deepEqual(result._id, oldVideo._id);
    });
    it('respondes with status 302', async() => {
      const newVideo = {
        title: 'new title',
        description: 'new desc',
        url: 'new url'
      }
      const response = await request(app)
        .post(`/videos/${oldVideo._id}/updates`)
        .type('form')
        .send(newVideo);

      assert.equal(response.status, 302);
    });
    it('does not save if title is missing', async() => {
      const videoNoTitle = {
        title: '',
        description: 'test',
        url: 'url'
      }
      const response = await request(app)
        .post(`/videos/${oldVideo._id}/updates`)
        .type('form')
        .send(videoNoTitle);

      const result = await Video.findOne({_id: oldVideo._id});
      assert.equal(response.status, 400);
      assert.deepEqual(result.title, oldVideo.title);
    })
    it('renders edit form again if input invalid', async() => {
      const videoNoTitle = {
        title: '',
        description: 'test',
        url: 'url'
      }
      const response = await request(app)
        .post(`/videos/${oldVideo._id}/updates`)
        .type('form')
        .send(videoNoTitle);

      assert.isOk(parseTextFromHTML(response.text, 'form'), 'from is rendered');
    })
  })
});
