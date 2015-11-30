import engine from 'game.engine'

let imgPath = location.pathname.replace('index.html', '') + 'images/game'

// Player
engine({
  name: 'guest',
  image: {
    src: `${imgPath}/player@2x.png`,
    ratio: 2
  }
})

engine({
  name: 'doge',
  image: {
    src: `${imgPath}/player-doge@2x.png`,
    ratio: 2
  }
})

engine({
  name: 'yuukiti',
  image: {
    src: `${imgPath}/player-yuukiti@2x.png`,
    ratio: 2
  }
})

engine({
  name: 'cosmo',
  image: {
    src: `${imgPath}/player-cosmo@2x.png`,
    ratio: 2
  }
})

// Object
engine({
  name: 'object',
  image: {
    src: `${imgPath}/object@2x.png`,
    ratio: 2
  }
})

engine({
  name: 'objectBrick',
  image: {
    src: `${imgPath}/object-brick@2x.png`,
    ratio: 2
  }
})

engine({
  name: 'objectBomb',
  image: {
    src: `${imgPath}/object-bomb@2x.png`,
    ratio: 2
  }
})

// engine({
//   name: 'objects',
//   image: {
//     src: `${imgPath}/objects@2x.png`,
//     ratio: 2
//   },
//   The textures have bug, it'so sad and have no time to solve...
//   textures: {
//     email: { x: 0, Y: 0, width: 59, height: 77 },
//     emailBrick: { x: 0, Y: 0, width: 159, height: 177 },
//     emailBomb: { x: 0, Y: 0, width: 159, height: 177 }
//   }
// })

// Others
engine({
  name: "textures",
  image: {
    src: `${imgPath}/textures@4x.png`,
    ratio: 4
  },
  trim: 0.2,
  textures: {
    box: { x: 0, y: 32, width: 16, height: 16, top: 4, bottom: 4, left: 4, right: 4 }
  }
})
