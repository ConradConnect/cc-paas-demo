import React from "react";

import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import DialogContent from "@material-ui/core/DialogContent";

import Slider from "@material-ui/core/Slider";

import { ChromePicker } from "react-color";

import styles from "../styles/ActuateDialogContent.module.css";

function ActuateDialogContent(props) {
  const [percentageSlider, setPercentageSlider] = React.useState(50);
  const [colorPicker, setColorPicker] = React.useState("#FF0000");

  if (!props.device) return null;

  console.log(props);

  const performActuate = value =>
    props.actuateDeviceMutation({
      device: props.device.id,
      property: props.property,
      value
    });

  if (props.property === "on_off") {
    return (
      <div className={styles.wrapper}>
        <ButtonGroup size="large" aria-label="large outlined button group">
          <Button
            className={styles.onButton}
            onClick={() => performActuate(true)}
          >
            ON
          </Button>
          <Button
            className={styles.offButton}
            onClick={() => performActuate(false)}
          >
            OFF
          </Button>
        </ButtonGroup>
      </div>
    );
  } else if (props.property === "brightness") {
    const marks = [
      {
        value: 0,
        label: "0%"
      },
      {
        value: 100,
        label: "100%"
      }
    ];
    return (
      <div className={styles.wrapper}>
        <div>
          <Slider
            defaultValue={50}
            step={1}
            marks={marks}
            valueLabelDisplay="on"
            onChange={(_, value) => setPercentageSlider(value)}
            value={percentageSlider}
          />
        </div>
        <Button
          color="primary"
          variant="contained"
          onClick={() => performActuate(percentageSlider)}
        >
          Change Brightness
        </Button>
      </div>
    );
  } else if (props.property === "color") {
    return (
      <div className={styles.wrapper}>
        <div className={styles.colorPicker}>
          <ChromePicker
            color={colorPicker}
            onChangeComplete={color => setColorPicker(color.hex)}
          />
        </div>
        <Button
          color="primary"
          variant="contained"
          onClick={() => performActuate(colorPicker)}
        >
          Change Color
        </Button>
      </div>
    );
  }

  return <DialogContent>Sorry, unknown property.</DialogContent>;
}

export default ActuateDialogContent;
