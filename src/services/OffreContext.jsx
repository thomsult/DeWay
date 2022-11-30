import React, { createContext, useEffect, useReducer } from "react";
import { MapContext } from "./MapContext";
import GetApi from "./GetApi";

const DefaultValue = { SetFilterContext: () => {} };
const ContextOffres = createContext(DefaultValue);

function OffresReducer(state, { type, value }) {
  if (type === "Load") {
    return { ...value };
  }
  if (type !== "Load") {
    const obj = { ...state };
    obj[`${type}`] = value;
    return obj; //
  }
}

function OffresContext({ children }) {
  const [state, dispatch] = useReducer(OffresReducer, DefaultValue);
  const SetIsLoaded = (e) => {
    dispatch({ type: "Loading", value: e });
  };
  const setData = (e) => {
    SetIsLoaded(0);
    dispatch({
      type: "Load",
      value: {
        Loading: 0,
        communes: e[0],
        quartierslocale: e[1],
        Siret: e[3],
        OffresPoleEmploi: e[2],
        OffresPoleEmploiFiltered: [],
        SetFilterContext: (Filter) => {
          dispatch({ type: "OffresPoleEmploiFiltered", value: Filter });
        },
      },
    });

    setTimeout(() => {
      SetIsLoaded(100);
    }, 500);
  };

  useEffect(() => {
    GetApi(setData);
  }, []);
  // console.log("UpdateOffresContext",state);
  return (
    <ContextOffres.Provider value={state}>
      <MapContext data={state.Loading === 100 && state}>{children}</MapContext>
    </ContextOffres.Provider>
  );
}
export { ContextOffres, OffresContext, OffresReducer };
