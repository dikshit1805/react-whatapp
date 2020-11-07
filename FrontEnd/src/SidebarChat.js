import React, {useState, useEffect} from 'react'
import {Avatar} from '@material-ui/core'
import "./SidebarChat.css"
import axios from "./axios"
import {Link} from "react-router-dom"
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';

function SidebarChat({id, name, addNewChat}) {
  const [seed, setSeed] = useState("")

  useEffect(()=> {
    setSeed(Math.floor(Math.random() * 5000))
  }, [])


  const createChat = async() => {
      const chatName = prompt("Enter the Chatroom Name :");
      if(chatName) {
        await axios.post("/rooms/new", {
          roomname: chatName,
          photoicon: "this is the path for photo icon"
        })
      } 
  }

  const selectedChat = () => {
  }

  async function deleteRoom(id) {
    await axios.get(`/rooms/delete/${id}`).then(() => console.log("Deleted")).catch(console.log("notDeleted"));
  }

  return !addNewChat ? (
    <Link to={`/room/${name}/${id}`}>
    <div onClick={selectedChat} className="sidebarchat">
      <div className="sibebar__block">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
        <div className="sidebarchat__info">
            <h2>{name}</h2>
        </div>
      </div>
      <Link to={`/`}>
        <DeleteIcon onClick={() => deleteRoom(id)}/>
      </Link>
    </div>
    </Link>
  ):(
    <div onClick={createChat} >
        <div className="sidebarchat">
          <h2> <AddIcon/> Add New Chat </h2>
      </div>
    </div>
  )
}

export default SidebarChat
