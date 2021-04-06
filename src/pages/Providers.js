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

import {
  getProviders,
  connectProvider,
  refreshProvider,
  disconnectProvider
} from "../api";

import { useQuery, useMutation } from "react-query";

import { UserContext } from "../context/user";

import generalStyles from "../styles/General.module.css";

function Providers() {
  const { user } = React.useContext(UserContext);

  const { data: providerData } = useQuery(user && "getProviders", getProviders);

  const [connectProviderMutation] = useMutation(connectProvider);
  const [disconnectProviderMutation] = useMutation(disconnectProvider);

  const [refreshProviderMutation] = useMutation(refreshProvider);

  const search = window.location.search.substring(1);
  const params = new URLSearchParams(search);
  const connected = params.get("connected");
  React.useEffect(() => {
    console.log("refresh devices: ", connected);
    if (connected) {
      refreshProviderMutation({ provider: connected });
    }
  }, [connected]); // eslint-disable-line

  if (!user) {
    return (
      <div>
        <h3>Not logged in</h3>
        Please login to see the providers
      </div>
    );
  }
  const notAuthenticated = (
    <div className={`${generalStyles.chip} ${generalStyles.noChip}`}>
      <span>NO</span>
    </div>
  );
  const isAuthenticated = (
    <div className={`${generalStyles.chip} ${generalStyles.yesChip}`}>
      <span>YES</span>
    </div>
  );

  let providers;
  if (providerData && providerData.data) {
    providers = providerData.data;
  }

  const onClickConnect = async id => {
    try {
      await connectProviderMutation({
        provider: id,
        redirect_uri: `${window.location.href}?connected=${id}`
      });
    } catch (error) {}
  };

  const onClickDisconnect = async id => {
    try {
      await disconnectProviderMutation({
        provider: id
      });
    } catch (error) {}
  };

  const onClickRefresh = async id => {
    try {
      await refreshProviderMutation({
        provider: id
      });
    } catch (error) {}
  };

  return (
    <div>
      <h3>Providers</h3>

      {!providers && <CircularProgress />}

      {providers && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell></TableCell>
                <TableCell>Name</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Authenticated</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {providers.map(row => (
                <TableRow key={row.id}>
                  <TableCell component="th" scope="row">
                    <img
                      style={{ height: "40px" }}
                      alt={row.name}
                      src={row.info.logoUrl}
                    ></img>
                  </TableCell>
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{row.type}</TableCell>
                  <TableCell align="right">
                    {row.isAuthenticated ? isAuthenticated : notAuthenticated}
                  </TableCell>
                  <TableCell align="right">
                    {!row.isAuthenticated && (
                      <Button
                        color="primary"
                        onClick={() => onClickConnect(row.id)}
                      >
                        Connect
                      </Button>
                    )}
                    {row.isAuthenticated && (
                      <Button
                        color="secondary"
                        onClick={() => onClickDisconnect(row.id)}
                      >
                        Disconnect
                      </Button>
                    )}

                    {row.isAuthenticated && (
                      <Button
                        color="default"
                        onClick={() => onClickRefresh(row.id)}
                      >
                        Refresh
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default Providers;
