import _ from 'lodash'
import $ from 'jquery'
import visibility from 'visibilityjs'
import screenfull from 'screenfull'
import GamepadMicro from 'gamepad-micro'
import {l, locale} from 'locales'
import {animateNumber} from 'uis'

import engine from 'game.engine'
import config from './config'
import audio from './audio'
import entities from './entities'
import './texture'  // engine.image('textureName')

/**
 * Methods List:
 * - Initializer
 * - Renders & Generator
 * - Controls & Actions & Events
 * - Levels & Time & Speed
 * - MainLoop & Detections
 * - Panels
 * - Core data
 * - Stats
 * - Status & Loaders
 * - AI
*/

class Game {

  constructor(options) {
    // Enable this as a global variable for debug
    DEBUG && (window.game = this)
    DEBUG && (window.$ = $)

    // Mount options
    this.options = options

    // Initializer: Create a game, get a stage
    engine((stage) => {
      // The callback is asynchronous
      this.stage = stage
      this.player = config.playerBuilt(this.options.role)

      // Set grid
      this.grid = config.gridBuilt()

      // Init game when all audios and texture atlases are loaded
      audio.onLoadCallback = () => {

        // Remove loading & switch game state
        engine.preload(() => {
          // Update Title
          document.title = l('game.name')

          this.removeLoading()
            .stateWelcome()
            .controls()
            .onResize()
        })
      }
    }, {
      canvas: document.querySelector(`${this.options.containerName} canvas`),
      full: true
    })
  }

  /* ==== Renders & Generator ====  */
  removeLoading() {
    let $loadingInit = $('.loading-init')
    // $loadingInit.on('transitionend webkitTransitionEnd', (ev) => {
    //   $(ev.currentTarget).remove()
    // })
    $loadingInit.addClass('loaded-init')
    _.delay(() => {
      $loadingInit.remove()
    }, 218)
    return this
  }

  onResize() {
    // Listen resize event
    this.stage.on('viewport', _.throttle(() => {
      this.renderBasic('refresh')
      if (this.states.isPaused) {
        this.loopSwitcher(false)
      }
    }, 100))
    return this
  }

  renderBasic(action) {

    if (action != 'refresh') {
      this.stage.empty()
      this.stage._tickAfter = []
    }

    // Refresh viewbox
    this.stage.viewbox(window.innerWidth, window.innerHeight)

    // Refresh grid
    _.extend(this.grid, config.gridBuilt())

    // Init matrix $DOM
    this.$$matrix = engine.create().appendTo(this.stage).pin({
      alignX: 0.5,
      alignY: 1,
      width: config.width(),
      height: config.height(),
      offsetY: config.height() - window.innerHeight
    })

    // // Dev hack & Martix background
    // engine.image('textures:box').stretch().appendTo(this.$$matrix).pin({
    //   width : config.width(),
    //   height : config.height(),
    //   align : 0.5,
    //   alpha : 0.5
    // })

    this.renderGrid()
      .renderBricks()
      .renderPlayer()
      .renderObjects(action)
    return this
  }

  renderGrid() {
    // Actually, the grid is invisible
    return this
  }

  renderBricks() {
    this.map2DArray(this.coreData.bricks, (item, i, j) => {
      item.render(this.$$matrix, i, j)
    })
    return this
  }

  renderPlayer() {
    let player = this.coreData.player
    if (!player) {
      player = this.coreData.player = new entities.Player({
        role: this.player.role,
        grid: this.grid
      })
    }
    player.render(
      this.$$matrix,
      this.coreData.bricks[player.col-1].length
    )
    return this
  }

  renderObjects(action) {
    this.map2DArray(this.coreData.objects, (item, i, j) => {
      item.render(this.$$matrix)
    })
    if (action != 'refresh') {
      this.objectsGenerator()
      this.mainLoop()
    }
    return this
  }

