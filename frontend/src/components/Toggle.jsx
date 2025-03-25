import { useNavigate } from "react-router-dom";
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ToggleButton from '@mui/material/ToggleButton';

const Toggle = () => {
  const navigate = useNavigate();
  
  return (
    <ToggleButtonGroup variant="outline">
      <ToggleButton sx={{backgroundColor:"skyblue", color:"black"}} onClick={() => navigate("/events-management")}>Manage Events</ToggleButton>
      <ToggleButton sx={{backgroundColor:"skyblue", color:"black"}} onClick={() => navigate("/attending-events")}>Attending</ToggleButton>
    </ToggleButtonGroup>
  );
};

export default Toggle;