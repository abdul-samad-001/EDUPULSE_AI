import { useState, useEffect } from "react";
import profileService from "../services/profileService";

import Avatar from "../components/profile/Avatar";
import ProfileForm from "../components/profile/ProfileForm";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const data = await profileService.getProfile();
        if (isMounted) {
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleProfileSave = async (updatedFields) => {
    try {
      setMessage(null);

      const data = await profileService.updateProfile(
        updatedFields
      );

      setProfile(data);

      localStorage.setItem(
        "user",
        JSON.stringify(data)
      );

      setMessage({
        type: "success",
        text: "Profile updated successfully.",
      });
    } catch (err) {
      console.error(err);

      setMessage({
        type: "error",
        text: "Failed to update profile.",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[70vh]">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>

          <h2 className="text-xl font-semibold">
            Loading Profile...
          </h2>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">

      <div className="bg-white rounded-xl shadow border p-8">

        <div className="flex flex-col items-center border-b pb-6">

          <Avatar
            name={profile?.name}
            size="h-24 w-24"
          />

          <h1 className="text-3xl font-bold mt-4">
            {profile?.name}
          </h1>

          <p className="text-gray-500">
            {profile?.email}
          </p>

        </div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              message.type === "success"
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        <div className="mt-8">
          <ProfileForm
            initialData={profile}
            onSave={handleProfileSave}
          />
        </div>

      </div>

    </div>
  );
}

export default Profile;