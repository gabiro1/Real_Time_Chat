import React, { useContext, useState } from 'react';
import assets from '../../assets/assets';
import { AuthContext } from '../../context/authContext';

const LoginPage = () => {
  const [currentState, setCurrentState] = useState('Sign Up');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [bio, setBio] = useState('');
  const [isDataSubmitted, setDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (e) => {
    e.preventDefault();

    if (currentState === 'Sign Up' && !isDataSubmitted) {
      setDataSubmitted(true);
      return;
    }

    login(currentState==='Sign Up' ? 'signup':'login', {fullName,email, password,bio})

    // Map frontend fields to backend expected format
    const payload =
      currentState === 'Sign Up'
        ? { name: fullName, email, password, bio }
        : { email, password };

    login(currentState === 'Sign Up' ? 'signup' : 'login', payload);
  };

  return (
    <div className="min-h-screen bg-cover bg-center flex items-center justify-center gap-4 sm:justify-evenly max-sm:flex-col backdrop-blur-2xl">
      {/* left  */}
      <img src={assets.logo_big} alt="" style={{ width: 'min(30vw, 250px)' }} />

      {/* right  */}
      <form
        onSubmit={onSubmitHandler}
        className="border-2 bg-white/8 text-white border-gray-500 p-6 flex flex-col gap-6 rounded-lg shadow-lg"
      >
        <h2 className="font-medium text-2xl justify-between items-center">
          {currentState}
          {isDataSubmitted && (
            <img
              onClick={() => {
                setDataSubmitted(false);
              }}
              src={assets.arrow_icon}
              alt=""
              className="w-5 cursor-pointer inline ml-2"
            />
          )}
        </h2>

        {currentState === 'Sign Up' && !isDataSubmitted && (
          <input
            onChange={(e) => setFullName(e.target.value)}
            value={fullName}
            type="text"
            className="p-2 border border-gray-500 rounded-md focus:outline-none"
            placeholder="Full Name"
            required
          />
        )}

        {!isDataSubmitted && (
          <>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              type="email"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Email Address"
              required
            />

            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              type="password"
              className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              placeholder="Password"
              required
            />
          </>
        )}

        {currentState === 'Sign Up' && isDataSubmitted && (
          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            cols="30"
            rows="5"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            placeholder="Bio"
            required
          ></textarea>
        )}

        <button
          type="submit"
          className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer"
        >
          {currentState === 'Sign Up' ? 'Create Account' : 'Login'}
        </button>

        <div className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" className="w-4 h-4 cursor-pointer" />
          <label>I agree to the terms and conditions</label>
        </div>

        <div className="flex flex-col gap-2">
          {currentState === 'Sign Up' ? (
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrentState('login');
                  setDataSubmitted(false);
                }}
              >
                Login Here
              </span>
            </p>
          ) : (
            <p className="text-sm text-gray-500">
              Create an Account{' '}
              <span
                className="font-medium text-violet-500 cursor-pointer"
                onClick={() => {
                  setCurrentState('Sign Up');
                  setDataSubmitted(false);
                }}
              >
                Click Here
              </span>
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
