import config from 'config'
import {Component, dom, utils} from 'framework'
import {l} from 'locales'
import Game from 'game'
const {h, loop} = dom

class ComGame extends Component {

  render() {
    let containerName = '.game-container'

    let panelFrame = function(panelName, content) {
      return h(`.panel-${panelName}`, [
        h('.panel-header', [
          h('.game-logo'),
          h('.game-name', l('game.name'))
        ]),
        h('.panel-content', content)
      ])
    }

    let vTree = (states) => {
      return h('.game', [
        h('.game-panels', [
          panelFrame('welcome', [
            h('input#bomb-input.focused-obj', {
              type: 'number',
              placeholder: l('panel.bomb'),
              autofocus: true,
              step: 1,
              max: 9999,
              min: 0
            }),
            h('br'),
            h('.game-start.button.action-handler.focused-obj.is-focused', {
              attributes: { 'data-action': 'start' }
            }, l('panel.start'))
          ]),
          panelFrame('pause', [
            h('.game-resume.button.action-handler.focused-obj.is-focused', {
              attributes: { 'data-action': 'pause' }
            }, l('panel.resume')),
            h('br'),
            h('.game-restart.button.action-handler.focused-obj', {
              attributes: { 'data-action': 'start' }
            }, l('panel.restart')),
            h('br'),
            h('.game-welcome.button.action-handler.focused-obj', {
              attributes: { 'data-action': 'welcome' }
            }, l('panel.welcome'))
          ]),
          panelFrame('over', [
            h('.over-tip', [
              l('panel.gameOver'),
              h('span.final-score')
            ]),
            h('.game-restart.button.action-handler.focused-obj.is-focused', {
              attributes: { 'data-action': 'start' }
            }, l('panel.restart')),
            h('br'),
            h('.game-welcome.button.action-handler.focused-obj', {
              attributes: { 'data-action': 'welcome' }
            }, l('panel.welcome'))
          ])
        ]),
        h(containerName, [
          h('.game-hud clearfix', [
            h('.pull-left', [
              h('.action-handler.img-icon.pause-toggle', {
                attributes: { 'data-action': 'pause' }
              }),
              h('.action-handler.img-icon.fullscreen-toggle', {
                attributes: { 'data-action': 'fullscreen' }
              }),
            ]),
            h('.pull-right info-wrap', [
              h('.info-bombs', [
                h('span.img-icon.bombs-icon'),
                h('small', 'x'),
                h('span.bombs-num', null, 0)
              ]),
              h('.info-score', [
                l('hud.score'),
                h('span.score-num', null, 0)
              ]),
              h('.info-combos', [
                h('.border-pixel'),
                h('small', 'x'),
                h('span.combos-num', null, 0)
              ])
            ])
          ]),
          h('canvas', {
            style: {
              position: 'absolute',
              'z-index': 2
            }
          })
        ])
      ])
    }

    this.el = loop({}, vTree)
    document.body.appendChild(this.el.target)
    new Game({
      containerName: containerName,
      env: config.env,
      role: utils.url.getQueryString('role')
    })
  }

}

export default ComGame
