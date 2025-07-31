import React, { useContext, useEffect, useState, useRef } from "react";
import assets from "../../assets/assets";
import { formatMessageDate } from "../../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/authContext";
import toast from "react-hot-toast";

const ChatContainer = () => {
  const {
    message,
    selectedUser,
    setSelectedUser,
    sendMessage,
    getMessages
  } = useContext(ChatContext);

  const { authUser, onlineUser } = useContext(AuthContext);
  const [input, setInput] = useState("");
  const scrollEnd = useRef(null);

  // Send text message
  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (input.trim() === "") return null;
    await sendMessage({ text: input.trim() });
    setInput("");
  };

  // Send image message
  const handleSendImage = async (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) {
      toast.error("Select an image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = async () => {
      await sendMessage({ image: reader.result });
      e.target.value = "";
    };
    reader.readAsDataURL(file);
  };

  // Load messages when a user is selected
  useEffect(() => {
    if (selectedUser) {
      getMessages(selectedUser._id);
    }
  }, [selectedUser]);

  // Auto scroll to bottom when messages change
  useEffect(() => {
    if (scrollEnd.current && message) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [message]);

  return selectedUser ? (
    <div className="h-full overflow-scroll relative backdrop-blur-lg">
      {/* Header */}
      <div className="flex items-center gap-3 py-3 mx-4 border-b border-stone-500">
        <img
          src={selectedUser.profilePic || assets.avatar_icon}
          className="w-8 rounded-full"
          alt="User"
        />
        <p className="flex-1 text-lg text-white flex items-center gap-2">
          {selectedUser.fullName}
          {onlineUser?.includes(selectedUser._id) && (
            <span className="w-2 h-2 rounded-full bg-green-500"></span>
          )}
        </p>
        <img
          onClick={() => setSelectedUser(null)}
          src={assets.arrow_icon}
          className="md:hidden max-w-7 cursor-pointer"
          alt="Back"
        />
        <img
          src={assets.help_icon}
          alt="Help"
          className="max-md:hidden max-w-5"
        />
      </div>

      {/* Chat Messages */}
      <div className="flex flex-col h-[calc(100%-120px)] overflow-y-scroll p-3 pb-6">
        {message.map((msg, index) => {
          const isMe = msg.senderId === authUser._id;
          return (
            <div
              key={index}
              className={`flex items-end gap-2 mb-5 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* Other user's avatar */}
              {!isMe && (
                <img
                  src={selectedUser.profilePic || assets.profile_martin}
                  alt="Sender"
                  className="w-7 h-7 rounded-full"
                />
              )}

              {/* Message bubble */}
              <div
                className={`max-w-[70%] text-sm ${
                  isMe ? "text-right" : "text-left"
                }`}
              >
                {msg.image ? (
                  <img
                    src={msg.image}
                    alt="Attachment"
                    className="max-w-[230px] border border-gray-700 rounded-lg"
                  />
                ) : (
                  <p
                    className={`p-2 rounded-lg break-words text-white ${
                      isMe
                        ? "bg-violet-500/30 rounded-br-none"
                        : "bg-[#1f1b38] rounded-bl-none"
                    }`}
                  >
                    {msg.text}
                  </p>
                )}
                <p className="text-gray-400 text-xs mt-1">
                  {formatMessageDate(msg.createdAt)}
                </p>
              </div>

              {/* My avatar */}
              {isMe && (
                <img
                  src={assets.avatar_icon}
                  alt="Me"
                  className="w-7 h-7 rounded-full"
                />
              )}
            </div>
          );
        })}
        <div ref={scrollEnd}></div>

        {/* Message input */}
        <div className="absolute bottom-0 left-0 right-0 flex items-center gap-3 p-3">
          <div className="flex-1 flex items-center bg-gray-100/12 rounded-full">
            <input
              type="text"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              onKeyDown={(e) => (e.key === "Enter" ? handleSendMessage(e) : null)}
              placeholder="Send a message"
              className="flex-1 text-sm p-3 pl-5 border-none rounded-lg outline-none text-white placeholder-gray-400"
              aria-label="Message Input"
            />
            <input
              onChange={handleSendImage}
              id="image"
              type="file"
              name="image"
              accept="image/png, image/jpeg"
              hidden
            />
            <label htmlFor="image">
              <img
                src={assets.gallery_icon}
                alt="Gallery Icon"
                className="w-5 mr-3.5 cursor-pointer"
              />
            </label>
          </div>
          <img
            onClick={handleSendMessage}
            src={assets.send_button}
            alt="Send Button"
            className="w-7 cursor-pointer"
          />
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-4 text-white/10 max-md:hidden">
      <img src={assets.logo_icon} className="max-w-16" alt="Logo" />
      <p className="text-lg font-medium text-white">Chat anytime, Anywhere</p>
    </div>
  );
};

export default ChatContainer;
