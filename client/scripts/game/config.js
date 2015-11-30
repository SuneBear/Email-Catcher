import _ from 'lodash'
import keycode from 'keycode'

let config = {

  // Size
  width() {
    let width
    let borderline = parseInt(window.innerWidth*0.2)
    let sidebarsWidth = window.innerWidth > 700 ? borderline * 2 : 0
    width = window.innerWidth - sidebarsWidth
    return width
  },

  height() {
    let height
    let grasslandHeight = 112
    height = window.innerHeight - grasslandHeight
    return height
  },

  // Controls
  controls: {
    start: keycode('enter'),
    pause: keycode('esc'),
    moveLeft: keycode('left'),
    moveRight: keycode('right'),
    bomb: keycode('space')
  },

  // Time
  timeBase: 218,
  timeCtrl: 218/20,
  timePlayerDuration: 218/20,
  timeGenCold: 800,

  // Number
  numActObj: 7,
  overAmount: 10,
  goalScore: 500,

  // Speed (align with percent)
  speedV: 0.003,
  speedA: 0.00003,
  speedMax: 0.010,

  // Collision detection
  cdvExtend: 1.6, // Character rows minus one row
  cdxExtend: 0.12,

  // Player - Static
  playerBuilt(role, options = {}) {
    if(typeof role == 'undefined' || this.roles[role] == 'undefined') {
      role = 'guest'
    }
    let player = _.extend({}, {
      role: role,
      upLevelSeconds: 10
    }, this.roles.guest, this.roles[role], options)
    return player
  },

  // Roles
  roles: {
    guest: {
      levelBase: 1,
      levelMax: 8,
      isAI: false,
      birthday: null
    },
    cosmo: {},
    doge: {},
    yuukiti: {},
    gwyn: {
      levelBase: 3,
      levelMax: 15,
      isAI: true,
      birthday: new Date(1994, 10, 10)
    }
  },

  // Stats － Dynamic
  stats: {
    startDate: null,
    durationSeconds: 0,
    caught: 0,
    combos: 0,
    score: 0,
    bombs: 0,
    level: 1
  },

  // Grid － Dynamic
  gridBuilt() {
    let cols = 9
    let width = parseInt(config.width()/cols)
    let height = parseInt(width/3)
    let rowsMax = 40
    let rows = Math.min(rowsMax,
      Math.abs(Math.ceil(config.height()/height))
    )

    return {
      width,
      height,
      rows,
      cols,
      alignX(col) {
        return (col-1)/(this.cols-1)
      },
      alignY(row) {
        return 1 - (row-1)/(this.rows-1)
      },
      offsetY(row) {
        return -(row * height)
      },
      randomCol() {
        return parseInt(Math.random() * (this.cols))
      }
    }
  }

}

export default config
