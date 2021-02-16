import { authService } from "fbase";
import React, { useState } from "react";
import { useHistory } from "react-router-dom";

export default ({ userObj, refreshUser }) => {
  const history = useHistory();
  const [newDisplayName, setNewDisplayName] = useState(userObj.displayName);
  const onLogOutClick = () => {
    authService.signOut();
    history.push("/"); // react router hook으로 이동시키기
  };
  // const getMyNweets = async() => {
  //   // where로 필터링
  //   const nweets = await dbService 
  //     .collection("nweets")
  //     .where("creatorId", "==", userObj.uid)
  //     .orderBy("createdAt") // The query requires an index
  //     .get();
  // };
  // useEffect(() => {
  //   getMyNweets();
  // }, [])
  const onChange = (event) => {
    const {
      target: {value},
    } = event;
    setNewDisplayName(value);
  };
  const onSubmit = async (event) => {
    event.preventDefault();

    if (userObj.displayName !== newDisplayName) {
      // firebase.User#updateprofile
      await userObj.updateProfile({ 
        displayName: newDisplayName
      });
    }

    // updateProfile refresh firebase user
    // But Navigation is not connected firebase, is userObj
    refreshUser();
  };
  return (
    <div className="container">
      <form onSubmit={onSubmit} className="profileForm">
        <input onChange={onChange} type="text" placeholder="Display Name" value={newDisplayName} autoFocus className="formInput" />
        <input type="submit" value="Update Profile" className="formBtn" style={{ marginTop: 10 }} />
      </form>
      <span className="formBtn cancelBtn logOut" onClick={onLogOutClick}>Log Out</span>
    </div>
  );
};