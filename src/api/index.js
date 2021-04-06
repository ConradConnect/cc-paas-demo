import customFetch from "../libs/fetch";
import { authHeader } from "../utils/user-helper";
import querystring from "querystring";

// We need to proxy the paasapi request, because the paasapi currently does not support cors. 
const basePath = "https://dashboard-staging.conradconnect.de/paasapi"

const webhookUrl =
  "https://mydaco-staging.conradconnect.de/External/v1/apiExtended/730ce9f0-531b-11ea-b5d4-cff7a45e585c/nw762r4j35he";

const apiUsername = process.env.REACT_APP_API_USERNAME
const apiPassword = process.env.REACT_APP_API_PASSWORD

export const createUser = ({ email, password, language = "en" }) =>
  customFetch(`${basePath}/users`, {
    method: "POST",
    headers: new Headers({
      Authorization: "Basic " + btoa(`${apiUsername}:${apiPassword}`),
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({
      email,
      password,
      language
    })
  });

export const getUsers = () =>
  customFetch(`${basePath}/users`, {
    method: "GET",
    headers: new Headers({
      Authorization: "Basic " + btoa(`${apiUsername}:${apiPassword}`)
    })
  });

export const loginUser = ({ email, password } = {}) =>
  customFetch(`${basePath}/oauth/token`, {
    method: "POST",
    headers: new Headers({
      Authorization: "Basic " + btoa(`${apiUsername}:${apiPassword}`),
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({
      grant_type: "password",
      username: email,
      password: password
    })
  });

export const getProviders = () =>
  customFetch(`${basePath}/providers`, {
    method: "GET",
    headers: new Headers(authHeader())
  });

export const connectProvider = async ({ provider, redirect_uri } = {}) => {
  const response = await fetch(
    `${basePath}/providers/${provider}/connect?redirect_uri=${encodeURI(
      redirect_uri
    )}`,
    {
      method: "POST",
      headers: new Headers(authHeader())
    }
  );
  if (response.redirected) {
    window.location.href = response.url;
  }
  return response;
};

export const refreshProvider = ({ provider } = {}) =>
  customFetch(`${basePath}/providers/${provider}/refresh`, {
    method: "POST",
    headers: new Headers(authHeader())
  });

export const disconnectProvider = ({ provider } = {}) =>
  customFetch(`${basePath}/providers/${provider}/disconnect`, {
    method: "POST",
    headers: new Headers(authHeader())
  });

export const disconnectAndDeleteDataProvider = ({ provider } = {}) =>
  customFetch(`${basePath}/providers/${provider}/disconnect-and-delete-data`, {
    method: "POST",
    headers: new Headers(authHeader())
  });

export const getDevices = (query = {}) =>
  customFetch(
    `${basePath}/abstraction/device?${querystring.stringify(query)}`,
    {
      method: "GET",
      headers: new Headers(authHeader())
    }
  );

export const actuateDevice = ({ device, property, value }) =>
  customFetch(`${basePath}/abstraction/device/${device}/actuate`, {
    method: "POST",
    headers: new Headers({
      ...authHeader(),
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({ property, value })
  });

export const getDevicesData = ({ device, property, ...rest }) =>
  customFetch(
    `${basePath}/abstraction/device/${device}/data/${property}?${querystring.stringify(
      rest
    )}`,
    {
      method: "GET",
      headers: new Headers(authHeader())
    }
  );

export const getDevicesDataLatest = ({ device, property }) =>
  customFetch(
    `${basePath}/abstraction/device/${device}/data/${property}/latest`,
    {
      method: "GET",
      headers: new Headers(authHeader())
    }
  );

export const subscribeToEvent = ({ device, triggers, event, token }) =>
  customFetch(`${basePath}/abstraction/device/${device}/event`, {
    method: "POST",
    headers: new Headers({
      ...authHeader(),
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({ triggers, event, token, url: webhookUrl })
  });

export const unsubscribeToEvent = ({ subscription }) =>
  customFetch(`${basePath}/abstraction/event/${subscription}`, {
    method: "DELETE",
    headers: new Headers({
      ...authHeader()
    })
  });

export const getSubscriptions = ({ token }) =>
  customFetch(`${basePath}/abstraction/subscriptions?token=${token}`, {
    method: "GET",
    headers: new Headers(authHeader())
  });

export const getWebhookEvents = () =>
  customFetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ secretPropertyReadMode: true })
  });

export const getDeviceTypes = () =>
  customFetch(`${basePath}/abstraction/device-types`, {
    method: "GET",
    headers: new Headers(authHeader())
  });

export const listAll = () =>
  customFetch(`${basePath}/abstraction/listAll`, {
    method: "GET",
    headers: new Headers(authHeader())
  });

export const getActionButtons = () =>
  customFetch(`${basePath}/abstraction/do`, {
    method: "GET",
    headers: new Headers(authHeader())
  });

export const pushActionButton = ({ project, event }) =>
  customFetch(`${basePath}/abstraction/do${project}`, {
    method: "POST",
    headers: new Headers({
      ...authHeader(),
      "Content-Type": "application/json"
    }),
    body: JSON.stringify({ event })
  });
