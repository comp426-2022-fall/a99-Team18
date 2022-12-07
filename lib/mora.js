export function mora(userGuess, userFingers) {//similar to odds_or_evens except the player must guess the total sum, points = the sum if the user wins
    var randNum = Math.floor(Math.random() * 5) + 1;    //a random num btween 1-5
    var res;

    if ((userFingers + randNum) == userGuess) {
        res = "WIN!"
    } else {
        "LOSE!"
    }

    return {sum: (userFingers + randNum), res: res, output: randNum}; //returns true or false if the user guessed correctly
}//end function