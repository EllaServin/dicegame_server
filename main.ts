function getSerialNumberFromPlayerData (playerDataValue: string) {
    return parseFloat(playerDataValue.substr(2, playerDataValue.length - -2))
}
input.onButtonPressed(Button.A, function () {
    if (stage == 0 && players.length > 1 && gameStarted == false) {
        newRound()
        gameStarted = true
    }
})
function newRound () {
    stage = 1
    player_data = []
    numberOfPlayersInRound = players.length
    // skickar till spelarna att det är dags att slå tärning (behövs eventuellt inte) göras)
    radio.sendString("ROLL")
}
function getHighestNumber () {
    highestNumber = 0
    for (let value of player_data) {
        siffra = parseFloat(value.substr(1, 1))
        if (siffra > highestNumber) {
            highestNumber = siffra
        }
    }
    return highestNumber
}
radio.onReceivedString(function (receivedString) {
    if (stage == 0) {
        serialNumber = radio.receivedPacket(RadioPacketProperty.SerialNumber)
        // index -1 innebär att serienumret inte finns i listan
        if (receivedString == "PLAYER" && -1 == players.indexOf(serialNumber)) {
            players.push(radio.receivedPacket(RadioPacketProperty.SerialNumber))
            // plottar en prick per ansluten spelare under fas 0
            for (let index = 0; index <= players.length - 1; index++) {
                led.plot(index, 0)
            }
        }
    } else if (stage == 1) {
        basic.showIcon(IconNames.Butterfly)
        if (serialNumberAlreadyExistsInPlayerData(radio.receivedPacket(RadioPacketProperty.SerialNumber)) == false) {
            player_data.push("" + receivedString + radio.receivedPacket(RadioPacketProperty.SerialNumber))
            basic.showIcon(IconNames.Angry)
        }
        // poängräkning sker när alla spelare skickat sin siffra + val
        if (players.length == player_data.length) {
            basic.showIcon(IconNames.Fabulous)
            highestNumber = getHighestNumber()
            countPoints()
            stage = 0
            basic.showLeds(`
                . . . . .
                . # # # .
                . # . # .
                . # . # .
                . # # # .
                `)
            basic.pause(2000)
            newRound()
        }
    }
})
function countPoints () {
    for (let value2 of player_data) {
        val = value2.substr(0, 1)
        siffra = parseFloat(value2.substr(1, 1))
        if (siffra == highestNumber && val == "A" || siffra < highestNumber && val == "B") {
            radio.sendString("POINT" + getSerialNumberFromPlayerData(value2))
        } else {
            radio.sendString("NOTPOINT" + getSerialNumberFromPlayerData(value2))
        }
    }
}
function serialNumberAlreadyExistsInPlayerData (serialNumber: number) {
    for (let value3 of player_data) {
        if (getSerialNumberFromPlayerData(value3) == serialNumber) {
            return true
        }
    }
    return false
}
let val = ""
let serialNumber = 0
let siffra = 0
let highestNumber = 0
let numberOfPlayersInRound = 0
let player_data: string[] = []
let players: number[] = []
let stage = 0
let gameStarted = false
radio.setGroup(33)
gameStarted = false
// stage är vilken fas av spelet man är i:
// 0 = innan tärningskast
// 1 = under tärningskast
stage = 0
players = []
