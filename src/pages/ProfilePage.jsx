import { useState, useEffect } from "react";
import API from "../api";

export default function ProfilePage() {
  const [profile, setProfile] = useState({ name: "", email: "" });

  useEffect(() => {
    API.get("/user/profile").then((res) => setProfile(res.data));
  }, []);

  const handleChange = (e) =>
    setProfile({ ...profile, [e.target.name]: e.target.value });

  const handleSave = async () => {
    try {
      await API.put("/user/profile", profile);
      alert("Profile updated");
    } catch (error) {
      console.error(error);
      alert("Update failed");
    }
  };

  return (
    <div>
      <h2>Profile</h2>
      <input
        name="name"
        value={profile.name}
        onChange={handleChange}
        placeholder="Full name"
      />
      <input
        name="email"
        value={profile.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <button onClick={handleSave}>Save</button>
    </div>
  );
}
        