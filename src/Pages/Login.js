import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import "../App.css";

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const auth = getAuth();
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setLoggedIn(!!user);
    });

    return unsubscribe;
  }, [auth]);

  useEffect(() => {
    if (loggedIn) {
      navigate('/home');
    }
  }, [loggedIn, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Logado com sucesso!", {
        position:'top-right',
        autoClose:5000,
        hideProgressBar:false,
        closeOnClick: true})
      navigate('/home');
    } catch (error) {
      toast.error("Email/senha inválidos!", {
        position:'top-right',
        autoClose:5000,
        hideProgressBar:false,
        closeOnClick: true})
    }
  };

  return (
    <div className="container">
    <div className="container-login">
      <div className="wrap-login">
        <form className="login-form" onSubmit={handleSubmit}>
          <span className="login-form-title"> Bem vindo(a) </span>

          <div className="wrap-input">
            <input
              className={email !== "" ? "has-val input" : "input"}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
            <span className="focus-input" data-placeholder="Email"></span>
          </div>

          <div className="wrap-input">
            <input
              className={password !== "" ? "has-val input" : "input"}
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <span className="focus-input" data-placeholder="Senha"></span>
          </div>

          <div className="container-login-form-btn">
            <button className="login-form-btn">Login</button>
          </div>
        </form>
      </div>
    </div>
    <ToastContainer></ToastContainer>
  </div>
  );
}

export default Login;