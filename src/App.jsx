import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Error from "./pages/Error.jsx";

export default function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Error />} />
      </Routes>
    </>
  );
}
