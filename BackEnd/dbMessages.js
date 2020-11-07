import mongoose from 'mongoose'

const whatsappMessageSchema = mongoose.Schema({
  message: String,
  name: String,
  email: String,
  timestamp: Date,
  received:Boolean
});

const whatsappRoomSchema = mongoose.Schema({
  roomname: String,
  photoIcon: String,
  roomchat: [whatsappMessageSchema],
})

//Collection
export default mongoose.model('roomcontents', whatsappRoomSchema);