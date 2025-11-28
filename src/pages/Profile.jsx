import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { User, Settings, History, Award, Edit, X } from 'lucide-react';
import { useToast } from '../components/ToastProvider';

export default function Profile() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showEditPopup, setShowEditPopup] = useState(false);
  const { push } = useToast();

  const [userData, setUserData] = useState(() => ({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: user?.location || '',
    course: user?.course || '',
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

        const response = await fetch('http://localhost:5000/api/user/profile', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setUserData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            location: data.location || '',
            course: data.course || '',
            interviewsCompleted: data.interviewsCompleted || 0,
            averageScore: data.averageScore || 0,
          });
          // Update localStorage with fresh data
          localStorage.setItem('userData', JSON.stringify(data));
        } else if (response.status === 401) {
          localStorage.removeItem('token');
          navigate('/auth');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();

    const onAttemptsUpdated = () => fetchUserData();
    window.addEventListener('attempts-updated', onAttemptsUpdated);
    return () => window.removeEventListener('attempts-updated', onAttemptsUpdated);
  }, [navigate]);

  const handleProfileUpdate = async (updatedData) => {
  try {
    const token = localStorage.getItem('token');
    const res = await fetch('http://localhost:5000/api/user/profile', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedData),
    });

    if (res.ok) {
      const data = await res.json();
      setUserData(data);
      localStorage.setItem('userData', JSON.stringify(data));
      try { push('Profile updated successfully!', { type: 'success' }); } catch {}
    }
  } catch (err) {
    console.error('Error updating profile:', err);
    try { push('Failed to update profile.', { type: 'error' }); } catch {}
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white pt-20 pb-12">
      <div className="max-w-5xl mx-auto px-4">
        {/* 🧑 Profile Header */}
        <div className="backdrop-blur-md bg-gray-800/60 rounded-2xl p-6 sm:p-8 mb-10 shadow-xl border border-gray-700 hover:border-blue-500 transition-colors duration-300">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <User size={50} className="text-white" />
            </div>
            <div className="flex-1 w-full">
              <div className="flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                <h1 className="text-2xl sm:text-3xl font-bold text-center sm:text-left tracking-wide">
                  {userData.name}
                </h1>
                <button
                  onClick={() => setShowEditPopup(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:scale-105 transition-transform shadow-md cursor-pointer"
                >
                  <Edit size={16} />
                  Edit Profile
                </button>
              </div>
              <p className="text-gray-400 mt-2 text-center sm:text-left">{userData.email}</p>
              <div className="mt-3 text-center sm:text-left text-gray-400 space-y-1">
                {userData.phone && <p>📞 {userData.phone}</p>}
                {userData.location && <p>📍 {userData.location}</p>}
                {userData.course && <p>💼 {userData.course}</p>}
              </div>
              <div className="flex flex-col sm:flex-row gap-6 mt-6 justify-center sm:justify-start">
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Interviews Completed</p>
                  <p className="text-2xl font-bold text-blue-400">{userData.interviewsCompleted}</p>
                </div>
                <div className="text-center">
                  <p className="text-gray-400 text-sm">Average Score</p>
                  <p className="text-2xl font-bold text-purple-400">{userData.averageScore}%</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 📊 Main Grid */}
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2">
          {/* 🕒 Interview History */}
          <div className="backdrop-blur-md bg-gray-800/60 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-blue-500 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-5">
              <History size={24} className="text-blue-400" />
              <h2 className="text-xl font-semibold">Recent Interviews</h2>
            </div>
            <div className="space-y-4">
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-gray-700/60 rounded-lg border border-gray-600 hover:border-blue-400 transition"
                >
                  <div>
                    <p className="font-medium text-base">Frontend Developer Interview</p>
                    <p className="text-sm text-gray-400">Completed on Sept {15 - i}, 2025</p>
                  </div>
                  <span className="px-3 py-1 bg-blue-500 rounded-full text-xs sm:text-sm font-semibold">
                    Score: 85%
                  </span>
                </div>
              ))}
              <button className="w-full text-center text-blue-400 hover:text-blue-300 text-sm py-2 font-medium cursor-pointer">
                View All History →
              </button>
            </div>
          </div>

          {/* 🏆 Performance Stats */}
          <div className="backdrop-blur-md bg-gray-800/60 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-purple-500 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-5">
              <Award size={24} className="text-purple-400" />
              <h2 className="text-xl font-semibold">Performance</h2>
            </div>
            <div className="space-y-4">
              {[
                { label: 'Communication Skills', percent: 85 },
                { label: 'Technical Knowledge', percent: 78 },
                { label: 'Problem Solving', percent: 92 }
              ].map((skill, index) => (
                <div key={index} className="p-4 bg-gray-700/60 rounded-lg border border-gray-600">
                  <p className="text-sm text-gray-300">{skill.label}</p>
                  <div className="w-full bg-gray-600 rounded-full h-2 mt-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${skill.percent}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ⚙️ Settings Section */}
          <div className="md:col-span-2 backdrop-blur-md bg-gray-800/60 rounded-2xl p-6 shadow-lg border border-gray-700 hover:border-gray-500 transition-colors duration-300">
            <div className="flex items-center gap-3 mb-5">
              <Settings size={24} className="text-gray-400" />
              <h2 className="text-xl font-semibold">Settings</h2>
            </div>
            <div className="grid gap-5">
              {[
                { label: "Email Notifications", desc: "Receive updates about your interviews" },
                { label: "Dark Mode", desc: "Toggle dark/light theme" }
              ].map((setting, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-700/60 rounded-lg border border-gray-600"
                >
                  <div>
                    <p className="font-medium">{setting.label}</p>
                    <p className="text-sm text-gray-400">{setting.desc}</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" className="sr-only peer" defaultChecked />
                    <div className="w-11 h-6 bg-gray-600 rounded-full peer peer-checked:bg-blue-500 peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all cursor-pointer"></div>
                  </label>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Edit Profile Popup */}
      {showEditPopup && (
        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl max-w-md w-full border border-gray-700 relative shadow-2xl">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-white cursor-pointer"
              onClick={() => setShowEditPopup(false)}
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-semibold mb-4 text-center">Edit Profile</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = new FormData(e.target);
                const updated = {
                  name: form.get('name'),
                  email: form.get('email'),
                  phone: form.get('phone'),
                  location: form.get('location'),
                  course: form.get('course'),
                };
                handleProfileUpdate(updated);
                setShowEditPopup(false);
              }}
              className="space-y-4"
            >
              {[
                { label: 'Name', name: 'name', value: userData.name },
                { label: 'Email', name: 'email', value: userData.email },
                { label: 'Phone', name: 'phone', value: userData.phone },
                { label: 'Location', name: 'location', value: userData.location },
                { label: 'Course', name: 'course', value: userData.course }
              ].map((field, idx) => (
                <div key={idx}>
                  <label className="block text-sm text-gray-400 mb-1">{field.label}</label>
                  <input
                    type="text"
                    name={field.name}
                    defaultValue={field.value}
                    className="w-full p-2 rounded-lg bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                  />
                </div>
              ))}
              <button
                type="submit"
                className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:opacity-90 transition cursor-pointer"
              >
                Save Changes
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
