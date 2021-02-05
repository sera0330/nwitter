import Nweet from "components/Nweet";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState(""); // form을 위한 state
  const [nweets, setNweets] = useState([]); // array
  
  const getNweets = async() => { // async를 써야 하므로 별도로 선언
    const dbNweets = await dbService.collection("nweets").get(); // querySnapshot
    dbNweets.forEach((document) => {
      const nweetObject = {
        ...document.data(),
        id: document.id,
      };
      // set에서 값대신 함수전달-> 이전값 불러오기
      setNweets((prev) => [nweetObject, ...prev]); // 작성한 것과 이전 값들 배열로 불러오기
    });
  }
  
  useEffect(() => {// component mount될 때
    // getNweets();

    // rerender 하지 않는 방식
    dbService.collection("nweets").onSnapshot(snapshot => { // onSnapshot : db 변동있을 때 알림
      const nweetArray = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);
  
  const onSubmit = async (event) => {
    event.preventDefault();
    // add returns promise -> await, async
    await dbService.collection("nweets").add({ 
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid
    });
    setNweet("");
  }; 
  
  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={140} />
        <input type="submit" value="Nweet" />
      </form>
      <div>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  );
}

export default Home;