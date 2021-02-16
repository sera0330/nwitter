import { dbService, storageService } from "fbase";
import React, { useState } from "react";
import { FontAwesomeIcon } from  "@fortawesome/react-fontawesome";
import { faTrash, faPencilAlt } from "@fortawesome/free-solid-svg-icons";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); // 수정중인지 아닌지
  const [newNweet, setNewNweet] = useState(nweetObj.text); // 수정중인 nweet

  const onDeleteClick = async () => {
    const ok = window.confirm("Are  you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete(); // nweets/~~ : 경로 (colection/document)
      await storageService.refFromURL(nweetObj.attachmentUrl).delete(); // 사진 삭제
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet
    });
    setEditing(false);
  };
  const onChange = (event) => {
    const {target:{value}} = event;
    setNewNweet(value);
  };

  return (
    <div className="nweet">
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit} className="container nweetEdit">
                <input type="text" placeholder="Edit your nweet" value={newNweet} required onChange={onChange} autoFocus className="formInput" />
                <input type="submit" value="Update" className="formBtn" />
              </form>
              <span onClick={toggleEditing} className="formBtn cancelBtn">
                Cancle
              </span>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {nweetObj.attachmentUrl && <img src={nweetObj.attachmentUrl} alt="" />}
          {isOwner && (
            <div className="nweet__actions"> 
              <span onClick={onDeleteClick}>
                <FontAwesomeIcon icon={faTrash} />
              </span>
              <span onClick={toggleEditing}>
                <FontAwesomeIcon icon={faPencilAlt} />
              </span>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;