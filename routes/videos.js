const router = require('express').Router();
const Video = require('../models/video');

// Update

router.post('/videos/:id/updates', async(req, res, next) => {
  const video = new Video(req.body);
  video.validateSync();
  if(video.errors){
    res.status(400).render('videos/edit', {video});
  } else {
    await Video.findByIdAndUpdate(req.params.id, req.body);
    res.redirect(`/videos/show/${req.params.id}`);
  }
});

// Delete

router.post('/videos/delete/:id', async(req, res, next) => {
  await Video.findByIdAndRemove(req.params.id);
  res.redirect('/videos');
})

// Index

router.get('/videos', async(req, res, next) => {
  const videos = await Video.find({});
  res.render('videos/index', {videos})
})

// Show

router.get('/videos/show/:id', async(req, res, next) => {
  const video = await Video.findOne({_id: req.params.id});
  res.render('videos/show', {video})
})

// Edit

router.get('/videos/edit/:id', async(req, res, next) => {
  const video = await Video.findOne({_id: req.params.id});
  res.render('videos/edit', {video});
})

// Create

router.get('/videos/create', (req, res, next) => {
  res.render('videos/create')
})

router.post('/videos', async(req, res, next) => {
  const video = new Video(req.body);
  video.validateSync();
  if(video.errors){
    res.status(400).render('videos/create', {video});
  } else {
    const video = await Video.create(req.body);
    res.redirect(`/videos/show/${video._id}`);
  }
});


module.exports = router;
