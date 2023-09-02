// STEPS:
// 1. Deposit
// 2. Choose number of lines for bet
// 3. Collect bet amount
// 4. Spin the machine
// 5. Check the winnings
// 6. Give user winnings
// 7. Play again

const prompt = require("prompt-sync")();

const ROWS = 4;
const COLS = 3;

const SYMBOLS_COUNT = {
    CHERRY: 15,
    LEMON: 10,
    BELL: 6,
    7: 4
}
const SYMBOLS_VALUE = {
    CHERRY: 5,
    LEMON: 10,
    BELL: 30,
    7: 100
}

// STEP 1
const deposit = () => {
    while (true) {
        const depositAmount = prompt("Please, enter a deposit amount: ");
        const depositAmountValue = parseFloat(depositAmount);

        if (isNaN(depositAmountValue) || depositAmountValue <= 0) {
            console.log("Please enter a valid deposit amount!");
        } else {
            return depositAmountValue;
        }
    }
}

// STEP 2
const chooseNumberOfLines = () => {
    while (true) {
        const lines = prompt("Please, enter a number of lines to bet on between '1-4': ");
        const linesValue = parseFloat(lines);

        if (isNaN(linesValue) || linesValue <= 0 || linesValue > 4) {
            console.log("Please enter a valid number of lines!");
        } else {
            return linesValue;
        }
    }
}

// STEP 3
const getBet = (balance, lines) => {
    while (true) {
        const betPerLine = prompt("Please, enter bet PER line: ");
        const betPerLineValue = parseFloat(betPerLine);

        let maximumBetPerLine = balance / lines;
        if (isNaN(betPerLineValue) || betPerLineValue <= 0 || betPerLineValue > maximumBetPerLine) {
            console.log("Please enter a valid bet!");
        } else {
            return betPerLineValue;
        }
    }
}

// STEP 4
const spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)) {
        // console.log(symbol, count);
        for (let i = 0; i < count; i++) {
            symbols.push(symbol);
        }
    }
    // console.log("-----------------");
    // console.log(symbols);

    const reels = [];
    for (let i = 0; i < COLS; i++) {
        reels.push([]);
        const reelSymbols = [...symbols];
        for (let j = 0; j < ROWS; j++) {
            const randomIndex = Math.floor(Math.random() * reelSymbols.length);
            const selectedSymbol = reelSymbols[randomIndex];

            reels[i].push(selectedSymbol);
            reelSymbols.splice(randomIndex, 1);
            // console.log(randomIndex);
            // console.log(selectedSymbol);
            // console.log("-----------------");
        }
    }

    return reels;
}

const move = (reels) => {
    const rows = [];

    for (let i = 0; i < ROWS; i++) {
        rows.push([]);
        for (let j = 0; j < COLS; j++) {
            rows[i].push(reels[j][i])
        }
    }

    // console.log(reels);
    // console.log("-----------------");
    // console.log(rows);
    return rows;
}

const print = (rows) => {
    console.log("---------- GAME START ----------");
    for (const row of rows) {
        let rowString = "";
        for (const [i, symbol] of row.entries()) {
            rowString += addPading(symbol);
            if (i != rows.length - 1) {
                rowString += " | "
            }
        }
        console.log(rowString)
    }
    console.log("--------------------------------");
}

const addPading = (symbol) => {
    let symbolWithPadding = "";
    
    switch (symbol) {
        case "7":
            symbolWithPadding = "   " + "7" + "    ";
          break;
        case "CHERRY":
            symbolWithPadding = " " + "CHERRY" + " ";
            break;
        case "LEMON":
            symbolWithPadding = " " + "LEMON" + "  ";
          break;
        case "BELL":
            symbolWithPadding = "  " + "BELL" + "  ";
            break;
    }
    
    return symbolWithPadding;
}

// STEP 5
const getWinnings = (rows, bet, lines) => {
    let winnings = 0;

    for (let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for (const symbol of symbols) {
            if (symbol != symbols[0]) {
                allSame = false;
                break;
            }
        }

        if (allSame) {
            console.log("the bet is $" + bet + " * " + SYMBOLS_VALUE[symbols[0]]);
            winnings += bet * SYMBOLS_VALUE[symbols[0]];
        }
    }
    
    return winnings;
}

const welcomeLog = () => {
    console.log("\n--------------------- Welcome to NoWinBet ---------------------");
}

const startGame = () => {
    welcomeLog();
    let balance = deposit();
    while (true) {
        console.log("Your balance is $" + balance);
        const numberOfLines = chooseNumberOfLines();
        const bet = getBet(balance, numberOfLines);
        balance -= bet * numberOfLines;
        const reels = spin();
        const rows = move(reels);
        print(rows);
        const winnings = getWinnings(rows, bet, numberOfLines);
        // STEP 6
        balance += winnings;
        if (winnings !== 0) {
            console.log("Congratulations you won $" + winnings.toString() + "!");
        } else {
            console.log("Sorry, no winnings. Better luck next time!");
        }

        if (balance <= 0) {
            console.log("You dont have any money! :( ");
            console.log("----------------------------");

            const depositMore = prompt("Do you want to play again (y/any key)?");
            if (depositMore == "y") {
                // STEP 7
                startGame();
            } else {
                break;
            }
        }

        // STEP 7
        const playAgain = prompt("Do you want to play again (y/any key)?");
        if (playAgain != "y") break;
    }
}

startGame();