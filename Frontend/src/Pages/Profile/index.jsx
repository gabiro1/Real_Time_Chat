import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import assets from "../../assets/assets";
import { AuthContext } from "../../context/authContext";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [bio, setBio] = useState(authUser?.bio || "");
  const [name, setName] = useState(authUser?.fullname || "");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
      console.log("authUser changed:", authUser);
    if (authUser) {
      setName(authUser.fullname || "Jovial Fleuron");
      setBio(authUser.bio || "A passionate developer with a love for coding and coffee.");
    }
  }, [authUser]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!selectedImage) {
        await updateProfile({ fullname: name, bio });
      } else {
        const reader = new FileReader();
        reader.readAsDataURL(selectedImage);
        reader.onload = async () => {
          const base64Image = reader.result;
          await updateProfile({ fullname: name, bio, profilePicture: base64Image });
          navigate("/");
        };
        return; // stop here; navigate is handled in onload
      }

      navigate("/");
    } catch (error) {
      console.error("Profile update failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-cover bg-no-repeat flex items-center justify-center p-4">
      <div className="w-5/6 max-w-2xl backdrop-blur-2xl text-gray-500 border-2 border-gray-500 flex items-center justify-center max-sm:flex-col-reverse rounded-lg">
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 p-10 flex-1">
          <h3 className="text-lg text-white font-semibold">Profile Details</h3>

          <label htmlFor="avatar" className="flex items-center gap-3 cursor-pointer">
            <input
              onChange={(e) => setSelectedImage(e.target.files[0])}
              type="file"
              id="avatar"
              accept=".png, .jpg, .jpeg"
              hidden
            />
            <img
              src={
                selectedImage
                  ? URL.createObjectURL(selectedImage)
                  : authUser?.profilePicture || assets.avatar_icon
              }
              alt="Upload avatar"
              className={`w-12 h-12 object-cover ${selectedImage && "rounded-full"}`}
            />
            <span className="text-sm text-white">Upload Profile Picture</span>
          </label>

          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Your Fullname"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
          />

          <textarea
            onChange={(e) => setBio(e.target.value)}
            value={bio}
            cols="30"
            rows="5"
            className="p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500"
            placeholder="Bio"
          ></textarea>

          <button
            type="submit"
            className="py-3 bg-gradient-to-r from-purple-400 to-violet-600 text-white rounded-md cursor-pointer disabled:opacity-50"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </button>
        </form>

        <img
          className={`max-w-[11rem] aspect-square rounded-full mx-5 max-sm:mt-10 ${selectedImage ? "rounded-full" : ""}`}
          src={assets.logo_icon}
          alt="Brand logo"
        />
      </div>
    </div>
  );
};

export default ProfilePage;
