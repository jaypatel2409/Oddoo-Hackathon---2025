import React, { useState } from 'react';

const sampleRequests = [
  { id: 1, user: 'Marc Demo', skill: 'Photoshop', status: 'Pending' },
  { id: 2, user: 'Michell', skill: 'Excel', status: 'Accepted' },
  { id: 3, user: 'Joe Vills', skill: 'Python', status: 'Rejected' },
];

export default function SwapRequestsPage() {
  const [requests, setRequests] = useState(sampleRequests);
  const handleAction = (id, action) => {
    setRequests(reqs => reqs.map(r => r.id === id ? { ...r, status: action } : r));
  };
  const handleDelete = id => {
    setRequests(reqs => reqs.filter(r => r.id !== id));
  };
  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Swap Requests</h1>
      <div className="space-y-4">
        {requests.map(r => (
          <div key={r.id} className="border p-4 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">{r.user}</div>
              <div className="text-sm text-gray-600">Skill: {r.skill}</div>
              <div className={`text-xs mt-1 ${r.status === 'Pending' ? 'text-yellow-600' : r.status === 'Accepted' ? 'text-green-600' : 'text-red-600'}`}>Status: {r.status}</div>
            </div>
            <div className="space-x-2">
              {r.status === 'Pending' && <>
                <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleAction(r.id, 'Accepted')}>Accept</button>
                <button className="bg-red-500 text-white px-2 py-1 rounded" onClick={() => handleAction(r.id, 'Rejected')}>Reject</button>
              </>}
              <button className="bg-gray-300 text-gray-800 px-2 py-1 rounded" onClick={() => handleDelete(r.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 