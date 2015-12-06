/**
 * Default loader for web.
 */

var Class = require('../core');

window.addEventListener('load', function() {
  DEBUG && console.log('On load.');
  Class.start();
}, false);

Class.config({
  'app-loader' : AppLoader,
  'image-loader' : ImageLoader
});

function AppLoader(app, configs) {
  configs = configs || {};
  var canvas = configs.canvas, context = null, full = configs.full || false;
  var width = 0, height = 0, ratio = 1;

  if (typeof canvas === 'string') {
    canvas = document.getElementById(canvas);
  }

  if (!canvas) {
    canvas = document.getElementById('cutjs')
        || document.getElementById('stage');
  }

  if (!canvas) {
    full = true;
    DEBUG && console.log('Creating Canvas...');
    canvas = document.createElement('canvas');
    canvas.style.position = 'absolute';
    var body = document.body;
    body.insertBefore(canvas, body.firstChild);
  }

  context = canvas.getContext('2d');

  var devicePixelRatio = window.devicePixelRatio || 1;
  var backingStoreRatio = context.webkitBackingStorePixelRatio
      || context.mozBackingStorePixelRatio || context.msBackingStorePixelRatio
      || context.oBackingStorePixelRatio || context.backingStorePixelRatio || 1;
  ratio = devicePixelRatio / backingStoreRatio;

  var requestAnimationFrame = window.requestAnimationFrame
      || window.msRequestAnimationFrame || window.mozRequestAnimationFrame
      || window.webkitRequestAnimationFrame || window.oRequestAnimationFrame
      || function(callback) {
        return window.setTimeout(callback, 1000 / 60);
      };

  DEBUG && console.log('Creating stage...');
  var root = Class.root(requestAnimationFrame, render);

  function render() {
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, width, height);
    root.render(context);
  }

  root.background = function(color) {
    canvas.style.backgroundColor = color;
    return this;
  };

  app(root, canvas);

  resize();
  window.addEventListener('resize', resize, false);
  window.addEventListener('orientationchange', resize, false);

  function resize() {

    if (full) {
      // screen.availWidth/Height?
      width = (window.innerWidth > 0 ? window.innerWidth : screen.width);
      height = (window.innerHeight > 0 ? window.innerHeight : screen.height);

      canvas.style.width = width + 'px';
      canvas.style.height = height + 'px';

    } else {
      width = canvas.clientWidth;
      height = canvas.clientHeight;
    }

    width *= ratio;
    height *= ratio;

    if (canvas.width === width && canvas.height === height) {
      return;
    }

    canvas.width = width;
    canvas.height = height;

    DEBUG && console.log('Resize: ' + width + ' x ' + height + ' / ' + ratio);

    root.viewport(width, height, ratio);

    render();
  }
}

function ImageLoader(src, success, error) {
  DEBUG && console.log('Loading image: ' + src);
  var image = new Image();
  image.onload = function() {
    success(image);
  };
  image.onerror = error;
  image.src = src;
}
