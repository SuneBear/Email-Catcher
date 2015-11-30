let script = document.getElementById('script-config')
script.parentNode.removeChild(script)

let config = {
  $NAME: script.getAttribute('data-name'),
  $VERSION: script.getAttribute('data-version'),
  env: script.getAttribute('data-env')
}

// Debug switcher
global.DEBUG = config.env == 'dev'

export default config
