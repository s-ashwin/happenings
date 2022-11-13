import {
  LogoutOutlined,
  SettingOutlined,
  UserOutlined
} from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
import { Header } from "antd/lib/layout/layout";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../../store/userStore";
import { supabaseClient } from "../../supabase/client";
import UserConfig from "../UserConfig";
import "./style.css"

export default function NavBar() {
  const navigate = useNavigate();
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const user = useUserStore((state) => state.user);
  const menu = () => (
    <Menu
      mode="horizontal"
      items={[
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
      ]}
    />
  );

  const loggedOutMenu = () => (
    <Menu
      mode="horizontal"
      items={[
        {
          label: "Sign In",
          key: "sign-in",
          onClick: async () => {
            navigate("/signin");
          }
        }
      ]}
    />
  );

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
      <h1 className="navHeading" style={{color:"white", margin:0}}>Happenings</h1>
      <Dropdown.Button
        className="dropdown-btn"
        overlay={user ? menu : loggedOutMenu}
        trigger={["click", "hover"]}
        icon={
          <UserOutlined
            style={{
              fontSize: 20,
              color: "white"
            }}
          />
        }
      />
      {isConfigOpen && (
        <UserConfig
          isModalOpen={isConfigOpen}
          closeModal={() => setIsConfigOpen(false)}
        />
      )}
    </Header>
  );
}
