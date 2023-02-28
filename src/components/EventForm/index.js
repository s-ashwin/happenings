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
import { DeleteOutlined, InfoCircleOutlined, PlusOutlined } from "@ant-design/icons";
import Tooltip from "antd/lib/tooltip";

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

  //States to control in the current time when the required input change.
  const [valueTitle, setValueTitle] = useState("");
  const [valueDate, setValueDate] = useState("");

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

  //Function to save the input Title value when it changes
  const onInput = (e) => {
    setValueTitle(e.target.value)};

  //Function to save the input Date-value when it changes
  const onChange = (date, dateString) => {
      if(dateString !== ""){
        setValueDate(dateString)
      }
  };


  return (
    <Modal
      open={isModalOpen}
      onCancel={() => {
        closeModal();
      }}
      confirmLoading={isLoading}
      centered
      footer={[
        <Button key="cancelButton" onClick={()=>{closeModal()}}>Cancel</Button>,
        //Personalized button in the modal
        //Disable when valueTitle and valueDate aren't filled in.
        <Button key="saveButton"type="primary" onClick={() =>{onFinish(form.getFieldsValue());}}
         disabled={valueDate !== "" && valueTitle !== "" ? false : true} >Save</Button>,
        <br key="space"/>,
        <Tooltip key="saveTooltip" placement="topLeft" title="Save available when title and date are filled in" >
          <InfoCircleOutlined />
        </Tooltip>
      ]}
     
    >
      <Form
        initialValues={event ? { ...event, date: moment.utc(event.date) } 
        : {}}
        layout={"vertical"}
        form={form}
        requiredMark="optional"
        onFinish={onFinish}
        
      >
        <Form.Item name="date" label="Date" 
        rules={[
          {
            required:true,
            message: 'Please input Date!',
          },
        ]}
        tooltip="This is a required field">
          <DatePicker  onChange={onChange}/>
        </Form.Item>
        <Form.Item name="title" label="Event title" 
        rules={[
          {
            required:true,
            message: 'Please input a Title!',
          },
        ]}
        tooltip="This is a required field">
          <Input placeholder="What happened?" onInput={onInput}/>
        </Form.Item>

        <Form.Item name="description" label="Event description" >
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