  objectsGenerator(action = 'start') {
    if (action == 'start') {
      this.objectsGeneratorTimer = setInterval(() => {
        let count = 0
        let objects = this.coreData.objects
        let maxNumber = this.numberWithLevel(config.numActObj)
        this.stats._maxObjects = maxNumber

        if (objects.length) {
          for (let i = 0; i < objects.length; i++) {
            count += objects[i].length
          }
        }

        if (count < maxNumber) {
          let i = this.grid.randomCol()
          let object = new entities.Object({
            grid: this.grid,
            i: i,
            v: this.speedVWithLevel()
          })
          this.coreData.objects[i].push(object)
          object.render(this.$$matrix)
        }

      }, this.timeWithLevel(config.timeGenCold))
    } else if (action == 'stop') {
      clearInterval(this.objectsGeneratorTimer)
    }
  }

  /* ==== Controls & Actions & Events ==== */
  controls() {
    // Keyboard
    $(document).on('keydown', _.throttle((e) => {
      let keycode = e.keyCode
      console.log(keycode)

      if (!this.states.isPlayed) {
        // Start
        if (keycode == config.controls.start) {
          this.statePlayed()
        }
      }

      if (this.states.isPlayed && !this.states.isOvered) {
        // Pause
        if (keycode == config.controls.pause || keycode == 80) {
          this.statePause()
        }

        if (!this.states.isPaused) {
          // Move
          switch(keycode) {
            case config.controls.moveLeft:
              this.actionMove('left')
              break
            case config.controls.moveRight:
              this.actionMove('right')
              break
            case config.controls.bomb:
              this.actionBomb()
          }
        }
      }
    }, config.timeCtrl, {trailing: false}))
    .on('mouseover', '.action-handler', _.throttle((e) => {
      audio.effects.play('hover')
    }, config.timeBase/2, {trailing: false}))
    .on('mousedown', '.action-handler', (e) => {
      audio.effects.play('click')
    })
    .on('click', '.action-handler', (e) => {
      let $target = $(e.currentTarget)
      let action = $target.data('action')
      switch (action) {
        case 'welcome':
          this.stateWelcome()
          break
        case 'start':
          this.statePlayed()
          break
        case 'pause':
          this.statePause()
          break
        case 'fullscreen':
          if (screenfull.enabled) {
            screenfull.toggle()
          }
          break
      }
    }).on(screenfull.raw.fullscreenchange, () => {
      $('.fullscreen-toggle').toggleClass('is-fullscreen')
    })

    // // Dev hack
    // triggerKeyboard(config.controls.start)

    // Gamepad
    let gp = new GamepadMicro()

    gp.onUpdate(_.throttle((gamepads) => {
      if (gp.gamepadConnected) {
        for(let i = 0; i < gamepads.length; i++) {
          // Buttons & dPad
          let buttons = gamepads[i].buttons
          for (let button in buttons) {
            DEBUG && console.log(button)
            switch (button) {
              case 'leftBumper':
                changeBombNumber('down')
                break
              case 'rightBumper':
                changeBombNumber('up')
                break
              case 'dPadUp':
                focusItem('up')
                break
              case 'dPadDown':
                focusItem('down')
                break
              case 'rightStick':
              case 'select':
                rightStickClick()
                break
              case 'dPadLeft':
                triggerKeyboard(config.controls.moveLeft)
                break
              case 'dPadRight':
                triggerKeyboard(config.controls.moveRight)
                break
              case 'actionSouth':
              case 'actionEast':
              case 'actionWest':
              case 'actionNorth':
                if(!this.states.isPlayed || this.states.isPaused || this.states.isOvered) {
                  rightStickClick()
                } else {
                  triggerKeyboard(config.controls.bomb)
                }
                break
              case 'start':
                  if(!this.states.isPlayed) {
                    $(document).click()
                    triggerKeyboard(config.controls.start)
                  } else {
                    if(buttons.start.released == true) {
                      triggerKeyboard(80)
                    }
                  }
                break
            }
          }

          // LeftStick
          let leftStick = gamepads[i].leftStick
          if(leftStick.x < -0.4) {
            triggerKeyboard(config.controls.moveLeft)
          } else if (leftStick.x > 0.4) {
            triggerKeyboard(config.controls.moveRight)
          }
          if(leftStick.y < -0.7) {
            focusItem('up')
          } else if (leftStick.y > 0.7) {
            focusItem('down')
          }
        }
      }
    }, config.timeCtrl * 7, {trailing: false}))

    // Page visibility
    visibility.change((e, state) => {
      if (this.states && this.states.isPlayed && !this.states.isOvered) {
        console.log(e, state)
        if (state == 'hidden') {
          this.loopSwitcher(false)
        } else {
          if (!this.states.isPaused) {
            this.loopSwitcher(true)
          }
        }
      } else {
        DEBUG && console.log('d[-_-]b')
      }
    })

    // Util
    let triggerKeyboard = function(keycode) {
      let event = $.Event('keydown')
      event.keyCode = keycode
      $(document).trigger(event)
    }

    let changeBombNumber = function(action) {
      let $bombInput = $('#bomb-input')
      let $activeWelcome = $('.panel-welcome.is-active')
      if ($activeWelcome.length) {
        $bombInput.focus()
        if ($bombInput.val() == '') {
          $bombInput.val(0)
        }
        if (action == 'up') {
          $bombInput.val(parseInt($bombInput.val()) + 1)
        } else {
          let value = $bombInput.val() - 1
          value = Math.max(value, 0)
          $bombInput.val(value)
        }
      }
    }

    let rightStickClick = function() {
      let $focusedItem = $('.is-active .is-focused')
      if ($focusedItem.length) {
        $focusedItem.trigger('click')
      }
    }

    let focusItem = function(direction) {
      let $activePanel, $current, firstItem, lastItem, nextItem, prevItem
      $activePanel = $('.game-panels .is-active')
      if ($activePanel.length) {
        audio.effects.play('hover')
        $current = $activePanel.find('.is-focused')
        if (direction === 'up') {
          prevItem = $current.removeClass('is-focused').prevAll('.focused-obj:eq(0)')
          lastItem = $activePanel.find('.focused-obj:last')
          if (prevItem.length > 0) {
            prevItem.addClass('is-focused').focus()
          } else {
            lastItem.addClass('is-focused').focus()
          }
        } else if (direction === 'down') {
          nextItem = $current.removeClass('is-focused').nextAll('.focused-obj:eq(0)')
          firstItem = $activePanel.find('.focused-obj:first')
          if (nextItem.length > 0) {
            nextItem.addClass('is-focused').focus()
          } else {
            firstItem.addClass('is-focused').focus()
          }
        }
      }
    }
    return this
  }

