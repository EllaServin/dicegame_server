function getSerialNumberFromPlayerData (playerDataValue: string) {
    return parseFloat(playerDataValue.substr(2, playerDataValue.length - -2))
}
input.onButtonPressed(Button.A, function () {
    if (stage == 0 && players.length > 1) {
        stage = 1
        player_data = []
        numberOfPlayersInRound = players.length
        // skickar till spelarna att det är dags att slå tärning (behövs eventuellt inte) göras)
        radio.sendString("ROLL")
        while (numberOfPlayersInRound != player_data.length) {
            // denna ikon visas under tiden spelarna kastar (kan med fördel bytas ut mot något roligare)
            basic.showIcon(IconNames.SmallDiamond)
        }
    }
})
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
        if (serialNumberAlreadyExistsInPlayerData(radio.receivedPacket(RadioPacketProperty.SerialNumber)) == false) {
            player_data.push("" + receivedString + radio.receivedPacket(RadioPacketProperty.SerialNumber))
        }
        // poängräkning sker när alla spelare skickat sin siffra + val
        if (players.length == player_data.length) {
            serialNumber = getHighestNumber()
            countPoints()
            basic.pause(2000)
            stage = 0
        }
    }
})
function countPoints () {
    for (let value of player_data) {
        val = value.substr(0, 1)
        siffra = parseFloat(value.substr(1, 1))
        if (siffra == highestNumber && val == "A" || siffra < highestNumber && val == "B") {
            radio.sendString("POINT" + getSerialNumberFromPlayerData(value))
        } else {
            radio.sendString("NOTPOINT" + getSerialNumberFromPlayerData(value))
        }
    }
}
function serialNumberAlreadyExistsInPlayerData (serialNumber: number) {
    for (let value of player_data) {
        if (getSerialNumberFromPlayerData(value) == serialNumber) {
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
radio.setGroup(33)
// stage är vilken fas av spelet man är i:
// 0 = innan tärningskast
// 1 = under tärningskast
stage = 0
players = []
