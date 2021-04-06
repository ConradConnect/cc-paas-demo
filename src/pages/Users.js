import React from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import CircularProgress from "@material-ui/core/CircularProgress";

import { getUsers, createUser } from "../api";

import { useQuery, useMutation } from "react-query";

import styles from "../styles/Users.module.css";

import MuiAlert from "@material-ui/lab/Alert";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Users() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const { data: userData } = useQuery("getUsers", getUsers);

  const [
    createUserMutation,
    { data: newUserData, isLoading: createIsLoading }
  ] = useMutation(createUser, {
    refetchQueries: ["getUsers"]
  });

  const onCreateUser = async e => {
    e.preventDefault();

    try {
      await createUserMutation({ email, password });
    } catch (error) {}
  };

  let users;
  if (userData) {
    users = userData.data;
  }

  return (
    <div>
      <h3>Create User</h3>
      <div>
        <div className={styles.formField}>
          <TextField
            label="E-Mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            variant="outlined"
          />
        </div>
        <div className={styles.formField}>
          <TextField
            value={password}
            onChange={e => setPassword(e.target.value)}
            label="Password"
            variant="outlined"
          />
        </div>
        <Button variant="contained" color="primary" onClick={onCreateUser}>
          Create User
        </Button>
        <br />
        {createIsLoading && <CircularProgress />}
        {newUserData && !newUserData.statusCode && (
          <div style={{ marginTop: "20px" }}>
            <Alert severity="success">New User created!</Alert>
          </div>
        )}
        {newUserData && newUserData.statusCode && (
          <div style={{ marginTop: "20px" }}>
            <Alert severity="error">{newUserData.message}</Alert>
          </div>
        )}
      </div>
      <h3 className={styles.listUsers}>List Users</h3>

      {!users && <CircularProgress />}

      {users && (
        <TableContainer component={Paper}>
          <Table aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Email</TableCell>
                <TableCell align="right">Created at</TableCell>
                <TableCell align="right">Language</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(row => (
                <TableRow key={row.email}>
                  <TableCell component="th" scope="row">
                    {row.email}
                  </TableCell>
                  <TableCell align="right">{row.createdAt}</TableCell>
                  <TableCell align="right">{row.language}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}

export default Users;
