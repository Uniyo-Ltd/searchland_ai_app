// pages/page/[userId].tsx
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

export default function UserProfile() {
  const router = useRouter();
  const { userId } = router.query;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log('useEffect called');
    const fetchUser = async () => {
      setLoading(true);
      console.log('Fetching user with ID:', userId);
      
      if (userId && !isNaN(Number(userId))) {
        try {
          const res = await fetch(`/api/page/${userId}`);
          console.log('Response status:', res.status);
          
          if (!res.ok) {
            console.error(`HTTP error! status: ${res.status}`);
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          
          const data = await res.json();
          console.log('Received raw data:', data);
          
          if (!data || typeof data !== 'object') {
            console.error('Invalid data received from API');
            throw new Error('Invalid data received from API');
          }
          
          setUser(data);
        } catch (error) {
          console.error('Error fetching user:', error);
          setUser(null); // Set user to null if there's an error
        }
      } else {
        console.log('Invalid userId:', userId);
        setUser(null); // Set user to null for invalid userId
      }
      
      setLoading(false);
    };

    fetchUser();
  }, [userId]);

  console.log('Rendering component', { loading, user });

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    console.log('User not found');
    console.log(user)
    return <div>User not found</div>;
  }

  return (
    <div>
      <h1>User Profile</h1>
      <p>ID: {user.id}</p>
      <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Created At: {new Date(user.createdAt).toLocaleDateString()}</p>
    </div>
  );
}