import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Button, Row, Col, ListGroup, Image, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import CheckoutSteps from "../components/CheckoutSteps";
import { createOrder } from "../actions/orderActions";
// import { ORDER_CREATE_RESET } from '../constants/orderConstants';
// import { USER_DETAILS_RESET } from '../constants/userConstants';

const PlaceOrderScreen = ({ history }) => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  if (!cart.shippingAddress.address) {
    history.push("/shipping");
  } else if (!cart.paymentMethod) {
    history.push("/payment");
  }

  const addDecimals = (num) => {
    return (Math.round(num * 100) / 100).toFixed(2);
  };
  cart.itemsPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
  );

  // shipping fee
  cart.shippingPrice = addDecimals(
    cart.cartItems.reduce((acc, item) => acc + 5 * item.qty, 0),
  );

  // tax fee
  cart.taxPrice = addDecimals(Number(cart.itemsPrice * 0.1));

  // total price
  cart.totalPrice = (
    Number(cart.itemsPrice) +
    Number(cart.shippingPrice) +
    Number(cart.taxPrice)
  ).toFixed(2);

  const orderCreate = useSelector((state) => state.orderCreate);
  const { order, success, error } = orderCreate;

  useEffect(() => {
    if (success) {
      history.push(`/order/${order._id}`);
    }
  }, [history, success]);

  const placeOrderHandler = () => {
    try {
      dispatch(
        createOrder({
          orderItems: cart.cartItems,
          shippingAddress: cart.shippingAddress,
          paymentMethod: cart.paymentMethod,
          itemsPrice: cart.itemsPrice,
          shippingPrice: cart.shippingPrice,
          taxPrice: cart.taxPrice,
          totalPrice: cart.totalPrice,
        }),
      );
    } catch (error) {
      console.error("Error placing order:", error);
    }
  };

  return (
    <>
      <CheckoutSteps step1 step2 step3 step4 />
      <h2 className="sub-heading">Place Order</h2>
      <Row>
        <Col md={8}>
          <Card className="box py-1">
            <ListGroup variant="flush">
              <ListGroup.Item className="px-0">
                <h2 className="pt-0">Shipping</h2>
                <p>
                  <strong>Address:</strong>
                  {cart.shippingAddress.address}, {cart.shippingAddress.city}{" "}
                  {cart.shippingAddress.postalCode},{" "}
                  {cart.shippingAddress.country}
                </p>
              </ListGroup.Item>

              <ListGroup.Item className="px-0">
                <h2>Payment Method</h2>
                <strong>Method: </strong>
                {cart.paymentMethod}
              </ListGroup.Item>

              <ListGroup.Item className="px-0">
                <h2>Order Items</h2>
                {cart.cartItems.length === 0 ? (
                  <Message>Your cart is empty</Message>
                ) : (
                  <ListGroup variant="flush">
                    {cart.cartItems.map((item, index) => (
                      <ListGroup.Item key={index}>
                        <Row>
                          <Col md={1}>
                            <Image
                              src={item.image}
                              alt={item.name}
                              fluid
                              rounded
                            />
                          </Col>
                          <Col>
                            <Link to={`/product/${item.product}`}>
                              {item.name}
                            </Link>
                          </Col>
                          <Col md={4}>
                            {item.qty} x ${item.price} = $
                            {item.qty * item.price}
                          </Col>
                        </Row>
                      </ListGroup.Item>
                    ))}
                  </ListGroup>
                )}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="box py-1">
            <ListGroup variant="flush">
              <ListGroup.Item className="px-0">
                <h2 className="pt-0">Order Summary</h2>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <Row>
                  <Col>Items</Col>
                  <Col>${cart.itemsPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <Row>
                  <Col>Shipping</Col>
                  <Col>${cart.shippingPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <Row>
                  <Col>Tax</Col>
                  <Col>${cart.taxPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <Row>
                  <Col>Total</Col>
                  <Col>${cart.totalPrice}</Col>
                </Row>
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                {error && <Message variant="danger">{error}</Message>}
              </ListGroup.Item>
              <ListGroup.Item className="px-0">
                <Button
                  type="button"
                  className="btn-block"
                  disabled={cart.cartItems === 0}
                  onClick={placeOrderHandler}
                >
                  Place Order
                </Button>
              </ListGroup.Item>
            </ListGroup>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PlaceOrderScreen;
