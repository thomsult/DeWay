/* eslint-disable react/prop-types */
// @ts-nocheck
import React from "react";
import { Marker, Tooltip } from "react-leaflet";
import L from "leaflet";

import filterByEntreprise from "./ServiceEntreprise";

const iconPoleEmploi = L.icon({
  iconUrl: "./marker-pb.svg",
  iconSize: [47, 53],
  iconAnchor: [23, 53],
  popupAnchor: [0, 0],
});

const iconPrincipal = L.icon({
  iconUrl: "./marker.svg",
  iconSize: [47, 53],
  iconAnchor: [23, 53],
  popupAnchor: [0, 0],
});

function MarkerListWithLocAndName(props) {
  const { icon, Loc, LocOfGroup, children, Offre, onClick } = props;
  if (icon) {
    return (
      <Marker
        icon={iconPoleEmploi}
        position={Loc || LocOfGroup || [0, 0]}
        Offre={Offre}
        eventHandlers={{
          click: onClick,
        }}
      >
        {children}
      </Marker>
    );
  }
  return (
    <Marker
      icon={iconPrincipal}
      position={Loc || LocOfGroup}
      Offre={Offre}
      eventHandlers={{
        click: onClick,
      }}
    >
      {children}
    </Marker>
  );
}

function MarkerJob({ name, Offre, Loc, onClick }) {
  let src = "";
  let nameOfGroup = "";
  let LocOfGroup = [];
  let icons = false;
  if (name === "Noncomuniquer") {
    LocOfGroup = [43.605043, 1.433195];
    nameOfGroup = "Pas de Nom d'entreprise";
    src = "./marker-pb.svg";
    icons = true;
  }
  try {
    src = Offre[0].entreprise.logo;
  } catch (error) {
    src = "./marker-pb.svg";
  }
  if (name === "Pas de Localisation") {
    icons = true;
    // eslint-disable-next-line no-unused-vars
    src = "./marker-pb.svg";
  }

  return (
    Offre[0] && (
      <MarkerListWithLocAndName
        Loc={Loc}
        LocOfGroup={LocOfGroup}
        icon={icons}
        Offre={Offre}
        onClick={onClick}
      >
        <Tooltip offset={[10, -40]}>{nameOfGroup || name}</Tooltip>
      </MarkerListWithLocAndName>
    )
  );
}
// []

export function MarkerToulouse(props) {
  return filterByEntreprise(props.data.data, props.Siret).map(
    ([nameOfEl, el]) => {
      const i = Math.floor(Math.random() + 1 * 100);
      if (nameOfEl === "NoLocation") {
        const newP = [];
        el.forEach(([, { Offre }]) => {
          newP.push(Offre);
        });

        return (
          <MarkerJob
            key={el.id + i}
            name="Pas de Localisation"
            city={props.city}
            Offre={newP.flat()}
            Loc={[43.599043, 1.433195]}
            onClick={props.onClick}
          />
        );
      }
      return (
        <MarkerJob
          key={nameOfEl + el.id + i}
          name={nameOfEl}
          city={props.city}
          Offre={el.Offre}
          Loc={el.Loc}
          onClick={props.onClick}
        />
      );
    }
  );
}

export function MarkerOther({ cityOfOffres, data, onClick }) {
  return data[0] !== undefined ? (
    <Marker
      position={[
        data[0].lieuTravail.latitude || 43.605043,
        data[0].lieuTravail.longitude || 1.433195,
      ]}
      icon={iconPoleEmploi}
      Offre={data}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Tooltip offset={[20, -40]}>
        <p>
          <strong>{data.length}</strong> offres à{" "}
          <strong>{cityOfOffres}</strong>
        </p>
      </Tooltip>
    </Marker>
  ) : null;
}

export function MarkerJobList(props) {
  const { data, city, Siret, onClick } = props;

  if (data[0] !== undefined) {
    const cityOfOffres = city.substring(5, city.length);

    return cityOfOffres.includes("TOULOUSE") ? (
      <MarkerToulouse
        data={props}
        city={cityOfOffres}
        Siret={Siret}
        onClick={onClick}
      />
    ) : (
      <MarkerOther cityOfOffres={cityOfOffres} data={data} onClick={onClick} />
    );
  }
  return null;
}
