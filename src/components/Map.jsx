import React, { useEffect, useRef, useState } from "react"
import * as L from "leaflet"
import "leaflet/dist/leaflet.css"
import axios from "axios"
import { MapComponent } from "./MapComponent"

const Map = () => {
    const [searchResult, setSearchResult] = useState([])
    const [query, setQuery] = useState("")
    const [currentLocation, setCurrentLocation] = useState({})
    const mapRef = useRef(null)
    const markersRef = useRef([])
    const boundaryRef = useRef([])
    const currentLocationMarkerRef = useRef(null)
    useEffect(() => {
        function getLocation() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(success, error);
            } else {
                alert("Geolocation is not supported by this browser.")
            }
        }
        function success(position) {

            const latitude = position.coords.latitude
            const longitude = position.coords.longitude
            setCurrentLocation({ latitude, longitude })
            // console.log("Latitude: " + position.coords.latitude +  "Longitude: " + position.coords.longitude)
        }

        function error() {
            alert("Sorry, no position available.");
        }
        getLocation()

    }, [])

    useEffect(() => {

        // set current location as view 
        if (!currentLocation.latitude || !currentLocation.longitude) return

        const lat = currentLocation.latitude
        const lon = currentLocation.longitude

        let map = mapRef.current

        if (!map) {
            map = L.map("map", { zoomControl: false }).setView([lat, lon], 12)
            mapRef.current = map
        } else {
            // Update view to current location
            map.setView([lat, lon], 13)
        }

        // Remove old current location marker if it exists
        if (currentLocationMarkerRef.current) {
            map.removeLayer(currentLocationMarkerRef.current)
        }

        // Add current location marker with custom styling
        const currentLocationIcon = L.divIcon({
            html: `<div style="background-color: #3b82f6; width: 12px; height: 12px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 0 2px #3b82f6;"></div>`,
            iconSize: [18, 18],
            className: 'current-location-marker'
        })

        const marker = L.marker([lat, lon], {
            icon: currentLocationIcon
        }).addTo(map)

        currentLocationMarkerRef.current = marker

        // Initialize tile layers only once when map is first created
        if (!mapRef.current._initializedLayers) {
            const streetLayer = L.tileLayer(
                "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
                { attribution: "&copy; OpenStreetMap contributors" }
            )

            const satelliteLayer = L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
                { attribution: "Tiles &copy; Esri" }
            )
            const WorldStreetLayer = L.tileLayer(
                "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
                { attribution: "Tiles &copy; Esri" }
            )

            streetLayer.addTo(map)
            L.control.scale().addTo(map)
            L.control.zoom({ position: "bottomleft" }).addTo(map)

            // fly to current location 
            L.Control.CustomButton = L.Control.extend({
                options: {
                    position: 'bottomright'
                },

                onAdd: function (map) {

                    var container = L.DomUtil.create('div', 'leaflet-bar leaflet-control');
                    var button = L.DomUtil.create('a', 'custom-button', container);

                    button.innerHTML = '📍';
                    button.title = 'Fly to Location';
                    button.href = '#';

                    L.DomEvent.disableClickPropagation(button);

                    L.DomEvent.on(button, 'click', function (e) {
                        L.DomEvent.stop(e);

                        map.flyTo([lat, lon], 17);
                    });

                    return container;
                }
            });
            new L.Control.CustomButton().addTo(map);

            // layers button
            L.control.layers(
                {
                    Street: streetLayer,
                    Satellite: satelliteLayer,
                    WorldStreetLayer,
                },
                {},
                { collapsed: true, position: "bottomright" }
            ).addTo(map)

            mapRef.current._initializedLayers = true

        }

        return () => {
            if (mapRef.current && map === mapRef.current) {
                map.remove()
                mapRef.current = null
            }
        }
    }, [currentLocation])

    const handleSearch = async () => {
        if (!query) return

        try {
            const response = await axios.get(
                `/api/search?q=${query}&format=json&polygon_geojson=1`
            )

            const results = response.data
            setSearchResult(Array.isArray(results) ? results : [])

            const map = mapRef.current


            markersRef.current.forEach(marker => map.removeLayer(marker))
            markersRef.current = []


            boundaryRef.current.forEach(layer => map.removeLayer(layer))
            boundaryRef.current = []

            results?.forEach(({ lon, lat, display_name, geojson }) => {
                if (lat && lon) {
                    const marker = L.marker([+lat, +lon])
                        .addTo(map)
                        .bindPopup(display_name || "Unknown")

                    markersRef.current.push(marker)

                    if (geojson) {
                        const boundary = L.geoJSON(geojson, {
                            style: {
                                color: "blue",
                                weight: 2,
                                fillOpacity: 0.2
                            }
                        }).addTo(map)
                        boundaryRef.current.push(boundary)
                        // zoom to boundary
                        map.fitBounds(boundary.getBounds())
                    }
                }
            })

        } catch (error) {
            console.log(error)
        }
    }

    const clearSearch = () => {
        const map = mapRef.current
        if (!map) return

        // Remove all search markers
        markersRef.current.forEach(marker => map.removeLayer(marker))
        markersRef.current = []

        // Remove all boundaries
        boundaryRef.current.forEach(layer => map.removeLayer(layer))
        boundaryRef.current = []

        // Clear search results and query
        setSearchResult([])
        setQuery("")
    }

    const handleViewLocation = (item) => {
        const map = mapRef.current
        if (!map) return

        // clear old boundary
        boundaryRef.current.forEach(layer => map.removeLayer(layer))
        boundaryRef.current = []

        if (item.geojson) {
            const boundary = L.geoJSON(item.geojson, {
                style: {
                    color: "blue",
                    fillOpacity: 0,
                    dashArray: "3 6",
                    weight: 1.5
                }
            }).addTo(map)

            boundaryRef.current.push(boundary)
            map.flyToBounds(boundary.getBounds(), {
                duration: 2,
                // easeLinearity: 0.25
            })
        } else {
            map.flyTo([+item.lat, +item.lon], 14, {
                duration: 2
            })
        }
    }

    return (
        <MapComponent
            handleSearch={handleSearch}
            handleViewLocation={handleViewLocation}
            query={query}
            setQuery={setQuery}
            searchResult={searchResult}
            clearSearch={clearSearch}
        />

    )
}

export default Map