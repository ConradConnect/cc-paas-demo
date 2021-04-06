import React from "react";

import {
  VictoryAxis,
  VictoryLine,
  VictoryChart,
  VictoryTheme,
  VictoryContainer,
  VictoryPortal,
  VictoryLabel
} from "victory";

function GenericLineChart(props) {
  const timestampToString = timestamp => {
    const date = new Date(Number(timestamp)).toLocaleDateString("de-DE");
    const time = new Date(Number(timestamp)).toLocaleTimeString("de-DE");
    return `${date} ${time}`;
  };

  const { label, yAxisProps, interpolation, yLabelOffset, chartData } = props;

  return (
    <VictoryChart width={600} theme={VictoryTheme.material}>
      <VictoryAxis
        tickFormat={tick => timestampToString(tick)}
        style={{
          tickLabels: {
            angle: -45,
            verticalAnchor: "middle",
            textAnchor: "end",
            padding: 5
          }
        }}
        tickLabelComponent={
          <VictoryPortal>
            <VictoryLabel />
          </VictoryPortal>
        }
      />
      <VictoryAxis
        {...yAxisProps}
        label={label}
        dependentAxis
        axisLabelComponent={<VictoryLabel renderInPortal dy={yLabelOffset} />}
      />
      <VictoryLine
        interpolation={interpolation}
        containerComponent={<VictoryContainer responsive={false} />}
        animate={{
          duration: 2000,
          onLoad: { duration: 1000 }
        }}
        style={{
          data: { stroke: "#c43a31", strokeWidth: 2 },
          parent: { border: "1px solid #ccc" }
        }}
        data={chartData}
        x="timestamp"
        y="value"
      />
    </VictoryChart>
  );
}

export default GenericLineChart;
