import React from 'react'
import "./Chat.css"
import {Avatar, IconButton} from '@material-ui/core'
import SearchOutlinedIcon from '@material-ui/icons/SearchOutlined';
import AttachFileOutlinedIcon from '@material-ui/icons/AttachFileOutlined';
import MoreVertOutlinedIcon from '@material-ui/icons/MoreVertOutlined';
import {useParams} from 'react-router-dom'
import InsertEmoticonOutlinedIcon from '@material-ui/icons/InsertEmoticonOutlined';
import MicOutlinedIcon from '@material-ui/icons/MicOutlined';
import {useEffect, useState} from 'react';
import Pusher from 'pusher-js'
import axios from "./axios"
import { useStateValue } from './StateProvider';

function Chat() {
  const [input, setInput] = useState('');
  const {roomId, roomname} = useParams()
  const [messages,setMessages]=useState([]);
  const [roomName, setRoomName] = useState("")
  const [{user}, dispatch] = useStateValue();
  const [seed, setSeed] = useState("")

  useEffect(()=> {
    setSeed(Math.floor(Math.random() * 5000))
  }, [])

  useEffect(() => {
    setRoomName(roomname);

    axios.get(`/messages/sync/${roomId}`).then(response => {
      setMessages(response.data)
    })
  }, [roomId, roomname, input])

  useEffect(() => {
    const pusher = new Pusher('3c74c2b9606b1627b3aa', {
      cluster: 'us2'
    });

    const channel = pusher.subscribe('room');
    channel.bind('inserted', (newMessage) => {
      setMessages([...messages, newMessage])
    });

    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    }
  }, [messages]);


  const sendMessage = async (e) => {
    e.preventDefault();
    const time = new Date();
    
    await axios.post(`/messages/new/${roomId}`, {
      message: input,
      name: user.displayName,
      email: user.email,
      timestamp: time,
      received: false
    })
    setInput(' ');
  }

  return (
    <div className="chat">
      <div className="chat__header">
        <Avatar src={`https://avatars.dicebear.com/api/human/${seed}.svg`}/>
        <div className="chat__headerInfo">
          <h3> {roomName} </h3>
          <p> {new Date(messages[messages.length - 1]?.timestamp).toLocaleTimeString() + ' ' + new Date(messages[messages.length - 1]?.timestamp).toLocaleDateString()} </p>
        </div>
        <div className="chat__headerRight">
          <IconButton>
            <SearchOutlinedIcon/>
          </IconButton>
          <IconButton>
            <AttachFileOutlinedIcon/>
          </IconButton>
          <IconButton>
            <MoreVertOutlinedIcon/>
          </IconButton>
        </div>
      </div>

      <div className="chat__body">
        {messages.map((message) => (
          <p className={`chat__message ${message.email === user.email && "chat__receiver"}`}>
          <span className="chat__name"> {message.name} </span>
          {message.message}
          <span className="chat__timestamp"> {new Date(message.timestamp).toLocaleTimeString() + ' ' + new Date(message.timestamp).toLocaleDateString() } </span>
          </p>
        ))}
      </div>
      <div className="chat__footer">
        <IconButton>
        <InsertEmoticonOutlinedIcon/>
        </IconButton>
        <form>
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Type a message" type="text"/>
          <button onClick={sendMessage} type="submit">
            Send a message
          </button>
        </form>
        <IconButton>
        <MicOutlinedIcon/>
        </IconButton>
      </div>
    </div>
  )
}

export default Chat
