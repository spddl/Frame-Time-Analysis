/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Popover from "@mui/material/Popover";
import { useState } from "react";
import { SketchPicker } from "react-color";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";

function ColorPicker({ color, index, setColors }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);

  return (
    <>
      <div
        style={{
          cursor: "pointer",
          width: "100%",
          height: "32px",
          background: `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`,
        }}
        onClick={handleClick}
      />
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transitionDuration={1}
      >
        <SketchPicker
          color={color}
          onChange={(ev) =>
            setColors((previousState) => {
              const newState = JSON.parse(JSON.stringify(previousState));
              newState[index] = ev.rgb;
              return newState;
            })
          }
        />
      </Popover>
    </>
  );
}

// input: h as an angle in [0,360] and s,l in [0,1] - output: r,g,b in [0,1]
function hsl2rgb(h, s, l) {
  const a = s * Math.min(l, 1 - l)
  const f = (n, k = (n + h / 30) % 12) => l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1)

  return {
    r: f(0) === 0 ? 0 : f(0) * 255,
    g: f(8) === 0 ? 0 : f(8) * 255,
    b: f(4) === 0 ? 0 : f(4) * 255,
    a: 1
  }
}

function setColorPreset(count, setColors) {
  const tempColor = []
  for (let i = 0; i < 24 / count; i += 1) {
    for (let index = 0; index < count; index+=1) {
      if (index === 0) {
        tempColor.push(hsl2rgb(0, 1, 0.5))
      } else {
        tempColor.push( hsl2rgb(((360 / count) * index), 1, 0.5)) }
    }
  }
  setColors(tempColor)
}

export default function Colors({ colors, setColors }) {
  const [preset, setPreset] = useState('');

  return (
    <Stack spacing={1} divider={<Divider />}>
      <div className="title">Colors</div>
      <Stack spacing={1}>

        <FormControl fullWidth size="small" style={{ marginTop: "16px" }}>
          <InputLabel id="color-presets">Presets</InputLabel>
          <Select
            labelId="color-presets"
            value={preset}
            label="Presets"
            onChange={ev => {
              setPreset(ev.target.value)
              setColorPreset(ev.target.value, setColors)
            }}
          >
            <MenuItem value={1}>1</MenuItem>
            <MenuItem value={2}>2</MenuItem>
            <MenuItem value={3}>3</MenuItem>
            <MenuItem value={4}>4</MenuItem>
            <MenuItem value={5}>5</MenuItem>
          </Select>
        </FormControl>

        {colors.map((color, index) => (
          <ColorPicker
            // eslint-disable-next-line react/no-array-index-key
            key={index}
            color={color}
            setColors={setColors}
            index={index}
          />
        ))}
      </Stack>
    </Stack>
  );
}
