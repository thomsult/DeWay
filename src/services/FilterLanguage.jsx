import React, { useState, useEffect } from "react";

export const dataResult = (description) => {
  try {
    const ResultFilter = {
      PHP: description.match(/PHP/) || false,
      "C#": description.match(/C#/) || description.match(/.NET/) || false,
      "C++": description.match(/C\+\+/) || false,
      SQL: description.match(/SQL/i) || false,
      Java: description.match(/Java/i) || false,
      JavaScript:
        description.match(/JavaScript/i) ||
        description.match(/React/i) ||
        description.match(/NodeJS/i) ||
        description.match(/VueJS/i) ||
        false,

      TypeScript:
        description.match(/TypeScript/i) || description.match(/Angular/i),
      Python: description.match(/Python/i) || false,
      Cobol: description.match(/Cobol/i) || false,
    };
    const Other =
      ResultFilter["C#"] ||
      ResultFilter["C++"] ||
      ResultFilter.SQL ||
      ResultFilter.Java ||
      ResultFilter.PHP ||
      ResultFilter.JavaScript ||
      ResultFilter.TypeScript ||
      ResultFilter.Python ||
      ResultFilter.Cobol;
    return { ...ResultFilter, Other: !Other ? "" : null };
  } catch (error) {
    return { error: "No Data" };
  }
};

export function FilterLanguageByDescription({ description }) {
  const [Result] = useState(dataResult(description));
  const ResultList = Object.keys(Result).map((key) => {
    return Result[key] && <li key={key}>{`${Result[key]}`}</li>;
  });
  return Result.error ? null : (
    <ul style={{ display: "flex" }}>{ResultList}</ul>
  );
}
function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

function FilterToOffres(arrayOfOffres, item) {
  if (item[0] === "C++") {
    return arrayOfOffres.filter((el) => el.description.search("C\\++") !== -1);
  }
  if (item.length > 0) {
    return item
      .map((itemUni) => {
        return arrayOfOffres.filter(
          (el) => el.description.search(new RegExp(itemUni, "i")) !== -1
        );
      })
      .flat()
      .filter(onlyUnique);
  }
  return arrayOfOffres.filter(
    (el) => el.description.search(new RegExp(item[0], "i")) !== -1
  );
}

// Offres: arr.filter((el) => el.description.match(/PHP/)),
const MatchResult = (Offres) => {
  const arr = Offres;
  const ResultatOfMatch = [
    {
      label: "PHP",
      value: false,
      Offres: FilterToOffres(arr, ["PHP"]),
    },
    {
      label: "C#",
      value: false,
      Offres: FilterToOffres(arr, ["C#", ".NET"]),
    },
    {
      label: "C++",
      value: false,
      Offres: FilterToOffres(arr, ["C++"]),
    },
    {
      label: "SQL",
      value: false,
      Offres: FilterToOffres(arr, ["SQL"]),
    },
    {
      label: "Java",
      value: false,
      Offres: FilterToOffres(arr, ["Java"]),
    },
    {
      label: "JavaScript",
      value: false,
      Offres: FilterToOffres(arr, ["JavaScript", "React", "NodeJS", "VueJS"]),
    },
    {
      label: "TypeScript",
      value: false,
      Offres: FilterToOffres(arr, ["TypeScript", "Angular"]),
    },
    {
      label: "Python",
      value: false,
      Offres: FilterToOffres(arr, ["Python"]),
    },
    {
      label: "Cobol",
      value: false,
      Offres: FilterToOffres(arr, ["Cobol"]),
    },
    {
      label: "Autre",
      value: false,
      Offres: arr,
    },
  ];
  return ResultatOfMatch;
};

export function FilterLanguage({
  OffresPoleEmploiFiltered,
  SetResult,
  parent,
}) {
  if (OffresPoleEmploiFiltered) {
    const [Filter, SetFilter] = useState(
      parent.FiltreLanguage.length > 0
        ? parent.FiltreLanguage
        : MatchResult(OffresPoleEmploiFiltered).map(
            ({ label, value }, index) => {
              return { id: index, label, value };
            }
          ) || parent.FiltreLanguage
    );
    const [FilterResult, SetFilterResult] = useState(
      MatchResult(OffresPoleEmploiFiltered).map((Filtre, index) => {
        return {
          id_Filtre: index,
          Offres: Filtre.Offres,
        };
      })
    );
    useEffect(() => {
      if (OffresPoleEmploiFiltered) {
        SetFilterResult(
          MatchResult(OffresPoleEmploiFiltered).map((Filtre, index) => {
            return {
              id_Filtre: index,
              Offres: Filter[index].value ? Filtre.Offres : [],
            };
          })
        );
      }
    }, [OffresPoleEmploiFiltered, Filter]);
    useEffect(() => {
      const NoClick = Filter.every((el) => el.value === false);
      if (NoClick) {
        SetResult(OffresPoleEmploiFiltered);
      } else {
        SetResult(
          FilterResult.reduce((acc, val) => acc.concat(val.Offres), []).filter(
            onlyUnique
          )
        );
      }
      return () => {
        const filtre = Filter.map((el) => {
          return { label: el.label, value: el.value, id: el.id };
        });
        parent.SetFiltreLanguage(filtre);
      };
    }, [FilterResult, Filter, OffresPoleEmploiFiltered]);

    const onClickButton = (e) => {
      if (e.target.innerText !== "Autre") {
        const filtre = Filter.map((el) =>
          el.label === e.target.innerText
            ? { label: el.label, value: !el.value, id: el.id }
            : { label: el.label, value: el.value, id: el.id }
        );

        SetFilter(filtre);
        parent.SetFiltreLanguage(filtre);
      } else {
        const filtre = Filter.map((el) => {
          return { label: el.label, value: false, id: el.id };
        });
        SetFilter(filtre);
        parent.SetFiltreLanguage(filtre);
      }
    };

    return (
      <div>
        {Filter.map(({ label, value }) => (
          <button
            key={label}
            type="button"
            className={value ? "filter filter-active" : "filter filter-none"}
            onClick={onClickButton}
          >
            {label}
          </button>
        ))}
      </div>
    );
  }
}
