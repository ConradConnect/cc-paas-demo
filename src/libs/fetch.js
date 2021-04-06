export default async function(...args) {
  const res = await fetch(...args);
  if (res.status === 204) return {};
  return await res.json();
}
