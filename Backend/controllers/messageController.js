import Message from "../models/Message.js";
import User from "../models/User.js";
import cloudinary from "../lib/cloudinary.js";
import { io, userSocketMap } from "../server.js";


// get users for sidebar except the current user
export const getUsersForSidebar = async (req, res) => {
    try {
        const userId = req.user._id; // Get the current user's ID from the request
        const filteredUsers = await User.find({_id:{ $ne: userId }}).select("-password");
        
        const unseenmessages = {};
        const promises = filteredUsers.map(async (user) => {
            const messages = await Message.find({
                senderId: user._id,
                receiverId: userId,
                seen: false
            })
            if (messages.length > 0) {
                unseenmessages[user._id] = messages.length;
            }
        })
        await Promise.all(promises);
        res.json({
            success: true,
            users: filteredUsers,
            unseenmessages
        });
        
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
        
    }


}

export const getAllMessages = async (req, res) => {
    try {
        const { id: selectedUserId } = req.params; // Get the selected user ID from the request parameters
        const myId = req.user._id; // Get the current user's ID from the request
        
        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: selectedUserId },
                { senderId: selectedUserId, receiverId: myId }
            ]
        })
        await Message.updateMany(
            { senderId: selectedUserId, receiverId: myId},
            { seen: true } 
        );  
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
        
    }
}

// api to mark all messages as seen
export const markMessagesAsSeen = async (req, res) => {
    try {
        const { id} = req.params;
        await Message.findByIdAndUpdate(
            id,
            {seen: true},
        );
        res.json({ success: true, message: "Messages marked as seen" });
        
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
        
    }
}

// send message to selecteduser 
export const sendMessage =async (req, res) =>{
    try {
        const { text, image } = req.body; 
        const selectedUserId = req.params.id; 
        const senderId = req.user._id; 

        let imageUrl = null;
        if (image) {
            // Assuming you have a function to upload the image and get the URL
            const uploadImage = await cloudinary.uploader.upload(image);
            imageUrl = uploadImage.secure_url;
        }
        
        const newMessage = await Message.create({
            senderId,
            receiverId: selectedUserId,
            text,
            image: imageUrl
        });

        // Emit the new message to the  receiver
   
        const receiverSocketId = userSocketMap[selectedUserId];
        if(receiverSocketId){
            io.to(receiverSocketId).emit('newMessage', newMessage);
        }
    

        res.json({
            success: true,
            message: "Message sent successfully",
            newMessage
        });
    } catch (error) {
        console.error(error.message);
        return res.json({ success: false, message: error.message });
        
    }
}


