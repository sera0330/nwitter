import { dbService } from "fbase";
import React, { useState } from "react";

const Nweet = ({ nweetObj, isOwner }) => {
  const [editing, setEditing] = useState(false); // 수정중인지 아닌지
  const [newNweet, setNewNweet] = useState(nweetObj.text); // 수정중인 nweet

  const onDeleteClick = async () => {
    const ok = window.confirm("Are  you sure you want to delete this nweet?");
    if (ok) {
      await dbService.doc(`nweets/${nweetObj.id}`).delete(); // nweets/~~ : 경로 (colection/document)
    }
  };
  const toggleEditing = () => setEditing((prev) => !prev);
  const onSubmit = async (event) => {
    event.preventDefault();
    await dbService.doc(`nweets/${nweetObj.id}`).update({
      text: newNweet
    });
    setEditing(false);
  }
  const onChange = (event) => {
    const {target:{value}} = event;
    setNewNweet(value);
  }

  return (
    <div>
      {editing ? (
        <>
          {isOwner && (
            <>
              <form onSubmit={onSubmit}>
                <input type="text" placeholder="Edit your nweet" value={newNweet} required onChange={onChange}/>
                <input type="submit" value="Update" />
              </form>
              <button onClick={toggleEditing}>Cancle</button>
            </>
          )}
        </>
      ) : (
        <>
          <h4>{nweetObj.text}</h4>
          {isOwner && (
            <> 
              <button onClick={onDeleteClick}>Delete</button>
              <button onClick={toggleEditing}>Edit</button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default Nweet;