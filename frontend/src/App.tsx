import "./globals.css";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import LoginForm from "./_auth/forms/LoginForm";
import RegisterForm from "./_auth/forms/RegisterForm";
import RootLayout from "./_root/RootLayout";
import { LandingPage } from "./_root/pages";
import Archives from "./_root/pages/Archives";
import MapForm from "./_root/pages/MapForm";
import LiveStream from "./_root/pages/LiveStream";
import ForYou from "./_root/pages/ForYou";
import CreatePost from "./_root/pages/CreatePost";
import EditPost from "./_root/pages/EditPost";
import PostDetails from "./_root/pages/PostDetails";
import Profile from "./_root/pages/Profile";
import UpdateProfile from "./_root/pages/UpdateProfile";
import Calendar from "./_root/pages/Calendar";
import Home from "./_root/pages/Home";
import { Toaster } from "react-hot-toast";
import ArchiveProvince from "./_root/pages/ArchiveProvince";
import ArchiveDetails from "./components/shared/ArchiveDetails";
import Reports from "./_root/pages/Reports";
import Explore from "./_root/pages/Explore";
import ArchiveCategory from "./_root/pages/ArchiveCategory";
import LiveDetails from "./_root/pages/LiveDetails";
import SharedPostDetails from "./_root/pages/SharedPostDetails";
import SupaAdmin from "./_root/SupaAdmin";

const App = () => {
  return (
    <main className="flex h-screen">
      <Routes>
        <Route index element={<LandingPage />} />

        {/* Login/ Register routes */}
        <Route element={<AuthLayout />}>
          <Route path="/signup" element={<RegisterForm />} />
          <Route path="/signin" element={<LoginForm />} />
        </Route>

        {/* After login routes */}
        <Route element={<RootLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/archives" element={<Archives />} />
          <Route path="/map" element={<MapForm />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/live-streams" element={<LiveStream />} />
          <Route path="/live-streams/:id" element={<LiveDetails />} />
          <Route path="/for-you" element={<ForYou />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
          <Route path="/archives/:province" element={<ArchiveProvince />} />
          <Route
            path="/archives/:province/:category"
            element={<ArchiveCategory />}
          />
          <Route
            path="/archives/:province/:category/:id"
            element={<ArchiveDetails />}
          />
          <Route path="/shared-post/:id" element={<SharedPostDetails />} />
        </Route>

        {/* SUPERADM IN ROUTE */}
        <Route path="/superadmin" element={<SupaAdmin />} />
      </Routes>

      <Toaster position="top-center" reverseOrder={false} />
    </main>
  );
};

export default App;
