const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());

const PORT = 3000;

// variables for current state of program
let score: number = 0;
let word: string = '';
let hint: string = '';

// scrambles a word
function scramble(word: string): string {
    let scrambled: string = '';
    let wordArray: string[] = word.split('');
    while (wordArray.length > 0) {
        let randInt: number = Math.floor(Math.random() * wordArray.length);
        scrambled += wordArray[randInt];
        wordArray.splice(randInt, 1);
    }
    return scrambled;
}

// return scrambled word, and save word and hint
app.get('/scrambled', async(req, res) => {
    
    // make api call to get random word
    const url: string =  'https://random-word-api.herokuapp.com/word';

    try {
        const res = await axios.get(url);
        word = res.data[0];
    } catch (error) {
        // console.error(error);
    }
    
    // use random word to update state
    let scrambled: string = scramble(word);

    res.send(`${scrambled}`)
    console.log("scrambled word requested")
});

// return hint for a word: 70% chance of censoring letter with '_'
app.get('/hint', async(req, res) => {

        let resultString = word[0];

        for (let i = 1; i < word.length; i++) {

          const randomValue = Math.random();

          if (randomValue < 0.7) {
            resultString += '_';
          } else {
            resultString += word[i];
          }
        }
      
    res.send(`${resultString}`)
    // console.log("hint requested:" + hint)
    
});

// check if guess is correct
app.get('/guess', (req, res) => {

    let guess: string = req.query.guess;
    // console.log(word);
    // console.log(guess);
    if (guess === word) {
        res.send('true');
        // console.log('correct guess')
    } else {
        res.send('false');
        // console.log('wrong guess')
    }
});

// get true word
app.get('/word', (req, res) => {

    res.send(`${word}`)
    // console.log(" true word requested")
});

// get hint
app.get('/hint', (req, res) => {
    res.send(`${hint}`)
    // console.log("hint requested")
});

// get score
app.get('/score', (req, res) => {
    res.send(`${score}`)
    // console.log("score requested")
});

// update score
app.patch('/score', (req, res) => {
    score += parseInt(req.query.val);
    res.send(`${score}`)
    // console.log('score updated')
});

// run backend server on Port 3000
app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});