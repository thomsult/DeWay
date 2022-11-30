// @ts-nocheck
import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import useSupercluster from "use-supercluster";
import { Marker, useMap, Popup } from "react-leaflet";
import { bikeIcon, clusterIcon } from "./icon";
import "./MarkerBikes.css";

const APIKey = import.meta.env.VITE_JCDECAUX_API_KEY;

function ShowBikes() {
  const [dataBikes, setDataBikes] = useState([]);

  const callAPIBikes = () => {
    axios
      .get(
        `https://api.jcdecaux.com/vls/v1/stations?contract=toulouse&apiKey=${APIKey}`
      )
      .then((response) => setDataBikes(response.data))
      .catch((err) => console.error(err.data));
  };
  useEffect(() => {
    let intervalId = 0;
    if (APIKey !== "YOUR_KEY" && APIKey !== undefined) {
      callAPIBikes();
      intervalId = setInterval(() => callAPIBikes(), 5000);
    }
    return () => clearInterval(intervalId);
  }, []);

  const maxZoom = 22;
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(12);
  const map = useMap();

  // get map bounds
  function updateMap() {
    const b = map.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat,
    ]);
    setZoom(map.getZoom());
  }

  const onMove = useCallback(() => {
    updateMap();
  }, [map]);

  useEffect(() => {
    updateMap();
  }, [map]);

  useEffect(() => {
    map.on("move", onMove);
    return () => {
      map.off("move", onMove);
    };
  }, [map, onMove]);

  const points = dataBikes.map((borne) => ({
    type: "Feature",
    properties: {
      cluster: false,
      bikeId: borne.address + borne.number,
      category: null,
      bikeName: borne.name,
      bikeAvailable: borne.available_bikes,
      standAvailable: borne.available_bike_stands,
    },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(borne.position.lng),
        parseFloat(borne.position.lat),
      ],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 200, maxZoom: 15 },
  });

  return (
    APIKey &&
    clusters.map((cluster) => {
      // every cluster point has coordinates
      const [longitude, latitude] = cluster.geometry.coordinates;
      // the point may be either a cluster or a point
      const { cluster: isCluster } = cluster.properties;

      // we have a cluster to render
      if (isCluster) {
        return (
          <Marker
            key={`cluster-${cluster.id}`}
            position={[latitude, longitude]}
            icon={clusterIcon}
            eventHandlers={{
              click: () => {
                const expansionZoom = Math.min(
                  supercluster.getClusterExpansionZoom(cluster.id),
                  maxZoom
                );
                map.setView([latitude, longitude], expansionZoom, {
                  animate: true,
                });
              },
            }}
          />
        );
      }

      // we have a single point to render
      return (
        <Marker
          key={`bike-${cluster.properties.bikeId}`}
          position={[latitude, longitude]}
          icon={bikeIcon}
        >
          <Popup maxWidth="300px" maxHeight="200px">
            <div className="popupBike">
              <h4>
                {cluster.properties.bikeName.substring(
                  8,
                  cluster.properties.bikeName.length
                )}
              </h4>
              <div className="popupBike-text">
                <div>
                  {cluster.properties.bikeAvailable < 5 ? (
                    <img src="./logo_red.png" alt="logo vélo" width="25px" />
                  ) : (
                    <img src="./logo.png" alt="logo vélo" width="25px" />
                  )}
                  <p>
                    {cluster.properties.bikeAvailable > 0
                      ? cluster.properties.bikeAvailable
                      : "0"}
                  </p>
                </div>
                <div>
                  {cluster.properties.standAvailable < 5 ? (
                    <img
                      src="./parking_red.png"
                      alt="logo parking rouge"
                      width="15px"
                    />
                  ) : (
                    <img src="./parking.png" alt="logo parking" width="15px" />
                  )}
                  <p>
                    {cluster.properties.standAvailable > 0
                      ? cluster.properties.standAvailable
                      : "0"}
                  </p>
                </div>
              </div>
            </div>
          </Popup>
        </Marker>
      );
    })
  );
}

export default ShowBikes;
