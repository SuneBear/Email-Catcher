import howler from 'howler'

let audio = {
  // Audio onLoad callback
  loads: 0,

  loaded: false,

  onLoadCallback(){},

  onload() {
    if (this.loads === 3 && !this.loaded) {
      this.onLoadCallback()
      this.loaded = true
    }
  },

  // Autios
  op: new howler.Howl({
    urls: ['./audios/op.mp3'],
    loop: true,
    onload: () => {
      audio.loads++
      audio.onload()
    }
  }),

  bgm: new howler.Howl({
    urls: ['./audios/bgm.mp3'],
    loop: true,
    onload: () => {
      audio.loads++
      audio.onload()
    }
  }),

  effects: new howler.Howl({
    urls: ['./audios/effects.mp3'],
    sprite: {
      // HUD
      hover: [0, 2000],
      click: [3000, 2000],
      // Status
      over: [64000, 4000],
      achieveGoal: [68000, 3000],
      // Controls
      move: [120000, 2000],
      caught: [123000, 2000],
      bomb: [126000, 2000],
      // System
      error: [180000, 2000],
      miss: [183000, 2000]
    },
    onload: () => {
      audio.loads++
      audio.onload()
    }
  })
}

DEBUG && console.log('Audios', window.audio = audio)

export default audio
