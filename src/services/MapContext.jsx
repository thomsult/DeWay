import React, { createContext, useEffect, useReducer } from "react";

const DefaultValue = {
  Loading: null,
  communes: null,
  quartierslocale: null,
  Siret: null,
  OffresPoleEmploi: null,
  location: null,
  LocationQuartier: null,
  Element: null,
  FirstOfCard: [],
};
const Context = createContext(DefaultValue);

function MapReducer(state, { type, value }) {
  // console.log(state, { type, value })
  if (type === "Load") {
    return value;
  }
  if (type !== "Load") {
    const obj = { ...state };
    obj[`${type}`] = value;
    return obj; //
  }
  return null;
}

function MapContext({ children, data }) {
  const [state, dispatch] = useReducer(MapReducer, DefaultValue);

  useEffect(() => {
    if (data) {
      dispatch({
        type: "Load",
        value: {
          ...state,
          Loading: data.Loading,
          communes: data.communes,
          quartierslocale: data.quartierslocale,
          Siret: data.Siret,
          OffresPoleEmploi: data.OffresPoleEmploiFiltered,
          OffresPoleEmploiFiltered: data.OffresPoleEmploiFiltered,
          ChangeLocation: (location) => {
            dispatch({ type: "location", value: location });
          },
          SetLocationQuartier: (LocationQuartier) => {
            dispatch({ type: "LocationQuartier", value: LocationQuartier });
          },
          SetElement: (El) => {
            dispatch({ type: "Element", value: El });
          },
          SetFirstOfCard: (El) => {
            dispatch({ type: "FirstOfCard", value: El });
          },
        },
      });
    }
  }, [data]);

  return <Context.Provider value={state}>{children}</Context.Provider>;
}
export { Context, MapContext, MapReducer };
