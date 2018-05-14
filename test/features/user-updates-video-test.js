const {assert} = require('chai');
const {generateVideoObject, createVideo} = require('../test-utils');

describe('/videos/edit/:id', ()=> {
  describe('user fills out and submits form', () => {
    it('shows submited video', () => {
      browser.url('/videos/create');
      const video = createVideo();
      browser.click('#edit');

      const newVideo = createVideo({title: 'test2'});


      assert.include(browser.getText('body'), newVideo.title);
      assert.equal(browser.getAttribute('iframe', 'src'), newVideo.url);
      assert.include(browser.getText('body'), newVideo.description);
    });
    it('does not create a new video', () => {
      browser.url('/videos/create');
      const video = createVideo();
      browser.click('#edit');

      const newVideo = createVideo({title: 'new title'});

      browser.url('/');

      assert.notInclude(browser.getText('body'), video.title)
      assert.include(browser.getText('body'), newVideo.title);
      assert.equal(browser.getAttribute('iframe', 'src'), newVideo.url);
      assert.include(browser.getText('body'), newVideo.description);
    });
  });
});
