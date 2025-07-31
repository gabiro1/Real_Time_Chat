import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./authContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [message, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [unSeenMessages, setUnSeenMessages] = useState({});

  const { socket, axios } = useContext(AuthContext);

  // Get all chat users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.users);
        setUnSeenMessages(data.unSeenMessages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Get messages for a selected user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Send a new message
  const sendMessage = async (messageData) => {
    try {
      const {data} = await axios.post(`/api/messages/send/${selectedUser._id}`,messageData);
      if (data.success) {
        setMessages((prevMessages) => [...prevMessages, data.newMessage]);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // Listen for incoming messages via socket
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prevMessages) => [...prevMessages, newMessage]);

        // Mark as seen in backend
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        // Update unseen message count
        setUnSeenMessages((prevUnSeenMessages) => ({
          ...prevUnSeenMessages,
          [newMessage.senderId]: prevUnSeenMessages[newMessage.senderId]
            ? prevUnSeenMessages[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // Stop listening to incoming messages
  const unSubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unSubscribeFromMessages();
  }, [socket, selectedUser]);

  const value = {
    message,
    users,
    selectedUser,
    getUsers,
    setMessages,
    sendMessage,
    setSelectedUser,
    unSeenMessages,
    setUnSeenMessages,
    getMessages,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
};
