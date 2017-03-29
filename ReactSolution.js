var lastSquareCoords = Array(9).fill(null);
var lastSquareIndex = Array(9).fill(null);
var squaresFilled = 0;
var winningCombo = null;
var isAscending = true;
var isRevisited = false;

function Square(props) {
  
  return (
    <button className="square" style={props.style} onClick={() => props.onClick()}>
      {props.value}
    </button>
  );
}
function isBold(i) {
  // 2 
  if (lastSquareIndex[squaresFilled] == i)
    return !isRevisited;
  return false;
}
function isHighlighted(i) {
  // 5
  if (winningCombo != null) {
      for (var j = 0; j < winningCombo.length; j++)
        if (winningCombo[j] == i)
          return !isRevisited;
    }
  return false;
}
class Board extends React.Component {
   
  renderSquare(i) {
    var normalOrBold = (isBold(i)) ? "bold" : "normal"; 
    var highlighted = (isHighlighted(i)) ? "yellow" : "white";
      return <Square value={this.props.squares[i]} style={{fontWeight: normalOrBold, backgroundColor: highlighted}} onClick={() => this.props.onClick(i)} />;
 
}
  render() {
    const winner = calculateWinner(this.props.squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (this.props.xIsNext ? 'X' : 'O');
  }
   const divSquares = [0, 3, 6];
    // 3) not quite a double loop (below)
    const divRow = divSquares.map((divSquares) =>
                                  <div className="board-row" key={divSquares.toString()}>{this.renderSquare(divSquares)}
                                    {this.renderSquare(divSquares + 1)}
                                    {this.renderSquare(divSquares + 2)}
                                  </div>
                                  );
    
    return (
      <div>
       {divRow}
      </div>
    );
  }
 
}

class Game extends React.Component {
  constructor() {
    super();
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true
    };
  }
  render() {
    var history = this.state.history;
const current = history[this.state.stepNumber];
const winner = calculateWinner(current.squares);
const moves = history.map((step, move) => {
 const desc =  move ?
    lastSquareCoords[move] :
    'Game start';
  return (
    <li key={move}>
      <a href="#" onClick={() => this.jumpTo(move)}>{desc}</a>
    </li>
  );
});
    // 4 (one must click on square or link in order to see reversed list)
    if (!isAscending)
      moves.reverse();
let status;
if (winner) {
  status = 'Winner: ' + winner;
} else {
  status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
}
    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
    onClick={(i) => this.handleClick(i)}
            />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
          <button onClick={() => this.toggleAscDesc()}>Toggle</button>
        </div>
      </div>
       
    );
  }
  toggleAscDesc() {
    isAscending = !isAscending;
  }
  handleClick(i) {
    isRevisited = false;
  const history = this.state.history;
  const current = history[this.state.stepNumber];
  const squares = current.squares.slice();
  if (calculateWinner(squares) || squares[i]) {
    return;
  }
  squares[i] = this.state.xIsNext ? 'X' : 'O';
  this.setState({
    history: history.concat([{
      squares: squares
    }]),
     stepNumber: history.length,
    xIsNext: !this.state.xIsNext,
  });
    // 1
    lastSquareCoords[history.length] = '(' + (Math.floor(i / 3)) + ',' + ((i % 3) + 1) + ')';
    lastSquareIndex[history.length] = i;
    squaresFilled = history.length;
}
  jumpTo(step) {
    isRevisited = (step != squaresFilled);
  this.setState({
    stepNumber: step,
    xIsNext: (step % 2) ? false : true,
  });
}
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('container')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      winningCombo = lines[i];
      return squares[a];
    }
  }
  return null;
}
