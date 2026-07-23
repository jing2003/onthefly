const Login = () => {
  return (
    <main className="Login">
      <h1>On The Fly ✈️</h1>

      <div style={{ textAlign: "center" }}>
        <a href="/auth/github">
          <button type="button" className="headerBtn">
            🔒 Login via GitHub
          </button>
        </a>
      </div>
    </main>
  );
};

export default Login;
