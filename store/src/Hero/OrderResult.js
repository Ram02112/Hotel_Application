import React from "react";
import { Button, Result, Modal } from "antd";
import { useNavigate } from "react-router-dom";
const OrderResult = (props) => {
  const { visible, onCancel } = props;
  const navigate = useNavigate();
  const handleGoBack = () => {
    navigate("/");
  };
  return (
    <Modal
      title="Order Result"
      width={700}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Result
        status="success"
        title="Successfully Purchased Product(s)"
        subTitle="Thank you for purchasing"
        extra={[
          <Button type="primary" key="console" onClick={handleGoBack}>
            Go to Home
          </Button>,
          <Button key="close">Close</Button>,
        ]}
      />
    </Modal>
  );
};

export default OrderResult;
