import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow">
      <h2 className="text-xl mb-4">Your Profile</h2>
      <div><strong>Name:</strong> {user?.name}</div>
      <div><strong>Email:</strong> {user?.email}</div>
    </div>
  );
}
