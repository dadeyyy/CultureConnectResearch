import "./globals.css";
import { Routes, Route } from "react-router-dom";
import AuthLayout from "./_auth/AuthLayout";
import LoginForm from "./_auth/forms/LoginForm";
import RegisterForm from "./_auth/forms/RegisterForm";
import RootLayout from "./_root/RootLayout";
import { LandingPage } from "./_root/pages";
import Explore from "./_root/pages/Explore";
import MapForm from "./_root/pages/MapForm";
import LiveStream from "./_root/pages/LiveStream";
import Notification from "./_root/pages/Notification";
import CreatePost from "./_root/pages/CreatePost";
import EditPost from "./_root/pages/EditPost";
import PostDetails from "./_root/pages/PostDetails";
import Profile from "./_root/pages/Profile";
import UpdateProfile from "./_root/pages/UpdateProfile";
import Calendar from "./_root/pages/Calendar";
import Home from "./_root/pages/Home";

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
          <Route path="/map" element={<MapForm />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/live-streams" element={<LiveStream />} />
          <Route path="/notifications" element={<Notification />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/update-post/:id" element={<EditPost />} />
          <Route path="/posts/:id" element={<PostDetails />} />
          <Route path="/profile/:id/*" element={<Profile />} />
          <Route path="/update-profile/:id" element={<UpdateProfile />} />
        </Route>
      </Routes>
    </main>
  );
};

export default App;
