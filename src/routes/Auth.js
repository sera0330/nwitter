import AuthForm from "components/AuthForm";
import { authService, firebaseInstance } from "fbase";
import React from "react";
import { FontAwesomeIcon } from  "@fortawesome/react-fontawesome";
import { faTwitter, faGoogle, faGithub, faGit } from "@fortawesome/free-brands-svg-icons";

const Auth = () => {
  const onSocialClick = async (event) => {
    // ES6 문법
    const {
      target: { name },
    } = event;

    let provider;
    if (name === "google") {
      provider = new firebaseInstance.auth.GoogleAuthProvider();
    } else if (name === "github") {
      provider = new firebaseInstance.auth.GithubAuthProvider();
    }
    const data = await authService.signInWithPopup(provider);
    console.log(data);
  };

  return (
    <div className="authContainer">
      <FontAwesomeIcon icon={faTwitter} color={"#04AAFF"} size="3x" style={{ marginBottom: 30 }} />
      <AuthForm />
      <div className="authBtns">
        <button onClick={onSocialClick} name="google" className="authBtn">
          Continue with Google <FontAwesomeIcon icon={faGoogle} />
        </button>
        <button onClick={onSocialClick} name="github" className="authBtn">
          Continue with Github <FontAwesomeIcon icon={faGithub} />
        </button>
      </div>
    </div>
  )
}

export default Auth; // function component

// const Auth = () =>
// export default Auth;
// 이렇게 작성하면 다른데서 import 자동완성됨