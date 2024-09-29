'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface User {
  id: number;
  name: string;
  email: string;
  createdAt: Date;
  deleteId: number;
}

interface PaginationProps {
  total: number;
  limit: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

interface NewUser {
  name: string;
  email: string;
  createdAt: Date;
}

export default function Home() {
  const [users, setUsers] = useState<User[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [showAddForm, setShowAddForm] = useState(false);


  const router = useRouter();
  const handleNavigateToUserProfile = (userId: number) => {
    console.log('Navigating to user profile with ID:', userId);
    router.push(`/page/UserProfile?userId=${userId}`);
  };

  const [newUser, setNewUser] = useState<NewUser>({
    name: '',
    email: '',
    createdAt: new Date(),
  });

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      try {
        console.log('Fetching users...');
        const response = await fetch(`/api/users?offset=${(currentPage - 1) * 10}`);
        console.log('Response received:', response);
        const data = await response.json();
        console.log('Parsed data:', data);
        setUsers(data.users || []);
        console.log('Updated users:', users);
        setTotal(data.totalCount);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, [currentPage]); 

 

  function Pagination({ total, limit, currentPage, onPageChange }: PaginationProps) {
    const totalPages = Math.ceil(total / limit);
    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  
    return (
      <nav aria-label="Pagination" className="mt-6">
        <ul className="flex space-x-2">
          <li>
            <button 
              disabled={currentPage === 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="px-4 py-2 rounded hover:bg-gray-100 transition-colors duration-200 text-center"
            >
              Prev
            </button>
          </li>
          {pages.map((page) => (
            <li key={page}>
              <button 
                onClick={() => onPageChange(page)}
                className={`px-4 py-2 rounded hover:bg-gray-100 transition-colors duration-200 text-center ${
                  page === currentPage ? 'bg-blue-500 text-white' : ''
                }`}
              >
                {page}
              </button>
            </li>
          ))}
          <li>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="px-4 py-2 rounded hover:bg-gray-100 transition-colors duration-colors duration-200 text-center"
            >
              Next
            </button>
          </li>
        </ul>
      </nav>
    );
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleAddUser = () => {
    setShowAddForm(true);
  };


  const handleSubmitAddUser = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!newUser.name || !newUser.email) {
      alert('Please fill in both name and email');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch('/api/route', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([newUser]), // Note: We're sending an array of users
      });
      
      if (response.ok) {
        const refreshedData = await fetch(`/api/users?offset=${(currentPage - 1) * 10}`);
        const refreshedUsers = await refreshedData.json();
        setUsers(refreshedUsers.users || []);
        setTotal(refreshedUsers.totalCount);
        alert('User successfully added!');
        setShowAddForm(false);
        setNewUser({
          name: '',
          email: '',
          createdAt: new Date()
        });
      } else {
        const errorMessage = await response.text();
        alert(`Failed to add user: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error adding user:', error);
      alert('An error occurred while adding the user.');
    } finally {
      setLoading(false);
    }
  };

const handleDelete = async (userId: number) => {
  const confirm = window.confirm(`Are you sure you want to delete user ID ${userId}?`);
  if (confirm) {
    try {
      const response = await fetch('/api/delete-user', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId }),
      });

      if (response.ok) {
        // Refresh the list of users
        const refreshResponse = await fetch(`/api/users?offset=${(currentPage - 1) * 10}`);
        const refreshedData = await refreshResponse.json();
        setUsers(refreshedData.users || []);
        setTotal(refreshedData.totalCount);
        alert('User successfully deleted!');
      } else {
        const errorMessage = await response.text();
        alert(`Failed to delete user: ${errorMessage}`);
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('An error occurred while deleting the user.');
    }
  }
};

return (
  <div className="container mx-auto px-4 py-8">
    <div className="max-w-4xl mx-auto">
      <h1 className="text-4xl font-extrabold text-center mb-8 text-primary-600">
        All Users
      </h1>
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 animate-spin" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-2 6m-9-14.1a11 11 0 011.882 3.391a10 10 0 01-.619 3.638c-.091 -.083 -.09-.07 -.283-.288L7.651 11.560a4.6 4.6 0 00-.563 1.047Z" />
              </svg>
              <span className="ml-4">Loading...</span>
            </div>
          ) : users.length === 0 ? (
            <div className="flex justify-center items-center h-64">
              <div className="flex-shrink-0 w-16 h-16 rounded-full bg-gray-200"></div>
              <h3 className="text-xl font-medium mt-4 text-gray-600">No results found</h3>
            </div>
          ) : (
            <>
              <div className="flex justify-between mb-4">
                <button 
                  onClick={handleAddUser} 
                  className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-l-lg"
                >
                  Add User
                </button>
                <Pagination
                  total={total}
                  limit={10}
                  currentPage={currentPage}
                  onPageChange={handlePageChange}
                  className="flex-grow"
                />
              </div>

              {showAddForm && (
                <form onSubmit={(e) => handleSubmitAddUser(e)} className="mb-4">
                  <div className="flex flex-col space-y-4">
                    <label htmlFor="name" className="text-sm font-medium mb-1">Name:</label>
                    <input
                      type="text"
                      id="name"
                      value={newUser.name}
                      onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                      className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <label htmlFor="email" className="text-sm font-medium mb-1">Email:</label>
                    <input
                      type="email"
                      id="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                      className="px-2 py-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    
                    <button type="submit" className="bg-primary-500 hover:bg-primary-600 text-white font-bold py-2 px-4 rounded-r-lg">
                      Add User
                    </button>
                  </div>
                </form>
              )}

              <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden mt-6">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user, index) => (
                    <tr key={user.id} className={` ${index % 2 === 0 ? 'bg-gray-50' : ''}`}>
                      <td className="px-4 py-2">{user.name}</td>
                      <td className="px-4 py-2 flex justify-end">
                        <button
                          onClick={() => handleNavigateToUserProfile(user.id)}
                          className="px-4 py-2 ml-2 rounded bg-green-500 text-white transition-colors duration-200"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="px-4 py-2 ml-2 rounded bg-red-500 text-white transition-colors duration-200"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          )}
        </div>
      </div>
    </div>
  </div>
);
}
