import React from "react";

import CircularProgress from "@material-ui/core/CircularProgress";
import Card from "@material-ui/core/Card";
import DeleteIcon from "@material-ui/icons/Delete";
import IconButton from "@material-ui/core/IconButton";
import Tooltip from "@material-ui/core/Tooltip";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert from "@material-ui/lab/Alert";

import JSONPretty from "react-json-pretty";

import { useQuery, useMutation } from "react-query";
import { getWebhookEvents, unsubscribeToEvent } from "../api";

import { UserContext } from "../context/user";

import styles from "../styles/Events.module.css";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Devices() {
  const { user } = React.useContext(UserContext);

  const { data: eventsData, isLoading } = useQuery(
    user && "getWebhookEvents",
    getWebhookEvents,
    { refetchInterval: 1000 }
  );

  const [unsubscribeToEventMutation] = useMutation(unsubscribeToEvent);

  const [snackbarOpen, setSnackbarOpen] = React.useState(false);

  if (!user) {
    return (
      <div>
        <h3>Not logged in</h3>
        Please login to see the events
      </div>
    );
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackbarOpen(false);
  };

  const handleUnsubscribeClick = async task => {
    try {
      await unsubscribeToEventMutation({ subscription: task });
      setSnackbarOpen(true);
    } catch (e) {}
  };

  return (
    <div>
      <h3>Events</h3>
      This page queries the events which were emitted by Conrad Connect.
      <br />
      Currently it does not filter for the logged in user.
      {isLoading && <CircularProgress />}
      {eventsData &&
        eventsData.webhooks &&
        eventsData.webhooks
          .map(event => {
            const keySplit = event.key.split("_");
            let date = "";
            let time = "";
            if (keySplit[1]) {
              date = new Date(Number(keySplit[1])).toLocaleDateString("de-DE");
              time = new Date(Number(keySplit[1])).toLocaleTimeString("de-DE");
            }
            return (
              <Card key={event.key} className={styles.webhookCard}>
                <div className={styles.webhookTitleRow}>
                  <div className={styles.webhookTitle}>
                    Webhook received: {date} {time}
                  </div>
                  <div className={styles.webhookTopRight}>
                    {event.value && event.value.task && (
                      <Tooltip title="Remove this webhook for future events">
                        <IconButton
                          aria-label="delete"
                          className={styles.deleteButton}
                          onClick={() =>
                            handleUnsubscribeClick(event.value.task)
                          }
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    )}
                  </div>
                </div>
                <div>
                  <JSONPretty data={event.value}></JSONPretty>
                </div>
              </Card>
            );
          })
          .reverse()}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity="success">
          Event unsubscribed!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default Devices;
