import { useContext, useEffect, useRef, useState } from "react";
import leaflet from "leaflet";
import "leaflet.heat";
import useLocalStorage from "../../hooks/useLocalStorage";
import useGeolocation from "../../hooks/useGeolocation";
import { TextField } from "@mui/material";
import { MapContext } from "../../pages/Map";
import server from "../../lib/axios/axios.instance";

// Constants
const BATCH_SIZE = 5;
const MAX_MARKERS = 15;
const dev = true;

// Utility functions for color generation
const generateColorWithHue = (hue, lightness) => {
    return `hsl(${hue}, 75%, ${lightness}%)`;
};

const generateSpeciesGradient = (speciesIndex, totalSpecies) => {
    const hue = (360 / totalSpecies) * speciesIndex;
    return {
        0.2: generateColorWithHue(hue, 95),
        0.4: generateColorWithHue(hue, 85),
        0.6: generateColorWithHue(hue, 65),
        0.8: generateColorWithHue(hue, 45),
        1.0: generateColorWithHue(hue, 30),
    };
};

export default function MapComponent() {
    const mapRef = useRef();
    const userMarkerRef = useRef();
    const mapInstance = useRef(null);
    const markersRef = useRef({});
    const heatmapLayersRef = useRef({});
    const [selectedBirdType, setSelectedBirdType] = useState(null);
    const [clickedMarkerId, setClickedMarkerId] = useState(null);
    const [detectedBirds, setDetectedBirds] = useState([]);
    const [birdBatches, setBirdBatches] = useState({});
    const [markerCount, setMarkerCount] = useState(0);
    const [birdTypeColors, setBirdTypeColors] = useState({});
    const { birdclass } = useContext(MapContext);

    // API related states
    const [apiBirdLocations, setApiBirdLocations] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const [userPosition, setUserPosition] = useLocalStorage("USER_MARKER", {
        latitude: 0,
        longitude: 0,
    });

    const location = useGeolocation();

    // Fetch API data
    const fetchBirdLocations = async () => {
        try {
            const response = await server.get("/locations/bird");
            const data = await response.data;
            setApiBirdLocations(data);
        } catch (error) {
            console.error("Error fetching bird locations:", error);
        }
    };

    // Marker icons
    const nearbyMarkerIcon = leaflet.icon({
        iconUrl: "/assets/feather_marker.png",
        iconSize: [48, 48],
        iconAnchor: [24, 24],
        popupAnchor: [0, -24],
    });

    const selectedMarkerIcon = leaflet.icon({
        iconUrl: "/assets/feather_marker.png",
        iconSize: [72, 72],
        iconAnchor: [36, 36],
        popupAnchor: [0, -36],
    });

    const clickedMarkerIcon = leaflet.icon({
        iconUrl: "/assets/feather_marker.png",
        iconSize: [120, 120],
        iconAnchor: [60, 60],
        popupAnchor: [0, -60],
    });

    // Update colors when birds change
    useEffect(() => {
        const allBirds = [
            ...new Set([
                ...detectedBirds.map((bird) => bird.species),
                ...apiBirdLocations.map((bird) => bird.bird.name),
            ]),
        ];

        const colors = {};
        allBirds.forEach((species, index) => {
            colors[species] = generateSpeciesGradient(index, allBirds.length);
        });
        setBirdTypeColors(colors);
    }, [detectedBirds, apiBirdLocations]);

    // Search handling
    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);

        if (value.trim()) {
            const allBirds = [
                ...new Set([
                    ...detectedBirds.map((bird) => bird.species),
                    ...apiBirdLocations.map((bird) => bird.bird.name),
                ]),
            ];
            const filtered = allBirds.filter((bird) =>
                bird.toLowerCase().includes(value.toLowerCase())
            );
            setSuggestions(filtered);
            setShowSuggestions(true);
        } else {
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    const handleSuggestionClick = (bird) => {
        setSearchTerm(bird);
        setShowSuggestions(false);

        const firstMarkerOfType = Object.entries(markersRef.current).find(
            ([_, { birdType }]) => birdType === bird
        );

        if (firstMarkerOfType) {
            handleMarkerClick(bird, firstMarkerOfType[0]);
        }
    };

    // Bird detection for real-time sightings
    const detectBirds = () => {
        if (
            !userPosition.latitude ||
            !userPosition.longitude ||
            markerCount >= MAX_MARKERS ||
            !birdclass
        )
            return;

        const locationOffset = () => (Math.random() - 0.5) * 0.002;

        const newBird = {
            species: birdclass,
            latitude: userPosition.latitude + locationOffset(),
            longitude: userPosition.longitude + locationOffset(),
            timestamp: new Date().toISOString(),
        };

        setDetectedBirds((prev) => [...prev, newBird]);
        setMarkerCount((prev) => prev + 1);
        addBirdMarker(newBird, false);
    };

    // Add markers for both detected and API birds
    const addBirdMarker = (birdData, isApiData = false) => {
        const markerId = isApiData
            ? `api-${birdData.location.latitude}-${birdData.location.longitude}-${birdData.bird.name}-${birdData.id}`
            : `${birdData.latitude}-${birdData.longitude}-${birdData.timestamp}`;

        if (!markersRef.current[markerId]) {
            const popupContent = isApiData
                ? `
                    <div style="min-width: 200px;">
                        <h3 style="margin: 0 0 8px 0;">${
                            birdData.bird.name
                        }</h3>
                        <p style="margin: 0 0 5px 0;"><strong>Species:</strong> ${
                            birdData.bird.species
                        }</p>
                        <p style="margin: 0 0 5px 0;"><strong>Population Trend:</strong> ${
                            birdData.bird.population_trend
                        }</p>
                        <p style="margin: 0 0 5px 0;"><strong>Spotted:</strong> ${new Date(
                            birdData.spotted_time
                        ).toLocaleString()}</p>
                        <p style="margin: 0;"><strong>Location:</strong> ${
                            birdData.location.latitude
                        }, ${birdData.location.longitude}</p>
                        ${
                            birdData.bird.background
                                ? `<p style="margin: 8px 0 0 0; font-style: italic;">${birdData.bird.background}</p>`
                                : ""
                        }
                    </div>
                `
                : `Bird: ${
                      birdclass.predicted_class
                  }<br>Location: ${birdData.latitude.toFixed(
                      4
                  )}, ${birdData.longitude.toFixed(4)}`;

            const marker = leaflet
                .marker(
                    [
                        isApiData
                            ? parseFloat(birdData.location.latitude)
                            : birdData.latitude,
                        isApiData
                            ? parseFloat(birdData.location.longitude)
                            : birdData.longitude,
                    ],
                    {
                        icon: nearbyMarkerIcon,
                    }
                )
                .addTo(mapInstance.current)
                .bindPopup(popupContent)
                .on("click", () =>
                    handleMarkerClick(
                        isApiData
                            ? birdData.bird.name
                            : birdclass.predicted_class,
                        markerId
                    )
                );

            markersRef.current[markerId] = {
                marker,
                birdType: isApiData
                    ? birdData.bird.name
                    : birdclass.predicted_class,
                isApi: isApiData,
                data: birdData,
            };
        }
    };

    // Add API markers
    const addApiBirdMarkers = () => {
        apiBirdLocations.forEach((data) => {
            addBirdMarker(data, true);
        });
    };

    // Heatmap management
    const clearAllHeatmaps = () => {
        Object.values(heatmapLayersRef.current).forEach((layer) => {
            if (layer && mapInstance.current) {
                mapInstance.current.removeLayer(layer);
            }
        });
        heatmapLayersRef.current = {};
    };

    const createProbabilityHeatmap = (selectedSpecies) => {
        clearAllHeatmaps();

        const selectedMarkers = Object.values(markersRef.current).filter(
            ({ birdType }) => birdType === selectedSpecies
        );

        const heatmapPoints = [];
        selectedMarkers.forEach(({ marker }) => {
            const latlng = marker.getLatLng();
            heatmapPoints.push([latlng.lat, latlng.lng, 1.0]);
        });

        const colorGradient = birdTypeColors[selectedSpecies];

        heatmapLayersRef.current[selectedSpecies] = leaflet
            .heatLayer(heatmapPoints, {
                radius: 15,
                blur: 10,
                maxZoom: 10,
                gradient: colorGradient,
            })
            .addTo(mapInstance.current);
    };

    const createAllHeatmaps = () => {
        clearAllHeatmaps();

        const markersByType = {};
        Object.values(markersRef.current).forEach(({ marker, birdType }) => {
            if (!markersByType[birdType]) {
                markersByType[birdType] = [];
            }
            markersByType[birdType].push(marker);
        });

        Object.entries(markersByType).forEach(([birdType, markers]) => {
            const heatmapPoints = markers.map((marker) => {
                const latlng = marker.getLatLng();
                return [latlng.lat, latlng.lng, 1];
            });

            const colorGradient = birdTypeColors[birdType];

            heatmapLayersRef.current[birdType] = leaflet
                .heatLayer(heatmapPoints, {
                    radius: 20,
                    blur: 15,
                    maxZoom: 10,
                    gradient: colorGradient,
                })
                .addTo(mapInstance.current);
        });
    };

    const handleMarkerClick = (clickedBirdType, markerId) => {
        setSelectedBirdType(clickedBirdType);
        setClickedMarkerId(markerId);

        Object.entries(markersRef.current).forEach(([id, markerInfo]) => {
            const { marker, birdType } = markerInfo;
            if (id === markerId) {
                marker.setIcon(clickedMarkerIcon);
                marker.setZIndexOffset(2000);
            } else if (birdType === clickedBirdType) {
                marker.setIcon(selectedMarkerIcon);
                marker.setZIndexOffset(1000);
            } else {
                marker.setIcon(nearbyMarkerIcon);
                marker.setZIndexOffset(0);
            }
        });

        createProbabilityHeatmap(clickedBirdType);
    };

    // Initialize map and fetch data
    useEffect(() => {
        if (!mapInstance.current) {
            mapInstance.current = leaflet
                .map("map")
                .setView([userPosition.latitude, userPosition.longitude], 13);

            leaflet
                .tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
                    maxZoom: 19,
                    attribution:
                        '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
                })
                .addTo(mapInstance.current);

            fetchBirdLocations();
        }

        if (birdclass) {
            detectBirds();
        }

        return () => {
            if (mapInstance.current) {
                mapInstance.current.remove();
                mapInstance.current = null;
            }
        };
    }, [userPosition, birdclass]);

    // Add API markers when data is loaded
    useEffect(() => {
        if (mapInstance.current && apiBirdLocations.length > 0) {
            addApiBirdMarkers();
        }
    }, [apiBirdLocations]);

    // Update user location
    useEffect(() => {
        if (location && location.latitude && location.longitude) {
            setUserPosition({
                latitude: location.latitude,
                longitude: location.longitude,
            });

            if (userMarkerRef.current) {
                mapInstance.current.removeLayer(userMarkerRef.current);
            }

            userMarkerRef.current = leaflet
                .marker([location.latitude, location.longitude])
                .addTo(mapInstance.current)
                .bindPopup(
                    `Current Location: lat: ${location.latitude.toFixed(
                        4
                    )}, long: ${location.longitude.toFixed(4)}`
                );

            mapInstance.current.setView([
                location.latitude,
                location.longitude,
            ]);
        }
    }, []);

    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
                padding: "20px",
                boxSizing: "border-box",
                width: "100%",
            }}
        >
            <div
                style={{
                    width: "80%",
                    marginBottom: "20px",
                    position: "relative",
                    zIndex: 1000, // Ensure search container is above map
                }}
                className="flex flex-col items-center"
            >
                <TextField
                    id="outlined-basic"
                    label="Search Bird"
                    variant="outlined"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    style={{
                        width: "95%",
                        fontSize: "16px",
                        borderRadius: "20px",
                        transition: "all 0.3s ease",
                        alignSelf: "center",
                        backgroundColor: "white",
                    }}
                />

                {showSuggestions && suggestions.length > 0 && (
                    <div
                        style={{
                            position: "absolute",
                            top: "100%",
                            left: "2.5%", // Align with the search box (accounts for the 95% width)
                            width: "95%",
                            background: "white",
                            border: "1px solid #ccc",
                            borderRadius: "8px",
                            marginTop: "4px",
                            maxHeight: "250px",
                            overflowY: "auto",
                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                            zIndex: 1001, // Higher than the search container
                        }}
                    >
                        {suggestions.map((bird, index) => (
                            <div
                                key={index}
                                onClick={() => handleSuggestionClick(bird)}
                                style={{
                                    padding: "12px 16px",
                                    cursor: "pointer",
                                    borderBottom: "1px solid #f2f2f2",
                                    fontSize: "16px",
                                    fontWeight: "500",
                                    transition: "background-color 0.3s ease",
                                }}
                                onMouseEnter={(e) =>
                                    (e.target.style.backgroundColor = "#f0f8ff")
                                }
                                onMouseLeave={(e) =>
                                    (e.target.style.backgroundColor =
                                        "transparent")
                                }
                            >
                                {bird}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div
                id="map"
                ref={mapRef}
                style={{
                    color: "gray",
                    height: "80%",
                    width: "80%",
                    borderRadius: "8px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
                    zIndex: 0, // Ensure map stays below search container
                    position: "relative",
                }}
            />

            {dev && (
                <div
                    style={{ marginTop: "20px" }}
                    className="flex flex-col items-center justify-center"
                >
                    <div>
                        {selectedBirdType && (
                            <p>Selected Birds: {selectedBirdType}</p>
                        )}
                    </div>
                    <div>
                        <button
                            style={{
                                marginRight: "10px",
                                padding: "10px",
                                color: "white",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                            }}
                            className="bg-primary"
                            onClick={createAllHeatmaps}
                        >
                            Show All
                        </button>
                        <button
                            style={{
                                padding: "10px",
                                color: "white",
                                borderRadius: "4px",
                                border: "none",
                                cursor: "pointer",
                            }}
                            className="bg-warning"
                            onClick={clearAllHeatmaps}
                        >
                            Clear All
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
