import {router} from 'framework'

import CtrlIndex from './controllers/index'

router
  .route('/null', () => {})
  .otherwise(() => {})
.start()

// Run at any route...
new CtrlIndex
