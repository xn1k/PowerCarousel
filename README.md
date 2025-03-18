# Power BI Carousel

A modern web application for managing and displaying Power BI embeds on rotation. Perfect for information displays in lobbies, meeting rooms, or dashboards that need to cycle through multiple reports.

![Power BI Carousel](https://i.imgur.com/placeholder.png)

## Features

- **Simple Authentication**: Secure admin dashboard with login protection
- **Multiple Displays**: Create and manage multiple display endpoints (e.g., `/lobby`, `/meetingroom`)
- **Customizable Rotation**: Set specific duration for each embed before rotating to the next
- **Responsive Design**: Clean, modern UI that works on various screen sizes
- **Custom Branding**: Styled with a professional color scheme
- **Persistent Storage**: Configuration stored in JSON files that persists between sessions and server restarts

## Tech Stack

- **Next.js 15**: React framework with App Router
- **TypeScript**: For type safety and better developer experience
- **Tailwind CSS**: For styling and responsive design
- **File-based Storage**: JSON file storage for configuration persistence

## Getting Started

### Prerequisites

- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone https://github.com/xn1k/PowerCarousel.git
cd PowerCarousel
```

2. Install dependencies:

```bash
npm install
```

3. Set up the data directory:

```bash
npm run setup
```

4. Start the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Default Login Credentials

- **Username**: `admin`
- **Password**: `password`

## Usage Guide

### Setting Up Displays

1. Log in to the admin dashboard using the default credentials
2. Create a new display with a name and endpoint (e.g., "Lobby Display" with endpoint "lobby")
3. The display will be accessible at `/<endpoint>` (e.g., `/lobby`)

### Adding Power BI Embeds

1. From the admin dashboard, select a display from the dropdown
2. Enter the Power BI embed URL (format: `https://app.powerbi.com/reportEmbed?reportId=...`)
3. Set the duration in seconds for how long this embed should be displayed
4. Click "Add Embed" to add it to the rotation

### Viewing Displays

- Access any display by navigating to its endpoint: `/<endpoint>`
- The display will automatically rotate through all configured embeds
- The header shows the current position in the rotation sequence

## Data Storage

The application uses a simple file-based storage system for persistence:

- All display and embed configuration is stored in `/data/displays.json`
- The data directory is automatically created when you run the app
- Data persists between server restarts and across different sessions
- For backup purposes, configurations are also cached in localStorage

## Power BI Authentication

When embedding Power BI reports, you might encounter authentication issues. Here are some solutions:

### Simple Embed (Current Implementation)

The current implementation uses direct iframe embedding, which works well when:
- Users are already logged into Power BI in the same browser
- Reports are set to public or have appropriate permissions

For authentication issues, the application provides an "Open in New Window" button which can help complete the authentication flow.

### Advanced Embedding Options

For production environments, consider these more robust solutions:

1. **Power BI Embed Tokens**: The most secure way to embed reports
   - Requires a backend service to generate embed tokens
   - Uses the Power BI REST API
   - Documentation: [Power BI Embedding](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embed-sample-for-your-organization)

2. **Power BI Embedded Capacity**: For scenarios where viewers don't have Power BI licenses
   - Requires Azure subscription and Power BI Embedded capacity
   - Provides embedding for non-Power BI users
   - Documentation: [Power BI Embedded](https://docs.microsoft.com/en-us/power-bi/developer/embedded/embedding)

3. **Microsoft Teams Integration**: If your organization uses Teams
   - Consider embedding reports in Teams tabs instead
   - Users will already be authenticated

### Best Practices

- Always sign in to Power BI before accessing embedded reports
- Use the same browser for authentication and viewing
- Clear browser cache if experiencing persistent issues
- Consider implementing a server-side authentication flow for production

## Deployment

### Building for Production

```bash
npm run build
npm start
```

### Deployment Platforms

This application can be deployed to:

- Vercel
- Netlify
- Azure Static Web Apps
- Any platform that supports Next.js applications

## Customization

### Color Scheme

The application uses a custom color scheme that can be modified in the `tailwind.config.js` file:

- **Orange** (`#F56920`): Used for action buttons like "Delete" and "Logout"
- **Dark Green** (`#0A5E58`): Used as the background/backdrop color
- **Light Green** (`#31B494`): Used for primary buttons
- **Text** (`#121212`): Used for text content

### Font

The application uses Calibri as the default font. This can be changed in the `tailwind.config.js` file.

## Security Considerations

For production use, consider:

1. Implementing a more robust authentication system
2. Using a database instead of simple JSON file storage
3. Adding environment variables for sensitive information
4. Implementing rate limiting and other security measures

## License

ISC

## Acknowledgements

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/) 