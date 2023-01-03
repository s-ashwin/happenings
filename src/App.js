import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import SignIn from "./components/SignIn";
import { useUserStore } from "./store/userStore";
import { supabaseClient } from "./supabase/client";
import MyTimeline from "./components/MyTimeline";
import PublicTimeline from "./components/PublicTimeline";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  useEffect(() => {
    supabaseClient.auth.getSession().then(({ data: { session } }) => {
      useUserStore.setState({ user: session?.user });
    });
    supabaseClient.auth.onAuthStateChange((_event, session) => {
      useUserStore.setState({ user: session?.user });
    });
  }, []);

  return (
    <BrowserRouter>
     <ToastContainer />
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/mytimeline" element={<MyTimeline />} />
        <Route path="/:username" element={<PublicTimeline />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
