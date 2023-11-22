import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { Table, Button, Modal, Input, Row, Col, message } from 'antd';
import { CreditCardOutlined } from '@ant-design/icons';
import { ROW_GUTTER } from 'constants/ThemeConstant';
import { setCards } from 'store/slices/subscriptionSlice';
import SubscriptionService from 'services/SubscriptionService';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  useStripe,
  useElements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
} from "@stripe/react-stripe-js";

const { Column } = Table;

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY);

const styles = {
  base: {
    fontSize: "14px",
    color: "#455560",
    "::placeholder": {
      color: "#e6ebf1",
      fontFamily: "'Roboto',-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,'Helvetica Neue',Arial,'Noto Sans',sans-serif,'Apple Color Emoji','Segoe UI Emoji','Segoe UI Symbol','Noto Color Emoji'"
    },
  },
};

const CardElementContainer = ({ children, label }) => {
  const [hover, setHover] = useState(false);

  const boxStyle = {
    boxSizing: 'border-box',
    margin: "5px 0px",
    padding: '10.5px 11px',
    color: '#455560',
    fontSize: 14,
    lineHeight: 1.6,
    borderWidth: 1,
    borderStyle: 'solid',
    borderColor: hover ? '#699dff' : '#e6ebf1',
    borderRadius: 10,
    transition: "all 0.2s"
  }

  return (
    <>
      <label>{label}</label>
      <div style={boxStyle} onMouseEnter={() => { setHover(true) }} onMouseLeave={() => { setHover(false) }} >
        {children}
      </div>
    </>
  )
}

const CardForm = ({ onCancel }) => {
  const elements = useElements();
  const stripe = useStripe();
  const [holder, setHolder] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleFinish = async (event) => {
    event.preventDefault();

    setIsLoading(true)
    if (holder === "") {
      message.error({ content: 'Please input holder name', duration: 2.5 })
    } if (!stripe || !elements) return;

    const cardNumberElement = elements?.getElement(CardNumberElement);

    if (!cardNumberElement) {
      setIsLoading(false);
    }

    const token = await stripe.createToken(cardNumberElement);

    if (token.error) {
      message.error({ content: token.error.message, duration: 2.5 })
      setIsLoading(false);
      return
    }

    const res = await SubscriptionService.updatePayment({ token: token.token.id, holder: holder })
    if (res) {
      dispatch(setCards([res]))
      message.success({ content: "Payment updated successfuly", duration: 2.5 })
      onCancel()
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleFinish}>
      <label>Card holder name</label>
      <Input style={{ marginTop: 5, marginBottom: 5 }} suffix={<CreditCardOutlined />} placeholder="Card holder name" onChange={(e) => setHolder(e.target.value)} />
      <CardElementContainer label="Card Number">
        <CardNumberElement
          options={{
            style: styles,
          }}
        />
      </CardElementContainer>
      <Row gutter={ROW_GUTTER}>
        <Col xs={24} sm={24} md={12}>
          <CardElementContainer label="Expiry date">
            <CardExpiryElement
              options={{
                style: styles,
              }}
            />
          </CardElementContainer>
        </Col>
        <Col xs={24} sm={24} md={12}>
          <CardElementContainer label="CVV Code">
            <CardCvcElement
              options={{
                style: styles,
              }}
            />
          </CardElementContainer>
        </Col>
      </Row>
      <Button type="primary" htmlType="submit" style={{ marginTop: 10 }} loading={isLoading}>Save Card</Button>
    </form>
  )
}

const AddNewCardForm = ({ visible, onCancel }) => {

  return (
    <Modal
      title="Add new card"
      open={visible}
      onCancel={onCancel}
      footer={false}
    >
      <Elements stripe={stripePromise}>
        <CardForm onCancel={onCancel} />
      </Elements>
    </Modal>
  )
}

const Billing = () => {
  const dispatch = useDispatch();
  const { cards } = useSelector(state => state.subscription)
  const [modalVisible, setModalVisible] = useState(false)

  const showModal = () => {
    setModalVisible(true)
  };

  const closeModal = () => {
    setModalVisible(false)
  }

  const getCardInfo = async () => {
    const res = await SubscriptionService.getCardInfo();
    if (res) {
      dispatch(setCards([res]))
    }
  }

  useEffect(() => {
    getCardInfo()
  }, [])

  const locale = {
    emptyText: (
      <div className="text-center my-4">
        <img src="/img/others/img-7.png" alt="Add credit card" style={{ maxWidth: '90px' }} />
        <h3 className="mt-3 font-weight-light">Please add a credit card!</h3>
      </div>
    )
  };

  return (
    <>
      <h2 className="mb-4">Billing</h2>
      <Table locale={locale} dataSource={cards} pagination={false}>
        <Column
          title="Card type"
          key="cardType"
          render={(text, record) => (
            <>
              <img src={record.type === 'visa' ? '/img/others/img-8.png' : '/img/others/img-9.png'} alt={record.type} />
              <span className="ml-2">{record.type === 'visa' ? 'Visa' : record.type === 'mastercard' ? 'MasterCard' : 'Credit Card'}</span>
            </>
          )}
        />
        <Column title="Card Number" dataIndex="cardNumber" key="cardNumber" render={(text, record) => (
          <>
            •••• •••• •••• {record.last4}
          </>
        )} />
        <Column title="Expires on" dataIndex="exp" key="exp" render={(text, record) => (
          <>
            {record.expiry}
          </>
        )} />
      </Table>
      <div className="mt-3 text-right">
        <Button type="primary" onClick={showModal}>{cards.length > 0 ? 'Update card' : 'Add new card'} </Button>
      </div>
      {modalVisible && <AddNewCardForm visible={modalVisible} onCancel={closeModal} />}
    </>
  )
}

export default Billing
