import { useNavigate } from "react-router-dom";
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useEffect, useState } from "react";

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