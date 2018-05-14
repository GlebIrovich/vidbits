const {assert} = require('chai');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');
const Video = require('../../models/video');

describe('Model: Video', ()=> {
  beforeEach(connectDatabase);
  afterEach(disconnectDatabase);
  describe('#title', ()=> {
    it('is String', () => {
      const number = 13;
      const video = new Video({title: number});

      assert.strictEqual(video.title, number.toString());
    });
    it('is required', async() => {
      const video = new Video({title: ''});
      video.validateSync();
      assert.equal(video.errors.title.message, 'Path `title` is required.')
    })
  });
  describe('#description', ()=> {
    it('is String', () => {
      const number = 13;
      const video = new Video({description: number});

      assert.strictEqual(video.description, number.toString());
    });
  });
  describe('#url', ()=> {
    it('is String', () => {
      const number = 13;
      const video = new Video({url: number});

      assert.strictEqual(video.url, number.toString());
    });
    it('is required', async() => {
      const video = new Video({url: ''});
      video.validateSync();
      assert.equal(video.errors.url.message, 'Path `url` is required.')
    })
  });
});

module.exports = {
  connectDatabase,
  disconnectDatabase,
}
