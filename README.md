# Interactive Map Module

A responsive, feature-rich map application built with **React** and **Leaflet**, designed to provide seamless geolocation-based mapping, location search, and layer switching capabilities.

---

## Overview

This map module delivers an intuitive, interactive mapping experience with geolocation detection, powerful location search, and dynamic tile layer switching. Users can explore multiple map types, search for locations worldwide, and visualize geographic boundaries in real-time.

---

## Key Features

- **🎯 Geolocation Detection** — Automatically detects and centers the map on the user's current location
- **🗺️ Multi-Layer Support** — Switch between Street, Satellite, and World Street map types
- **🔍 Location Search** — Search for places globally with auto-complete results and boundary visualization
- **✈️ Smooth Animations** — Animated fly-to and fit-bounds transitions for seamless navigation
- **📍 Custom Markers** — Display search results with labeled markers and boundaries
- **🎮 Intuitive Controls** — Zoom, scale, and custom navigation buttons positioned strategically
- **📱 Responsive Design** — Fully responsive interface optimized for desktop and mobile devices

---

## Map Layers

The map supports three tile layer providers for different viewing preferences:

### 1. **Street Map** (Default)
- Provider: OpenStreetMap
- Best for: Navigation and general reference
- URL: `https://tile.openstreetmap.org/{z}/{x}/{y}.png`
- Attribution: © OpenStreetMap contributors

### 2. **Satellite**
- Provider: Esri World Imagery
- Best for: Aerial views and detailed landscape inspection
- URL: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}`
- Attribution: © Esri and partners

### 3. **World Street Map**
- Provider: Esri World Street Map
- Best for: Detailed road networks and urban planning
- URL: `https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}`
- Attribution: © Esri, HERE, Garmin, and others

---

## Controls & Interactions

### Map Controls
- **Zoom Control** — Located at bottom-left; standard zoom in/out buttons
- **Scale Control** — Displays map scale in metric and imperial units
- **Fly to Location Button** — Custom button (bottom-right) animates map to user's current location at zoom level 17
- **Layer Switcher** — Bottom-right panel with visual previews of each tile layer for quick switching

### User Interactions
- **Search Bar** — Enter location queries; results appear in a slide-up panel with options
- **Search Results** — Click any result to animate the map to that location and display boundaries
- **Boundary Visualization** — GeoJSON boundaries rendered with semi-transparent fill and dashed borders
- **Keyboard Support** — Press Enter in the search box to execute search

---

## Tech Stack

| Technology       | Version       | Purpose                               |
| ---------------- | ------------- | ------------------------------------- |
| **React**        | 19.2.0        | UI framework and component management |
| **Leaflet**      | 1.9.4         | Core mapping library                  |
| **Axios**        | 1.15.0        | HTTP client for API requests          |
| **Lucide React** | 1.8.0         | Icon components                       |
| **Tailwind CSS** | 4.2.2         | Styling and responsive design         |
| **Vite**         | 8.0.0-beta.13 | Build tool and dev server             |

---

## Installation

### Prerequisites
- Node.js 16+ and npm/yarn
- Modern browser with Geolocation API support

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure the API endpoint:**
   The map uses Nominatim API for location search. Ensure your backend proxy or environment supports:
   ```
   /api/search?q={query}&format=json&polygon_geojson=1
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## Usage

### Basic Map Initialization
The map initializes automatically on component mount with:
- User geolocation detection via browser Geolocation API
- Map centered at current location with zoom level 12
- Street layer active by default

### Searching for Locations

1. Click the search bar at the top
2. Type a location name, address, or coordinates
3. Press Enter or click the search icon
4. Results appear in a slide-up panel with:
   - Location name (primary)
   - Full address (secondary)
   - Map pin icon
5. Click a result to:
   - Animate the map to that location
   - Display location boundaries (if available)
   - Fit map bounds to show the entire area

### Switching Map Layers

1. Click the **Layers** button (bottom-right)
2. A panel opens with three map type options:
   - **Street** — Standard street map (default)
   - **Satellite** — Aerial imagery
   - **World St.** — Detailed world street map
