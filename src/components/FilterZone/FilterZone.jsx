import React, { useState, useContext, useEffect, useRef } from "react";
// eslint-disable-next-line import/no-extraneous-dependencies
// eslint-disable-next-line import/no-unresolved
import CardList from "@components/Card/CardList";
import { ClickAwayListener } from "@mui/material";
import { ContextOffres } from "../../services/OffreContext";
import "./FilterZone.css";
import { FilterLanguage } from "../../services/FilterLanguage";
import { Context } from "../../services/MapContext";

function FilterZone({ filterOpen, result = false }) {
  const { OffresPoleEmploi, SetFilterContext, OffresPoleEmploiFiltered } =
    useContext(ContextOffres);
  const { stateOfContent, FirstOfCard } = useContext(Context);

  const [ResultLanguage, SetResultLanguage] = useState([]);
  const [FiltreLanguage, SetFiltreLanguage] = useState([]);
  const [ResultFiltre, SetResultFiltre] = useState([]);
  // States modal
  const [open, setOpen] = useState(false);

  // States pour les filtres
  const [filtersContract, setFiltersContract] = useState([
    { label: "CDI", value: false },
    { label: "CDD", value: false },
    { label: "Autre", value: false },
  ]);

  const [filterAlternance, setFilterAlternance] = useState({
    label: "alternance",
    value: false,
  });

  const [filtersExperience, setFiltersExperience] = useState([
    { label: "Débutant", value: false },
    { label: "Expérimenté", value: false },
  ]);

  // Fonctions de filtre
  function handleFiltersContract(arroffres) {
    const cdi = filtersContract[0].value
      ? arroffres.filter((e) => e.typeContrat === "CDI")
      : [];
    const cdd = filtersContract[1].value
      ? arroffres.filter((e) => e.typeContrat === "CDD")
      : [];
    const autre = filtersContract[2].value
      ? arroffres.filter(
          (e) => e.typeContrat !== "CDI" && e.typeContrat !== "CDD"
        )
      : [];
    const resultContract = [...cdi, ...cdd, ...autre];

    return resultContract.length === 0 ? arroffres : resultContract;
  }

  function handleFilterAlternance(arroffres) {
    const alternance =
      filterAlternance.value === true && arroffres.filter((e) => e.alternance);

    return alternance || arroffres;
  }

  function handleFiltersExperience(arroffres) {
    /* const debutant = filtersExperience[0].value
    ? arroffres.filter((e) => e.experienceExige === "D")
    : arroffres;
  const experimente = filtersExperience[1].value
    ? arroffres.filter((e) => e.experienceExige === "E")
    : arroffres;
*/
    const p = filtersExperience.map(({ label, value }) => {
      if (value === true) {
        return arroffres.filter((e) => e.experienceExige === label[0]);
      }
      return arroffres.filter((e) => e.experienceExige !== label[0]);
    });
    if (filtersExperience[0].value && !filtersExperience[1].value) {
      return [...p[0]];
    }
    if (filtersExperience[1].value && !filtersExperience[0].value) {
      return [...p[1]];
    }
    if (
      filtersExperience[0].value === true &&
      filtersExperience[1].value === true
    ) {
      return p.flat();
    }
    return p.flat();
  }
  // Fonctions toggle bouttons filtres
  function toggleContract(label) {
    setFiltersContract(
      filtersContract.map((e) => {
        return {
          label: e.label,
          value: e.label === label ? !e.value : e.value,
        };
      })
    );
  }

  function toggleAlternance() {
    setFilterAlternance({
      label: "alternance",
      value: !filterAlternance.value,
    });
  }

  function toggleExperience(label) {
    setFiltersExperience(
      filtersExperience.map((e) => {
        return {
          label: e.label,
          value: e.label === label ? !e.value : e.value,
        };
      })
    );
  }

  const refChild = useRef(null);

  // gestion de apparition/réduction de la zone des filtres
  const [openFilters, setOpenFilters] = useState(true);
  const handleClick = () => {
    setOpenFilters(!openFilters);
  };

  // récupérer la largeur de l'écran
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  useEffect(() => {
    setScreenWidth(window.innerWidth);
  }, [window.innerWidth]);
  const desktop = screenWidth > 700;

  useEffect(() => {
    if (filterOpen && FirstOfCard.length > 0) {
      setOpenFilters(false);
    }
    if (result) {
      setOpenFilters(true);
    }
    return () => {
      setOpenFilters(true);
    };
  }, [filterOpen, result]);

  // Résultat des filtres
  const ResultFilter = (OffresList) => {
    return handleFiltersContract(
      handleFiltersExperience(handleFilterAlternance(OffresList.resultats))
    );
  };

  useEffect(() => {
    if (OffresPoleEmploi) {
      SetResultFiltre(ResultFilter(OffresPoleEmploi));
    }
  }, [filtersExperience, filtersContract, filterAlternance, OffresPoleEmploi]);

  useEffect(() => {
    if (OffresPoleEmploi) {
      SetFilterContext({
        resultats: ResultLanguage,
      });
    }
  }, [ResultFiltre, FiltreLanguage, OffresPoleEmploi, ResultLanguage]);

  try {
    return (
      ResultFiltre && (
        <div
          className={filterOpen ? "filter-panel open" : "filter-panel close"}
        >
          <h2>Filtrer votre recherche</h2>
          <div className="filters-container">
            {ResultFiltre && (
              <p>
                <span>
                  {OffresPoleEmploiFiltered !== undefined &&
                    OffresPoleEmploiFiltered.resultats.length}
                </span>{" "}
                {OffresPoleEmploiFiltered.resultats === 1 ||
                OffresPoleEmploiFiltered.resultats.length === 0
                  ? `offre d'emploi`
                  : `offres d'emploi`}
              </p>
            )}
            <ClickAwayListener
              onClickAway={() => {
                setOpen(false);
              }}
            >
              <>
                {desktop ? (
                  <button
                    type="button"
                    onClick={handleClick}
                    className="filterModal"
                  >
                    {openFilters
                      ? "Afficher les offres"
                      : "Afficher les filtres"}
                  </button>
                ) : null}
                {openFilters ? (
                  <>
                    <div className="contract-zone">
                      <h3>Type de contrat</h3>
                      {filtersContract.map((e) => (
                        <button
                          type="button"
                          key={e.label}
                          className={
                            e.value
                              ? "filter filter-active"
                              : "filter filter-none"
                          }
                          onClick={() => toggleContract(e.label, e.value)}
                        >
                          {e.label}
                        </button>
                      ))}
                      <button
                        type="button"
                        className={
                          filterAlternance.value
                            ? "filter filter-active"
                            : "filter filter-none"
                        }
                        onClick={toggleAlternance}
                      >
                        Alternance
                      </button>
                    </div>
                    <div className="experience-zone">
                      <h3>Expérience</h3>
                      {filtersExperience.map((e) => (
                        <button
                          type="button"
                          key={e.label}
                          className={
                            e.value
                              ? "filter filter-active"
                              : "filter filter-none"
                          }
                          onClick={() => toggleExperience(e.label, e.value)}
                        >
                          {e.label}
                        </button>
                      ))}
                    </div>

                    <div className="language-zone">
                      <h3>Langage</h3>
                      {ResultFiltre && (
                        <FilterLanguage
                          OffresPoleEmploiFiltered={ResultFiltre}
                          SetResult={SetResultLanguage}
                          parent={{ FiltreLanguage, SetFiltreLanguage }}
                        />
                      )}
                    </div>
                  </>
                ) : (
                  <div
                    ref={refChild}
                    className={`${
                      open ? "Open" : "Close"
                    } BottomSheetContent card__viewPort`}
                  >
                    <CardList
                      data={ResultFiltre}
                      FirstOfC={FirstOfCard}
                      onClick={(e) => {
                        return e;
                      }}
                      Etat={stateOfContent}
                      OnChange={(e) => {
                        return e;
                      }}
                    />
                  </div>
                )}
              </>
            </ClickAwayListener>
          </div>
        </div>
      )
    );
  } catch (error) {
    return null;
  }
}

export default FilterZone;
