import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";

import GenericLineChart from "../components/GenericLineChart";

import styles from "../styles/ShowPropertyDialogContent.module.css";

import { useQuery } from "react-query";

import { getDevicesData } from "../api";

function ShowPropertyDialogContent(props) {
  const dayAgo = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
  const [from, setFrom] = React.useState(dayAgo.getTime());

  const [until, setUntil] = React.useState(Date.now());

  const groupings = ["auto", "week", "day", "hour", "minute", "second"];
  const [grouping, setGrouping] = React.useState("auto");

  const aggregations = [
    "mean",
    "median",
    "min",
    "max",
    "sum",
    "count",
    "first",
    "last",
    "std",
    "percentile(0.1)",
    "percentile(0.5)",
    "percentile(0.9)" // any number > 0 and <=1
  ];
  const [aggregate, setAggregate] = React.useState("mean");

  const memoDevice = React.useMemo(() => props.device && props.device.id, [
    props.device
  ]);
  const memoProperty = React.useMemo(() => props.property, [props.property]);

  const { data, isLoading } = useQuery(
    props.device && [
      "getDevicesData",
      {
        from,
        until,
        grouping,
        aggregate,
        device: memoDevice,
        property: memoProperty
      }
    ],
    getDevicesData
  );

  if (!props.device) return null;

  if (isLoading) {
    return <CircularProgress />;
  }
  if (!data) {
    return "no data";
  }

  if (data.statusCode) {
    return "An error occurred";
  }

  const chartFiltered = data.filter(point => point.value !== null);

  let chartData;

  const chartOptions = {};

  if (props.property === "on_off") {
    chartData = chartFiltered.map(point => ({
      timestamp: point.timestamp,
      value: point.value ? 1 : 0
    }));
    chartOptions.label = "On/Off";
    chartOptions.interpolation = "stepAfter";
    chartOptions.yAxisProps = { tickValues: [0, 1], tickFormat: ["Off", "On"] };
    chartOptions.yLabelOffset = 0;
  } else {
    chartData = chartFiltered;
    chartOptions.label = props.property;
    chartOptions.interpolation = "linear";
    chartOptions.yLabelOffset = -50;
  }

  return (
    <div className={styles.wrapper}>
      <GenericLineChart chartData={chartData} {...chartOptions} />
    </div>
  );
}

export default ShowPropertyDialogContent;
