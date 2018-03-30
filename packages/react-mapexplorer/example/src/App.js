import React from "react";

import { MapExplorer } from "@indigocore/react-mapexplorer";

import { chainscript } from "./chainscript";

const App = () => {
  return (
    <div>
      <MapExplorer chainscript={chainscript} agentUrl="http://localhost:3000" />
    </div>
  );
};

export default App;
