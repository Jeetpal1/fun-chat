import {
  AttachFile,
  InsertEmoticon,
  Mic,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  addDoc,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import db from "../firebase";
import { useStateValue } from "../StateProvider";
import { serverTimestamp } from "firebase/firestore";

import "./Chat.css";

function Chat() {
  const [seed, setSeed] = useState("");
  const [input, setInput] = useState("");
  const { roomId } = useParams();
  const [roomName, setRoomName] = useState("");
  const [messages, setMessages] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
    const unsub1 = onSnapshot(
      doc(db, "rooms", roomId),
      (snapshot) => {
        setRoomName(snapshot.data().name);
      },
      (error) => {
        console.log(error);
        console.log(
          "Error occured within database, please contact Jeetpal Singh ( singjeetpal001@gmail.com )"
        );
      }
    );

    const unsub2 = onSnapshot(
      query(
        collection(db, "rooms", roomId, "messages"),
        orderBy("timestamp", "asc")
      ),
      (snapshot) => {
        setMessages(snapshot.docs.map((doc) => doc.data()));
      },
      (error) => {
        console.log(error);
        console.log(
          "Error occured within database, please contact Jeetpal Singh ( singjeetpal001@gmail.com )"
        );
      }
    );

    // just for cleanup using a promise
    return () => {
      unsub1();
      unsub2();
    };
  }, [roomId, db]);

  const sendMessagSubmit = (event) => {
    event.preventDefault();
    if (input !== "") {
      
      addDoc(collection(db, "rooms", roomId, "messages"), {
        message: input,
        name: user.displayName,
        timestamp: serverTimestamp(),
      });
    }
    // console.log(input);

    setInput("");
  };

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="chat__headerInfo">
          <h3>{roomName}</h3>
          
            {(messages[messages.length - 1]) ?(<p>Last seen{" "} {new Date(messages[messages.length - 1]?.timestamp?.toDate()).toUTCString()}</p>):<p>No messages yet</p>}
          
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlined />
          </IconButton>
          <IconButton>
            <AttachFile />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="chat__body">
      <div className="chat__background"></div>
        {messages.map((message, index) => (
          <p
            className={`chat__message ${
              message.name === user.displayName && "chat__reciever"
            }`}
            key={index}
          >
            <span className="chat__name">{message.name}</span>
            {message.message}
            <span className="chat__timestamp">
              {new Date(message.timestamp?.toDate()).toUTCString()}
            </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <IconButton>
          <InsertEmoticon />
        </IconButton>
        <form  onSubmit={sendMessagSubmit}>
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            type="text"
            placeholder="Type a message"
          />
          <button type="submit">
            Send a message
          </button>
        </form>
        <IconButton>
          <Mic />
        </IconButton>
      </div>
    </div>
  );
}

export default Chat;
