import React, { useState } from 'react';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [skillsOffered, setSkillsOffered] = useState('');
  const [skillsWanted, setSkillsWanted] = useState('');
  const [availability, setAvailability] = useState('weekends');
  const [isPublic, setIsPublic] = useState(true);

  const handleSubmit = e => {
    e.preventDefault();
    // TODO: Save profile
    alert('Profile saved!');
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Your Profile</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input className="border p-2 rounded w-full" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Location (optional)" value={location} onChange={e => setLocation(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Skills Offered (comma separated)" value={skillsOffered} onChange={e => setSkillsOffered(e.target.value)} />
        <input className="border p-2 rounded w-full" placeholder="Skills Wanted (comma separated)" value={skillsWanted} onChange={e => setSkillsWanted(e.target.value)} />
        <select className="border p-2 rounded w-full" value={availability} onChange={e => setAvailability(e.target.value)}>
          <option value="weekends">Weekends</option>
          <option value="evenings">Evenings</option>
          <option value="mornings">Mornings</option>
        </select>
        <label className="flex items-center space-x-2">
          <input type="checkbox" checked={isPublic} onChange={e => setIsPublic(e.target.checked)} />
          <span>Profile Public</span>
        </label>
        <button className="bg-green-600 text-white px-4 py-2 rounded w-full" type="submit">Save</button>
      </form>
    </div>
  );
} 