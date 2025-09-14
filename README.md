# Admin-Frontend-V2

## Nevado Trek Admin Panel

A React TypeScript admin frontend for managing the Nevado Trek tours application.

### Tech Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **UI Library**: Material-UI (MUI) with dark theme
- **Routing**: React Router DOM
- **Authentication**: Token-based authentication

### Features
- ✅ Secure token-based login system
- ✅ Protected routes with authentication
- ✅ Dashboard interface
- ✅ Integration with Nevado Trek API
- 🚧 Tours management (coming soon)
- 🚧 Bookings management (coming soon)
- 🚧 Itineraries management (coming soon)

### Getting Started

1. **Install dependencies**:
   ```bash
   cd admin-frontend
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Open http://localhost:5173/login
   - Enter the admin token to access the dashboard

### API Integration

The frontend connects to the Nevado Trek Supabase Edge Function:
- **Base URL**: `https://donprqhxuezsyokucfht.supabase.co/functions/v1/nevado-trek-api`
- **Authentication**: Bearer token required for admin actions
- **Actions**: Supports full CRUD operations for tours, itineraries, and bookings

### Project Structure

```
admin-frontend/
├── src/
│   ├── components/     # Reusable UI components
│   ├── contexts/       # React contexts (Auth)
│   ├── pages/          # Page components
│   ├── router/         # Routing configuration
│   ├── services/       # API service functions
│   └── main.tsx        # Application entry point
├── public/             # Static assets
└── package.json        # Dependencies and scripts
```

### Development

- **Build**: `npm run build`
- **Lint**: `npm run lint`
- **Preview**: `npm run preview`

### Architecture

This admin panel is designed to work with the Nevado Trek backend system, providing a secure interface for managing:
- Tours with pricing tiers and itineraries
- Customer bookings with dynamic pricing
- Multi-day tour activities and schedules

For more details, see the architecture documentation in the parent directory.