import MapComponent from "../components/Map/map";
import Togglebar from "../components/Togglebar/Togglebar";
import "../../src/index.css";
import { createContext, useEffect, useState } from "react";
import Spectrogram from "../components/Record/Record";

export const MapContext = createContext();

const Map = () => {
    const [page, setPage] = useState("map");
    const [birdclass, setBirdclass] = useState(null);

    return (
        <>
            <MapContext.Provider value={{ birdclass, setBirdclass }}>
                <div className="flex flex-col items-center justify-center h-auto w-full ">
                    <div className="flex justify-center items-center flex-col my-6 gap-4">
                        {page === "map" ? (
                            <h1 className="text-2xl md:text-4xl mb-4 loraFont">
                                Bird Habitat Map
                            </h1>
                        ) : (
                            <h1 className="text-2xl md:text-4xl mb-4 loraFont">
                                Capture, Visualize & Identify Bird Calls
                            </h1>
                        )}
                        <Togglebar setPage={setPage} />
                    </div>
                    {page === "map" ? <MapComponent /> : <Spectrogram />}
                </div>
            </MapContext.Provider>
        </>
    );
};

export default Map;
