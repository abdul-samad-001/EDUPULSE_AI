import { useState, useEffect } from "react";
import profileService from "../services/profileService";

import Avatar from "../components/profile/Avatar";
import ProfileForm from "../components/profile/ProfileForm";

import { SectionHeader, Card, LoadingSpinner } from "../components/ui";
import { User } from "lucide-react";

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

      const data = await profileService.updateProfile(updatedFields);

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
        <LoadingSpinner size="lg" label="Loading Profile..." />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <SectionHeader
        title="User Profile 👤"
        subtitle="Manage your personal information, avatar, and account settings."
        icon={User}
      />

      <Card className="p-8">
        <div className="flex flex-col items-center border-b border-dark-border pb-6">
          <Avatar
            name={profile?.name}
            size="h-24 w-24"
          />

          <h2 className="text-2xl font-bold text-dark-text mt-4">
            {profile?.name}
          </h2>

          <p className="text-sm text-dark-muted mt-1">
            {profile?.email}
          </p>
        </div>

        {message && (
          <div
            className={`mt-6 p-4 rounded-xl text-sm font-medium border ${
              message.type === "success"
                ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/10 border-rose-500/30 text-rose-400"
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
      </Card>
    </div>
  );
}

export default Profile;