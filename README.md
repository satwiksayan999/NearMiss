# Near Miss Incident Dashboard

A production-quality React dashboard for visualizing and analyzing near miss incident data. Built with modern web technologies to provide comprehensive insights into safety incidents.

## Features

- **KPI Cards**: Quick overview of key metrics including total incidents, highest severity, most common causes, and locations
- **Interactive Charts**: 
  - Bar chart showing incidents by action cause
  - Pie/Donut chart displaying severity distribution
  - Line chart tracking monthly incident trends
  - Horizontal bar chart highlighting top locations
  - Bar chart showing incidents by region
- **Advanced Filtering**: 
  - Filter by year
  - Filter by severity level
- **Responsive Design**: Fully responsive layout that works on desktop, tablet, and mobile devices
- **Data Safety**: Graceful handling of missing or empty fields with "Unknown" placeholders
- **Loading States**: Smooth loading indicators while data is being processed
- **Error Handling**: Comprehensive error handling to prevent crashes
- **Modern UI**: Clean, professional design with smooth hover effects and tooltips

## Tech Stack

- **React 18**: Modern React with functional components and hooks
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework for rapid UI development
- **Recharts**: Composable charting library built on React components
- **JavaScript (ES6+)**: Modern JavaScript features including optional chaining

## Project Structure

```
src/
├── components/
│   ├── charts/
│   │   ├── BarChart.jsx
│   │   ├── PieChart.jsx
│   │   ├── LineChart.jsx
│   │   ├── HorizontalBarChart.jsx
│   │   └── ChartCard.jsx
│   ├── KPICards/
│   │   ├── KPICard.jsx
│   │   └── KPICards.jsx
│   └── Dashboard/
│       └── Dashboard.jsx
├── data/
│   └── incidents.json
├── utils/
│   └── dataProcessor.js
├── App.jsx
├── App.css
├── main.jsx
└── index.css
```

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager

### Installation

1. **Clone or navigate to the project directory**

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   - The app will be available at `http://localhost:5173` (or the port shown in your terminal)
   - Vite will automatically open the browser

### Building for Production

To create a production build:

```bash
npm run build
```

The built files will be in the `dist` directory. To preview the production build:

```bash
npm run preview
```

## Data Format

The dashboard expects a JSON file at `src/data/incidents.json` with the following structure:

```json
[
  {
    "id": 1,
    "incident_date": "2023-01-15",
    "severity_level": "High",
    "action_cause": "Equipment Failure",
    "location": "Warehouse A",
    "region": "North",
    "behavior_type": "Unsafe Act"
  },
  ...
]
```

### Required Fields

- `id`: Unique identifier for each incident
- `incident_date`: Date in YYYY-MM-DD format
- `severity_level`: Severity classification (e.g., "High", "Medium", "Low")
- `action_cause`: Primary cause of the incident
- `location`: Location where the incident occurred
- `region`: Geographic region
- `behavior_type`: Type of behavior involved

**Note**: All fields are optional. Missing or empty fields will be automatically replaced with "Unknown" to prevent errors.

## Key Features Explained

### Data Processing

The `dataProcessor.js` utility provides robust data handling:

- **Normalization**: Automatically replaces null, undefined, or empty values with "Unknown"
- **Grouping**: Efficiently groups data by any field
- **Filtering**: Supports filtering by year and severity
- **Aggregation**: Calculates monthly trends and top locations
- **KPI Calculation**: Computes key performance indicators

### Component Architecture

- **Modular Design**: Each chart is a reusable component
- **Separation of Concerns**: Data processing is separated from UI components
- **Performance Optimized**: Uses React hooks (useMemo) to prevent unnecessary recalculations
- **Error Boundaries**: Graceful handling of edge cases

### Responsive Design

- Mobile-first approach
- Grid layouts that adapt to screen size
- Touch-friendly interface elements
- Optimized chart rendering for different viewport sizes

## Assumptions

1. **Data Source**: The application loads data from a local JSON file. In a production environment, this would typically be replaced with an API call.

2. **Date Format**: Incident dates are expected in ISO format (YYYY-MM-DD). The application handles invalid dates gracefully.

3. **Field Values**: 
   - Severity levels are assumed to be categorical (High, Medium, Low)
   - Action causes, locations, and regions are treated as categorical data
   - All categorical fields support any string value

4. **Performance**: The application is optimized for datasets with up to several thousand records. For larger datasets, consider implementing pagination or data sampling.

5. **Browser Support**: Modern browsers that support ES6+ features and CSS Grid.

6. **No Backend**: The application is designed to work entirely client-side with no backend requirements.

## Customization

### Changing Colors

Chart colors can be customized by modifying the `color` prop in chart components or updating the `COLORS` array in `PieChart.jsx`.


