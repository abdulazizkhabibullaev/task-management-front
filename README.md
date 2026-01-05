# Task Management System

A professional, full-featured task management application built with Vue 3, TypeScript, and Element Plus.

## Features

### Authentication

- User registration with validation
- Secure login system
- Session management with persistent state

### Dashboard

- Overview statistics (total tasks, to-do, in progress, completed)
- Recent tasks display
- Quick access to projects and tasks
- Visual statistics cards with color coding

### Projects

- Create, view, edit, and delete projects
- Project descriptions
- Task count per project
- Search functionality
- Responsive table view

### Tasks

- Full CRUD operations for tasks
- Task properties:
  - Title and description
  - Associated project
  - Status: To Do, In Progress, Done
  - Priority: Low, Medium, High
  - Due date
- Advanced filtering:
  - Filter by project
  - Filter by status
  - Filter by priority
  - Search by title
- Visual status and priority indicators
- Overdue task highlighting

## Tech Stack

- **Framework**: Vue 3 with Composition API
- **Language**: TypeScript
- **UI Components**: Element Plus
- **State Management**: Pinia with persistence
- **Routing**: Vue Router
- **HTTP Client**: Axios
- **Date Handling**: Day.js
- **Internationalization**: Vue I18n (English, Russian, Uzbek)
- **Build Tool**: Vite

## Project Structure

```
src/
├── assets/              # Static assets and global styles
├── common/
│   ├── api/            # API service modules
│   ├── constants/      # Application constants
│   ├── types/          # TypeScript type definitions
│   └── utils/          # Utility functions
├── components/
│   ├── common/         # Reusable components
│   └── layout/         # Layout components
├── composables/        # Vue composables
├── layouts/            # Page layouts
├── locales/            # Translation files
├── plugins/            # Vue plugins
├── router/             # Route definitions
├── stores/             # Pinia stores
└── views/              # Page components
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd task-management-front
```

2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Create a `.env` file in the root directory:

```
VITE_BASE_URL=http://your-api-url
```

### Development

Run the development server:

```bash
# Development mode
npm run watch:dev

# Production mode
npm run watch:prod

# Local mode
npm run watch:local
```

The application will be available at `http://localhost:3000`

### Build

Build for production:

```bash
npm run build
```

Type checking:

```bash
npm run type-check
```

## Features in Detail

### Responsive Design

- Mobile-first approach
- Adaptive sidebar navigation
- Touch-friendly interfaces
- Optimized for all screen sizes

### User Experience

- Smooth animations and transitions
- Loading states for async operations
- Form validation with helpful error messages
- Confirmation dialogs for destructive actions
- Success/error notifications
- Empty states handling

### Internationalization

The application supports three languages:

- English (en)
- Russian (ru)
- Uzbek (uz)

Language can be switched via the language selector in the header.

### State Management

- Centralized store with Pinia
- Persistent authentication state
- Automatic token management
- User session handling

### API Integration

All API calls are handled through a centralized service with:

- Request/response interceptors
- Error handling
- Token injection
- Type-safe responses

## Component Library

### Custom Components Used

**Layout Components:**

- `Header` - Application header with user menu
- `Nav-Aside` - Sidebar navigation

**Common Components:**

- `Button` - Customizable button
- `Card` - Container with styling
- `Table` - Feature-rich data table
- `AddButton` - Quick action button
- `EditButton` - Edit action button
- `DeleteButton` - Delete action button
- `FilterPanel` - Filter container
- `FilterField` - Search input
- `FilterSelect` - Dropdown filter
- `FormDrawer` - Side drawer for forms
- `DatePicker` - Date selection
- `LanguageSelect` - Language switcher

**Form Elements:**

- `TextInput` - Text/email/password input
- `Select` - Dropdown selection

## API Endpoints Expected

The application expects the following API structure:

### Authentication

- `POST /user/register` - Register new user
- `POST /user/login` - User login
- `GET /user/profile` - Get current user

### Projects

- `GET /projects` - List projects (with pagination)
- `POST /projects` - Create project
- `GET /projects/:id` - Get project details
- `PUT /projects/:id` - Update project
- `DELETE /projects/:id` - Delete project

### Tasks

- `GET /tasks` - List tasks (with filters and pagination)
- `POST /tasks` - Create task
- `GET /tasks/:id` - Get task details
- `PUT /tasks/:id` - Update task
- `DELETE /tasks/:id` - Delete task
- `GET /tasks/statistics` - Get task statistics

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Best Practices

- TypeScript for type safety
- Composition API for better code organization
- Reusable components
- Centralized state management
- Consistent code style
- Internationalization support
- Mobile-responsive design
- Accessibility considerations

## License

MIT

## Support

For support, please contact [your-email@example.com]
