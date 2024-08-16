import { useState } from "react";
import { useCookies } from "react-cookie";
const Auth = () => {
  const [LogIn, setLogIn] = useState(false);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState(null);
  const [password, setPassword] = useState(null);
  const [ConfirmPassword, setConfirmPassword] = useState(null);
  const [cookie, setCookie, removeCookie] = useCookies(null);
  console.log(cookie);
  const viewLogIn = (status) => {
    setLogIn(status);
  };
  const handleSubmit = async (e, endpoint) => {
    e.preventDefault();
    if (!LogIn && password !== ConfirmPassword) {
      setError("Make Sure Passowords are matched");
      return;
    }
    const response = await fetch(`http://localhost:8000/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (data.detail) {
      setError(data.detail);
    } else {
      setCookie("Email", data.email);
      setCookie("AuthToken", data.token);
      console.log(data);
      window.location.reload();
    }
  };
  return (
    <div className="auth-container">
      <div className="auth-box">
        <form>
          <h2>{LogIn ? "Please Log In" : "Please Sign Up"}</h2>
          <input
            type="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value);
            }}
          />
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value);
            }}
          />
          {!LogIn && (
            <input
              type="password"
              placeholder="Confirm Password"
              onChange={(e) => {
                setConfirmPassword(e.target.value);
              }}
            />
          )}
          <input
            type="submit"
            className="create"
            onClick={(e) => handleSubmit(e, LogIn ? "login" : "signup")}
          />
          {error && <p>{error}</p>}
        </form>
        <div className="auth-option">
          <button
            onClick={() => viewLogIn(false)}
            style={
              LogIn
                ? { backgroundColor: "rgb(255,255,255)" }
                : { backgroundColor: "rgb(108, 115, 148)" }
            }
          >
            SignUP
          </button>
          <button
            onClick={() => viewLogIn(true)}
            style={
              !LogIn
                ? { backgroundColor: "rgb(255,255,255)" }
                : { backgroundColor: "rgb(108, 115, 148)" }
            }
          >
            LogIN
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
