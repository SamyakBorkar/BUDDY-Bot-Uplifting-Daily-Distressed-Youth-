import React from "react";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user } = useAuth();
  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-xl p-8 rounded-2xl shadow-2xl border border-purple-500/20">
        <div className="text-center mb-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            👤
          </div>
          <h2 className="text-3xl font-bold text-white mb-2">Your Profile</h2>
          <p className="text-gray-400">Manage your account information</p>
        </div>
        
        <div className="space-y-6">
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2">Full Name</label>
            <p className="text-xl text-white font-semibold">{user?.name || "Not provided"}</p>
          </div>
          
          <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
            <label className="block text-sm font-medium text-gray-400 mb-2">Email Address</label>
            <p className="text-xl text-white font-semibold">{user?.email || "Not provided"}</p>
          </div>
          
          {user?.reg_no && (
            <div className="bg-gray-900/50 p-6 rounded-xl border border-gray-700">
              <label className="block text-sm font-medium text-gray-400 mb-2">Registration Number</label>
              <p className="text-xl text-white font-semibold">{user.reg_no}</p>
            </div>
          )}

          <div className="pt-6 border-t border-gray-700">
            <p className="text-sm text-gray-500 text-center">
              Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
