import * as PIXI from "pixi.js"
import { directive } from "babel-types"

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

function d(sides) {
    return Math.floor(Math.random() * Math.floor(sides)) + 1;
}

let d6 = () => d(6)

const STARTING_DIE = 5

const pink = 0xDE3249

let Opponent = (x, y, numDie=STARTING_DIE) => {
    let container = new PIXI.Text(numDie, {
        fontFamily : 'Arial',
        fontSize: 50,
        fill : pink,
        align : 'center'
    })

    container.x = x
    container.y = y

    container.die = []

    for (let i = 0; i < numDie; i++) {
        container.die.push( {value: d6()} )
    }

    container.reject = (bet) => {
        return bet.num > 3
    }

    container.makeBet = (bet) => {
        return {num: bet.num + 1, val: bet.val}
    }

    return container
}

function playGame(inPlayers) {
    let Dice = (x, y, roll=d6()) => {
        let dice = new PIXI.Graphics()
    
        dice.beginFill(pink)
        dice.drawRoundedRect(0, 0, 60, 60, 20)
        dice.endFill()
    
        dice.x = x
        dice.y = y
        
        dice.value = roll
    
        dice.beginFill(0x00)
    
        let r = 5
    
        if (roll == 1) {
            dice.drawCircle(30, 30, r)
        }
        if (roll == 2) {
            dice.drawCircle(20, 20, r)
            dice.drawCircle(40, 40, r)
        }
        if (roll == 3) {
            dice.drawCircle(15, 15, r)
            dice.drawCircle(30, 30, r)
            dice.drawCircle(45, 45, r)
        }
        if (roll == 4) {
            dice.drawCircle(20, 20, r)
            dice.drawCircle(20, 40, r)
            dice.drawCircle(40, 40, r)
            dice.drawCircle(40, 20, r)
        }
        if (roll == 5) {
            dice.drawCircle(30, 30, r)
            dice.drawCircle(15, 15, r)
            dice.drawCircle(15, 45, r)
            dice.drawCircle(45, 45, r)
            dice.drawCircle(45, 15, r)
        }
        if (roll == 6) {
            dice.drawCircle(20, 15, r)
            dice.drawCircle(20, 30, r)
            dice.drawCircle(20, 45, r)
            dice.drawCircle(40, 15, r)
            dice.drawCircle(40, 30, r)
            dice.drawCircle(40, 45, r)
        }
    
        dice.endFill()
    
        return dice
    }
    
    let Player = (x, y, numDie=STARTING_DIE) => {
        // width: 460
        // height: 60
    
        let container = new PIXI.Container()
    
        container.x = x
        container.y = y
    
        container.die = []
    
        for (let i = 0; i < numDie; i++) {
            container.die.push( Dice(100 * i, 0) )
        }
    
        for (let dice of container.die) {
            container.addChild( dice )
        }
    
        container.reject = (bet) => {
            return false
        }
    
        container.makeBet = (bet) => {
            return {num: bet.num + 1, val: bet.val}
        }
    
        return container
    }

    let players = inPlayers.map((player, index) =>
        (player.type == "player" ? Player : Opponent)(10, 10 + 100 * index, player.numDie)
    )

    let die = [0, 0, 0, 0, 0, 0]

    for (let player of players) {
        for (let dice of player.die) {
            die[dice.value - 1] += 1
        }
    }

    let bet = {
        num: 0,
        val: 6
    }

    function checkBet(bet, turn) {
        if ( die[bet.val - 1] <= bet.num ) {
            alert(`player ${turn % players.length + 1} looses!`)
        } else {
            alert(`player ${turn % players.length + 1} wins!`)
        }
    }

    function playerLoose(player) {
        inPlayers[player].numDie -= 1
        return inPlayers
    }

    function betValid(oldbet, newbet) {
        if ( ![1, 2, 3, 4, 5, 6].includes(newbet.val) ) {
            return false
        }

        if (newbet.num > oldbet.num) {
            return true
        }

        if (newbet.num == oldbet.num && newbet.val > oldbet.val) {
            return true
        }

        return false
    }

    function doTurn(bet, turn) {
        let player = players[turn % players.length]

        if ( player.reject(bet) ) {
            if ( checkBet(bet, turn) ) {
                return playerLoose(turn % players.length) 
            } else {
                return playerLoose((turn - 1) % players.length) 
            }
        } else {
            let newBet = player.makeBet(bet)

            if (!betValid(bet, newBet)) {
                console.log(bet)
                alert(`player ${turn % players.length + 1} made an invalid move!`)
                return playerLoose(turn % players.length) 
            } else {
                return doTurn(newBet, turn + 1)
            }
        }
    }

    return doTurn(bet, 0)
}

///////////////////////////////////////////////////////////////////////////////////////////////////////////

let Game = (players) => players
let Player = (numDie=STARTING_DIE) => ({type: "player", numDie: numDie})
let AI = (numDie=STARTING_DIE) => ({type: "AI", numDie: numDie})

console.log( playGame( Game([
    Player(),
    AI(),
    AI(),
    AI(),
    AI()
]) ) )