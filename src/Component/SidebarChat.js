import { Avatar } from "@mui/material";
import React, { useEffect, useState } from "react";
import "./SidebarChat.css";

import db from "../firebase";
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { Link } from "react-router-dom";

function SidebarChat(props) {
  const [seed, setSeed] = useState("");
  const [messages, setMessages] = useState("");

  useEffect(() => {
    if (props.id) {
      const unsub = onSnapshot(
        query(
          collection(db, "rooms", props.id, "messages"),
          orderBy("timestamp", "desc")
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
      return () => {
        unsub();
      };
    }
  }, []);

  useEffect(() => {
    setSeed(Math.floor(Math.random() * 5000));
  }, []);

  const createChat = async () => {
    const roomName = prompt("Please enter name for chat room");

    if (roomName) {
      // if there is a room name then we will change database

      // Add a new document in collection "rooms"
      await addDoc(collection(db, "rooms"), {
        name: roomName,
      });
    }
  };

  return !props.addNewChat ? (
    <Link to={`/rooms/${props.id}`}>
      <div className="sidebarChat">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`} />
        <div className="sidebarChat__info">
          <h2>{props.name}</h2>
          <p className="sidebarChat__lastMessage">{messages[0]?.message?String(messages[0]?.message).substring(0,20)+".....":""}</p>
        </div>
      </div>
    </Link>
  ) : (
    <div onClick={createChat} className="sidebarChat">
      <h2>Add New Chat</h2>
    </div>
  );
}

export default SidebarChat;
