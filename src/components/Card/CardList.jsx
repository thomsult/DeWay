import React, { useEffect, useState, useRef, useContext } from "react";
import Card from "./Card";
import CardInfos from "./CardInfos";
import { Context } from "../../services/MapContext";
import "./card.css";

function CardList({ FirstOfC, onClick, Etat, OnChange }) {
  const [cardInfosId, setCardInfosId] = useState(null);
  const ref = useRef();
  const [first, SetFirst] = useState(null);
  const { OffresPoleEmploiFiltered } = useContext(Context);

  const SrollToTop = () => {
    try {
      const CardListEl = ref.current.parentElement.parentElement.parentElement;
      if (
        CardListEl &&
        CardListEl.getAttribute("data-rsbs-scroll") === "Close"
      ) {
        CardListEl.setAttribute("data-rsbs-scroll", "Open");
        CardListEl.scroll(0, 0);
        CardListEl.setAttribute("data-rsbs-scroll", "Close");
      } else if (
        CardListEl &&
        CardListEl.getAttribute("data-rsbs-scroll") === "Open"
      ) {
        CardListEl.scrollTo({
          left: 0,
          top: 0,
          behavior: "smooth",
        });
      } else {
        ref.current.scrollTo({
          left: 0,
          top: 0,
          behavior: "smooth",
        });
      }
    } catch (error) {
      console.warn(error);
    }
  };

  useEffect(() => {
    if (ref.current) {
      SrollToTop();
      if (Etat === "List") {
        setCardInfosId(null);
      }
      if (FirstOfC !== null && FirstOfC.length > 0) {
        SetFirst(FirstOfC.map((e) => e.id));
      }
    }
  }, [Etat, FirstOfC, OffresPoleEmploiFiltered, ref]);

  const onClickDetail = (e) => {
    const Id = e.target.getAttribute("data-id");
    if (!cardInfosId) {
      onClick(0);
      setCardInfosId(Id);
      OnChange("Info");
      SrollToTop();
    } else {
      onClick(1);
      setCardInfosId(null);
      OnChange("List");
    }
  };

  const GetEntrepriseName = (data, firstOf) => {
    const res = data.find((el) => el.id === firstOf[0]);
    if (res) {
      return res.entreprise.nom ? res.entreprise.nom : res.lieuTravail.libelle;
    }
    return "";
  };

  if (!cardInfosId && OffresPoleEmploiFiltered.resultats) {
    return (
      OffresPoleEmploiFiltered && (
        <main ref={ref}>
          {first && (
            <p>
              {GetEntrepriseName(OffresPoleEmploiFiltered.resultats, first)}
            </p>
          )}
          {OffresPoleEmploiFiltered.resultats.map((resultats) => {
            if (first && first.includes(resultats.id)) {
              return (
                <Card
                  key={resultats.id}
                  resultats={resultats}
                  onClick={onClickDetail}
                />
              );
            }
            return null;
          })}

          {first && <p>Autres offres</p>}
          {OffresPoleEmploiFiltered.resultats.map((resultats) => {
            if (first && first.includes(resultats.id)) {
              return null;
            }
            return (
              <Card
                key={resultats.id}
                resultats={resultats}
                onClick={onClickDetail}
              />
            );
          })}

          <button type="button" onClick={SrollToTop} className="btn__getback">
            <img src="./symbole-fleche-grise.png" width="20px" alt="getback" />
          </button>
        </main>
      )
    );
  }
  return (
    <main ref={ref}>
      {cardInfosId && (
        <CardInfos
          onClose={onClickDetail}
          Offres={OffresPoleEmploiFiltered.resultats.filter(
            (el) => el.id === cardInfosId
          )}
        />
      )}
    </main>
  );
}

export default CardList;
