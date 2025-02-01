import React from "react";
import {
  Avatar,
  Button,
  Card,
  Div,
  FormItem,
  Header,
  SimpleCell,
} from "@vkontakte/vkui";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getCart,
  getFeedback,
  getOrderId,
  getOrders,
  getProducts,
} from "../../storage/selectors/main";
import {
  useRouterBack,
  useRouterModal,
  useRouterPanel,
} from "@kokateam/router-vkminiapps";

const statuses = [
  "Создан и ожидает обработки",
  "Обрабатывается",
  "Передан в доставку",
  "Доставлен",
  "Отменен",
];

const OrderDetailsModal = () => {
  const orders = useRecoilValue(getOrders);
  const orderId = useRecoilValue(getOrderId);

  const products = useRecoilValue(getProducts);

  const [, setCart] = useRecoilState(getCart);

  const toBack = useRouterBack();

  const order = orders.find((order) => order.id === orderId);

  const [, toModal] = useRouterModal();
  const [, setFeedback] = useRecoilState(getFeedback);

  const [, toPanel] = useRouterPanel();

  const repeatOrder = () => {
    const newCart = [];

    order.items.forEach((item) => {
      const currentItem = products.find((product) => product.id === item.id);

      if (currentItem)
        newCart.push({
          ...currentItem,
          quantity: item.quantity,
          options: item.options,
        });
    });

    setCart(newCart);

    toModal(-1);
    toBack(-2);

    setTimeout(() => {
      toPanel("cart");
    }, 1);
  };

  return (
    <div className={"DivFix cart"}>
      <Header
        subtitle={`${statuses[order.status]}, ${
          order?.payment_type === 0 ? "наличными" : "картой"
        }${order?.change_from === 0 ? "" : `, сдача с ${order?.change_from}`}`}
        multiline
      >
        Заказ от{" "}
        {new Date(order?.created_at * 1000).toLocaleString("ru", {
          month: "long",
          day: "numeric",
        })}{" "}
        на {order?.amount} ₽{" "}
        {order?.previous_amount && order?.previous_amount !== order?.amount ? (
          <s className={"gray small"}>{order?.previous_amount} ₽</s>
        ) : (
          ""
        )}
      </Header>

      <Div className={"DivFix"}>
        <Card>
          <Div>
            <b>Адрес:</b> {order.address}
            {order?.comment ? (
              <>
                <br />
                <br />
                <b>Комментарий:</b> {order?.comment}
              </>
            ) : (
              ""
            )}
          </Div>
        </Card>
      </Div>

      <Header mode={"secondary"}>Корзина</Header>
      {order?.items.map((item, key) => (
        <SimpleCell
          className={"productCell"}
          multiline
          disabled
          description={`${item.quantity} шт ${
            item.options.length
              ? `с ${item.options
                  .map((option) => option.title.toLowerCase())
                  .join(", ")}`
              : ""
          }`}
          after={`${item.sell_price * item.quantity} ₽`}
          before={
            <Avatar
              size={40}
              mode={"app"}
              src={`${import.meta.env.VITE_BACKEND_URL}${item.image_url}`}
            />
          }
          key={key}
        >
          {item.title}
        </SimpleCell>
      ))}

      <FormItem
        className={"mt5"}
        bottom={
          <div className={"centered"}>
            При повторении заказа стоимость некоторых позиций может измениться
            после их актуализации
          </div>
        }
      >
        <div
          style={{
            display: "flex",
          }}
        >
          <Button
            className={"mr8"}
            stretched
            size={"l"}
            onClick={() => {
              repeatOrder();
            }}
          >
            Повторить
          </Button>
          <Button
            size={"l"}
            mode={"secondary"}
            onClick={() => {
              toModal(-1);

              setTimeout(() => {
                setFeedback(`Вопрос по заказу №${order.id}: `);

                toModal("feedback");
              }, 400);
            }}
          >
            Помощь
          </Button>
        </div>
      </FormItem>
    </div>
  );
};

export default OrderDetailsModal;
