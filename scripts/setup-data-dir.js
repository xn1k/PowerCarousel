const fs = require('fs');
const path = require('path');

const dataDir = path.join(process.cwd(), 'data');

// Create data directory if it doesn't exist
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log('Data directory created successfully!');
  } else {
    console.log('Data directory already exists.');
  }
  
  // Create an empty displays.json file if it doesn't exist
  const displaysFile = path.join(dataDir, 'displays.json');
  
  if (!fs.existsSync(displaysFile)) {
    fs.writeFileSync(displaysFile, '[]', 'utf8');
    console.log('Empty displays.json file created successfully!');
  } else {
    console.log('displays.json file already exists.');
  }
  
  console.log('Setup complete!');
} catch (err) {
  console.error('Error setting up data directory:', err);
  process.exit(1);
} 