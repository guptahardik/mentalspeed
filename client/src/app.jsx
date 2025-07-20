const { useState, useEffect, useRef } = React;

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function generateQuestion() {
  const a = getRandomInt(10);
  const b = getRandomInt(10);
  const opIdx = getRandomInt(4);
  const ops = ['+', '-', '*', '/'];
  const op = ops[opIdx];
  let answer;
  switch (op) {
    case '+': answer = a + b; break;
    case '-': answer = a - b; break;
    case '*': answer = a * b; break;
    case '/': answer = a; answer = Math.floor(a * b); break;
  }
  return { text: `${a} ${op} ${b}`, answer };
}

function App() {
  const [running, setRunning] = useState(false);
  const [duration, setDuration] = useState(60);
  const [time, setTime] = useState(60);
  const [question, setQuestion] = useState(generateQuestion());
  const [input, setInput] = useState('');
  const [correct, setCorrect] = useState(0);
  const [incorrect, setIncorrect] = useState(0);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!running) return;
    if (time <= 0) {
      setRunning(false);
      return;
    }
    const id = setTimeout(() => setTime(time - 1), 1000);
    return () => clearTimeout(id);
  }, [running, time]);

  function start() {
    setRunning(true);
    setTime(duration);
    setCorrect(0);
    setIncorrect(0);
    setQuestion(generateQuestion());
    setInput('');
    setTimeout(() => inputRef.current.focus(), 0);
  }

  function submit(e) {
    e.preventDefault();
    const value = parseFloat(input);
    if (value === question.answer) {
      setCorrect(c => c + 1);
    } else {
      setIncorrect(i => i + 1);
    }
    setQuestion(generateQuestion());
    setInput('');
    inputRef.current.focus();
  }

  return (
    <div className="max-w-md mx-auto text-center">
      <h1 className="text-2xl font-bold mb-4">MentalSpeed</h1>
      {!running && (
        <div className="mb-4">
          <select value={duration} onChange={e => setDuration(parseInt(e.target.value))} className="border p-2">
            <option value="30">30s</option>
            <option value="60">1m</option>
            <option value="120">2m</option>
          </select>
          <button onClick={start} className="ml-2 px-4 py-2 bg-blue-500 text-white">Start</button>
        </div>
      )}
      {running && (
        <div>
          <div className="text-xl mb-2">Time: {time}s</div>
          <div className="text-xl mb-4">{question.text}</div>
          <form onSubmit={submit}>
            <input ref={inputRef} value={input} onChange={e => setInput(e.target.value)} autoFocus className="border p-2 w-32 text-center" />
          </form>
          <div className="mt-4">Correct: {correct} Incorrect: {incorrect}</div>
        </div>
      )}
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
