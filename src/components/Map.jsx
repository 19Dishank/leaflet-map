import * as L from "leaflet"
import React, { lazy, Suspense, useEffect, useRef, useState } from "react"
import "leaflet/dist/leaflet.css"
import axios from "axios"
// import { MapComponent } from "./MapComponent"
import { SATELLITELAYER, STREETLAYER, WORLDSTREETLAYER } from "../map/layers/baseLayers"
import { locateIcon } from "../assets/icons/LocateIcon"
import { currentLocationIcon } from "../assets/icons/currentLocation"
import { layerButton } from "./ui/layerButton"
import toast from "react-hot-toast"


const MapComponent = lazy(() => import('./MapComponent'))

const INDIA_CENTER = [20.5937, 78.9629]

const Map = () => {
    const [searchResult, setSearchResult] = useState([])
    const [query, setQuery] = useState("")
    const [currentLocation, setCurrentLocation] = useState(null) // null = not yet known
    const mapRef = useRef(null)
    const markersRef = useRef([])
    const boundaryRef = useRef([])
    const currentLocationMarkerRef = useRef(null)

    // --- 1. Get user location once on mount ---
    useEffect(() => {
        if (!navigator.geolocation) {
            () => {
                toast.error("Geolocation is not supported by this browser.", { duration: 3000 })
            }
            return
        }

        navigator.geolocation.getCurrentPosition(
            (position) => {
                setCurrentLocation({
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                })
            },
            () => {
                toast.error("Couldn’t get your current location. Please make sure location services are enabled.", { duration: 3000 });
            }
        )
    }, [])

    // --- 2. Initialize map once ---
    useEffect(() => {
        const map = L.map("map", { zoomControl: false }).setView(INDIA_CENTER, 5)
        mapRef.current = map

        WORLDSTREETLAYER.addTo(map)
        L.control.scale().addTo(map)
        L.control.zoom({ position: "bottomleft" }).addTo(map)

        // Fly-to-location button
        L.Control.CustomButton = L.Control.extend({
            options: { position: "bottomright" },
            onAdd: function (map) {
                const container = L.DomUtil.create("div", "leaflet-bar leaflet-control")
                const button = L.DomUtil.create("a", "custom-button", container)
                button.style.display = "flex"
                button.style.alignItems = "center"
                button.style.justifyContent = "center"
                button.innerHTML = locateIcon
                button.style.cursor = 'pointer'
                button.title = "Fly to Location"
                // button.href = "#"

                L.DomEvent.disableClickPropagation(button)
                L.DomEvent.on(button, "click", function (e) {
                    L.DomEvent.stop(e)
                    // Read from the ref so we always get the latest location
                    const loc = currentLocationMarkerRef.current?.getLatLng()
                    if (loc) {
                        map.flyTo(loc, 17)
                    }
                })
                return container
            },
        })
        new L.Control.CustomButton().addTo(map)

        // Layer switcher
        L.Control.LayerSwitcher = L.Control.extend({
            options: { position: "bottomright" },
            onAdd: function (map) {
                const container = L.DomUtil.create("div", "gmap-layer-switcher")
                L.DomEvent.disableClickPropagation(container)
                L.DomEvent.disableScrollPropagation(container)
                container.innerHTML = layerButton

                const layers = {
                    world: WORLDSTREETLAYER,
                    street: STREETLAYER,
                    satellite: SATELLITELAYER,
                }

                let active = "world"

                const btn = container.querySelector("#ls-toggle-btn")
                const panel = container.querySelector("#ls-panel")
                const close = container.querySelector("#ls-close")

                btn.addEventListener("click", () => panel.classList.toggle("ls-open"))
                close.addEventListener("click", () => panel.classList.remove("ls-open"))

                container.querySelectorAll(".ls-option").forEach((opt) => {
                    opt.addEventListener("click", () => {
                        const name = opt.dataset.layer
                        if (name === active) return

                        map.removeLayer(layers[active])
                        map.addLayer(layers[name])

                        container.querySelector(".ls-option.active").classList.remove("active")
                        opt.classList.add("active")

                        btn.querySelector(".ls-btn-preview").className = `ls-btn-preview ls-preview-${name}`
                        btn.querySelector(".ls-btn-label").textContent =
                            name === "street" ? "Street" : name === "satellite" ? "Satellite" : "World St."

                        active = name
                    })
                })

                return container
            },
        })
        new L.Control.LayerSwitcher().addTo(map)

        // --- Cleanup: always destroy the map when the component unmounts ---
        return () => {
            map.remove()
            mapRef.current = null
        }
    }, []) // empty array = runs once on mount

    // --- 3. Update marker whenever location changes ---
    useEffect(() => {
        const map = mapRef.current
        if (!map || !currentLocation) return // skip if map or location isn't ready

        const { latitude: lat, longitude: lon } = currentLocation

        // Remove old marker before adding a new one
        if (currentLocationMarkerRef.current) {
            map.removeLayer(currentLocationMarkerRef.current)
        }

        const marker = L.marker([lat, lon], {
            icon: L.divIcon({
                html: currentLocationIcon,
                iconSize: [18, 18],
                iconAnchor: [9, 9],
                className: "current-location-marker",
            }),
        }).addTo(map)

        currentLocationMarkerRef.current = marker
        map.setView([lat, lon], 13)
    }, [currentLocation])

    // --- Search, clear, and view handlers are unchanged ---
    const handleSearch = async () => {
        if (!query) return
        try {
            const response = await axios.get(`/api/search?q=${query}&format=json&polygon_geojson=1`)
            const results = response.data
            setSearchResult(Array.isArray(results) ? results : [])

            const map = mapRef.current

            markersRef.current.forEach((marker) => map.removeLayer(marker))
            markersRef.current = []

            boundaryRef.current.forEach((layer) => map.removeLayer(layer))
            boundaryRef.current = []

            results?.forEach(({ lon, lat, display_name, geojson }) => {
                if (lat && lon) {
                    const marker = L.marker([+lat, +lon])
                        .addTo(map)
                        .bindPopup(display_name || "Unknown")
                    markersRef.current.push(marker)

                    if (geojson) {
                        const boundary = L.geoJSON(geojson, {
                            style: { color: "blue", weight: 2, fillOpacity: 0.2 },
                        }).addTo(map)
                        boundaryRef.current.push(boundary)
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

        markersRef.current.forEach((marker) => map.removeLayer(marker))
        markersRef.current = []

        boundaryRef.current.forEach((layer) => map.removeLayer(layer))
        boundaryRef.current = []

        setSearchResult([])
        setQuery("")
    }

    const handleViewLocation = (item) => {
        const map = mapRef.current
        if (!map) return

        boundaryRef.current.forEach((layer) => map.removeLayer(layer))
        boundaryRef.current = []

        if (item.geojson) {
            const boundary = L.geoJSON(item.geojson, {
                style: { color: "blue", fillOpacity: 0, dashArray: "3 6", weight: 1.5 },
            }).addTo(map)
            boundaryRef.current.push(boundary)
            map.flyToBounds(boundary.getBounds(), { duration: 2 })
        } else {
            map.flyTo([+item.lat, +item.lon], 14, { duration: 2 })
        }
    }

    return (
        // <Suspense fallback={"loading"}>
        <MapComponent
            handleSearch={handleSearch}
            handleViewLocation={handleViewLocation}
            query={query}
            setQuery={setQuery}
            searchResult={searchResult}
            clearSearch={clearSearch}
        />
        // </Suspense>
    )
}

export default Map