import { LoadingOutlined } from "@ant-design/icons";
import { Empty, Layout, Spin, Tag, Timeline } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../supabase/client";
import { handleError } from "../../util";
import moment from "moment";

import "./style.css";

export const loadingIcon = (
  <LoadingOutlined
    style={{
      fontSize: 44
    }}
    spin
  />
);

export default function PublicTimeline() {
  let { username } = useParams();
  const [timeline, setTimeline] = useState([]);
  const [userName, setUserName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function fetchTimeline() {
    setIsLoading(true);

    const { data: configData, error } = await supabaseClient
      .from("user_config")
      .select()
      .eq("url", username);
    handleError(error);
    if (!error && configData[0]?.is_public) {
      setUserName(configData[0].display_name);
      const { data, error } = await supabaseClient
        .from("timeline")
        .select()
        .eq("user_id", configData[0].user_id)
        .order("date", { ascending: false });
      handleError(error);
      if (data) {
        setTimeline(data);
      }
    }

    setIsLoading(false);
  }

  useEffect(() => {
    fetchTimeline();
    document.title=username
  }, [username]);

  return (
    <Layout style={{ height: "100%" }}>
      <Content
        className="site-layout public-layout"
      >
        <div className="site-layout-background" style={{ padding: 24 }}>
          {userName && (
            <div className="publicHeader">
              <h1>{userName}</h1>
            </div>
          )}

          {isLoading && (
            <div className="loader">
              <Spin indicator={loadingIcon} />
            </div>
          )}

          <Timeline mode="alternate">
            {timeline.map((event) => (
              <Timeline.Item key={event.event_id}>
                <>
                  <Tag color="processing">{moment(event.date).format("LL")}</Tag>
                  <h1 style={{ margin: 0 }}>{event.title} </h1>

                  <p>{event.description}</p>
                </>
              </Timeline.Item>
            ))}
            {!isLoading && timeline.length === 0 && (
              <div className="empty">
                <Empty
                  description={false}
                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                />
                <p className="emptymessage">Empty Timeline</p>
              </div>
            )}
          </Timeline>
        </div>
      </Content>
    </Layout>
  );
}
