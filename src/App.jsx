import React from "react";
import SwipeableBottomPanel from "./components/SwipeablePanel";
import "./App.css";
import Map from "./map/Map";
import NavBar from "./components/NavBar/NavBar";
import { OffresContext } from "./services/OffreContext";
import Modal from "./components/Modal loading/Modal";

function App() {
  return (
    <OffresContext>
      <div className="App">
        <NavBar />
        <SwipeableBottomPanel />
        <Map />
        <Modal />
      </div>
    </OffresContext>
  );
}

export default App;
