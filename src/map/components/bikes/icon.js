import L from "leaflet";

// eslint-disable-next-line import/prefer-default-export
export const bikeIcon = L.icon({
  iconUrl: "./bike_popup.png",
  shadowUrl: null,
  iconSize: [50, 50], // size of the icon
  shadowSize: null, // size of the shadow
  iconAnchor: null, // point of the icon which will correspond to marker's location
  shadowAnchor: null, // the same for the shadow
  popupAnchor: [1, -15], // point from which the popup should open relative to the iconAnchor
});

export const clusterIcon = L.icon({
  iconUrl: "./logo_cluster.png",
  shadowUrl: null,
  iconSize: [60, 60], // size of the icon
  shadowSize: null, // size of the shadow
  iconAnchor: null, // point of the icon which will correspond to marker's location
  shadowAnchor: null, // the same for the shadow
  popupAnchor: [1, -15], // point from which the popup should open relative to the iconAnchor
});
