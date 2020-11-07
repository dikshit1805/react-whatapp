import React, {useState, useEffect} from 'react'
import "./Sidebar.css"
import ChatIcon from '@material-ui/icons/Chat';
import DonutLargeIcon from '@material-ui/icons/DonutLarge';
import {Avatar, IconButton} from '@material-ui/core'
import MoreVertIcon from '@material-ui/icons/MoreVert';
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import SidebarChat from './SidebarChat'
import axios from "./axios"
import Pusher from 'pusher-js'
import { useStateValue } from './StateProvider';


function Sidebar() {
  const [rooms,setRooms]=useState([]);
  const [{user}, dispatch] = useStateValue();
  console.log("Hello");
  useEffect(() => {
    console.log("Hello");
    axios.get("/rooms/sync").then(response => {
      setRooms(response.data)
    })

  }, [])


  useEffect(() => {
    const pusher = new Pusher('3c74c2b9606b1627b3aa', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('rooms');
    channel.bind('created', (roomInfo) => {
      setRooms([...rooms, roomInfo])
    });
    
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [rooms]);

  useEffect(() => {
    const pusher = new Pusher('3c74c2b9606b1627b3aa', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('rooms');
    channel.bind('deleted', (roomInfo) => {
      axios.get("/rooms/sync").then(response => {
        setRooms(response.data)
      })
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [rooms]);


  return (
    <div className="sidebar">
      <div className="sidebar__header">
            <Avatar src={user?.photoURL}/>
            <div className="sidebar__headerRight">
            <IconButton>
              <DonutLargeIcon/>
            </IconButton>
            <IconButton>
              <ChatIcon/> 
            </IconButton>
            <IconButton>
              <MoreVertIcon/>
            </IconButton>
        </div>
      </div>
      <div className="sidebar__search">
        <div className="sidebar__searchContainer">
          <SearchOutlinedIcon />
          <input placeholder="Search or Start New chat" type="text"/>
        </div>
      </div>

      <div className="sidebar_chats">
        <SidebarChat addNewChat/>
        {rooms.map((room) => (
           <SidebarChat key={room._id} id={room._id} name={room.roomname}/>
        ))}
      </div>
    </div>
  )
}

export default Sidebar
