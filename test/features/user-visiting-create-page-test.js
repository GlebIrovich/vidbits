const {assert} = require('chai');

describe('/videos/create', ()=> {
  describe('user visits create page', () => {
    it('opens a propper page', () => {
      browser.url('/');
      browser.click('#add-video');

      assert.include(browser.getAttribute('#submit-button', 'value'), 'Save a video');
    })
  })
})
