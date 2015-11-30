import engine from 'game.engine'
import config from './config'

let entities = {}

/**
 * Object Class
 * @param {object} options
 * {grid, i, v, type}
 */
entities.Object = function(options) {
  this.grid = options.grid
  this.i = options.i
  this.v = options.v
  this.type = options.type || 'core'
  this.isStopped = false

  this.$entity = engine.image('object').stretch()
}

entities.Object.prototype.render = function($target) {
  let width = this.grid.width
  let height = width/2.307

  this.$entity.appendTo($target)
  .pin({
    width: width,
    height: height,
    alignX: this.grid.alignX(this.i + 1),
    alignY: this.$entity.pin('alignY') || 0,
    offsetY: -height
  })
}

entities.Object.prototype.drop = function(a = 0, maxAlignY, collisionDetection, brickify) {
  if (!this.isStopped) {
    this.v += a
    DEBUG && console.log('v', this.v)
    this.v = Math.min(this.v, config.speedMax)
    let lastAlignY = this.$entity.pin('alignY')
    let alignY = lastAlignY + this.v
    if (alignY >= maxAlignY) {
      alignY = maxAlignY
      setTimeout(() => {
        this.brickify(alignY, brickify)
      }, 50)
    }
    this.$entity.pin({
      alignY: alignY
    })
    // Collision Callback
    collisionDetection(() => {
      this.isStopped = true
      this.$entity.tween(config.timeBase).pin({
        alignX: 1.3,
        alignY: 0.05,
        scaleX : 0,
        scaleY : 0,
        alpha: 0.5,
        rotation: Math.PI/4
      }).remove()
    })
  }
}

entities.Object.prototype.bomb = function(callback) {
  this.isStopped = true
  this.$entity.image('objectBomb').pin({
    height: this.grid.width
  })
  .tween(config.timeBase).pin({
    alpha: 0
  })
  callback()
}

entities.Object.prototype.brickify = function(alignY, callback) {
  if (!this.isStopped) {
    this.isStopped = true
    this.$entity.pin({
      alignY: alignY
    })
    this.$entity.tween(config.timeBase/2).pin({
      alpha: 0,
      rotation: Math.PI/2,
      width: this.grid.width,
      height: this.grid.height
    }).remove()
    callback()
  }
}

/**
 * Brick Class
 * @param {object} options
 * {grid}
 */
entities.Brick = function(options) {
  this.grid = options.grid
  this.$entity = engine.image('objectBrick').stretch()
}

entities.Brick.prototype.render = function($target, i, j) {
  this.$entity.pin({
    width: this.grid.width,
    height: this.grid.height,
    alignX: this.grid.alignX(i+1),
    alignY: 1,
    offsetY: this.grid.offsetY(j)
  })
  setTimeout(() => this.$entity.appendTo($target))
}

/**
 * Player Class
 * @param {object} options
 * {grid}
 */
entities.Player = function(options) {
  this.role = options.role
  this.grid = options.grid
  this.col = Math.ceil(this.grid.cols/2)
  this.$entity = engine.image(this.role).stretch()
}

entities.Player.prototype.render = function($target, row = 0) {
  this.$entity.appendTo($target)
  // Without tween
  this.align(
    this.grid.alignX(this.col),
    this.grid.offsetY(row)
  )
}

entities.Player.prototype.align = function(alignX, offsetY, duration = 0) {
  this.$entity[duration ? 'tween' : 'label'](duration)
  .pin({
    width: this.grid.width,
    height: this.grid.width * 0.84,
    alignX: alignX,
    alignY: 1,
    offsetY: offsetY
  })
}

entities.Player.prototype.squeeze = function(alignX, direction) {
  let addend = direction == 'left' ? -0.15 : 0.15

  this.$entity
  .tween(config.timeBase/3).ease('bounce')
  .pin({
    alignX: alignX + addend
  })
  .tween(config.timeBase/3).ease('bounce')
  .pin({
    alignX: alignX
  })
}

entities.Player.prototype.move = function(direction, success, error) {
  let addend = direction == 'left' ? -1 : 1
  let newCol = this.col + addend
  if (newCol >= 1 && newCol <= this.grid.cols) {
    this.col = newCol
    success()
  } else {
    error()
  }
}

export default entities
