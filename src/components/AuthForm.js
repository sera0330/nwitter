import { authService } from "fbase";
import React, { useState } from "react";

const AuthForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [newAccount, setNewAccount] = useState(true);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const {target: {name, value}} = event;

    if (name === "email") {
      setEmail(value);
    } else if (name === "password") {
      setPassword(value);
    }
  };
  const onSubmit = async(event) => {
    event.preventDefault(); // I dont want the default thing to happen. let me handle that

    try {
      let data;
      if (newAccount) { // create account
        // createUserWithEmailAndPassword ( email :  string ,  password :  string ) : Promise < UserCredential >
        // Promise -> await ???
        data = await authService.createUserWithEmailAndPassword(email, password);
      } else { // log in
        data = await authService.signInWithEmailAndPassword(email, password);
      }
    } catch (error) {
      setError(error.message);
    }
  };
  const toggleAccount = () => setNewAccount((prev) => !prev);

  return (
    <>
      <form onSubmit={onSubmit} className="container">
        <input name="email" type="email" placeholder="Email" required value={email} onChange={onChange} className="authInput" />
        <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange} className="authInput" />
        <input type="submit" value={newAccount ? "Create Account" : "Log In"} className="authInput authSubmit" />
        {error && <span className="authError">{error}</span>}
      </form>
      <span onClick={toggleAccount} className="authSwitch">
        {newAccount ? "Sign in" : "Create Account"}
      </span>
    </>
  );
};

export default AuthForm;