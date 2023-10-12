// Set a session flag indicating a new session on page refresh

class BoggleGame{
constructor(boardId, seconds = 60){
    this.board = $('#' + boardId);
    this.seconds = seconds;
    this.words = new Set()
    this.timer = setInterval(this.tick.bind(this), 1000);
    this.showTimer();
    this.score = 0;
    // Attach a submit event handler to the form with class "word-form"
    $('.word-form', this.board).on('submit', this.handleSubmit.bind(this));
}

showMessage(msg, cls) {
    $('.msg',this.board).text(msg)
    .removeClass()
    .addClass(cls)
  }

//Fetch input value and check if it's not words.
async handleSubmit(event){
    event.preventDefault(); 
    const $word = $('.input-value',this.board);

    let word = $word.val(); 

    if (this.words.has(word)) {
      this.showMessage('Word already submitted', 'error');
      return;
    } else {
      this.checkValidity(word);
      return;
    }
  }

  //Check server for validity.
  async checkValidity(word){
    try{

    const response = await axios.get('/word',{params: {word:word} });

    if (response.data.result === "not-word"){
        this.showMessage(`${word} is not valid.`,'error');
    } else if (response.data.result === "not-on-board"){
        this.showMessage(`${word} is not on board.`, 'error');
    } else {
    ///Create li and add word
        this.showMessage(`Added: ${word}`, 'valid');
        let list = $('<li>').text(word);
        $('.word-list').append(list);

    ///Add word to set
        this.words.add(word)

    ///Update score
        this.score += word.length;
        $('.score').text('Score:'+ this.score);
    }
} catch (error){
    console.error('Error:', error);
}
    const $word = $('.input-value',this.board);
    $word.val("").focus();

}

///Timer to reset once secons equals 0.
async tick(){
    this.seconds -= 1;
    this.showTimer();

    if(this.seconds === 0){
        clearInterval(this.timer);
        await this.finalScore()
    }

}

async finalScore(){
    const response = await axios.post('/post-score',{score: this.score}) ;
    if (response.data.brokeRecord){
        this.showMessage(`New score:${this.score}`, 'valid');
    } else {
        this.showMessage(`Final Score:${this.score}`,'valid');

    }
}


showTimer(){
    $('.timer', this.board).text('Seconds Left:'+ this.seconds);
}


}






