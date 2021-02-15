import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { v4 as uuidv4 } from 'uuid'; // To create a random UUID...
import { FontAwesomeIcon } from  "@fortawesome/react-fontawesome";
import { faPlus, faTimes } from "@fortawesome/free-solid-svg-icons";

const NweetFactory = ({ userObj }) => {
  const [nweet, setNweet] = useState(""); // form을 위한 state
  const [attachment, setAttacthment] = useState(""); // 첨부파일 

  const onSubmit = async (event) => {
    if (nweet === "") {
      return;
    }
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

  const onClearAttachmentClick = () => setAttacthment("");

  return (
    <form onSubmit={onSubmit} className="factoryForm">
      <div className="factoryInput__container">
        <input value={nweet} onChange={onChange} type="text" placeholder="What's on your mind?" maxLength={140} className="factoryInput__input" />
        <input type="submit" value="&rarr;" className="factoryInput__arrow"/>
      </div>
      <label for="attac-file" className="factoryInput__label">
        <span>Add photos</span>
        <FontAwesomeIcon icon={faPlus} />
      </label>
      <input id="attac-file" type="file" accept="image/*" onChange={onFileChange} style={{ opacity: 0 }} />
      {attachment && (
        <div className="factoryForm__attachment">
          <img src={attachment} style={{ backgroundImage: attachment }} />
          <div className="factoryForm__clear" onClick={onClearAttachmentClick}>
            <span>Remove</span>
            <FontAwesomeIcon icon={faTimes} />
          </div>
        </div>
      )}
  </form>
  )
};

export default NweetFactory;