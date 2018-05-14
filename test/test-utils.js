const {jsdom} = require('jsdom');
const Video = require('../models/video');
// extract text from an Element by selector.
const parseTextFromHTML = (htmlAsString, selector, attr=null) => {
  const selectedElement = jsdom(htmlAsString).querySelector(selector);
  if (selectedElement !== null) {
    if(attr) return selectedElement.getAttribute(attr);
    return selectedElement.textContent;
  } else {
    throw new Error(`No element with selector ${selector} found in HTML string`);
  }
};

const generateVideoObject = (options = {}) => {
  return {
    title: options.title || 'test title',
    description: options.description || 'test description',
    url: options.url || 'https://www.youtube.com/watch?v=nNnO8kJZGTc'
  };
};
const createVideo = (options={}) => {
  const video = generateVideoObject(options);
  browser.setValue('input[id=title-input]', video.title);
  browser.setValue('textarea[id=description-input]', video.description);
  browser.setValue('input[id=url-input]', video.url);
  browser.submitForm('form');
  return video
}

const seedVideoToDatabase = async (options = {}) => {
  const video = await Video.create(generateVideoObject(options));
  return video;
};

module.exports = {
  seedVideoToDatabase,
  createVideo,
  parseTextFromHTML,
  generateVideoObject,
  parseTextFromHTML
};
