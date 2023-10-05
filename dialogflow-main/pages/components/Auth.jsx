import React, { useEffect, useState } from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import styles from '@/styles/Auth.module.scss';
import Link from 'next/link';
import axios from 'axios';

export default function Auth() {
  const { loginWithRedirect } = useAuth0();
  const [isSignUp, setIsSignUp] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const { user, isAuthenticated, isLoading } = useAuth0();

  useEffect(() => {
    if (isAuthenticated) {
      // Set email and name if user is authenticated
      setEmail(user.email);
      setName(user.name);
    }
  }, [isAuthenticated, user?.email, user?.name]);

  useEffect(() => {
    if (isAuthenticated) {
      try {
        login();
      } catch (error) {
        console.log(error);
        register();
      }
    }
  }, [name, email, isAuthenticated]);

  // Components of auth0
  const LogoutButton = () => {
    const { logout } = useAuth0();

    return (
      <button
        onClick={() =>
          logout({ logoutParams: { returnTo: window.location.origin } })
        }
        style={{
          margin: "10px",
        }}
        className='btn btn-dark'
      >
        Log Out
      </button>
    );
  };

  const LoginButton = () => {
    return (
      <button className='btn btn-success' onClick={() => loginWithRedirect()}>
        Log In
      </button>
    );
  };

  const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
      return <div>Loading ...</div>;
    }

    return (
      isAuthenticated && (
        <div>
          <img src={user.picture} alt={user.name} />
          <h2>{user.name}</h2>
          <p>{user.email}</p>
        </div>
      )
    );
  };

  // Login + Register functions

  // Login
  const login = async () => {
    try {
      if (email.length > 0) {
        const { data } = await axios.post("/api/login", { email, password });
        sessionStorage.setItem("user_info", JSON.stringify(data));
        window.location.href = '/textToSpeech';
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Register
  const register = async () => {
    try {
      if (email.length > 0) {
        const { data } = await axios.post("/api/register", { email, password, name });
        console.log(data);
        sessionStorage.setItem("user_info", JSON.stringify(data));
        window.location.href = '/textToSpeech';
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className={styles.authContainer}>
      <div className={`${styles.container} ${isSignUp ? styles['right-panel-active'] : ''}`} id="container">
        <div className={`${styles['form-container']} ${styles['sign-up-container']}`} id="sign-up-container">
          <div className={styles['form-container-form']}>
            <h1 className={styles['form-container-title']}>Create Account</h1>
            <div className={styles['social-container']}>
              <button className='btn btn-primary social' onClick={() => loginWithRedirect()}><i className="fab fa-facebook-f"></i></button>
              <button className='btn btn-danger social' onClick={() => loginWithRedirect()}><i className="fab fa-google-plus-g"></i></button>
              <button className='btn btn-info social'><i className="fab fa-linkedin-in"></i></button>
            </div>
            <span>or use your email for registration</span>
            <div className={styles.infield}>
              <input type="text" placeholder="Name" defaultValue={name} onChange={e=>setName(e.target.value)} />
              <label></label>
            </div>
            <div className={styles.infield}>
              <input type="email" placeholder="Email" name="email" defaultValue={email} onChange={e=>setEmail(e.target.value)} />
              <label></label>
            </div>
            <div className={styles.infield}>
              <input type="password" placeholder="Password" defaultValue={password} onChange={e=>setPassword(e.target.value)} />
              <label></label>
            </div>
            <button onClick={register}>Sign Up</button>
          </div>
        </div>
        <div className={`${styles['form-container']} ${styles['sign-in-container']}`} id="sign-in-container">
          <div>
            <h1>Sign in</h1>
            <div className={styles['social-container']}>
              <button className='btn btn-primary social' onClick={() => loginWithRedirect()}><i className="fab fa-facebook-f"></i></button>
              <button className='btn btn-danger social' onClick={() => loginWithRedirect()}><i className="fab fa-google-plus-g"></i></button>
              <button className='btn btn-info social'><i className="fab fa-linkedin-in"></i></button>
            </div>
            <span>or use your account</span>
            <div className={styles.infield}>
              <input type="email" placeholder="Email" name="email" defaultValue={email} onChange={e=>setEmail(e.target.value)} />
              <label></label>
            </div>
            <div className={styles.infield}>
              <input type="password" placeholder="Password" defaultValue={password} onChange={e=>setPassword(e.target.value)}/>
              <label></label>
            </div>
            <a href="#" className={styles.forgot}>Forgot your password?</a>
              <button onClick={login}>Sign In</button>
          </div>
        </div>
        <div className={styles['overlay-container']} id="overlay-container">
          <div className={styles.overlay}>
            <div className={`${styles['overlay-panel']} ${styles['overlay-left']}`}>
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button onClick={() => setIsSignUp(false)} style={{textAlign:"center",marginBottom:50,marginLeft:10}}>Sign In</button>
            </div>
            <div className={`${styles['overlay-panel']} ${styles['overlay-right']}`}>
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start journey with us</p>
              <button onClick={() => setIsSignUp(true)} style={{textAlign:"center"}}>Sign Up</button>
            </div>
          </div>
          <button id="overlayBtn" onClick={() => setIsSignUp(!isSignUp)}></button>
        </div>
      </div>
    </div>
  );
}