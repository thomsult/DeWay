import L from "leaflet";

const iconLocation = L.icon({
  iconUrl: "../../src/assets/icons/iconLoc.svg",

  iconSize: [90, 120],
  iconAnchor: [45, 100],
});
const iconDefault = L.icon({
  iconUrl: "../../src/assets/icons/icon.svg",

  iconSize: [47, 53],
  iconAnchor: [23, 53],
  popupAnchor: [23, 600],
});

export { iconLocation, iconDefault };
