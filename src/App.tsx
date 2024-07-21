import React from "react";
import { Flex } from "@chakra-ui/react";

import { ColorPicker } from "./components/ColorPicker";

const App: React.FC = () => {
  return (
    <Flex justifyContent="center" alignItems="center">
      <ColorPicker />
    </Flex>
  );
};

export default App;
