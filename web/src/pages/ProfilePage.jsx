import { Camera, Mail, User } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore"
import { useEffect, useState } from "react";

const ProfilePage = () => {
  const { authUser, isUpdatingProfile, updateProfile } = useAuthStore();
  const [bioValue, setBioValue] = useState("");

  useEffect(() => {
    setBioValue(authUser?.bio ?? "");
  }, [authUser?.bio]);
  
  const handleImageUpload = async (e) => {
    const formData = new FormData();
    formData.append("profilePic", e.target.files[0]);

    await updateProfile(formData);
  };

  const handleBioUpload = async (e) => {
    setBioValue(e.target.value);
  };

  const handleBioSubmit = async (e) => {
    // Return if the same bio is typed
    if (bioValue == authUser?.bio) return;

    const formData = new FormData();
    formData.append("bio", bioValue);

    await updateProfile(formData);
  };

  return (
    <div className="h-screen pt-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-base-300 rounded-xl p-6 space-y-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold">Profile</h1>
            <p className="mt-2">Your profile information</p>
          </div>

          {/* Avater */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={authUser.profilePic.url || "/avatar.png"}
                alt="Profile Picture"
                className="size-32 rounded-full object-cover border-4 "
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-5 h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          {/*User Info*/}
          <div className="space-y-6">
            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <User className="size-4" />
                <span>Username</span>
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.username}</p>
            </div>

            <div className="space-y-1.5">
              <div className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="size-4" />
                <span>Email Address</span>
              </div>
              <p className="px-4 py-2.5 bg-base-200 rounded-lg border">{authUser?.email}</p>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="bio" className="text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="size-4" />
                <span>Bio</span>
              </label>
              <input 
                type="text"
                id="bio" 
                className="px-4 py-2.5 bg-base-200 rounded-lg border w-full"
                value={bioValue}
                onChange={handleBioUpload}
                onBlur={handleBioSubmit}
                disabled={isUpdatingProfile}
              />
            </div>

            <div className="mt-6 bg-base-300 rounded-xl p-6">
              <h2 className="text-large font-medium mb-4">Account Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                  <span>Member since: </span>
                  <span>{authUser.createdAt?.split("T")[0]}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span>Account Status </span>
                  <span className="text-green-500">{authUser.status ?? "Active"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage