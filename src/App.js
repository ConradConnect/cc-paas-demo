import React from "react";
import "./App.css";

import styles from "./styles/App.module.css";

import { StylesProvider } from "@material-ui/core/styles";

import Button from "@material-ui/core/Button";

import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";

import { getLogin } from "./utils/user-helper";
import { UserContext } from "./context/user";

import Users from "./pages/Users";
import Login from "./pages/Login";
import Providers from "./pages/Providers";
import Devices from "./pages/Devices";
import Events from "./pages/Events";

function App() {
  const [user, setUser] = React.useState(null);

  React.useEffect(() => {
    const user = getLogin();

    if (user) {
      setUser(user);
    }
  }, []);

  return (
    <StylesProvider injectFirst>
      <UserContext.Provider value={{ user, setUser }}>
        <Router>
          <div className="App">
            <div className={styles.header}>
              {user && (
                <div className={styles.userLogin}>
                  Logged in as <b>{user.email}</b>
                </div>
              )}
              <h1 className={styles.headerTitle}>Conrad Connect PaaS Demo</h1>
            </div>

            <div className={styles.mainWrapper}>
              <div className={styles.sidebar}>
                <Button
                  component={Link}
                  to="/users"
                  variant="contained"
                  className={styles.menuButton}
                >
                  USER
                </Button>
                <Button
                  component={Link}
                  to="/login"
                  variant="contained"
                  className={styles.menuButton}
                >
                  {user && "SWITCH LOGIN"}
                  {!user && "LOGIN"}
                </Button>
                <Button
                  component={Link}
                  to="/providers"
                  variant="contained"
                  className={styles.menuButton}
                >
                  PROVIDER
                </Button>
                <Button
                  component={Link}
                  to="/devices"
                  variant="contained"
                  className={styles.menuButton}
                >
                  DEVICES
                </Button>
                <Button
                  component={Link}
                  to="/events"
                  variant="contained"
                  className={styles.menuButton}
                >
                  EVENTS
                </Button>
              </div>

              <div className={styles.main}>
                <Switch>
                  <Route path="/users">
                    <Users />
                  </Route>
                  <Route path="/login">
                    <Login />
                  </Route>
                  <Route path="/providers">
                    <Providers />
                  </Route>
                  <Route path="/devices">
                    <Devices />
                  </Route>
                  <Route path="/events">
                    <Events />
                  </Route>
                  <Route path="/">
                    <Users />
                  </Route>
                </Switch>
              </div>
            </div>
          </div>
        </Router>
      </UserContext.Provider>
    </StylesProvider>
  );
}

export default App;
