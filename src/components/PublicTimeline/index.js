import { LoadingOutlined } from "@ant-design/icons";
import { Empty, Image, Layout, Spin, Tag, Timeline } from "antd";
import { Content } from "antd/lib/layout/layout";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { supabaseClient } from "../../supabase/client";
import { handleError } from "../../util";
import moment from "moment";

import "./style.css";
import NavBar from "../NavBar";

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
  const [isLoading, setIsLoading] = useState(false);

  async function fetchTimeline() {
    setIsLoading(true);

    const { data: configData, error } = await supabaseClient
      .from("user_config")
      .select()
      .eq("url", username);
    handleError(error);
    if (!error && configData[0]?.is_public) {
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
    document.title = username;
  }, [username]);

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <NavBar publicTimeline={true} userName={username} />
      <Content className="site-layout public-layout">
        <div className="site-layout-background" style={{ padding: 24 }}>
          {isLoading && (
            <div className="loader">
              <Spin indicator={loadingIcon} />
            </div>
          )}

          <Timeline className="timeline" mode="alternate">
            {timeline.map((event) => (
              <Timeline.Item key={event.event_id}>
                <>
                  <Tag color="processing">
                    {moment(event.date).format("LL")}
                  </Tag>
                  <h1 style={{ margin: 0 }}>{event.title} </h1>

                  <p>{event.description}</p>
                  {event.image_url && (
                    <Image width={150} src={event.image_url} />
                  )}
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
