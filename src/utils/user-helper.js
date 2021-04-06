export function saveLogin(user) {
  console.log(user);
  localStorage.setItem("user", JSON.stringify(user));
}

export function getLogin() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (user && user.accessToken) {
    return user;
  }
  return null;
}

export function authHeader() {
  const user = getLogin();
  if (user && user.accessToken) {
    return { Authorization: `Bearer ${user.accessToken}` };
  }
  return {};
}
