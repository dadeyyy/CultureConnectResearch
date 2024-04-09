import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import App from "./App";
import { PostProvider } from "./context/PostContext";
import { ForYouProvider } from "./context/ForYouContext";
import { pdfjs } from "react-pdf";

// Configure the worker source for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

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
