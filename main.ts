input.onButtonPressed(Button.A, function () {
    player_data = []
})
radio.onReceivedString(function (receivedString) {
    if (stage == 0) {
        if (receivedString == "PLAYER" && -1 == players.indexOf(radio.receivedPacket(RadioPacketProperty.SerialNumber))) {
            players.push(radio.receivedPacket(RadioPacketProperty.SerialNumber))
        }
    } else if (stage == 1) {
        if (serialNumberAlreadyExistsInPlayerData(radio.receivedPacket(RadioPacketProperty.SerialNumber)) == false) {
            player_data.push("" + receivedString + radio.receivedPacket(RadioPacketProperty.SerialNumber))
        }
        if (players.length == player_data.length) {
        	
        }
    }
    for (let value of player_data) {
        val = value.substr(0, 1)
        siffra = parseFloat(value.substr(1, 2))
        highestNumber = 0
        if (siffra == highestNumber && val == "A" || siffra < highestNumber && val == "B") {
            radio.sendString("POINT" + parseFloat(value.substr(2, value.length - -2)))
        } else {
            radio.sendString("NOTPOINT" + parseFloat(value.substr(2, value.length - -2)))
        }
    }
})
function serialNumberAlreadyExistsInPlayerData (serialNumber: number) {
    for (let value of player_data) {
        if (parseFloat(value.substr(2, value.length - 2)) == serialNumber) {
            return true
        }
    }
    return false
}
let highestNumber = 0
let siffra = 0
let val = ""
let player_data: string[] = []
let players: number[] = []
let stage = 0
radio.setGroup(33)
stage = 0
players = []
basic.forever(function () {
    basic.showNumber(players.length)
})
