const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video');
const {generateVideoObject, parseTextFromHTML, seedVideoToDatabase} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos/delete/:id', () => {
  beforeEach(connectDatabase)
  afterEach(disconnectDatabase);

  describe('POST', () => {

    it('deletes the record and redirects to main', async() => {
      const video = await seedVideoToDatabase();
      const response = await request(app)
        .post(`/videos/delete/${video._id}`)
        .type('form')
        .send();

      const result = await Video.find({});
      assert.equal(response.headers.location, '/videos');
      assert.equal(result.length, 0);
    });
  });
});
