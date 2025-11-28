# Mini Dashboard

A dashboard application built with React and TanStack Router featuring user and project management capabilities with real-time data visualization.

## Features Completed

### Authentication
- Login/Logout functionality with localStorage-based session management
- Protected routes with automatic redirects
- Authentication state persistence across page refreshes

### Dashboard Overview
- **Statistics Cards**: Display key metrics (Total Users, Total Posts, Total Tasks, Completion Rate)
- **Data Visualization**: 
  - Line chart showing user activity (posts and todos by user)
  - Bar chart displaying posts distribution among top users
- **Real-time Data**: Fetches data from JSONPlaceholder API
- Responsive grid layout with gradient styling

### User Management
- **CRUD Operations**: Read, Update, and Delete users
- **Dual Edit Modes**:
  - Inline editing directly in the table
  - Modal-based editing with form validation
- **Search Functionality**: Filter users by name, email, or company
- **Sorting**: Sort users by name, email, or company (ascending/descending)
- **Delete Confirmation**: Alert dialog to prevent accidental deletions
- Fetches real user data from JSONPlaceholder API

### Project Management
- **CRUD Operations**: Full project lifecycle management
- **Dual Edit Modes**:
  - Quick inline editing for fast updates
  - Side drawer editing for detailed changes
- **Project Properties**:
  - Name, Description, Status (Active, Pending, Completed, On Hold)
  - Color-coded status badges
- **Delete Confirmation**: Protective dialog before deletion
- Local state management (no API dependency)

### UI/UX
- Responsive layout optimized for all screen sizes
- Smooth transitions and hover effects
- Sidebar navigation with active state indicators
- Loading states and empty state messaging
- Toast notifications

## Libraries Used

### Core Framework
- **React 19.2.0**: Latest React with improved performance
- **Vite 7.2.4**: Fast build tool and development server

### Routing
- **@tanstack/react-router**: file-based routing

### UI Components
- **ShadCN UI**: Dialog, Alert Dialog, Label, Select, Slot

### Styling
- **Tailwind CSS**: Utility-first CSS framework

### Data Visualization
- **Recharts 3.5.1**: Composable charting library built on React components

### Form Management
- **react-hook-form**: Performant form validation
- **@hookform/resolvers**: Validation resolvers
- **Zod**: TypeScript-first schema validation

### HTTP Client
- **Axios**: Promise-based HTTP client

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mini-dashboard
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:5173
```

### Build for Production

```bash
npm run build
```

The production-ready files will be generated in the `dist` directory.

### Preview Production Build

```bash
npm run preview
```

### Linting

```bash
npm run lint
```

## Project Structure

```
mini-dashboard/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   ├── forms/      # Form components (login form)
│   │   ├── layout/     # Layout components (Sidebar)
│   │   └── ui/         # Reusable UI components (shadcn/ui)
│   ├── lib/            # Utility functions
│   ├── routes/         # File-based routing
│   │   ├── dashboard/  # Dashboard routes
│   │   │   ├── index.jsx    # Dashboard home
│   │   │   ├── users.jsx    # User management
│   │   │   └── projects.jsx # Project management
│   │   ├── __root.jsx  # Root layout
│   │   ├── index.jsx   # Landing page
│   │   ├── login.jsx   # Login page
│   │   └── about.jsx   # About page
│   ├── auth.js         # Authentication logic
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── components.json     # shadcn/ui configuration
├── vite.config.js      # Vite configuration
├── package.json        # Project dependencies
└── README.md          # This file
```

## Default Credentials

For the login functionality, you can use any credentials as the authentication is currently mock-based using localStorage.

## API Integration

The dashboard fetches data from the following JSONPlaceholder endpoints:
- Users: `https://jsonplaceholder.typicode.com/users`
- Posts: `https://jsonplaceholder.typicode.com/posts`
- Todos: `https://jsonplaceholder.typicode.com/todos`

## Improvements

### Implemented Enhancements
- Dual editing modes (inline and modal/drawer) for better UX
- Advanced search and sorting capabilities
- Responsive design with gradient aesthetics
- Loading and empty states for better user feedback
- Delete confirmations to prevent data loss
- Clean, modern UI with consistent styling

### Future Improvements

1. **Authentication**
   - Integrate with a real backend authentication system (JWT, OAuth)
   - Add role-based access control (RBAC)
   - Implement password reset functionality
   - Add multi-factor authentication (MFA)

2. **Data Management**
   - Connect to a real backend API instead of localStorage/JSONPlaceholder
   - Implement pagination for large datasets
   - Add bulk operations (multi-select and batch delete/edit)
   - Export data to CSV/Excel formats

3. **User Experience**
   - Complete dark mode implementation
   - Add keyboard shortcuts for power users
   - Implement drag-and-drop for project reordering
   - Add undo/redo functionality

4. **Features**
   - Add file upload capability for user avatars
   - Implement comments/notes system for projects
   - Add activity logs and audit trails
   - Create advanced filtering with multiple criteria
   - Add email notifications

5. **Performance**
   - Implement virtual scrolling for large lists
   - Add service worker for offline support
   - Optimize bundle size with code splitting
   - Add caching strategies with React Query

6. **Testing**
   - Add unit tests with Jest/Vitest
   - Implement integration tests with React Testing Library
   - Add E2E tests with Playwright/Cypress

7. **Accessibility**
   - Enhance keyboard navigation
   - Add ARIA labels and roles
   - Improve screen reader support
   - Add focus management

## Limitations

1. **Authentication**: Currently uses localStorage which is not secure for production use
2. **Data Persistence**: User changes are not persisted on page refresh (except projects in localStorage)
3. **API Integration**: Uses mock API (JSONPlaceholder) which resets data
4. **Form Validation**: Basic validation only; could be enhanced with more complex rules
5. **Error Handling**: Limited error handling for API failures
6. **Mobile Optimization**: While responsive, mobile UX could be further optimized
7. **Browser Support**: Tested primarily on modern browsers (Chrome, Firefox, Safari)
8. **Dark Mode**: Theme switching configured but not fully implemented across all components
