import React, { useState, useEffect } from "react";
import AppRouter from "components/Router"; // jsconfig.json 옵션으로 Absolute Imports 가능
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  
  useEffect(() => {
    authService.onAuthStateChanged((user) => { // 로그인, 로그아웃, 애플리케이션 초기화
      if (user) {
        setUserObj(user); // 다른 곳에서 사용할 수 있도록 유저 정보 저장해두기
      }
      setInit(true); // AppRouter 설정
    });
  }, []);

  return (
    <>
      {init ? <AppRouter isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
