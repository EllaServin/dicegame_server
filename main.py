def getSerialNumberFromPlayerData(playerDataValue: str):
    return parse_float(playerDataValue.substr(2, len(playerDataValue) - -2))

def on_button_pressed_a():
    global gameStarted
    if stage == 0 and len(players) > 1 and gameStarted == False:
        newRound()
        gameStarted = True
input.on_button_pressed(Button.A, on_button_pressed_a)

def newRound():
    global stage, player_data, numberOfPlayersInRound
    stage = 1
    player_data = []
    numberOfPlayersInRound = len(players)
    # skickar till spelarna att det är dags att slå tärning (behövs eventuellt inte) göras)
    radio.send_string("ROLL")
    while numberOfPlayersInRound != len(player_data):
        basic.show_leds("""
            . . . . .
            . . # . .
            . . # . .
            . . # . .
            . . # . .
            """)
def getHighestNumber():
    global highestNumber, siffra
    highestNumber = 0
    for value in player_data:
        siffra = parse_float(value.substr(1, 1))
        if siffra > highestNumber:
            highestNumber = siffra
    return highestNumber

def on_received_string(receivedString):
    global serialNumber2, highestNumber, stage
    if stage == 0:
        serialNumber2 = radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)
        # index -1 innebär att serienumret inte finns i listan
        if receivedString == "PLAYER" and -1 == players.index_of(serialNumber2):
            players.append(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER))
            # plottar en prick per ansluten spelare under fas 0
            index = 0
            while index <= len(players) - 1:
                led.plot(index, 0)
                index += 1
    elif stage == 1:
        if serialNumberAlreadyExistsInPlayerData(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)) == False:
            player_data.append("" + receivedString + str(radio.received_packet(RadioPacketProperty.SERIAL_NUMBER)))
        # poängräkning sker när alla spelare skickat sin siffra + val
        if len(players) == len(player_data):
            highestNumber = getHighestNumber()
            countPoints()
            stage = 0
            basic.show_leds("""
                . . . . .
                . # # # .
                . # . # .
                . # . # .
                . # # # .
                """)
            basic.pause(2000)
            newRound()
radio.on_received_string(on_received_string)

def countPoints():
    global val, siffra
    for value2 in player_data:
        val = value2.substr(0, 1)
        siffra = parse_float(value2.substr(1, 1))
        if siffra == highestNumber and val == "A" or siffra < highestNumber and val == "B":
            radio.send_string("POINT" + str(getSerialNumberFromPlayerData(value2)))
        else:
            radio.send_string("NOTPOINT" + str(getSerialNumberFromPlayerData(value2)))
def serialNumberAlreadyExistsInPlayerData(serialNumber: number):
    for value3 in player_data:
        if getSerialNumberFromPlayerData(value3) == serialNumber:
            return True
    return False
val = ""
serialNumber2 = 0
siffra = 0
highestNumber = 0
numberOfPlayersInRound = 0
player_data: List[str] = []
players: List[number] = []
stage = 0
gameStarted = False
radio.set_group(33)
gameStarted = False
# stage är vilken fas av spelet man är i:
# 0 = innan tärningskast
# 1 = under tärningskast
stage = 0
players = []