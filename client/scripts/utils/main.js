import {utils as futils} from 'framework'
import util from './util'

// Inherit futils
let utils = futils.util.extend({}, futils)

// Extend utils.util
futils.util.extend(utils.util, util)

// Add more utils
futils.util.extend(utils, {

})

export default utils
