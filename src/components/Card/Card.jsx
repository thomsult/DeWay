import React, { useContext } from "react";
import { Context } from "../../services/MapContext";
// import { useState } from "react";
import "./card.css";
// import CardInfos from "./CardInfos";

export default function Card({ resultats, onClick }) {
  // const [compArray, setCompArray] = useState([]);

  // const php =
  //   resultats.competences &&
  //   resultats.competences.filter((item) => item.libelle.includes("PHP"));
  const { ChangeLocation } = useContext(Context);

  return (
    <section
      className="emploi"
      onClick={() => {
        ChangeLocation(resultats.id);
      }}
      aria-hidden="true"
      id={resultats.id}
    >
      <div className="emploi__description">
        <div className="emploi__entreprise">
          <ul className="list__element__card">
            <li>
              <h1>{resultats.appellationlibelle}</h1>
              {/* <h3>Id de l'Offres: {resultats.id}</h3> */}
            </li>
            {resultats.entreprise.nom && (
              <li>
                <img
                  src="/building-solid.svg"
                  alt="building"
                  className="icon"
                />
                {resultats.entreprise.nom}
              </li>
            )}
            {/* <li>
              <button type="button" >
                Express
              </button>
            </li> */}
          </ul>
          <div className="btn__postuler">
            <button type="button">
              <a
                href={resultats.origineOffre.urlOrigine}
                target="_blank"
                rel="noreferrer"
              >
                Postuler
              </a>
            </button>
          </div>
        </div>
        <div className="emploi__entreprise">
          <ul className="list__element__card">
            <li>
              <img
                src="/file-contract-solid.svg"
                alt="contract"
                className="icon"
              />
              {resultats.typeContrat}
            </li>
            <li>
              <img
                src="/location-dot-solid.svg"
                alt="location"
                className="icon"
              />
              {resultats.lieuTravail.libelle}
            </li>
            {resultats.formations && (
              <li>
                <img src="/graduation-cap-solid.svg" alt="" className="icon" />
                {resultats.formations[0].niveauLibelle}
              </li>
            )}
          </ul>
          <button
            type="button"
            className="voir"
            onClick={onClick}
            data-id={resultats.id}
          >
            Détails de l'offre
          </button>
        </div>
      </div>
    </section>
  );
}
