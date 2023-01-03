import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined,
  GiftFilled
} from "@ant-design/icons";
import { Dropdown } from "antd";
import { Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { supabaseClient } from "../../supabase/client";
import { capitalize } from "../../util";
import UserConfig from "../UserConfig";
import "./style.css";

export default function NavBar({ publicTimeline = false, userName = "" }) {
  const navigate = useNavigate();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const menu = [
    {
      label: "Sign Out",
      key: "sign-out",
      icon: <LogoutOutlined />,
      onClick: async () => {
        await supabaseClient.auth.signOut();
        navigate("/signin");
      }
    },
    {
      label: "Config",
      key: "config",
      icon: <SettingOutlined />,
      onClick: async () => {
        setIsConfigOpen(true);
      }
    }
  ];

  const loggedOutMenu = [
    {
      label: "Sign In",
      key: "sign-in",
      onClick: async () => {
        navigate("/signin");
      }
    }
  ];

  const publicMenu = [
    {
      label: "Create your timeline",
      key: "sign-in",
      onClick: async () => {
        navigate(user ? "/mytimeline" : "/signin");
      }
    }
  ];

  return (
    <Header
      style={{
        display: "flex",
        gap: 10,
        justifyContent: "space-between",
        alignItems: "center",
        padding: "0 2rem"
      }}
    >
      <h1 className="navHeading" style={{ color: "white", margin: 0 }}>
        {publicTimeline ? capitalize(userName) : "Happenings"}
      </h1>

      {!publicTimeline && (
        <Dropdown
          menu={{ items: user ? menu : loggedOutMenu }}
          placement="bottomLeft"
        >
          <UserOutlined
            style={{
              fontSize: 20,
              color: "white"
            }}
          />
        </Dropdown>
      )}
      {publicTimeline && (
        <Dropdown menu={{ items: publicMenu }} placement="bottomLeft">
          <GiftFilled
            style={{
              fontSize: 20,
              color: "white"
            }}
          />
        </Dropdown>
      )}
      {isConfigOpen && (
        <UserConfig
          isModalOpen={isConfigOpen}
          closeModal={() => setIsConfigOpen(false)}
        />
      )}
    </Header>
  );
}
