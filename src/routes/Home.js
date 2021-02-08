import Nweet from "components/Nweet";
import { dbService, storageService } from "fbase";
import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // To create a random UUID...

const Home = ({ userObj }) => {
  const [nweet, setNweet] = useState(""); // form을 위한 state
  const [nweets, setNweets] = useState([]); // array
  const [attachment, setAttacthment] = useState(); // 첨부파일 

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

    let attachmentUrl = "";

    if (attachment !== "") {
      // storage.Reference Google Cloud Storage object = bucket
      const attachmentRef = storageService.ref().child(`${userObj.uid}/${uuidv4()}`);
      const response = await attachmentRef.putString(attachment, "data_url"); // readAsDataURL
      attachmentUrl = await response.ref.getDownloadURL();
    } 

    const nweetObj = {
      text: nweet,
      createdAt: Date.now(),
      creatorId: userObj.uid,
      attachmentUrl
    };
    
    await dbService.collection("nweets").add(nweetObj);
    setNweet("");
    setAttacthment("");
  };

  const onChange = (event) => {
    const {
      target: { value },
    } = event;
    setNweet(value);
  };

  const onFileChange = (event) => {
    // es6 : event.target.files 가져오기
    const { 
      target: { files }
    } = event;
    const theFile = files[0];
    const reader = new FileReader();
    
    reader.onloadend = (finishedEvent) => { // 파일 로딩이 끝날 때
      const {
        currentTarget: { result }
      } = finishedEvent;
      setAttacthment(result);
    }
    reader.readAsDataURL(theFile);
  };

  const onClearAttachmentClick = () => setAttacthment(null);

  return (
    <div>
      <form onSubmit={onSubmit}>
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={140} />
        <input type="file" accept="image/*" onChange={onFileChange} />
        <input type="submit" value="Nweet" />
        {attachment && (
          <div>
            <img src={attachment} width="50px"/>
            <button onClick={onClearAttachmentClick}>Clear</button>
          </div>
        )}
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