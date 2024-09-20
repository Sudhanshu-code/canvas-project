import { Analytics } from "@vercel/analytics/react";
import Canvas from "./canvas/Canvas";

function App() {
  return (
    <>
      <Analytics />
      <Canvas />
    </>
  );
}

export default App;
