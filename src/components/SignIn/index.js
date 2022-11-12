import React from "react";
import { Auth, ThemeSupa } from "@supabase/auth-ui-react";
import { supabaseClient } from "../../supabase/client";
import "./style.css";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";

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
