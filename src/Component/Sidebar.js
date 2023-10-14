import {
  Chat,
  DonutLarge,
  MoreVert,
  SearchOutlined,
} from "@mui/icons-material";
import { Avatar, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import "./Sidebar.css";
import SidebarChat from "./SidebarChat";
import db from "../firebase"
import { collection, onSnapshot } from "firebase/firestore";
import { useStateValue } from "../StateProvider";


function Sidebar() {
  const [rooms, setRooms] = useState([]);
  const [{ user }, dispatch] = useStateValue();

  useEffect(()=>{
    // here we get the snapshot of the "rooms" collection inside the database, which is realtime means everytime the collection is changed, a new snapshot will be given.
    const unsub = onSnapshot(collection(db, "rooms"), (snapshot) => {
      setRooms(snapshot.docs.map(doc=>({
        id: doc.id,
        data: doc.data()
      })))
  }, (error)=>{
    console.log(error)
    console.log("Error occured within database, please contact Jeetpal Singh ( singjeetpal001@gmail.com )")
  });

  // just for cleanup using a promise
  return ()  => {
    unsub();
  }
  },[])

  return (
    <div className="sidebar">
      <div className="sidebar__header">
        <Avatar src={user?.photoURL}/>
        <h3 className="sidebar__title">Jeetpal's FunChat</h3>
        <div className="sidebar__headerRight">
          <IconButton>
            <DonutLarge />
          </IconButton>
          <IconButton>
            <Chat />
          </IconButton>
          <IconButton>
            <MoreVert />
          </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlined />
          <input placeholder="Search or start new chat" />
        </div>
      </div>
      <div className="sidebar__chats">
      <SidebarChat addNewChat/>
      {rooms.map(room =>(
        <SidebarChat key={room.id} id={room.id} name ={room.data.name}/>
      ))}
      </div>
    </div>
  );
}

export default Sidebar;
