const {assert} = require('chai');
const {generateVideoObject, createVideo} = require('../test-utils');

describe('/', ()=> {
  describe('user fills out and submits form', () => {
    it('shows submited video', () => {
      browser.url('/videos/create');

      const video = createVideo();

      assert.include(browser.getText('body'), video.title);
      assert.include(browser.getText('body'), video.description);
      assert.equal(browser.getAttribute('iframe', 'src'), video.url);
    })
  })
})
