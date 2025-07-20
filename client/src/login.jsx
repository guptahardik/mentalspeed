const { useState } = React;

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [mode, setMode] = useState('login');

  function submit(e) {
    e.preventDefault();
    fetch(`/api/${mode}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    })
      .then(res => res.json())
      .then(data => {
        if (data.token) {
          localStorage.setItem('token', data.token);
          window.location.href = '/index.html';
        } else {
          alert(JSON.stringify(data));
        }
      });
  }

  return (
    <div className="max-w-sm mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-4">{mode === 'login' ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submit} className="space-y-2">
        <input className="border p-2 w-full" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="border p-2 w-full" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
        <button className="w-full px-4 py-2 bg-blue-500 text-white">Submit</button>
      </form>
      <button className="mt-2 text-sm text-blue-500" onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}>
        {mode === 'login' ? 'Need an account? Sign up' : 'Have an account? Log in'}
      </button>
    </div>
  );
}

ReactDOM.render(<Login />, document.getElementById('root'));
