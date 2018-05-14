const {assert} = require('chai');
const request = require('supertest');
const app = require('../../app');
const Video = require('../../models/video');
const {generateVideoObject, parseTextFromHTML, seedVideoToDatabase} = require('../test-utils');
const {connectDatabase, disconnectDatabase} = require('../database-utilities');

describe('Server path: /videos', () => {
  const video = generateVideoObject();

  beforeEach(connectDatabase);

  afterEach(disconnectDatabase);

  describe('POST', () => {
    it('responds 302 to video creation', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);

      assert.equal(response.status, 302);
    });
    it('saves submited video', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);

      const result = await Video.findOne(video);
      assert.isOk(result, 'video created');
    });
    it('saves video, that has title, description and url', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);

      const result = await Video.findOne(video);
      assert.exists(result.title, 'title is ok');
      assert.exists(result.description, 'description is ok');
      assert.exists(result.url, 'url is ok');
    });
    it('redirects to /videos/show', async () => {
      const response = await request(app)
        .post('/videos')
        .type('form')
        .send(video);

      assert.equal(response.status, 302);
    });

    describe('Missing title', () => {
      it('does not save if title is missing and returns 400', async () => {
        const videoNoTitle = {
          title: '',
          description: 'test'
        }
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoNoTitle);

        const result = await Video.find({});
        assert.equal(response.status, 400);
        assert.equal(result.length, 0);
      });
      it('renders form if title is missing. Error message is triggered', async () => {
        const videoNoTitle = {
          title: '',
          description: 'test',
          url: '123'
        }
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoNoTitle);

        assert.isOk(parseTextFromHTML(response.text, 'form')); // cheks if form can be located
        assert.include(parseTextFromHTML(response.text, 'body'), 'required');
      });
      it('fills form with prev data', async () => {
        const videoNoTitle = {
          title: '',
          description: 'test',
          url: '123'
        }
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoNoTitle);
        assert.include(parseTextFromHTML(response.text, 'form'), videoNoTitle.description);
        assert.include(parseTextFromHTML(response.text, '#url-input', 'value'), videoNoTitle.url);
      });
    });
    describe('Missing url', () => {
      it('does not save if title is missing and returns 400', async () => {
        const videoNoTitle = {
          title: 'test',
          description: 'test',
          url: ''
        }
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoNoTitle);

        const result = await Video.find({});
        assert.equal(response.status, 400);
        assert.equal(result.length, 0);
      });
      it('triggers error message', async () => {
        const videoNoTitle = {
          title: 'test',
          description: 'test',
          url: ''
        }
        const response = await request(app)
          .post('/videos')
          .type('form')
          .send(videoNoTitle);

        const result = await Video.find({});
        assert.include(parseTextFromHTML(response.text, 'body'), 'required');
      });
    });


  });
  describe('GET', () => {
    it('includes values of submited video', async() => {
      await Video.create(video);
      const response = await request(app)
        .get('/videos');

      assert.include(parseTextFromHTML(response.text, 'body'), video.title);
      assert.include(parseTextFromHTML(response.text, 'body'), video.description);
    })
    it('renders video with a specific id', async() => {
      const newVideo = await Video.create(video);
      const response = await request(app)
        .get(`/videos/show/${newVideo._id}`);

      assert.include(parseTextFromHTML(response.text, 'body'), newVideo.title);
      assert.include(parseTextFromHTML(response.text, 'iframe', 'src'), newVideo.url);
      assert.include(parseTextFromHTML(response.text, 'body'), newVideo.description);
    })
    it('populates form on the edit page', async() => {
      const newVideo = await seedVideoToDatabase();
      const response = await request(app)
        .get(`/videos/edit/${newVideo._id}`);

      assert.equal(parseTextFromHTML(response.text, '#title-input', 'value'), newVideo.title);
      assert.equal(parseTextFromHTML(response.text, '#description-input'), newVideo.description);
      assert.equal(parseTextFromHTML(response.text, '#url-input', 'value'),newVideo.url);
    })
  })
});
