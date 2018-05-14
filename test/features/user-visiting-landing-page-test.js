const {assert} = require('chai');
const {generateVideoObject, createVideo} = require('../test-utils');

const generateRandomUrl = (domain) => {
  return `http://${domain}/${Math.random()}`;
};

describe('/', ()=> {
  describe('user visits landing page', () => {
    it('is empty', () => {
      browser.url('/');

      assert.equal(browser.getText('#videos-container'), '');
    })
  })
  describe('lp with existing video', () => {
    it('displays existing video', () => {

      browser.url('/videos/create');
      const video = createVideo();

      browser.url('/');

      assert.include(browser.getText('body'), video.title);
      assert.equal(browser.getAttribute('iframe', 'src'), video.url);
      assert.include(browser.getText('body'), video.description);
    })
    it('displays iframe', () => {

      browser.url('/videos/create');
      const video = createVideo();

      browser.url('/');

      assert.include(browser.getAttribute('iframe', 'src'), video.url);
    })
  })
  describe('user can navigate to a video', () => {
    it('displays existing chosen video', () => {

      browser.url('/videos/create');
      const video = createVideo();

      browser.url('/');
      browser.click('.video-title a');

      assert.include(browser.getText('body'), video.title);
      assert.equal(browser.getAttribute('iframe', 'src'), video.url);
      assert.include(browser.getText('body'), video.description);
    })
  })
})
