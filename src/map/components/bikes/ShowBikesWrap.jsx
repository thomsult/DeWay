import React, { useState } from "react";
import ShowBikes from "./ShowBikes";
import "../../Map.css";

function ShowBikesW() {
  const [showBikes, setShowBikes] = useState(false);
  function setShowBikesOnClick() {
    setShowBikes(!showBikes);
  }
  return (
    <>
      <button
        type="button"
        onClick={setShowBikesOnClick}
        className="leaflet-control-container leaflet-top bikeButton"
      >
        <img src="./logo.png" width="30px" alt="logo" />
      </button>

      {showBikes && <ShowBikes />}
    </>
  );
}

export default ShowBikesW;
