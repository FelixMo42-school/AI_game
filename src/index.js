import * as PIXI from "pixi.js"

// create the app
const app = new PIXI.Application(window.innerWidth, window.innerHeight, {backgroundColor : 0x000000})

// add the view to the dom
document.getElementById("game").appendChild(app.view)

// resize the canvas when the window resizes
window.onresize = function(event) {
    var width  = window.innerWidth
    var height = window.innerHeight

    app.renderer.resize(width, height)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

let makeDice = (x, y, number) => {
    let dice = new PIXI.Graphics()
        dice.beginFill(0xDE3249)
        dice.drawRoundedRect(0, 0, 60, 60, 20)
        dice.endFill()
        
        dice.x = x
        dice.y = y

    if (number == 1) {
    }
    if (number == 2) {
        
    }
    if (number == 3) {
        
    }
    if (number == 4) {
        
    }
    if (number == 5) {
        
    }
    if (number == 6) {
        
    }

    return dice
}

let die = [
    makeDice( 10, 10),
    makeDice(110, 10),
    makeDice(210, 10),
    makeDice(310, 10),
    makeDice(410, 10)
]

for (let dice of die) {
    app.stage.addChild(dice)
}