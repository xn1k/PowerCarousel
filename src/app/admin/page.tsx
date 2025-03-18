'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Display, Embed, fetchDisplays, saveDisplays } from '@/lib/displayService';

export default function AdminPage() {
  const [displays, setDisplays] = useState<Display[]>([]);
  const [newDisplay, setNewDisplay] = useState({ name: '', endpoint: '' });
  const [newEmbed, setNewEmbed] = useState({ displayId: '', name: '', url: '', duration: 30 });
  const [selectedDisplay, setSelectedDisplay] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const router = useRouter();
  const { isAuthenticated, logout } = useAuth();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  // Load displays from API on component mount
  useEffect(() => {
    const loadDisplays = async () => {
      try {
        const data = await fetchDisplays();
        setDisplays(data);
      } catch (error) {
        console.error('Failed to load displays:', error);
      }
    };
    
    loadDisplays();
  }, []);

  // Function to save displays
  const handleSaveDisplays = async (updatedDisplays: Display[]) => {
    setIsSaving(true);
    setSaveError(null);
    
    try {
      const success = await saveDisplays(updatedDisplays);
      if (!success) {
        setSaveError('Failed to save displays to server, but saved locally');
      }
    } catch (error) {
      console.error('Error saving displays:', error);
      setSaveError('Failed to save displays');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAddDisplay = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newDisplay.name || !newDisplay.endpoint) return;
    
    const display: Display = {
      id: Date.now().toString(),
      name: newDisplay.name,
      endpoint: newDisplay.endpoint.toLowerCase().replace(/\s+/g, ''),
      embeds: []
    };
    
    const updatedDisplays = [...displays, display];
    setDisplays(updatedDisplays);
    setNewDisplay({ name: '', endpoint: '' });
    
    await handleSaveDisplays(updatedDisplays);
  };

  const handleAddEmbed = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newEmbed.displayId || !newEmbed.name || !newEmbed.url || newEmbed.duration <= 0) return;
    
    const embed: Embed = {
      id: Date.now().toString(),
      name: newEmbed.name,
      url: newEmbed.url,
      duration: newEmbed.duration
    };
    
    const updatedDisplays = displays.map(display => {
      if (display.id === newEmbed.displayId) {
        return {
          ...display,
          embeds: [...display.embeds, embed]
        };
      }
      return display;
    });
    
    setDisplays(updatedDisplays);
    setNewEmbed({ ...newEmbed, name: '', url: '', duration: 30 });
    
    await handleSaveDisplays(updatedDisplays);
  };

  const handleDeleteDisplay = async (id: string) => {
    const updatedDisplays = displays.filter(display => display.id !== id);
    setDisplays(updatedDisplays);
    
    if (selectedDisplay === id) {
      setSelectedDisplay(null);
    }
    
    await handleSaveDisplays(updatedDisplays);
  };

  const handleDeleteEmbed = async (displayId: string, embedId: string) => {
    const updatedDisplays = displays.map(display => {
      if (display.id === displayId) {
        return {
          ...display,
          embeds: display.embeds.filter(embed => embed.id !== embedId)
        };
      }
      return display;
    });
    
    setDisplays(updatedDisplays);
    await handleSaveDisplays(updatedDisplays);
  };

  if (!isAuthenticated) {
    return null; // Will redirect in the useEffect
  }

  return (
    <div className="min-h-screen bg-brand-dark-green text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button 
            onClick={logout}
            className="px-4 py-2 bg-brand-orange text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Logout
          </button>
        </div>
        
        {saveError && (
          <div className="mb-6 bg-red-500 bg-opacity-20 border border-red-500 rounded-md p-3 text-white">
            <p>{saveError}</p>
          </div>
        )}
        
        {isSaving && (
          <div className="mb-6 bg-brand-light-green bg-opacity-20 border border-brand-light-green rounded-md p-3 text-white">
            <p>Saving changes...</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Add Display Form */}
          <div className="bg-white text-brand-text p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-brand-dark-green">Add New Display</h2>
            <form onSubmit={handleAddDisplay} className="space-y-4">
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium">
                  Display Name
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={newDisplay.name}
                  onChange={(e) => setNewDisplay({ ...newDisplay, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-light-green focus:border-brand-light-green"
                  placeholder="e.g. Main Hall"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="endpoint" className="block text-sm font-medium">
                  Endpoint Name
                </label>
                <input
                  type="text"
                  id="endpoint"
                  value={newDisplay.endpoint}
                  onChange={(e) => setNewDisplay({ ...newDisplay, endpoint: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-light-green focus:border-brand-light-green"
                  placeholder="e.g. mainhall"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-light-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-green"
              >
                Add Display
              </button>
            </form>
          </div>

          {/* Add Embed Form */}
          <div className="bg-white text-brand-text p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-brand-dark-green">Add New Embed</h2>
            <form onSubmit={handleAddEmbed} className="space-y-4">
              <div>
                <label htmlFor="displaySelect" className="block text-sm font-medium">
                  Select Display
                </label>
                <select
                  id="displaySelect"
                  value={newEmbed.displayId}
                  onChange={(e) => setNewEmbed({ ...newEmbed, displayId: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-light-green focus:border-brand-light-green"
                  required
                >
                  <option value="">Select a display</option>
                  {displays.map(display => (
                    <option key={display.id} value={display.id}>
                      {display.name}
                    </option>
                  ))}
                </select>
              </div>
              
              <div>
                <label htmlFor="embedName" className="block text-sm font-medium">
                  Embed Name
                </label>
                <input
                  type="text"
                  id="embedName"
                  value={newEmbed.name}
                  onChange={(e) => setNewEmbed({ ...newEmbed, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-light-green focus:border-brand-light-green"
                  placeholder="e.g. Main Hall Embed"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="embedUrl" className="block text-sm font-medium">
                  Power BI Embed URL
                </label>
                <input
                  type="text"
                  id="embedUrl"
                  value={newEmbed.url}
                  onChange={(e) => setNewEmbed({ ...newEmbed, url: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-light-green focus:border-brand-light-green"
                  placeholder="https://app.powerbi.com/reportEmbed?reportId=..."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="duration" className="block text-sm font-medium">
                  Duration (seconds)
                </label>
                <input
                  type="number"
                  id="duration"
                  value={newEmbed.duration}
                  onChange={(e) => setNewEmbed({ ...newEmbed, duration: parseInt(e.target.value) })}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-light-green focus:border-brand-light-green"
                  min="5"
                  required
                />
              </div>
              
              <button
                type="submit"
                className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-light-green hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-light-green"
              >
                Add Embed
              </button>
            </form>
          </div>
        </div>

        {/* Display List */}
        <div className="mt-8 bg-white text-brand-text p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-brand-dark-green">Manage Displays</h2>
          
          {displays.length === 0 ? (
            <p className="text-gray-500">No displays added yet.</p>
          ) : (
            <div className="space-y-6">
              {displays.map(display => (
                <div key={display.id} className="border border-gray-200 rounded-md p-4">
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <h3 className="text-lg font-medium text-brand-dark-green">{display.name}</h3>
                      <p className="text-sm text-gray-500">
                        Endpoint: /{display.endpoint}
                      </p>
                      <p className="text-sm text-brand-light-green underline">
                        <Link href={`/${display.endpoint}`} target="_blank">
                          View Display
                        </Link>
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => selectedDisplay === display.id ? setSelectedDisplay(null) : setSelectedDisplay(display.id)}
                        className="px-3 py-1 bg-brand-light-green text-white rounded-md hover:bg-opacity-90 transition-colors"
                      >
                        {selectedDisplay === display.id ? 'Hide Embeds' : 'Show Embeds'}
                      </button>
                      <button
                        onClick={() => handleDeleteDisplay(display.id)}
                        className="px-3 py-1 bg-brand-orange text-white rounded-md hover:bg-opacity-90 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                  
                  {selectedDisplay === display.id && (
                    <div className="mt-4 pl-4 border-l-2 border-brand-light-green">
                      <h4 className="text-md font-medium mb-2 text-brand-dark-green">Embeds:</h4>
                      {display.embeds.length === 0 ? (
                        <p className="text-gray-500">No embeds added to this display.</p>
                      ) : (
                        <ul className="space-y-2">
                          {display.embeds.map(embed => (
                            <li key={embed.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <div className="overflow-hidden">
                                <p className="text-sm font-medium text-brand-dark-green">{embed.name}</p>
                                <p className="text-sm truncate" title={embed.url}>
                                  {embed.url}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Duration: {embed.duration} seconds
                                </p>
                              </div>
                              <button
                                onClick={() => handleDeleteEmbed(display.id, embed.id)}
                                className="ml-2 px-2 py-1 text-xs bg-brand-orange text-white rounded hover:bg-opacity-90 transition-colors"
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 