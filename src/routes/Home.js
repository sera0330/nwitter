import Nweet from "components/Nweet";
import NweetFactory from "components/NweetFactory";
import { dbService } from "fbase";
import React, { useEffect, useState } from "react";

const Home = ({ userObj }) => {
  const [nweets, setNweets] = useState([]); // array
  const getNweets = async () => { // async를 써야 하므로 별도로 선언
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
    // rerender 하지 않는 방식
    dbService.collection("nweets").orderBy("createdAt", "desc").onSnapshot(snapshot => { // onSnapshot : db 변동있을 때 알림
      const nweetArray = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setNweets(nweetArray);
    });
  }, []);

  return (
    <div className="container">
      <NweetFactory userObj={userObj} />
      <div style={{ marginTop: 30 }}>
        {nweets.map((nweet) => (
          <Nweet key={nweet.id} nweetObj={nweet} isOwner={nweet.creatorId === userObj.uid} />
        ))}
      </div>
    </div>
  );
}

export default Home;