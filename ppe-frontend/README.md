# Vision AI - PPE Detection Dashboard

A modern React + TypeScript dashboard application for PPE (Personal Protective Equipment) detection and monitoring.

## Features

- **Dashboard**: Real-time incident trends and compliance rates by zone
- **PPE Detection**: Live camera feed with real-time detection statistics
- **Live Chat**: Integrated Tawk.to chat widget (bottom-right corner)

## Tech Stack

- React 19 + TypeScript
- TanStack Router for routing
- Tailwind CSS for styling
- shadcn/ui components
- Recharts for data visualization
- Tawk.to for live chat

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure Tawk.to (optional):
   - Get your Tawk.to credentials from https://www.tawk.to/
   - Replace `YOUR_PROPERTY_ID` and `YOUR_WIDGET_ID` in `index.html`

3. Start the development server:
```bash
npm run dev
```

4. Make sure the Flask backend is running on `http://localhost:5000` for the video feed to work.

## Project Structure

```
src/
├── routes/          # TanStack Router routes
├── components/      # React components
│   ├── ui/         # shadcn/ui components
│   ├── Sidebar.tsx
│   ├── Dashboard.tsx
│   └── PPEDetection.tsx
├── lib/            # Utility functions
├── data/           # Mock data
└── main.tsx        # Entry point
```

## Development

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
