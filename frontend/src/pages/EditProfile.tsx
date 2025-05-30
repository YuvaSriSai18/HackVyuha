import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function EditProfile() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: 'John Researcher',
    title: 'Associate Professor of Computer Science',
    institution: 'Stanford University',
    location: 'Palo Alto, CA',
    email: 'john.researcher@stanford.edu',
    website: 'https://johnresearcher.com',
    bio: 'Computational scientist specializing in quantum algorithms...',
  });

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Save logic goes here
    alert('Profile updated successfully!');
    navigate('/profile');
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Edit Profile</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="name" value={formData.name} onChange={handleChange} className="p-2 border rounded" placeholder="Name" />
        <input name="title" value={formData.title} onChange={handleChange} className="p-2 border rounded" placeholder="Title" />
        <input name="institution" value={formData.institution} onChange={handleChange} className="p-2 border rounded" placeholder="Institution" />
        <input name="location" value={formData.location} onChange={handleChange} className="p-2 border rounded" placeholder="Location" />
        <input name="email" value={formData.email} onChange={handleChange} className="p-2 border rounded" placeholder="Email" />
        <input name="website" value={formData.website} onChange={handleChange} className="p-2 border rounded" placeholder="Website" />
        <textarea name="bio" value={formData.bio} onChange={handleChange} className="p-2 border rounded" placeholder="Biography" rows={4} />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded">Save Changes</button>
      </form>
    </div>
  );
}
