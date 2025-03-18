import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const dataFilePath = path.join(process.cwd(), 'data', 'displays.json');

// Ensure the data directory exists
async function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  try {
    await fs.access(dataDir);
  } catch {
    await fs.mkdir(dataDir, { recursive: true });
  }
}

// Function to read displays from the JSON file
async function getDisplays() {
  await ensureDataDir();
  
  try {
    const data = await fs.readFile(dataFilePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // If file doesn't exist or is invalid, return empty array
    return [];
  }
}

// Function to write displays to the JSON file
async function saveDisplays(displays: any[]) {
  await ensureDataDir();
  await fs.writeFile(dataFilePath, JSON.stringify(displays, null, 2), 'utf8');
}

// GET handler
export async function GET() {
  const displays = await getDisplays();
  return NextResponse.json(displays);
}

// POST handler
export async function POST(request: Request) {
  const displays = await request.json();
  await saveDisplays(displays);
  return NextResponse.json({ success: true });
} 