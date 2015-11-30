import {Controller} from 'framework'

import ComGame from '../components/game'

class CtrlIndex extends Controller {
  initialize () {
    this.comGame = new ComGame()
  }
}

export default CtrlIndex
