import { LinkOutlined } from "@ant-design/icons";
import { Button, Input, Modal, Space, Switch } from "antd";
import React, { useEffect, useState } from "react";
import { useUserStore } from "../../store/userStore";
import { supabaseClient } from "../../supabase/client";
import { handleError, handleSuccess } from "../../util";
import "./style.css";

const openInNewTab = (url) => {
  window.open(url, "_blank", "noopener,noreferrer");
};

export default function UserConfig({ isModalOpen, closeModal }) {
  const [userConfig, setUserConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const user = useUserStore((state) => state.user);

  async function fetchConfig() {
    const { data, error } = await supabaseClient
      .from("user_config")
      .select()
      .eq("user_id", user.id);

    handleError(error);
    if (data) {
      setUserConfig({
        ...data[0],
        is_public: data[0]?.is_public || false,
        display_name: data[0]?.display_name || user.user_metadata.name
      });
    }
  }

  useEffect(() => {
    fetchConfig();
  }, []);

  const addConfig = async (values) => {
    setIsLoading(true);
    if (userConfig?.id) {
      const { error } = await supabaseClient
        .from("user_config")
        .update(values)
        .eq("id", userConfig.id);
      handleError(error);
      if (!error) {
        handleSuccess("Updated Config");
        closeModal();
        setUserConfig(null);
      }
    } else {
      const { error } = await supabaseClient
        .from("user_config")
        .insert({ ...values });
      handleError(error);
      if (!error) {
        handleSuccess("Updated Config");
        closeModal();
        setUserConfig(null);
      }
    }
    setIsLoading(false);
  };

  const handleSave = async () => {
    if (userConfig.is_public && !userConfig.url) {
      handleError({ message: "Please setup your public URL" });
    } else {
      await addConfig({ ...userConfig, user_id: user.id });
    }
  };

  return (
    <Modal
      title="Config"
      open={isModalOpen}
      onOk={handleSave}
      onCancel={() => {
        closeModal();
      }}
      closable={false}
      centered
      okText="Save Preferences"
      confirmLoading={isLoading}
    >
      <Space style={{ width: "100%" }} size={"middle"} direction="vertical">
        <div className="configItem">
          <p>Display Name</p>
          <Input
            value={userConfig?.display_name}
            onChange={(e) => {
              setUserConfig({ ...userConfig, display_name: e.target.value });
            }}
          />
        </div>
        <div className="configItem">
          <p>Your Public URL</p>
          <Input.Group compact>
            <Input
              value={userConfig?.url}
              style={{ width: "calc(100% - 32px)" }}
              onChange={(e) => {
                setUserConfig({ ...userConfig, url: e.target.value });
              }}
              prefix={`${window.location.origin}/`}
            />

            <Button
              type="primary"
              onClick={() =>
                openInNewTab(
                  `${window.location.origin}/${userConfig.url || ""}`
                )
              }
              icon={<LinkOutlined />}
            />
          </Input.Group>
        </div>
        <Switch
          checked={userConfig?.is_public}
          onChange={(value) => {
            setUserConfig({ ...userConfig, is_public: value });
          }}
          checkedChildren="public"
          unCheckedChildren="public"
        />
      </Space>
    </Modal>
  );
}
