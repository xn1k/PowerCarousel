'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { fetchDisplays } from '@/lib/displayService';
import type { Display } from '@/lib/displayService';

export default function DisplayPage() {
  const params = useParams();
  const endpoint = params.endpoint as string;
  
  const [display, setDisplay] = useState<Display | null>(null);
  const [currentEmbedIndex, setCurrentEmbedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [authError, setAuthError] = useState(false);

  // Load display data from API
  useEffect(() => {
    const loadDisplay = async () => {
      try {
        const displays = await fetchDisplays();
        const matchedDisplay = displays.find(d => d.endpoint === endpoint);
        
        if (matchedDisplay) {
          setDisplay(matchedDisplay);
        } else {
          setError(`No display found with endpoint: ${endpoint}`);
        }
      } catch (error) {
        console.error('Failed to load display:', error);
        setError('Failed to load display data');
      } finally {
        setLoading(false);
      }
    };
    
    loadDisplay();
  }, [endpoint]);

  // Rotate through embeds
  useEffect(() => {
    if (!display || display.embeds.length === 0) return;
    
    const currentEmbed = display.embeds[currentEmbedIndex];
    const timer = setTimeout(() => {
      setCurrentEmbedIndex((prevIndex) => 
        prevIndex === display.embeds.length - 1 ? 0 : prevIndex + 1
      );
    }, currentEmbed.duration * 1000);
    
    return () => clearTimeout(timer);
  }, [display, currentEmbedIndex]);

  // Function to open report in a new window
  const openInNewWindow = (url: string) => {
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-dark-green">
        <div className="text-xl text-white">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-dark-green">
        <div className="bg-white border border-brand-orange rounded-md p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold text-brand-orange mb-4">Error</h1>
          <p className="text-brand-text mb-6">{error}</p>
          <Link 
            href="/"
            className="inline-block px-4 py-2 bg-brand-orange text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  if (!display || display.embeds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-brand-dark-green">
        <div className="bg-white border border-brand-light-green rounded-md p-6 max-w-md w-full">
          <h1 className="text-2xl font-bold text-brand-dark-green mb-4">{display ? display.name : 'Display'}</h1>
          <p className="text-brand-text mb-6">
            {display 
              ? 'No embeds have been added to this display yet.' 
              : 'Display not found.'}
          </p>
          <Link 
            href="/"
            className="inline-block px-4 py-2 bg-brand-light-green text-white rounded-md hover:bg-opacity-90 transition-colors"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  const currentEmbed = display.embeds[currentEmbedIndex];

  return (
    <div className="h-screen flex flex-col">
      <div className="bg-brand-dark-green text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">{display.name}</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            Showing {currentEmbedIndex + 1} of {display.embeds.length}
          </div>
          <button
            onClick={() => openInNewWindow(currentEmbed.url)}
            className="text-xs bg-brand-orange px-2 py-1 rounded hover:bg-opacity-90"
            title="Open in new window (if you have authentication issues)"
          >
            Open in New Window
          </button>
        </div>
      </div>
      
      <div className="flex-1 h-full relative">
        <iframe
          src={currentEmbed.url}
          className="w-full h-full border-0"
          style={{ height: 'calc(100vh - 64px)' }}
          allowFullScreen
          onError={() => setAuthError(true)}
        />
        
        {authError && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg max-w-md text-center">
              <h2 className="text-xl font-bold text-brand-dark-green mb-3">Authentication Required</h2>
              <p className="text-brand-text mb-4">
                There seems to be an authentication issue with this Power BI report. This commonly happens when embedding reports.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-600">Try these solutions:</p>
                <ol className="text-left text-sm list-decimal pl-5 space-y-2">
                  <li>Make sure you're signed in to Power BI in this browser</li>
                  <li>Try opening the report in a new window</li>
                  <li>Contact your administrator for proper embed tokens</li>
                </ol>
                <button
                  onClick={() => openInNewWindow(currentEmbed.url)}
                  className="w-full mt-4 bg-brand-orange text-white py-2 px-4 rounded hover:bg-opacity-90"
                >
                  Open Report in New Window
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 