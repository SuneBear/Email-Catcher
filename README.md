Introduction
====================
A pixel(mosaic) art casual game about catching emails based on Stage.js.

It's stupidly simple that there’s just one rule,

which a player uses the directional keys to catch more emails

as far as possible from the top down.

The game is over when the emails stack up to the top of the playing field.

In order to get more fun, you can replace the player texture with [Doge 🐕]http://sunebear.github.io/Email-Catcher?role=doge) , [Yuukiti 🐻]http://sunebear.github.io/Email-Catcher?role=yuukiti) or [Cosmo 🐱]http://sunebear.github.io/Email-Catcher?role=cosmo).

In addition to fun, it has an important feature:

Racing with a simple scoring system.

[Click here to play now and discover more!](http://sunebear.github.io/Email-Catcher)

Controls
====================
### Keyboard controls

- **Enter** - Start
- **Horizontal Arrow** - Move your role
- **Spacebar** - Set off a bomb
- **Esc / P** - Pasue or Resume

### Gamepad controls
- **Start** - Start, Pasue or Resume
- **Left Stick / dPad** - Move your role
- **X/Y/A/B** - Set off a bomb

Running on local
====================
### Install
```
$ brew install node
$ npm install -g gulp

$ git clone git@github.com/SuneBear/Email-Catcher.git
$ cd Email-Catcher
$ npm install
```


### Startup: development
```
$ gulp
$ gulp serve
```


### Startup: production
```
$ gulp build
$ gulp serve-build
```


Development Notes
====================
It's written in JavaScript(ES6),

built with Gulp and runs in modern browsers.

The path for core files of the game is `client/game`.

The web framework `SBW` is Work in Progress

and should be replaced with better framework

such as `React` and `Cycle`.

If you are viewing this repo,

I hope you don't judge me too harshly...

Maybe you need to read [Stage.js Documentation](http://piqnt.com/stage.js/)

that helps you understand more clearly.

Feel free to give feedback and raise any issues : )


Dependencies
====================

### Front-end
- [Stage.js](https://github.com/shakiba/stage.js) is a 2D HTML5 JavaScript library for cross-platform game development.
- [Howler.js](https://github.com/goldfire/howler.js) is an audio library for the modern web.
- [jQuery](https://github.com/jquery/jquery) write less, do more.
- [Virtual Dom Starter](https://github.com/substack/virtual-dom-starter) bare-bones virtual-dom starter using main-loop.
- [Keycode](https://github.com/timoxley/keycode) is a simple map of keyboard codes.
- [Lodash](https://github.com/lodash/lodash) is a JavaScript utility library delivering consistency, modularity, performance.

### Font
- [Pixel Emulator](http://www.fontspace.com/pixel-sagas/pixel-emulator)

### Launcher
- [Koa](https://github.com/koajs/koa) is expressive middleware for node.js using generators.

### Built & Translators
- [Gulp](https://github.com/gulpjs/gulp) is the streaming build system.
- [Babel](https://github.com/babel/babel) is a compiler for writing next generation JavaScript.
- [Stylus](https://github.com/stylus/stylus) a revolutionary new language, providing an efficient way to generate CSS.


References
====================
- [Christmas Hat Game](https://github.com/rubenwardy/christmas_hat_game)
- [Catch the Coins!](https://github.com/poetofcode/gamecoins)
- [Jo's Happy Super Fun Time Sofa Catchy Game](https://github.com/haswalt/JosHappySuperFunTimeSofaCatchyGame)

License
====================
This work is licensed under the BSD license.
