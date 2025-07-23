import React, { useContext, useEffect, useState } from 'react';
import assets from '../../assets/assets';
import { ChatContext } from '../../context/ChatContext';
import { AuthContext } from '../../context/authContext';

const RightSideBar = () => {
  const { selectedUser, message } = useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);
  const [msgImages, setMsgImages] = useState([]);

  useEffect(() => {
    setMsgImages(message.filter((msg) => msg.image).map((msg) => msg.image));
  }, [message]);

  return (
    selectedUser && (
      <div className={`bg-[#8185B2]/10 text-white w-[300px] max-w-sm max-md:w-full relative overflow-y-auto ${selectedUser ? 'max-md:hidden' : ''}`}>
        
        {/* User Info */}
        <div className='pt-16 flex flex-col items-center gap-2 text-xs font-light mx-auto'>
          <img
            src={selectedUser?.profilePic || assets.avatar_icon}
            alt="User avatar"
            className='w-20 aspect-[1/1] rounded-full'
          />
          <h1 className='px-10 text-xl font-medium mx-auto flex items-center gap-2'>
            {onlineUsers.includes(selectedUser._id) && (
              <span className='w-2 h-2 rounded-full bg-green-500'></span>
            )}
            {selectedUser.fullName}
          </h1>
          <p className='px-10 mx-auto'>{selectedUser.bio}</p>
        </div>

        <hr className='border-[#ffffff50] my-4' />

        {/* Media Section */}
        <div className='px-5 text-xs'>
          <p className='font-semibold mb-2'>Media</p>
          <div className='max-h-[200px] overflow-y-scroll grid grid-cols-2 gap-4 opacity-80 mb-6'>
            {msgImages.map((image, index) =>
              image ? (
                <div key={index} onClick={() => window.open(image)} className='cursor-pointer rounded'>
                  <img src={image} className='w-full h-full rounded-md object-cover' alt={`media-${index}`} />
                </div>
              ) : null
            )}
          </div>
        </div>

        {/* Logout Button */}
        <div className='flex justify-center mb-6'>
          <button 
            onClick={() => logout()}
            className='bg-gradient-to-r from-purple-400 to-violet-600 text-white text-sm font-light py-2 px-10 rounded-full cursor-pointer mt-3'
          >
            Logout
          </button>
        </div>
      </div>
    )
  );
};

export default RightSideBar;
