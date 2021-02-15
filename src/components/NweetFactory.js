import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // To create a random UUID...

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState(""); // form을 위한 state
  const [attachment, setAttacthment] = useState(""); // 첨부파일 

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
  )
};

export default NweetFactory;