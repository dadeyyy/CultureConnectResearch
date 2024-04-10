import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import App from "./App";
import { ForYouProvider } from "./context/ForYouContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <ForYouProvider>
        <App />
      </ForYouProvider>
    </AuthProvider>
  </BrowserRouter>
);
