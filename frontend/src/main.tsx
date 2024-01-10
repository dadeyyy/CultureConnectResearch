import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import App from "./App";
import { PostProvider } from "./context/PostContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <PostProvider>
          <App />
      </PostProvider>
    </AuthProvider>
  </BrowserRouter>
);
