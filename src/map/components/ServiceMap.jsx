/* eslint-disable react/prop-types */
import { useContext } from "react";
import { Context } from "../../services/MapContext";
import { MarkerJobList } from "./Markers";

export default function ServiceMap({ Siret, OffrePoleEmploi }) {
  // const { OffrePoleEmploi, Siret } = props;
  const { SetFirstOfCard } = useContext(Context);
  try {
    if (OffrePoleEmploi) {
      const DataByLieuTravail = (city, array) => {
        return array.filter(
          (resultat) => city === resultat.lieuTravail.libelle
        );
      };

      const cities = OffrePoleEmploi.resultats
        .map((e) => e.lieuTravail.libelle)
        .filter((item, pos, arr) => arr.indexOf(item) === pos)
        .map((el) => {
          return { city: el, Data: [] };
        })
        .map(({ city }) => {
          return {
            city,
            Data: DataByLieuTravail(city, OffrePoleEmploi.resultats),
          };
        });
      const onClick = (e) => {
        SetFirstOfCard(e.target.options.Offre);
      };
      return (
        cities.length > 0 &&
        cities.map((el) => (
          <MarkerJobList
            key={el.city}
            data={el.Data}
            city={el.city}
            Siret={Siret}
            onClick={onClick}
          />
        ))
      );
    }
  } catch (error) {
    return null;
  }

  return null;
}