  actionMove(direction) {
    let self = this
    let player = self.coreData.player
    let duration = config.timePlayerDuration

    player.move(direction,
      function() {
        player.align(
          self.grid.alignX(player.col),
          self.grid.offsetY(self.coreData.bricks[player.col-1].length),
          duration
        )
        audio.effects.play('move')
      },
      function() {
        player.squeeze(self.grid.alignX(player.col), direction)
        audio.effects.play('error')
      }
    )
    DEBUG && console.log(direction)
    return this
  }

  actionBomb() {
    if(this.stats.bombs) {
      this.stats.bombs--
      this.hudUpdate()
      audio.effects.play('bomb')
      this.map2DArray(this.coreData.objects, (item, i, j) => {
        item.bomb(() => {
          this.coreData.objects[i].splice(j, 1)
          this.growthScore()
        })
      })
      DEBUG && console.log('Bomb')
    } else {
      audio.effects.play('error')
      $('.bombs-num').removeClass('error-blink')
      _.delay(() => {
        $('.bombs-num').addClass('error-blink')
      })
    }
    return this
  }

  eventMiss() {
    this.stats.combos = 0
    audio.effects.play('miss')
    this.hudUpdate()
    return this
  }

  eventCaught(isMuted = false) {
    if (!isMuted) {
      audio.effects.play('caught')
    }
    this.growthScore()
    return this
  }

  /* ==== Levels & Time & Speed ==== */
  calculateLevel() {
    let level = Math.ceil(this.stats.durationSeconds/this.player.upLevelSeconds)
    let levelBase = this.player.levelBase
    let levelMax =  this.player.levelMax
    level = Math.max(level, levelBase)
    level = Math.min(level, levelMax)
    this.stats.level = level
    return this
  }

  getLevel(){
    return (this.stats && this.stats.level) || 1
  }

  countDuration() {
    if (this.player.isAI) {
      let now = new Date()
      this.stats.durationSeconds = parseInt(Math.abs(now - this.player.birthday) / 60)
    } else {
      this.stats.durationSeconds++
    }
    return this
  }

