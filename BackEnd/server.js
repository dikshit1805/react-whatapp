//importing
import express from 'express'
import mongoose from 'mongoose'
import Pusher from "pusher"
import Messages from "./dbMessages.js"
import cors from 'cors';
import { v4 as uuidv4 } from 'uuid';

//app config
const app=express();
const port=process.env.PORT || 9000;

const pusher = new Pusher({
  appId: "1100239",
  key: "3c74c2b9606b1627b3aa",
  secret: "f6252e94b2604796df61",
  cluster: "us2",
  useTLS: true
});


//middleware
app.use(express.json())
app.use(cors());
// app.use((req, res, next) =>  {
//   res.setHeader("Access-control-Allow-Orgin", "*");
//   res.setHeader("Access-control-Allow-Headers", "*");
//   next();
// });

//DB config
const connection_url = `mongodb+srv://admin:OzptCYBO0T4oHp7P@cluster0.fpigf.mongodb.net/whatappDB?retryWrites=true&w=majority`

mongoose.connect(connection_url, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
})

const db = mongoose.connection
db.once('open', () => {
  console.log("DB Connected");
  const msgCollection = db.collection('roomcontents')
  const changeStream = msgCollection.watch();
  
  changeStream.on("change", (change) => {
    console.log(change);
    if(change.operationType === 'insert' ){
      const roomDetails = change.fullDocument;
      pusher.trigger('rooms', 'created', {
        roomname: roomDetails.roomname,
        _id: roomDetails._id,
        photoIcon: roomDetails.photoIcon,
    });
    } else if(change.operationType === 'update' ){ 
      const messageDetails = change.updateDescription.updatedFields;
      let message = {};
      for(let key in messageDetails){
        if(key.includes("roomchat")) {
          message = messageDetails[key];
          pusher.trigger('room', 'inserted' ,{
            roomID: change.documentKey._id,
            email:message.email,
            message: message.message,
            name: message.name,
            timestamp: message.timestamp,
            received: message.received
          });
          break;
        }
      }
      
    } else if (change.operationType === 'delete') {
      const roomDetails = change.documentKey;
      pusher.trigger('rooms', 'deleted', {
        roomname: roomDetails.roomname,
        _id: roomDetails._id,
      });
    } else {
      console.log("Error triggering Pusher");
    }
  })
  
});

// ??????


// api routes
app.get('/', (req, res) => res.status(200).send("Hello World"))

app.post('/messages/new/:id', (req, res) => {
  const msg = req.body;
  Messages.findOne({"_id":req.params.id}).then(room => {
    room.roomchat.push(msg)
    room.save()
    res.status(201).send(room)
  }).catch(err => {
    res.status(500).send(err)
  })
})

app.get('/messages/sync/:id', (req, res) => {
    Messages.findOne({"_id":req.params.id}).then(room => {
      res.status(201).send(room.roomchat)
    }).catch(err => {
      res.status(500).send(err)
    })
})

app.post('/rooms/new', (req, res) => {
  const dbRoom = {
    roomname: req.body.roomname,
    photoIcon: req.body.photoIcon,
    roomchat:[]
  }

  Messages.create(dbRoom, (err, data) => {
    if(err) {
      res.status(500).send(err)
    }else{
      res.status(201).send(data)
    }
  })
});

app.get('/rooms/sync', (req, res) => {
  Messages.find({} ,{roomname:1, photoIcon:1}).then(rooms => {
    res.json(rooms);
  }).catch(err => {
    res.status(500).send(err);
  })
} );


app.get('/rooms/delete/:id', (req, res) => {
  Messages.findByIdAndDelete(req.params.id).then(() => {
    res.status(201).send("Deleted")
  }).catch(err => {
    res.status(500).send(err);
  })
}) 


//listen
app.listen(port, ()=> console.log(`Listenign on Localhost:${port}`));