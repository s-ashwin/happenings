import React, {  useState } from "react";
import {  DatePicker, Form, Input, Modal } from "antd";
import TextArea from "antd/lib/input/TextArea";
import moment from "moment";
import { supabaseClient } from "../../supabase/client";
import { useUserStore } from "../../store/userStore";
import { handleError, handleSuccess } from "../../util";

export default function EventForm({
  event,
  isModalOpen,
  closeModal,
  fetchTimeline
}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    if (event) {
      await updateEvent(values);
    } else {
      await addEvent(values);
    }
    setIsLoading(false);
    closeModal();
  };

  return (
    <Modal
      open={isModalOpen}
      onOk={() => {
        onFinish(form.getFieldsValue());
      }}
      onCancel={() => {
        closeModal();
      }}
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
        <Form.Item required name="date" label="Date">
          <DatePicker />
        </Form.Item>
        <Form.Item required name="title" label="Event title">
          <Input placeholder="What happened?" />
        </Form.Item>
        <Form.Item name="description" label="Event description">
          <TextArea rows={4} />
        </Form.Item>
      </Form>
    </Modal>
  );
}
