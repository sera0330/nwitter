import React, { useState, useEffect } from "react";
import AppRouter from "components/Router"; // jsconfig.json 옵션으로 Absolute Imports 가능
import { authService } from "fbase";

function App() {
  const [init, setInit] = useState(false);
  const [userObj, setUserObj] = useState(null);
  
  useEffect(() => {
    authService.onAuthStateChanged((user) => { // 로그인, 로그아웃, 애플리케이션 초기화
      if (user) {
        // 다른 곳에서 사용할 수 있도록 유저 정보 저장해두기(firebase to react)
        setUserObj({
          displayName: user.displayName,
          uid: user.uid,
          updateProfile: (args) => user.updateProfile(args),
        }); 
      }
      setInit(true); // AppRouter 설정
    });
  }, []);

  const refreshUser = () => {
    // currentUser has too many fields
    // 사용하는 것만 간추리기(diaplayName, uid, updateProfile)
    const user = authService.currentUser;
    setUserObj({
      displayName: user.displayName,
      uid: user.uid,
      updateProfile: (args) => user.updateProfile(args),
    }); 
  };

  return (
    <>
      {init ? <AppRouter refreshUser={refreshUser} isLoggedIn={Boolean(userObj)} userObj={userObj} /> : "Initializing..."}
      <footer>&copy; {new Date().getFullYear()} Nwitter</footer>
    </>
  );
}

export default App;
