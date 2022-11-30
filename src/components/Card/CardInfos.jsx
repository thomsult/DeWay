import React, { useEffect, useRef } from "react";
import { FilterLanguageByDescription } from "../../services/FilterLanguage";
import "./card.css";

export default function CardInfos({ Offres, onClose }) {
  const Offre = Offres[0];
  const ref = useRef();

  const ScrollToTop = () => {
    ref.current.parentElement.scroll(0, 0);
    document.querySelector("[data-rsbs-scroll]").scroll(0, 0);
  };
  useEffect(() => ScrollToTop(), [ref]);
  return (
    <div className="emploi__un" ref={ref}>
      <div>
        <button type="button" className="voir Close" onClick={onClose}>
          <img src="/Cross.png" alt="" />
        </button>
      </div>

      <div className="emploi__description__un">
        <div className="emploi__description__header">
          <h1>{Offre.appellationlibelle}</h1>
        </div>
        <div className="emploi__entreprise__un">
          <ul className="list__element__card__un">
            <li />
            {Offre.entreprise.nom && (
              <li>
                <img src="/building-solid.svg" alt="" className="icon" />
                {Offre.entreprise.nom}
              </li>
            )}
            <li>
              <img src="/file-contract-solid.svg" alt="" className="icon" />
              {Offre.typeContrat}
            </li>
            <li>
              <img src="/location-dot-solid.svg" alt="" className="icon" />
              {Offre.lieuTravail.libelle}
            </li>
            {Offre.formations && (
              <li>
                <img src="/graduation-cap-solid.svg" alt="" className="icon" />
                {Offre.formations[0].niveauLibelle}
              </li>
            )}
          </ul>

          <p className="textDescription">{Offre.description}</p>
        </div>
        <div className="resultat__filter">
          <FilterLanguageByDescription description={Offre.description} />
        </div>
      </div>
      <button className="Up" type="button" onClick={ScrollToTop}>
        <img src="/symbole-fleche-grise.png" alt="" />
      </button>
      <div className="btn__postuler__un">
        <button type="button">
          <a
            href={Offre.origineOffre.urlOrigine}
            target="_blank"
            rel="noreferrer"
          >
            Postuler
          </a>
        </button>
      </div>
    </div>
  );
}

/* export default CardInfos;
 */
