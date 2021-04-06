import React from "react";

import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import styles from "../styles/Login.module.css";

import { useMutation } from "react-query";

import { saveLogin } from "../utils/user-helper";

import { loginUser } from "../api";

import { UserContext } from "../context/user";

import MuiAlert from "@material-ui/lab/Alert";

import CircularProgress from "@material-ui/core/CircularProgress";

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function Login() {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const [
    loginUserMutation,
    { reset, data: loginData, isLoading: loginIsLoading }
  ] = useMutation(loginUser);

  const { setUser } = React.useContext(UserContext);

  const onLoginUser = async e => {
    e.preventDefault();
    reset();

    try {
      const user = await loginUserMutation({ email, password });
      const userObj = { email, accessToken: user.access_token, ...user };
      saveLogin(userObj);
      setUser(userObj);
    } catch (error) {}
  };

  return (
    <div>
      <h3>Login</h3>
      You can log here as any user, even if you are already logged in.
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
            type="password"
            onChange={e => setPassword(e.target.value)}
            label="Password"
            variant="outlined"
          />
        </div>
        <Button variant="contained" color="primary" onClick={onLoginUser}>
          LOGIN
        </Button>
        <br />

        {loginIsLoading && <CircularProgress />}

        {loginData && !loginData.error && (
          <div style={{ marginTop: "20px" }}>
            <Alert severity="success">Login successful!</Alert>
          </div>
        )}
        {loginData && loginData.error && (
          <div style={{ marginTop: "20px" }}>
            <Alert severity="error">{loginData.error_description}</Alert>
          </div>
        )}
      </div>
    </div>
  );
}

export default Login;
