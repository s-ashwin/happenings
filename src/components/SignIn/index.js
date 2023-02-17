import React from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { supabaseClient } from "../../supabase/client";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { Image } from "antd";
import HomeArt from "../../assets/journey.svg";

const Container = (props) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);

  if (user) {
    navigate("/mytimeline");
    return;
  }

  return props.children;
};

export default function SignIn() {
  return (
    <div className="signInPage">
      <div className="signInContainer">
        <Image style={{ width: "20rem" }} src={HomeArt} preview={false} />
        <h1>Happenings</h1>
        <p>Create & share your timeline of achievements!</p>
        <Container supabaseClient={supabaseClient}>
          <Auth
            supabaseClient={supabaseClient}
            appearance={{
              theme: ThemeSupa
            }}
            onlyThirdPartyProviders
            providers={["google"]}
          />
        </Container>
      </div>
    </div>
  );
}
