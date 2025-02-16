import * as React from "react";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";

export default function Togglebar({ setPage }) {
    const [alignment, setAlignment] = React.useState("map");

    const handleChange = (event, newAlignment) => {
        if (newAlignment !== null) {
            setAlignment(newAlignment);
            setPage(newAlignment);
        }
    };

    return (
        <ToggleButtonGroup
            color="primary"
            value={alignment}
            exclusive
            onChange={handleChange}
            aria-label="Platform"
        >
            <ToggleButton
                value="map"
                sx={{ width: "100px", fontWeight: "bold" }}
            >
                Map
            </ToggleButton>
            <ToggleButton
                value="record"
                sx={{ width: "100px", fontWeight: "bold" }}
            >
                Record
            </ToggleButton>
        </ToggleButtonGroup>
    );
}
