import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';

interface UserProfileProps {}

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
}

const UserProfile: React.FC<UserProfileProps> = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const userId = router.query.userId;


  console.log('router.query:', router.query);

  useEffect(() => {
    console.log('userId:', userId);
    const fetchUser = async () => {
      if (!userId || isNaN(Number(userId))) {
        console.error('Invalid userId:', userId);
        return;
      }
      setLoading(true);
      try {
        const response = await fetch(`/api/page/${userId}?userId=${userId}`);
        const userData = await response.json();
        console.log('userData:', userData);
        setUser(userData);
      } catch (error) {
        console.error('Error fetching user:', error);
      } finally {
        setLoading(false);
      }
    };
    if (userId) {
      fetchUser();
    }
  }, [userId]);

  // ... (rest of the code remains the same)

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <div>User not found2</div>;
  }

  const handleBack = () => {
    router.push('/');
  };

 return (
  <div className="flex flex-col items-center justify-center h-screen">
  <div className="bg-white p-6 rounded-lg shadow-md w-1/2">
    <div className="flex justify-between mb-4">
      <h1 className="text-3xl font-bold">User Profile</h1>
      <button onClick={handleBack} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
        Back
      </button>
    </div>
       <div className="flex flex-col items-center">
         <img
           src="https://picsum.photos/200/300"
           alt="User Avatar"
           className="w-24 h-24 rounded-full mb-4"
         />
         <h2 className="text-2xl font-semibold mb-2">{user.name}</h2>
         <p className="text-gray-600 mb-2">ID: {user.id}</p>
         <p className="text-gray-600 mb-2">Email: {user.email}</p>
         <p className="text-gray-600 mb-2">
           Created At: {new Date(user.createdAt).toLocaleDateString()}
         </p>
       </div>
     </div>
   </div>
 );
};

export default UserProfile;