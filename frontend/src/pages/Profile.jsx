import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Settings, History, Award, Edit } from 'lucide-react';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    interviewsCompleted: 0,
    averageScore: 0,
  }));

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/auth');
          return;
        }

        // Use the stored user data if available
        const storedData = localStorage.getItem("userData");
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          setUserData(prevData => ({
            ...prevData,
            name: parsedData.name || prevData.name,
            email: parsedData.email || prevData.email
          }));
        }

        // Then fetch full user data from backend
        try {
          const response = await fetch('http://localhost:5000/api/user/profile', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const data = await response.json();
            setUserData(prevData => ({
              ...prevData,
              name: data.name || prevData.name,
              email: data.email || prevData.email,
              interviewsCompleted: data.interviewsCompleted || prevData.interviewsCompleted,
              averageScore: data.averageScore || prevData.averageScore
            }));
          } else if (response.status === 401) {
            // Only remove token and redirect on unauthorized response
            localStorage.removeItem('token');
            navigate('/auth');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          // Keep the default data if there's an error
          // Don't redirect on network errors
        }
      } catch (error) {
        console.error('Error in fetchUserData:', error);
      }
    };

    fetchUserData();
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-white pt-20 pb-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-gray-800 rounded-lg p-4 sm:p-6 mb-6 shadow-lg border border-gray-700">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
              <User size={40} className="text-white sm:h-12 sm:w-12" />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-center sm:items-start sm:justify-between gap-3 sm:gap-0">
                <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">{userData.name}</h1>
                <button className="flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors text-sm sm:text-base">
                  <Edit size={16} />
                  Edit Profile
                </button>
              </div>
              <p className="text-gray-400 mt-1 text-center sm:text-left">{userData.email}</p>
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 mt-4">
                <div className="text-center sm:text-left">
                  <p className="text-gray-400 text-sm">Interviews Completed</p>
                  <p className="text-xl font-semibold">{userData.interviewsCompleted}</p>
                </div>
                <div className="text-center sm:text-left">
                  <p className="text-gray-400 text-sm">Average Score</p>
                  <p className="text-xl font-semibold">{userData.averageScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Interview History */}
        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <History size={20} className="text-blue-400 sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl font-semibold">Recent Interviews</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 bg-gray-700 rounded-lg gap-2 sm:gap-0">
                  <div>
                    <p className="font-medium text-sm sm:text-base">Frontend Developer Interview</p>
                    <p className="text-xs sm:text-sm text-gray-400">Completed on Sept {15 - i}, 2025</p>
                  </div>
                  <span className="px-2 sm:px-3 py-1 bg-blue-500 rounded-full text-xs sm:text-sm whitespace-nowrap">Score: 85%</span>
                </div>
              ))}
              <button className="w-full text-center text-blue-400 hover:text-blue-300 text-xs sm:text-sm py-2">
                View All History
              </button>
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-gray-800 rounded-lg p-4 sm:p-6 shadow-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Award size={20} className="text-purple-400 sm:w-6 sm:h-6" />
              <h2 className="text-lg sm:text-xl font-semibold">Performance</h2>
            </div>
            <div className="space-y-3 sm:space-y-4">
              <div className="p-3 sm:p-4 bg-gray-700 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-400">Communication Skills</p>
                <div className="w-full bg-gray-600 rounded-full h-1.5 sm:h-2 mt-2">
                  <div className="bg-purple-500 h-1.5 sm:h-2 rounded-full" style={{ width: '85%' }}></div>
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gray-700 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-400">Technical Knowledge</p>
                <div className="w-full bg-gray-600 rounded-full h-1.5 sm:h-2 mt-2">
                  <div className="bg-purple-500 h-1.5 sm:h-2 rounded-full" style={{ width: '78%' }}></div>
                </div>
              </div>
              <div className="p-3 sm:p-4 bg-gray-700 rounded-lg">
                <p className="text-xs sm:text-sm text-gray-400">Problem Solving</p>
                <div className="w-full bg-gray-600 rounded-full h-1.5 sm:h-2 mt-2">
                  <div className="bg-purple-500 h-1.5 sm:h-2 rounded-full" style={{ width: '92%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Settings Section */}
          <div className="md:col-span-2 bg-gray-800 rounded-lg p-6 shadow-lg border border-gray-700">
            <div className="flex items-center gap-3 mb-4">
              <Settings size={24} className="text-gray-400" />
              <h2 className="text-xl font-semibold">Settings</h2>
            </div>
            <div className="grid gap-4">
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Email Notifications</p>
                  <p className="text-sm text-gray-400">Receive updates about your interviews</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
              <div className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-400">Toggle dark/light theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}