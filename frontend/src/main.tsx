import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import App from "./App";
import { PostProvider } from "./context/PostContext";
import { ForYouProvider } from "./context/ForYouContext";


ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <PostProvider>
        <ForYouProvider>
          <App />
        </ForYouProvider>
      </PostProvider>
    </AuthProvider>
  </BrowserRouter>
);
