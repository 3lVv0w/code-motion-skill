// 9:16 portrait cut of the Product Launch Reveal video for Reels, Shorts, and TikTok.
;(function () {
  'use strict'
  window.VIDEOS = window.VIDEOS || {}
  window.VIDEOS['launch-vertical'] = {
    ...window.VIDEOS.launch,
    width: 1080,
    height: 1920,
    voice: 'launch-voice.mp3',
    score: window.LAUNCH_SCORE || window.VIDEOS.launch?.score,
  }
})()
