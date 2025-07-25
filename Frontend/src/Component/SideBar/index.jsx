import React, { useContext, useEffect, useState } from 'react'
import assets from '../../assets/assets'
import { useNavigate } from 'react-router-dom'
import { ChatContext } from '../../context/ChatContext'
import { AuthContext } from '../../context/authContext'

const SideBar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    unSeenMessages,
    setUnSeenMessages,
  } = useContext(ChatContext)

  const { logout, onlineUsers } = useContext(AuthContext)
  const [input, setInput] = useState('')

  const navigate = useNavigate()

  // Fetch users when onlineUsers change
  useEffect(() => {
    getUsers()
  }, [onlineUsers])

  // Filter users based on search input
  const filteredUsers = input.length
    ? users.filter((user) =>
        user.fullName.toLowerCase().includes(input.toLowerCase())
      )
    : users

  return (
    <div
      className={`bg-[#8185B2]/10 h-full p-5 rounded-r-xl overflow-y-scroll text-white ${
        selectedUser ? 'max-md:hidden' : ''
      }`}
    >
      <div className='pb-5'>
        {/* Top Logo and Menu */}
        <div className='flex justify-between items-center'>
          <img src={assets.logo} alt='Logo' className='max-w-40' />
          <div className='relative py-2 group'>
            <img
              src={assets.menu_icon}
              alt='Menu'
              className='max-h-5 cursor-pointer'
            />
            <div className='absolute top-full right-0 z-20 w-32 p-5 rounded-md bg-[#282142] border border-gray-500 text-gray-100 hidden group-hover:block'>
              <p
                onClick={() => navigate('/profile')}
                className='cursor-pointer text-sm'
              >
                Edit Profile
              </p>
              <hr className='my-2 border-t border-gray-500' />
              <p
                onClick={() => logout()}
                className='cursor-pointer text-sm'
              >
                Logout
              </p>
            </div>
          </div>
        </div>

        {/* Search Input */}
        <div className='bg-[#282142] rounded-full flex items-center gap-2 py-3 px-4 mt-5'>
          <img src={assets.search_icon} alt='Search' className='w-3' />
          <input
            onChange={(e) => setInput(e.target.value)}
            type='text'
            className='bg-transparent border-none outline-none text-white text-xs placeholder-[#c8c8c8] flex-1'
            placeholder='Search User...'
          />
        </div>
      </div>

      {/* User List */}
      <div className='flex flex-col'>
        {filteredUsers.map((user) => (
          <div
            key={user._id || user.fullName}
            role='button'
            tabIndex={0}
            onClick={() => {
              setSelectedUser(user)
              setUnSeenMessages((prev) => ({
                ...prev,
                [user._id]: 0,
              }))
            }}
            className={`relative flex items-center gap-3 p-2 rounded hover:bg-[#282142] cursor-pointer ${
              selectedUser?._id === user._id ? 'bg-[#282142]/50' : ''
            }`}
          >
            <img
              src={user?.profilePic || assets.avatar_icon}
              alt='Profile'
              className='w-[35px] h-10 aspect-[1/1] rounded-full'
            />
            <div className='flex flex-col leading-5'>
              <p className='text-sm'>{user.fullName}</p>
              {onlineUsers.includes(user._id) ? (
                <span className='text-green-400 text-xs'>Online</span>
              ) : (
                <span className='text-xs text-neutral-400'>
                  Last seen 2 days ago
                </span>
              )}
            </div>

            {/* Unseen message count */}
            {unSeenMessages[user._id] > 0 && (
              <p className='absolute top-4 right-4 text-xs h-5 w-5 flex justify-center items-center rounded-full bg-violet-500/50'>
                {unSeenMessages[user._id]}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export default SideBar
