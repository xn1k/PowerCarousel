// Define display and embed types
export interface Embed {
  id: string;
  url: string;
  duration: number;
}

export interface Display {
  id: string;
  name: string;
  endpoint: string;
  embeds: Embed[];
}

// Function to fetch all displays
export async function fetchDisplays(): Promise<Display[]> {
  try {
    const response = await fetch('/api/displays', {
      method: 'GET',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch displays');
    }
    
    return response.json();
  } catch (error) {
    console.error('Error fetching displays:', error);
    
    // Fallback to localStorage if API fails
    const savedDisplays = localStorage.getItem('displays');
    if (savedDisplays) {
      return JSON.parse(savedDisplays);
    }
    
    return [];
  }
}

// Function to save displays
export async function saveDisplays(displays: Display[]): Promise<boolean> {
  try {
    const response = await fetch('/api/displays', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(displays),
    });
    
    if (!response.ok) {
      throw new Error('Failed to save displays');
    }
    
    // Also save to localStorage as a backup/cache
    localStorage.setItem('displays', JSON.stringify(displays));
    
    return true;
  } catch (error) {
    console.error('Error saving displays:', error);
    
    // Still save to localStorage even if API fails
    localStorage.setItem('displays', JSON.stringify(displays));
    
    return false;
  }
} 