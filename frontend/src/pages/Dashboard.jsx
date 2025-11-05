import React, { useEffect, useState } from "react";
import { getMoodLogs } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import MoodChart from "../components/MoodChart";

export default function Dashboard() {
  const { user } = useAuth();
  const [moods, setMoods] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await getMoodLogs(user._id);
      setMoods(data);
    };
    fetchData();
  }, [user]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Your Mood Dashboard</h2>
      <MoodChart data={moods} />
    </div>
  );
}
