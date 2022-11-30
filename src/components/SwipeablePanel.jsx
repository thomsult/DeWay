import React, { useState, useRef, useEffect, useContext } from "react";
import { BottomSheet } from "react-spring-bottom-sheet";
import CardList from "./Card/CardList";
import "./SwipeablePanel.css";
import { Context } from "../services/MapContext";

function SwipeableBottomPanel() {
  const ref = useRef(null);
  const refChild = useRef(null);
  const [isOpen, setIsOpen] = useState(false);

  // Toggle CloseForDesktop for Desktop Mode //
  const [CloseForDesktop] = useState(true);
  // Toggle CloseForDesktop for Desktop Mode //

  const [stateOfContent, setStateOfContent] = useState("List");
  const FullHeight = 0.9;
  const MiddleHeight = 0.5;
  const MinHeightValue = 0.06;
  const { Loading, SetElement, FirstOfCard } = useContext(Context);
  /**
   * "SetHeight" is a function that takes a number as an argument and uses that number to determine which
   * snap point to snap to.
   */
  const SetHeight = (Destination) => {
    ref.current.snapTo(({ snapPoints }) => snapPoints[Destination]);
  };

  const ChangeHeight = () => {
    if (stateOfContent === "List") {
      if (!isOpen) {
        SetHeight(1);
      } else {
        SetHeight(2);
      }
    } else {
      SetHeight(1);
      setStateOfContent("List");
    }
  };

  const OnSpringEnd = () => {
    if (
      Math.round(window.innerHeight * MinHeightValue) === ref.current.height
    ) {
      setIsOpen(false);
      refChild.current.parentElement.parentElement.setAttribute(
        "data-rsbs-scroll",
        "Close"
      );
    } else {
      setIsOpen(true);
      refChild.current.parentElement.parentElement.setAttribute(
        "data-rsbs-scroll",
        "Open"
      );
    }
  };
  useEffect(() => {
    if (ref.current) {
      SetHeight(1);
      setStateOfContent("List");
    }
  }, [FirstOfCard]);

  useEffect(() => {
    if (ref.current) {
      SetElement(document.querySelector("[data-rsbs-root]"));
    }
  }, [ref.current]);
  return (
    Loading === 100 &&
    CloseForDesktop && (
      <BottomSheet
        ref={ref}
        open={CloseForDesktop}
        snapPoints={({ maxHeight }) => [
          maxHeight * FullHeight,
          maxHeight * MiddleHeight,
          maxHeight * MinHeightValue,
        ]}
        blocking={false}
        defaultSnap={({ snapPoints, lastSnap }) =>
          lastSnap ?? Math.min(...snapPoints)
        }
        onSpringEnd={OnSpringEnd}
        header={
          <button
            className="BottomSheetBouton"
            aria-label="ToggleMenu"
            type="button"
            onClick={ChangeHeight}
            data-state={stateOfContent}
          />
        }
      >
        <div
          ref={refChild}
          className={`${isOpen ? "Open" : "Close"} BottomSheetContent`}
        >
          <CardList
            FirstOfC={FirstOfCard}
            onClick={SetHeight}
            Etat={stateOfContent}
            OnChange={setStateOfContent}
          />
        </div>
      </BottomSheet>
    )
  );
}

export default SwipeableBottomPanel;