  timeWithLevel(time) {
    let level = this.getLevel()
    time = time / Math.sqrt(level)
    return time
  }

  numberWithLevel(number) {
    let level = this.getLevel()
    number = number + level * 5
    return number
  }

  speedAWithLevel() {
    let a
    let level = this.getLevel()
    a = config.speedA * Math.sqrt(level)
    this.stats._speedA = a
    return a
  }

  speedVWithLevel() {
    let v
    let level = this.getLevel()
    v = config.speedV * Math.sqrt(level)
    this.stats._speedV = v
    return v
  }

  /* ==== MainLoop & Detections ==== */
  mainLoop() {
    this.stage.tick((t) => {
      this.map2DArray(this.coreData.objects, (item, i, j) => {
        item.drop(
          this.speedAWithLevel(),
          this.grid.alignY(this.coreData.bricks[i].length),
          (success) => {
            this.collisionDetection(item, i, j, success)
          },
          () => {
            this.eventMiss()
            let brickCol = this.coreData.bricks[item.i]
            this.coreData.objects[i].splice(j, 1)
            brickCol.push(
              new entities.Brick({
                grid: this.grid
              })
            )
            brickCol[brickCol.length-1].render(
              this.$$matrix,
              i,
              brickCol.length-1
            )
            this.overGridDetection()
          }
        )
      })
    })
  }

  loopSwitcher(isOn) {
    if (isOn) {
      this.statsLoop()
      this.objectsGenerator()
      this.mainLoop()
    } else {
      this.statsLoop('stop')
      this.objectsGenerator('stop')
      this.stage._tickAfter = []
    }
  }

  collisionDetection(obejct, i, j, success) {
    let $$object = obejct.$entity
    let $$player = this.coreData.player.$entity
    if ($$object.pin('alignY') >= this.grid.alignY(this.coreData.bricks[i].length + config.cdvExtend) &&
        Math.abs($$object.pin('alignX') - $$player.pin('alignX')) <= config.cdxExtend) {
      this.coreData.objects[i].splice(j, 1)
      this.eventCaught()
      success()
    }
    return this
  }

  overGridDetection() {
    for(let i = 0; i < this.coreData.bricks.length; i++) {
      if(this.coreData.bricks[i].length >= Math.min((this.grid.rows - 1), config.overAmount)) {
        this.stateOver()
      }
    }
    return this
  }
  /* ==== Panels ==== */
  panels(name) {
    let $hud            = $('.game-hud')
    let $panelsWrap     = $('.game-panels')
    let $panels         = $(' > *', $panelsWrap)
    let $gameContainer  = $('.game-container')

    if (typeof name === 'undefined') {
      $hud.addClass('is-on')
      $panelsWrap.removeClass('is-on')
      $gameContainer.removeClass('with-panel is-paused')
      $panels.removeClass('is-active')
    } else {
      $panelsWrap.addClass('is-on')
      $gameContainer.addClass('with-panel')
      $(`.panel-${name}`).addClass('is-active')
        .siblings().removeClass('is-active')
      if (name == 'welcome') {
        $gameContainer.removeClass('is-paused')
      }
      if (name == 'over') {
        this.overPanelUpdate()
      }
      if (!this.states.isPaused) {
        $hud.removeClass('is-on')
      } else {
        $gameContainer.addClass('is-paused')
      }
    }
    return this
  }

  hudUpdate() {
    let $bombsNum = $('.bombs-num')
    let $scoreNum = $('.score-num')
    let $combosNum = $('.combos-num')
    let $pauseToggle = $('.pause-toggle')

    $bombsNum.text(this.stats.bombs)

    if (this.stats.score != this.stats._prevScore || !this.stats._prevScore) {
      $scoreNum.animateNumber({
        number: this.stats.score,
        numberStep: $.animateNumber.numberStepFactories.separator(',')
      }, config.timeBase/2)
    }

    if (this.stats.combos >= 2) {
      $('.info-combos').addClass('is-on')
      $combosNum.text(this.stats.combos)
    } else {
      $('.info-combos').removeClass('is-on')
    }

    $pauseToggle.toggleClass('is-paused', this.states.isPaused)

    return this
  }

