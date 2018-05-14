const {assert} = require('chai');
const {createVideo} = require('../test-utils');

describe('/videos/delete/:id', ()=> {
  describe('user deletes video', () => {
    it('it not desplayed on index page', () => {
      browser.url('/videos/create');
      const video = createVideo();
      browser.submitForm('#delete');

      // redirected to /videos
      assert.notInclude(browser.getText('body'), video.title);
      assert.notInclude(browser.getText('body'), video.description);
    });
  });
});
