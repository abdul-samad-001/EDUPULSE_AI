import { useState, useEffect } from "react";
import profileService from "../services/profileService";
import Avatar from "../components/profile/Avatar";
import ProfileForm from "../components/profile/ProfileForm";

function Profile() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    profileService.getProfile()
      .then((data) => {
        setProfile(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const handleProfileSave = async (updatedFields) => {
    try {
      setMessage(null);
      const data = await profileService.updateProfile(updatedFields);
      setProfile(data);
      // Synchronize modified local session user profiles
      localStorage.setItem("user", JSON.stringify(data));
      setMessage({ type: "success", text: "Profile parameters synchronized successfully." });
    } catch (err) {
        console.error(err);
        setMessage({ type: "error", text: "Failed to update profile records upstream." });
    }
  };

  if (loading) return <div className="p-10 text-center text-slate-500 font-medium">Syncing profile instance...</div>;

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-xl mx-auto bg-white rounded-xl border border-slate-200 p-6 md:p-8 shadow-sm space-y-6">
        <div className="flex flex-col items-center border-b border-slate-100 pb-6 text-center">
          <Avatar name={profile?.name} size="h-24 w-24" />
          <h1 className="text-2xl font-bold text-slate-900 mt-4">{profile?.name || "Student Profile"}</h1>
          <p className="text-sm text-slate-500">{profile?.email}</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm font-medium ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
            {message.text}
          </div>
        )}

        <ProfileForm initialData={profile} onSave={handleProfileSave} />

      </div>
    </div>
  );
}

export default Profile;