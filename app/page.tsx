import { Metadata } from "next";
import { useState, useEffect } from "react";
import App from "@/components/pages/app";
import { APP_URL } from "@/lib/constants";

const frame = {
  version: "next",
  imageUrl: `${APP_URL}/images/feed.png`,
  button: {
    title: "Track Monad XP",
    action: {
      type: "launch_frame",
      name: "Monad XP Tracker",
      url: APP_URL,
      splashImageUrl: `${APP_URL}/images/splash.png`,
      splashBackgroundColor: "#f7f7f7",
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Monad XP Tracker",
    openGraph: {
      title: "Monad XP Tracker",
      description: "Track and rank users in the Monad ecosystem based on XP.",
    },
    other: {
      "fc:frame": JSON.stringify(frame),
    },
  };
}

const MonadXPTracker = () => {
  const [users, setUsers] = useState([]);
  const [rank, setRank] = useState(null);

  // Fetch Monad-related posts (Farcaster API)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("https://api.farcaster.xyz/v1/users/monad"); // Replace with actual API
        const data = await response.json();
        setUsers(data.users); // assuming the API returns users in this format
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    fetchData();
  }, []);

  const calculateXP = (user) => {
    // Calculate XP: number of posts containing 'monad'
    return user.posts.filter(post => post.includes("monad")).length;
  };

  const generateRankMessage = (user) => {
    const xp = calculateXP(user);
    return `${user.username} is ranked with ${xp} XP in the Monad ecosystem!`;
  };

  return (
    <div>
      <h1>Monad XP Tracker</h1>
      <h2>Your Monad Rank:</h2>
      {rank && <p>{generateRankMessage(rank)}</p>}
      
      <h3>Top Monad Users:</h3>
      <ul>
        {users.map((user) => (
          <li key={user.id}>
            {user.username} - XP: {calculateXP(user)}
          </li>
        ))}
      </ul>

      <button onClick={() => alert(generateRankMessage(rank))}>
        Post My Rank
      </button>
    </div>
  );
};

export default MonadXPTracker;
