from flask import Flask, render_template, request, jsonify, session

from boggle import Boggle

app = Flask(__name__)
app.config["SECRET_KEY"] = "SECRET"


boggle_game = Boggle()

@app.route('/')
def homepage():
    """Show Board"""
    
    board = boggle_game.make_board()
    session['board'] = board
    high_score = session.get('high_score',0)
    num_plays = session.get('num_plays', 0)
   
    return render_template('base.html', board=board, high_score = high_score, num_plays=num_plays)

@app.route('/word')
def word_validity():
    
    """ Check if word is in dictionary"""
    
    board = session['board']
    word = request.args['word']
    
    """TO BE USED FOR JS"""
    response = boggle_game.check_valid_word(board, word) 
    
    """ Convert response to Json"""
    return jsonify({'result': response})

@app.route('/post-score', methods = ['POST'])
def post_score():
    """Fetch score. Update highescore and unm_plays if applicable"""
    
    score = request.json['score']
    num_plays = session.get('num_plays',0)
    high_score = session.get('high_score',0)
    
    session['num_plays'] = num_plays + 1
    session[high_score] = max(score, high_score)

    return jsonify(brokeRecord=score > highscore)
    

    