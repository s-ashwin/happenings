import React, { useState } from "react";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Image,
  Input,
  Modal,
  Row,
  Spin,
  Upload
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { supabaseClient } from "../../supabase/client";
import { useUserStore } from "../../store/userStore";
import { handleError, handleSuccess } from "../../util";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { Form, Input, DatePicker } from 'antd';

export default function EventForm({
  event,
  isModalOpen,
  closeModal,
  fetchTimeline
}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUpLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [imageURL, setImageUrl] = useState(event?.image_url);

  const updateEvent = async (values) => {
    const { error } = await supabaseClient
      .from("timeline")
      .update(values)
      .eq("event_id", event.event_id);

    handleError(error);
    if (!error) {
      fetchTimeline();
      handleSuccess("Updated");
    }
  };

  const addEvent = async (values) => {
    const { error } = await supabaseClient
      .from("timeline")
      .insert({ ...values, user_id: useUserStore.getState().user.id });
    handleError(error);
    if (!error) {
      fetchTimeline();
      handleSuccess("Event Added");
    }
  };

  const onFinish = async (values) => {
    if (!values.date || !values.title) {
      handleError({ message: "Please check your input" });
      return;
    }

    values.image_url = imageURL;

    setIsLoading(true);
    if (event) {
      await updateEvent(values);
    } else {
      await addEvent(values);
    }
    setIsLoading(false);
    closeModal();
  };

  const handleUpload = async ({ file }) => {
    setIsUpLoading(true);
    const { error } = await supabaseClient.storage
      .from("event-images")
      .upload(
        `${useUserStore.getState().user.id}/${file.uid}-${file.name}`,
        file,
        {
          cacheControl: "3600",
          upsert: false
        }
      );

    handleError(error);
    if (!error) {
      const { data: urlData, error: urlError } = supabaseClient.storage
        .from("event-images")
        .getPublicUrl(
          `${useUserStore.getState().user.id}/${file.uid}-${file.name}`
        );

      handleError(urlError);
      setImageUrl(urlData.publicUrl);
    }
    setIsUpLoading(false);
  };

  const handleRemoveImage = async () => {
    setIsDeleting(true);
    let path = imageURL.replaceAll(
      `${supabaseClient.storageUrl}/object/public/event-images/${
        useUserStore.getState().user.id
      }`,
      ""
    );
    const { error } = await supabaseClient.storage
      .from(`event-images`)
      .remove([`/${useUserStore.getState().user.id}/${path}`]);
    handleError(error);
    if (!error) {
      setImageUrl(null);
    }
    setIsDeleting(false);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8
        }}
      >
        Upload
      </div>
    </div>
  );

  return (
    <Modal
      open={isModalOpen}
      onOk={() => {
        onFinish(form.getFieldsValue());
      }}
      onCancel={() => {
        closeModal();
      }}
      okText={"Save"}
      confirmLoading={isLoading}
      centered
    >
      <Form
        initialValues={event ? { ...event, date: moment.utc(event.date) } : {}}
        layout={"vertical"}
        form={form}
        onValuesChange={() => {}}
        onFinish={onFinish}
      >
        

const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};

const tailLayout = {
  wrapperCol: {
    offset: 8,
    span: 16,
  },
};

const MyForm = () => {
  const onFinish = (values) => {
    console.log('Success:', values);
  };

  const onFinishFailed = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  return (
    <Form>
      {...layout}
      name="basic"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
    >
      <Form.Item
        label="Date"
        name="date"
        rules={[
          {
            required: true,
            message: 'Please select a date!',
          },
        ]}
      >
        <DatePicker style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Event Title"
        name="title"
        rules={[
          {
            required: true,
            message: 'Please input the title of the event!',
          },
        ]}
      >
        <Input placeholder="What happened?" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item {...tailLayout}>
        <Button type="primary" htmlType="submit">
          Submit
        </Button>
      </Form.Item>
    </Form>)
};

        <Form.Item name="description" label="Event description">
          <TextArea rows={4} />
        </Form.Item>
        <div>
          <Row gutter={10}>
            {imageURL && (
              <Col
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "0.5rem"
                }}
              >
                <Image width={100} src={imageURL} />
                <Button onClick={handleRemoveImage} style={{ width: 100 }}>
                  {isDeleting ? <Spin /> : <DeleteOutlined />}
                </Button>
              </Col>
            )}
            <Col>
              <Upload
                listType="picture-card"
                customRequest={handleUpload}
                showUploadList={false}
                accept="image/x-png,image/jpg,image/jpeg"
              >
                {isUploading ? <Spin /> : uploadButton}
              </Upload>
            </Col>
          </Row>
        </div>
      </Form>
    </Modal>
  );
}