import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";

/**
 * Toggle component for switching between different views or pages.
 * Provides a dropdown menu to navigate between "Events I created" and "Events I am attending".
 * Automatically navigates to the selected page when the toggle value changes.
 * @component
 * @param {Object} props - The component props.
 * @param {string} [props.defaultToggle="events-management"] - The default toggle value.
 * @returns {JSX.Element} The Toggle component.
 */
const Toggle = (
  { defaultToggle = "events-management" }
) => {
  const [toggle, setToggle] = useState(defaultToggle);
  const navigate = useNavigate();
  useEffect(() => {
    navigate(`/${toggle}`);
  }
    , [toggle, navigate]);

  const handleChange = (event) => {
    setToggle(event.target.value);
  };

  return (
    <FormControl sx={{ m: 1, minWidth: 120 }}>
      <InputLabel id="select-toggle">Manage Events</InputLabel>
      <Select
        labelId="select-toggle"
        id="demo-simple-select"
        value={toggle}
        label="Toggle"
        onChange={handleChange}
      >
        <MenuItem value={"events-management"}>Events I created</MenuItem>
        <MenuItem value={"attending-events"}>Events I am attending</MenuItem>
      </Select>
    </FormControl>
  )

}

export default Toggle;