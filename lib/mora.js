export function mora(userGuess, userFingers) {//similar to odds_or_evens except the player must guess the total sum
    var randNum = Math.floor(Math.random() * 5) + 1;    //a random num btween 1-5

    return (userFingers + randNum) == userGuess; //returns true or false if the user guessed correctly
}//end function