3. Click a layer to switch instantly
4. Button preview updates to reflect active layer

### Navigating the Map

- **Zoom** — Use mouse scroll or zoom controls (bottom-left)
- **Pan** — Click and drag the map
- **Fly to Current Location** — Click the locate button (bottom-right) to animate to your position at high zoom
- **View Location Bounds** — Search results with boundaries automatically fit the view

---

## Code Structure

```
src/
├── components/
│   ├── Map.jsx                    # Main map component & geolocation logic
│   ├── MapComponent.jsx           # UI wrapper (search bar, results panel)
│   └── ui/
│       └── layerButton.js         # Layer switcher UI template
├── map/
│   └── layers/
│       └── baseLayers.js          # Tile layer definitions
└── assets/
    └── icons/
        ├── LocateIcon.js          # Locate button icon
        └── CurrentLocation.js     # Current location marker icon
```

### File Descriptions

- **Map.jsx** — Core map logic including:
  - Geolocation initialization
  - Map instance management
  - Search handler with API integration
  - Marker and boundary rendering
  - Custom control creation (Fly-to, Layer Switcher)

- **MapComponent.jsx** — UI layer providing:
  - Search input field
  - Search results slide-up panel
  - Responsive layout and styling

- **baseLayers.js** — Centralized tile layer configuration with attribution

---

## Configuration

### Tile Layer Setup
Define tile layers in `src/map/layers/baseLayers.js`:

```javascript
export const STREETLAYER = L.tileLayer(
  "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
  {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  },
);
```

### Map Initialization Options
In `Map.jsx`, the map initializes with:
```javascript
const map = L.map("map", { zoomControl: false }).setView([lat, lon], 12)
```
- `zoomControl: false` — Custom zoom control positioned at bottom-left
- `setView([lat, lon], 12)` — Initial zoom level 12 at user's location

### Custom Controls
- **Fly to Location** — Animates to current location at zoom 17 with 2-second duration
- **Layer Switcher** — Toggle between three tile layers with visual previews
- **Scale & Zoom** — Leaflet standard controls

### API Configuration
The search functionality relies on an API endpoint:
```
GET /api/search?q={query}&format=json&polygon_geojson=1
```
Customize this endpoint in the `handleSearch()` method if using a different backend.

---

## Screenshots

> Map views with multiple layers and search results

| Street Map                                                                                   | Satellite                                                                                       | Search Results                                                                                  |
| -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------- |
| ![Street View](https://drive.google.com/uc?export=view&id=13y8Vt2_1g036oPybPdFklpwqg5UaBJkv) | ![Satellite View](https://drive.google.com/uc?export=view&id=1ERSGSjbTDjOBSlqYmqNR5Pi84T8plrCw) | ![Search Results](https://drive.google.com/uc?export=view&id=1rj1DIJZ7TP6qFvd2_xfgT-47bCBFyrAV) |

## Performance Considerations

- **Marker Management** — Old markers are removed before adding new search results
- **Layer Switching** — Efficient layer removal/addition; only one layer active at a time
- **Boundary Rendering** — GeoJSON boundaries are cleared between searches to prevent memory leaks
- **Geolocation** — Runs once on component mount; caches current location in state

---

## Browser Compatibility

- ✅ Chrome/Chromium (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)
- ⚠️ Requires Geolocation API support and HTTPS (in production)

---

## Future Enhancements

- Advanced filtering by location type (cities, landmarks, addresses)
- Routing and directions functionality
- Heatmap visualization
- Custom marker clustering
- Offline map support
- Drawing and annotation tools

---

## License

See the main project LICENSE file for details.

---

## Support

For issues or questions specific to map functionality, refer to:
- [Leaflet Documentation](https://leafletjs.com/)
- [Nominatim Search API](https://nominatim.org/)
- [Esri Tile Services](https://www.arcgis.com/home/item.html?id=10df2279f9684e4a9f6a7f08b8bac9c9)
