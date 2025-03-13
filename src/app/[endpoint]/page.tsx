'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Embed {
  id: string;
  url: string;
  duration: number;
}

interface Display {
  id: string;
  name: string;
  endpoint: string;
  embeds: Embed[];
}

export default function DisplayPage() {
  const params = useParams();
  const endpoint = params.endpoint as string;
  
  const [display, setDisplay] = useState<Display | null>(null);
  const [currentEmbedIndex, setCurrentEmbedIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load display data from localStorage
  useEffect(() => {
    const savedDisplays = localStorage.getItem('displays');
    if (savedDisplays) {
      const displays: Display[] = JSON.parse(savedDisplays);
      const matchedDisplay = displays.find(d => d.endpoint === endpoint);
      
      if (matchedDisplay) {
        setDisplay(matchedDisplay);
      } else {
        setError(`No display found with endpoint: ${endpoint}`);
      }
    } else {
      setError('No displays configured');
    }
    
    setLoading(false);
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
        <div className="text-sm">
          Showing {currentEmbedIndex + 1} of {display.embeds.length}
        </div>
      </div>
      
      <div className="flex-1 h-full">
        <iframe
          src={currentEmbed.url}
          className="w-full h-full border-0"
          style={{ height: 'calc(100vh - 64px)' }}
          allowFullScreen
        />
      </div>
    </div>
  );
} 