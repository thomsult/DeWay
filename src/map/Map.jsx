/* eslint-disable no-underscore-dangle */
import React, { useState, useEffect, useRef, useContext } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import L from "leaflet";
import UseLocation from "../services/UseLocation";
import "leaflet/dist/leaflet.css";
import ServiceMap from "./components/ServiceMap";
import ShowBikesW from "./components/bikes/ShowBikesWrap";
import { Context } from "../services/MapContext";

function SetLocation(LocationQuartier, mapRef) {
  mapRef.current.setView(LocationQuartier.location, 13);
}
function SetLocationById(Id, mapRef) {
  if (mapRef.current) {
    for (const key in mapRef.current._layers) {
      if (mapRef.current._layers[key].options.Offre) {
        const Offres = mapRef.current._layers[key].options.Offre;
        const filter = Offres.filter((el) => el.id === Id); // Context
        if (filter.length > 0) {
          const { lat, lng } = mapRef.current._layers[key]._latlng;
          mapRef.current.setView(new L.LatLng(lat, lng), 14);
        }
      }
    }
  }
}

export default function Map() {
  const accessToken = import.meta.env.VITE_ACCESS_TOKEN;
  const productMode = import.meta.env.VITE_PRODUCTION || "false";
  const {
    communes,
    quartierslocale,
    Siret,
    OffresPoleEmploi,
    location,
    Loading,
    LocationQuartier,
    Element,
    FirstOfCard,
  } = useContext(Context);

  const mapConfig = {
    lat: 43.604652,
    lng: 1.444209,
  };
  const mapRef = useRef();
  // Map Resize Begin
  const requestRef = useRef();

  const animate = () => {
    // The 'state' will always be the initial value here
    if (Element !== null && mapRef.current) {
      const heightOfMap = Element.style.cssText
        .split(";")[5]
        .split(":")[1]
        .replace("px", "");
      mapRef.current._container.style.setProperty(
        "--MapHeight",
        `${window.innerHeight - heightOfMap + 35}px`
      );
      mapRef.current.invalidateSize();
      requestRef.current = requestAnimationFrame(animate);
    }
  };

  useEffect(() => {
    if (requestRef.current == null && Element) {
      requestRef.current = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [Element]);

  // Map Resize End

  // Map Action

  const [mapZone, SetMapZone] = useState([]);

  // Action Zoom to Location By Id of Work
  useEffect(() => {
    if (mapRef.current) {
      SetLocationById(location, mapRef);
    }
  }, [location]);

  // Action Zoom to Location District
  useEffect(() => {
    if (mapRef.current) {
      SetLocation(LocationQuartier, mapRef);
      if (
        mapZone.findIndex((el) => el.quartier === LocationQuartier.quartier) ===
        -1
      ) {
        const dataSet = document.querySelector(
          `[Data-Quartier="${LocationQuartier.quartier}"]`
        );
        dataSet.setAttribute("Active", true);
        SetMapZone((mZone) => [...mZone, LocationQuartier]);
      } else {
        const dataSet = document.querySelector(
          `[Data-Quartier="${LocationQuartier.quartier}"]`
        );
        dataSet.setAttribute("Active", false);
        SetMapZone((mZone) => [
          ...mZone.filter((el) => el.quartier !== LocationQuartier.quartier),
        ]);
      }
    }
  }, [LocationQuartier]);

  useEffect(() => {
    if (document) {
      const dataSet = document.querySelectorAll(`[Data-Quartier]`);
      Array.from(dataSet).forEach((e) => {
        const active = e.attributes.Active.value === "false";
        const Attribute = {
          "stroke-opacity": active ? 0 : 1,
          stroke: active ? "rgba(0,0,0,0.2)" : "#0A72BF",
          fill: active ? "rgba(0,0,0,0.2)" : "#0a71bf1c",
          "stroke-dasharray": active ? "0" : "4 1",
          "stroke-linecap": active ? "round" : "4 1",
        };
        // eslint-disable-next-line guard-for-in
        for (const key in Attribute) {
          e.setAttribute(key, Attribute[key]);
        }
      });
    }
  }, [FirstOfCard, mapZone, location, LocationQuartier, OffresPoleEmploi]);
  // Map Action End
  const onEachZone = (zone, layer) => {
    const name = zone.properties.libelle || zone.properties.nom_quartier;
    layer
      .on("add", (e) => {
        e.target._path.setAttribute("Data-Quartier", name);
        e.target._path.setAttribute("Active", false);
      })
      .on("click", (e) => {
        const points = e.target.feature.properties.geo_point_2d;
        const result = { quartier: name, location: points };

        if (e.target._path.attributes.Active) {
          if (e.target._path.attributes.Active.value === "false") {
            e.target._path.attributes.Active.value = "true";
            SetMapZone((mZone) => [...mZone, result]);
          } else {
            e.target._path.attributes.Active.value = "false";
            SetMapZone((mZone) => [
              ...mZone.filter((el) => el.quartier !== name),
            ]);
          }
        }
      });

    layer.bindTooltip(name, {
      sticky: true,
    });
  };
  UseLocation({ map: mapRef });
  return (
    <MapContainer center={mapConfig} zoom={13} ref={mapRef} id="map-container">
      {productMode === "True" ? (
        <TileLayer
          url={`https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/512/{z}/{x}/{y}@2x?access_token=${accessToken}`}
          attribution='Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="https://www.mapbox.com/">Mapbox</a>'
        />
      ) : (
        <TileLayer
          // OpenStreetMap
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
      )}
      {Loading === 100 ? (
        <>
          <ServiceMap OffrePoleEmploi={OffresPoleEmploi} Siret={Siret} />
          <ShowBikesW />
          <GeoJSON
            // @ts-ignore
            style={{
              color: "rgba(0,0,0,0.2)",
              opacity: 0,
              fillOpacity: 0.1,
            }}
            key="commune"
            data={communes}
            onEachFeature={onEachZone}
          />
          <GeoJSON
            // @ts-ignore
            style={{
              color: "rgba(0,0,0,0.2)",
              opacity: 0,
              fillOpacity: 0.1,
            }}
            key="quartiers"
            data={quartierslocale}
            onEachFeature={onEachZone}
          />
        </>
      ) : (
        <div className="Template">Loading...</div>
      )}
    </MapContainer>
  );
}
