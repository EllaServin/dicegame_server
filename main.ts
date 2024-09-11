input.onButtonPressed(Button.A, function () {
    player_data = []
})
function highestNumber2 () {
    highestNumber = 0
    for (let value of player_data) {
        siffra = parseFloat(value.substr(1, 2))
        val = value.substr(0, 1)
        if (siffra > highestNumber) {
            highestNumber = siffra
        }
    }
    return highestNumber
}
radio.onReceivedString(function (receivedString) {
    if (receivedString == "PLAYER" && -1 == players.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber))) {
        players.push(radio.receivedPacket(RadioPacketProperty.SerialNumber))
    }
    player_data.push("" + receivedString + radio.receivedPacket(RadioPacketProperty.SerialNumber))
    for (let value of player_data) {
        val = value.substr(0, 1)
        siffra = parseFloat(value.substr(1, 2))
        highestNumber = highestNumber()
        if (siffra == highestNumber && val == "A" || siffra < highestNumber && val == "B") {
            radio.sendString("POINT" + parseFloat(value.substr(2, value.length - -2)))
        } else {
            radio.sendString("NOTPOINT" + parseFloat(value.substr(2, value.length - -2)))
        }
    }
})
let val = ""
let siffra = 0
let highestNumber = 0
let player_data: string[] = []
let players: number[] = []
radio.setGroup(33)
players = []
basic.forever(function () {
    basic.showNumber(players.length)
})
