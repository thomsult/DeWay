function GetLocalStorage(key) {
  return JSON.parse(localStorage.getItem(key));
}
function SetLocalStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
  return data;
}
export { GetLocalStorage, SetLocalStorage };