  overPanelUpdate() {
    let $finalScore = $('.final-score')
    $finalScore.text(l('panel.finalScore', this.stats.score))
    return this
  }

  /* ==== Core data ==== */
  initCoreData() {
    this.coreData = {
      player: null,
      objects: [],
      bricks: []
    }

    for (let i = 0; i < this.grid.cols; i++) {
      this.coreData.bricks[i] = []
      this.coreData.objects[i] = []
      // // dev hack
      // this.coreData.bricks[i][0] = new entities.Brick({
      //   grid: this.grid
      // })
      // this.coreData.objects[i][0] = new entities.Object({
      //   grid: this.grid,
      //   i: i
      // })
    }

    return this
  }

  map2DArray(data, callback) {
    if (data.length) {
      for (let i = 0; i < data.length; i++) {
        for (let j = 0; j < data[i].length; j++) {
          let item = data[i][j]
          callback(item, i, j)
        }
      }
    }
  }

  /* ==== Stats ==== */
  initStats() {
    this.stats = _.clone(config.stats, true)
    this.stats.startDate = this.player.isAI ? this.player.birthday : new Date()
    this.initBombs()
      .initCoreData()
      .hudUpdate()
      .statsLoop()
    return this
  }

  initBombs(num) {
    if (typeof num === 'undefined' || '[object Number]' !== Object.prototype.toString.call(num)) {
      num = parseInt($('#bomb-input').val())
      if (isNaN(num)) {
        num = 0
      }
      this.stats.bombs = num
    }
    return this
  }

  statsLoop(action = 'start') {
    if (action == 'start') {
      this.statsLoopTimer = setInterval(() => {
        // Duration
        this.countDuration()
        // Level
        this.calculateLevel()
      }, 1000)
    } else if (action == 'stop') {
      clearInterval(this.statsLoopTimer)
    }
    return this
  }

  growthScore() {
    this.stats.combos++
    let growthScore = 0
    let scoreBase = 5
    let scoreTimes = Math.min(Math.ceil(this.stats.level/3), 3)
    let bonusStart = 4
    if (this.stats.combos >= bonusStart) {
      growthScore = (scoreBase * scoreTimes) + (this.stats.combos - bonusStart)
    } else {
      growthScore = scoreBase
    }
    this.stats._prevScore = this.stats.score
    this.stats.score += growthScore
    if (this.stats.score >= config.goalScore && !this.states.achieveGoal) {
      this.states.achieveGoal = true
      audio.effects.play('achieveGoal')
    }
    this.hudUpdate()
    return this
  }

  /* ==== Status & Loaders ==== */
  initStates() {
    this.states = {}
    this.states.isPlayed = false
    this.states.isPaused = false
    this.states.isOvered = false
    this.states.achieveGoal = false
    audio.op.pause()
    audio.bgm.pause()
    return this
  }

  stateWelcome() {
    this.stage.empty()
    this.initStates()
      .panels('welcome')
    audio.op.play().pos(0)
    return this
  }

  statePlayed() {
    this.initStates()
      .initStats()
    this.states.isPlayed = true

    audio.bgm.play().pos(0)

    // // Dev hack
    // audio.bgm.mute()

    this.renderBasic()
      .panels()
    DEBUG && console.log('Played')
    return this
  }

  statePause(action) {
    if (this.states.isPaused) {
      this.states.isPaused = false
      this.stage.resume()
      this.panels()
      audio.bgm.play()
      this.loopSwitcher(true)

      // // Dev hack
      // audio.bgm.mute()

    } else {
      this.states.isPaused = true
      this.stage.pause()
      audio.bgm.pause()
      this.panels('pause')
      this.loopSwitcher(false)
    }
    this.hudUpdate()
    DEBUG && console.log(this.states.isPaused ? 'Paused' : 'Resume')
    return this
  }

  stateOver() {
    this.loopSwitcher(false)
    this.states.isOvered = true
    this.hudUpdate()
    this.panels('over')
    audio.bgm.pause()
    audio.effects.play('over')
    return this
  }

  /* ==== AI ==== */
  // TODO: Add a role of AI

}

export default Game
