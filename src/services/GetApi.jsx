import axios from "axios";
import { GetLocalStorage, SetLocalStorage } from "./LocalStorage";

const GitHub =
  "https://raw.githubusercontent.com/thomsult/leaft-React/main/src/assets/";

function GetWorkName(Array) {
  return Array.resultats
    .map((Offres) => {
      return Offres.entreprise.nom;
    })
    .filter((item, pos, arr) => arr.indexOf(item) === pos && item);
}
const productMode = import.meta.env.VITE_PRODUCTION || false;

function GetLocationOf(Arrays, setData, data) {
  if (GetLocalStorage("Siret") !== null) {
    setData([...data, GetLocalStorage("Siret")]);
  } else if (productMode) {
    axios
      .get(
        `https://raw.githubusercontent.com/thomsult/leaft-React/main/src/assets/Siret.json`
      )
      .then((res) => {
        SetLocalStorage("Siret", res.data);
        setData([...data, res.data]);
      });
  } else {
    axios
      .all(
        Arrays.map((el) =>
          axios.get(
            `https://data.toulouse-metropole.fr/api/records/1.0/search/?dataset=base-sirene-v3&q=${el}`
          )
        )
      )
      .then(
        axios.spread((...resultData) => {
          localStorage.setItem(
            "Siret",
            JSON.stringify(resultData.map((item) => item.data))
          );
          setData([...data, resultData.map((item) => item.data)]);
        })
      )
      .catch((er) => {
        console.warn(er);
      });
  }
}

export default async function GetApi(setData) {
  axios.get(`${GitHub}import.json`).then((result) => {
    const Works = GetWorkName(result.data);
    SetLocalStorage("Offres", result.data);
    axios
      .all([
        GetLocalStorage("communes") === null &&
          axios.get(
            "https://data.toulouse-metropole.fr/api/v2/catalog/datasets/communes/exports/geojson?limit=-1&offset=0&lang=fr&timezone=Europe%2FParis"
          ),
        GetLocalStorage("quartierslocale") === null &&
          axios.get(
            "https://data.toulouse-metropole.fr/api/v2/catalog/datasets/quartiers-de-democratie-locale/exports/geojson?limit=-1&offset=0&lang=fr&timezone=Europe%2FParis"
          ),
      ])
      .then(
        axios.spread((data1, data2) => {
          // output of req.
          const communes =
            GetLocalStorage("communes") ||
            SetLocalStorage("communes", data1.data);

          const quartierslocale =
            GetLocalStorage("quartierslocale") ||
            SetLocalStorage("quartierslocale", data2.data);

          GetLocationOf(Works, setData, [
            communes,
            quartierslocale,
            result.data,
          ]);
        })
      );
  });
}
