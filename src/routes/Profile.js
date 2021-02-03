import { authService } from "fbase";
import React from "react";
import { useHistory } from "react-router-dom";

export default () => {
  const history = useHistory();
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/"); // react router hook으로 이동시키기
  };
  return (
    <>
      <button onClick={onLogOutClick}>Log Out</button>
    </>
  );
};