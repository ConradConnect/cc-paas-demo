import React from "react";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import EditIcon from "@material-ui/icons/Edit";
import RemoveRedEyeIcon from "@material-ui/icons/RemoveRedEye";
import NotificationsIcon from "@material-ui/icons/Notifications";

import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";

import Chip from "@material-ui/core/Chip";

import { useQuery, useMutation } from "react-query";

import { UserContext } from "../context/user";
import { getDevices, subscribeToEvent, actuateDevice } from "../api";

// import styles from "../styles/Devices.module.css";

import ActuateDialogContent from "../components/ActuateDialogContent";
import ShowPropertyDialogContent from "../components/ShowPropertyDialogContent";

const makeChip = (text, props) => <Chip key={text} label={text} {...props} />;

function Devices() {
  const { user } = React.useContext(UserContext);

  const { data: devicesData } = useQuery(user && "getDevices", getDevices);

  const [subscribeToEventMutation] = useMutation(subscribeToEvent);

  const [actuateDeviceMutation] = useMutation(actuateDevice);

  const [actuationOpen, setActuationOpen] = React.useState(null);

  const [propertyWatchOpen, setPropertyWatchOpen] = React.useState(null);

  if (!user) {
    return (
      <div>
        <h3>Not logged in</h3>
        Please login to see the devices
      </div>
    );
  }

  const handlePropertyEditClick = (device, property) => {
    setActuationOpen({ device, property, actuateDeviceMutation });
  };

  const handlePropertyWatchClick = (device, property) => {
    setPropertyWatchOpen({ device, property });
  };

  const handleEventClick = async (device, event) => {
    await subscribeToEventMutation({
      device: device.id,
      event: event,
      token: user.email
    });
  };

  return (
    <div>
      <h3>Devices</h3>
      {!devicesData && <CircularProgress />}

      {devicesData && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="right">Provider</TableCell>
                <TableCell align="right">Types</TableCell>
                <TableCell align="left">Properties</TableCell>
                <TableCell align="left">Events</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {devicesData.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.providerFriendly}
                  </TableCell>
                  <TableCell align="right">
                    {row.metadata.types.map(t => makeChip(t))}
                  </TableCell>
                  <TableCell align="right">
                    {row.metadata.properties.map(property => {
                      const chipProperties = {
                        onClick: property.writable
                          ? () => handlePropertyEditClick(row, property.name)
                          : undefined,
                        color: property.writable ? "primary" : undefined,
                        icon: property.writable ? <EditIcon /> : undefined,
                        deleteIcon: property.readable ? (
                          <RemoveRedEyeIcon />
                        ) : (
                          undefined
                        ),
                        onDelete: property.readable
                          ? () => handlePropertyWatchClick(row, property.name)
                          : undefined
                      };
                      return makeChip(property.name, chipProperties);
                    })}
                  </TableCell>
                  <TableCell align="right">
                    {row.metadata.events.map(event => {
                      const chipProperties = {
                        onClick: () => handleEventClick(row, event.name),
                        icon: <NotificationsIcon />
                      };
                      return makeChip(event.name, chipProperties);
                    })}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog
        open={!!actuationOpen}
        onClose={() => setActuationOpen(null)}
        aria-labelledby="actuate-dialog-title"
      >
        <DialogTitle id="actuate-dialog-title">Actuation</DialogTitle>
        <ActuateDialogContent {...actuationOpen} />
        <DialogActions>
          <Button onClick={() => setActuationOpen(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!propertyWatchOpen}
        onClose={() => setPropertyWatchOpen(null)}
        aria-labelledby="watch-dialog-title"
      >
        <DialogTitle id="watch-dialog-title">Show Property</DialogTitle>
        <ShowPropertyDialogContent {...propertyWatchOpen} />
        <DialogActions>
          <Button onClick={() => setPropertyWatchOpen(null)} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Devices;
