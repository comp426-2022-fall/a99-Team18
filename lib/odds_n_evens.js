export function odds_n_evens(userGuess, userFingers) { //user inputs a guess and a number between 1-5, points = 1 if the user wins
    //a game where two ppl reveal a number of fingers at the same time
    //and try to guess if the sum of their finger's will be even or odd
    var randNum = Math.floor(Math.random() * 5) + 1;    //a random num btween 1-5
    var _results = (userFingers + randNum)%2;   //divides the sum of user's fingers and randNum to see of it's even
    var outcome = '';
    if (_results == 0) {
        outcome = 'Even';
    } else {
        outcome = 'Odd';
    }

    return outcome == userGuess; //returns true or false if the user guessed correctly

}//end function