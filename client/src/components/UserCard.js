import React from 'react';

export default function UserCard({ user }) {
  return (
    <div className="border p-4 rounded flex items-center justify-between">
      <div className="flex items-center space-x-4">
        <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">
          {user.profilePhoto ? <img src={user.profilePhoto} alt="Profile" className="w-12 h-12 rounded-full" /> : user.name[0]}
        </div>
        <div>
          <div className="font-semibold">{user.name}</div>
          <div className="text-xs text-gray-600">Offered: {user.skillsOffered.join(', ')}</div>
          <div className="text-xs text-gray-600">Wanted: {user.skillsWanted.join(', ')}</div>
          <div className="text-xs text-gray-500">Availability: {user.availability}</div>
          <div className="text-xs text-yellow-600">Rating: {user.rating}</div>
        </div>
      </div>
      <button className="bg-blue-600 text-white px-4 py-2 rounded">Request</button>
    </div>
  );
} 