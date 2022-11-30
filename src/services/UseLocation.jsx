/* eslint-disable no-underscore-dangle */
import { useEffect } from "react";
import L from "leaflet";
import "leaflet-easybutton/src/easy-button";
import "leaflet-easybutton/src/easy-button.css";
import "../map/components/bikes/icon";

export default function UseLocation({ map }) {
  const icon = `<svg style="padding:4px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512"><!--! Font Awesome Pro 6.2.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><path d="M215.7 499.2C267 435 384 279.4 384 192C384 86 298 0 192 0S0 86 0 192c0 87.4 117 243 168.3 307.2c12.3 15.3 35.1 15.3 47.4 0zM192 256c-35.3 0-64-28.7-64-64s28.7-64 64-64s64 28.7 64 64s-28.7 64-64 64z"/></svg>`;
  const mapCurrent = map.current;

  const markerGeoloc = L.icon({
    iconUrl: "./geoloc-marker.png",
    iconSize: [64, 76],
    iconAnchor: [32, 76],
    popupAnchor: [0, 0],
  });
  const marker = L.marker([0, 0], {
    icon: markerGeoloc,
    draggable: "true",
    alt: "MarkerPos",
  }).on("add", (e) => {
    e.target._icon.id = "MarkerPos";
    // e.target._shadow.id = "MarkerPosShadow";
  });

  useEffect(() => {
    if (!mapCurrent) return;
    L.easyButton(`<span>${icon}</span>`, () => {
      mapCurrent
        .locate()
        .on("locationfound", (e) => {
          marker.setLatLng(e.latlng);
          mapCurrent.addLayer(marker);
          mapCurrent.flyTo(e.latlng, mapCurrent.getZoom());
        })
        .on("locationerror", () => {
          const origin = mapCurrent.getCenter();
          marker.setLatLng(origin);
          mapCurrent.addLayer(marker);
          mapCurrent.flyTo(origin, mapCurrent.getZoom());
        });
    }).addTo(mapCurrent);
  }, [mapCurrent]);
  return null;
}
