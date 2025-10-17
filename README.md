# SuperOps - MSP Growth & IT Budget Optimization Platform

SuperOps is a futuristic, enterprise-grade web application designed as a comprehensive Managed Service Provider (MSP) growth and IT budget optimization platform. It combines profitability analytics, budget optimization, and sales/marketing integrations into a unified, glassmorphic dashboard.

This prototype demonstrates a sophisticated, role-based single-page application (SPA) built with modern frontend technologies, showcasing a rich user interface and integration with the Google Gemini API for AI-powered insights.

## Core Features

- **Profitability Analytics Dashboard**: Real-time tracking of MRR, client-level profitability, and service margin breakdowns.
- **Client Management**: A detailed view of all clients, with advanced filtering, sorting, and individual client deep-dives.
- **Sales & Marketing Hub**: Integrated views for HubSpot sales pipeline data, Mailchimp email campaigns, and social media performance.
- **Advanced Reporting**: A custom report builder that allows users to generate reports from various data sources, export them, and generate AI-powered summaries.
- **Secure Settings Management**: Role-aware settings for profile management, billing, integrations, and secure API key generation/revocation.
- **Role-Based Access Control (RBAC)**: Four distinct user roles (Admin, Manager, Analyst, Viewer) with granular permissions for page access and specific actions.
- **AI-Powered Insights**: Utilizes the Google Gemini API to provide actionable business insights on the dashboard and intelligent summaries for custom reports.

## Technology Stack

- **Frontend Framework**: React.js with TypeScript
- **Styling**: TailwindCSS for utility-first styling, with custom configurations for a "glassmorphic" design.
- **Data Visualization**: Recharts for interactive and responsive charts.
- **AI Integration**: Google Gemini API (`@google/genai`) for generating intelligent summaries and insights.
- **State Management**: React Context API for managing global user state.
- **Icons**: A custom set of SVG icons for a consistent visual language.
- **Backend**: A mock API layer (`lib/api.ts`) is used to simulate asynchronous data fetching and API latency.

## Getting Started

The application is set up as a modern single-page application using `index.html` and a main `index.tsx` entry point.

### Prerequisites

- A modern web browser that supports ES6 modules.
- A valid Google Gemini API Key.

### Running the Application

1.  **API Key Configuration**: The application requires a Google Gemini API key to power its AI features. This key **must** be provided as an environment variable named `API_KEY`. The application is designed to read this key directly from `process.env.API_KEY`.

2.  **Serving the Files**: Serve the project's root directory using a simple local web server.

### User Roles & Permissions

The application features a robust role-based access control system. You can switch between different user roles via the user menu in the header to see how the UI and available actions change.

-   **Admin**: Full access to all pages, settings, and actions, including billing and user management functionalities.
-   **Manager**: Access to most pages and settings. Can manage clients and API keys but does not have access to billing.
-   **Analyst**: Has read-only access to analytics-focused pages like the Dashboard, Profitability, and Clients. Cannot access settings or perform administrative actions.
-   **Viewer**: The most restricted role, with access only to the main Dashboard for high-level overviews.

Permissions are managed centrally in `lib/permissions.ts`.

## Project Structure

```
/
├── components/         # Reusable React components
│   ├── AIInsights.tsx      # AI-powered dashboard insights widget
│   ├── ClientsTable.tsx    # Advanced table for client data
│   ├── Header.tsx          # Top navigation bar with user menu
│   ├── ReportingPage.tsx   # Custom report builder and AI summary
│   ├── SettingsPage.tsx    # Role-aware settings management
│   └── Sidebar.tsx         # Main navigation sidebar
├── constants.ts        # Mock data for the application
├── contexts/           # React Context for global state (UserContext)
├── lib/                # Core logic and utilities
│   ├── api.ts            # Mock API for data fetching
│   └── permissions.ts    # Role-based access control logic
├── types.ts            # TypeScript type definitions
├── App.tsx             # Main application component with routing
├── index.html          # The single HTML page
├── index.tsx           # The entry point of the React application
└── README.md           # This file
```

## License

This project is licensed under the MIT License.
