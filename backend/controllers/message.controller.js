import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
// import { getReceiverSocketId } from "../socket/socket.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async(req, res) => {
    try {
        const { message } = req.body;
        const { id: receiverID } = req.params;
        const senderID = req.user._id;

        let conversation = await Conversation.findOne({
            participants: { $all: [senderID, receiverID] },
        });

        if (!conversation) {
            conversation = await Conversation.create({
                participants: [senderID, receiverID],
            });
        }

        const newMessage = await Message({
            senderID,
            receiverID,
            message,
        });

        if(newMessage) {
            conversation.messages.push(newMessage._id);
            // await conversation.save();
        }
        // await conversation.save();
        // await newMessage.save();
        await Promise.all([conversation.save(), newMessage.save()]);

        const receiverSocketID = getReceiverSocketId(receiverID);
        if (receiverSocketID) {
            io.to(receiverSocketID).emit("newMessage", newMessage);
        }
        res.status(201).json(newMessage);

        // console.log("Message:", message);
        // console.log("User id:", id);
        // res.status(200).json({ message: "Message sent" });
    } catch (error) {
        console.error("Error in sendMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};

export const getMessages = async(req, res) => {
    try {
        const {id:userToChatID} = req.params;
        const senderID = req.user._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderID, userToChatID] },
        }).populate("messages");

        if (!conversation) return res.status(200).json([]);
        const messages = conversation.messages;

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error getMessage controller:", error.message);
        res.status(500).json({ error: "Internal Server Error" });
    }
};