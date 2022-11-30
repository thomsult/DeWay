import React, { useState, useContext, useEffect } from "react";
import Box from "@mui/material/Box";
import { Modal } from "@mui/material"; // eslint-disable-next-line import/no-unresolved
import FilterZone from "@components/FilterZone/FilterZone";
import "./NavBar.css";
import { Context } from "../../services/MapContext";

function NavBar() {
  const [searchValue, setSearchValue] = useState("");
  const [filterOpen, setFilterOpen] = useState(false);
  const [ResultOpen, setResultOpen] = useState(false);
  // States modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // CSS de la modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: "80vw",
    height: "80vh",
    bgcolor: "background.paper",
    border: "1px solid #004AAD",
    borderRadius: "10px",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
  };

  const { quartierslocale, communes, SetLocationQuartier, FirstOfCard } =
    useContext(Context);
  const handleChange = (event) => {
    setSearchValue(event.target.value);
  };

  useEffect(() => {
    if (FirstOfCard.length > 0 && window.innerWidth > 1024) {
      setFilterOpen(true);
      setResultOpen(false);
    }
  }, [FirstOfCard]);

  const handleClick = () => {
    if (!ResultOpen) {
      setResultOpen(!ResultOpen);
    } else {
      setFilterOpen(!filterOpen);
    }
  };
  if (quartierslocale && communes) {
    const LocCommunes = communes.features.map((commune) => {
      return {
        quartier: commune.properties.libelle,
        location: commune.properties.geo_point_2d,
      };
    });

    const locQuartier = quartierslocale.features.map((quartier) => {
      return {
        quartier: quartier.properties.nom_quartier,
        location: quartier.properties.geo_point_2d,
      };
    });

    const dataQuartier = [...locQuartier, ...LocCommunes]
      .map((quartier) => quartier.quartier.split("/"))
      .flat();

    const moveTo = (e) => {
      const locationOf = [...locQuartier, ...LocCommunes].filter((user) =>
        user.quartier.includes(e.target.getAttribute("data-quartier"))
      );
      try {
        SetLocationQuartier(locationOf[0]);
        setSearchValue("");
      } catch (error) {
        console.warn("No Location");
      }
    };

    return (
      <>
        <div className="header__container">
          <ul className="navBar">
            <li>
              <div className="buttonProject">
                <button type="button" onClick={handleOpen}>
                  <img src="/DEWAY_-_LOGO.svg" alt="logo" width="50px" />
                </button>
                <Modal
                  open={open}
                  onClose={handleClose}
                  aria-labelledby="modal-modal-title"
                  aria-describedby="modal-modal-description"
                >
                  <Box sx={style}>
                    <div className="modal-style">
                      <img src="./dw_logo.svg" alt="projectGroup" width="200" />
                      <h4>Qu'est-ce que le projet DeWay ?</h4>
                      <p>
                        Né de la collaboration entre quatre développeurs en
                        formation - Anaïs, Marie-Hermine, Maxime et Thomas, le
                        projet DeWay a pour objectif de proposer l'ensemble des
                        offres d'emploi de développement informatique (ROME
                        M1805) dans la région de Toulouse, disponibles sur le
                        site de Pôle Emploi.
                      </p>
                      <h4>Mais pourquoi "DeWay" ?</h4>
                      <p>
                        "DeWay" vient de la contraction entre "Developpeur" et
                        "Way" ("chemin" en anglais). En effet, son objectif est
                        de vous aider à prendre la route qui vous mènera à
                        l'emploi !
                      </p>
                      <h4>Comment fonctionne l'application ?</h4>
                      <p>
                        DeWay se présente sous la forme d'une carte où vous
                        pouvez rechercher des offres d'emploi dans Toulouse et
                        sa région. En cliquant sur un <i>marker</i>, vous aurez
                        accès à les informations principales de l'offre d'emploi
                        (titre, entreprise, type de poste, expérience). Vous
                        pouvez accéder à l'ensemble des informations de l'offre
                        en cliquant sur "Voir plus". Vous pouvez également
                        accéder directement à la page Pôle Emploi en cliquant
                        sur le bouton "Postuler".
                      </p>
                      <h4>Et pourquoi les vélos ?</h4>
                      <p>
                        La cause écologique nous tenant à coeur, nous avons fait
                        le choix d'afficher les VélôToulouse afin que chaque
                        utilisateur sache quelles sont les bornes de vélos à
                        proximité de leur futur lieu de travail. C'est également
                        pour cette raison que nous avons décidé d'avoir le vélo
                        comme symbole de notre application.
                      </p>
                      <h4>D'où viennent les informations ?</h4>
                      <p>
                        Les offres d'emploi sont récupérées via l'
                        <a
                          href="https://pole-emploi.io/data/api/offres-emploi"
                          target="_blank"
                          rel="noreferrer"
                        >
                          API de Pôle Emploi
                        </a>
                        . Les adresses des entreprises sont également récupérées
                        via l'API de Pôle Emploi ou, si elles sont manquantes,
                        via l'
                        <a
                          href="https://data.toulouse-metropole.fr/explore/dataset/base-sirene-v3/information/?disjunctive.libellecommuneetablissement&disjunctive.etatadministratifetablissement&disjunctive.sectionetablissement&disjunctive.naturejuridiqueunitelegale"
                          target="_blank"
                          rel="noreferrer"
                        >
                          API Base SIRENE de Toulouse Métropole
                        </a>
                        . La localisation des bornes de VélôToulouse et la mise
                        à jour du nombre de vélos ou de places disponibles sont
                        récupérées via l'
                        <a
                          href="https://developer.jcdecaux.com/#/opendata/vls?page=getstarted"
                          target="_blank"
                          rel="noreferrer"
                        >
                          API de JCDecaux
                        </a>
                        , fournisseur des VélôToulouse.
                      </p>
                      <h4>Les membres du groupe</h4>
                      <p>
                        Cliquer sur chacun des membres pour voir leur profil
                        GitHub !
                        <br />
                        Sinon, vous pouvez{" "}
                        <a href="mailto:schneider.marieh@gmail.com">
                          contacter{" "}
                        </a>
                        le groupe.
                      </p>
                      <ul className="group-members">
                        <li>
                          <a
                            href="https://github.com/Milimaks/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src="./maxime.png" alt="maxime" width="200" />
                            Maxime
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://github.com/curiouseagle/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src="./anais.png" alt="anais" width="200" />
                            Anaïs
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://github.com/aimach/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src="./mh.png" alt="mh" width="200" />
                            Marie-Hermine
                          </a>
                        </li>
                        <li>
                          <a
                            href="https://github.com/thomsult/"
                            target="_blank"
                            rel="noreferrer"
                          >
                            <img src="./thomas.png" alt="thomas" width="200" />
                            Thomas
                          </a>
                        </li>
                      </ul>
                    </div>
                  </Box>
                </Modal>
              </div>
            </li>
            <li className="search__value">
              <input
                className="textArea"
                value={searchValue}
                type="text"
                placeholder="Recherchez dans votre quartier"
                onChange={handleChange}
              />
            </li>
            <li className="icon__header__deux">
              <button type="button" onClick={handleClick}>
                <img src="./filter-icon.svg" alt="filter icon" />
              </button>
            </li>
          </ul>

          <div className="search__filter">
            {searchValue &&
              dataQuartier
                .filter((user) => user.match(new RegExp(searchValue, "i")))
                .map((user) => {
                  return (
                    <button
                      type="button"
                      data-quartier={user}
                      className="search__result"
                      key={user}
                      onClick={moveTo}
                      onKeyDown={moveTo}
                    >
                      <img className="icons" src="./DEWAY_-_LOGO.svg" alt="" />
                      {user}
                    </button>
                  );
                })
                .slice(0, 4)}
          </div>
        </div>
        <FilterZone
          filterOpen={filterOpen}
          result={ResultOpen}
          handleClick={handleClick}
        />
      </>
    );
  }
}

export default NavBar;
