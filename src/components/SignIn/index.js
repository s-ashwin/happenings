import React, { useState } from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { supabaseClient } from "../../supabase/client";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { Image, Spin } from "antd";
import HomeArt from "../../assets/journey.svg";

const Container = (props) => {
  const navigate = useNavigate();
  const user = useUserStore((state) => state.user);
  const [isLoading, setIsLoading] = useState(false);

  if (user) {
    if (isLoading) {
      return (
        <div className="signInPage">
          <Spin size="large" />
        </div>
      );
    }
    navigate("/mytimeline");
    return null;
  }

  return (
    <div className="signInPage">
      {isLoading && (
        <div className="overlay">
          <Spin size="large" />
        </div>
      )}
      {props.children}
    </div>
  );
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
            onAuthenticated={() => setIsLoading(true)}
          />
        </Container>
      </div>
    </div>
  );
}