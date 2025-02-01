import React, { useEffect } from "react";
import { Avatar, Footer, Header, SimpleCell } from "@vkontakte/vkui";
import { useRecoilState } from "recoil";
import { getOrderId, getOrders } from "../../storage/selectors/main";
import fetchData from "../../modules/fetchData";
import Loader from "../__global/Loader";
import declOfNum from "../../modules/declOfNum";
import { useRouterModal } from "@kokateam/router-vkminiapps";

const statuses = [
  "Создан и ожидает обработки",
  "Обрабатывается",
  "Передан в доставку",
  "Доставлен",
  "Отменен",
];

const Orders = () => {
  const [orders, setOrders] = useRecoilState(getOrders);

  const [, setOrderId] = useRecoilState(getOrderId);

  useEffect(() => {
    if (orders === null) fetchData("orders", "GET", setOrders);
  }, []);

  const [, toModal] = useRouterModal();

  return (
    <>
      <Header className={"DivFix"}>Список заказов</Header>

      {orders === null ? (
        <Loader />
      ) : (
        <>
          {orders.length ? (
            <div className={"cart"}>
              {orders.map((el, key) => (
                <SimpleCell
                  className={"productCell"}
                  before={
                    <Avatar
                      size={40}
                      mode={"app"}
                      src={`${import.meta.env.VITE_BACKEND_URL}${
                        el.items[0].image_url
                      }`}
                    />
                  }
                  key={key}
                  onClick={() => {
                    toModal("orderDetails");

                    setOrderId(el.id);
                  }}
                  expandable
                  description={statuses[el.status]}
                >
                  Заказ №{el.id} на {el.amount} ₽{" "}
                  {el?.previous_amount && el?.previous_amount !== el.amount ? (
                    <s className={"gray small"}>{el.previous_amount} ₽</s>
                  ) : (
                    ""
                  )}
                </SimpleCell>
              ))}

              <Footer>
                {declOfNum(orders.length, ["заказ", "заказа", "заказов"])}
              </Footer>
            </div>
          ) : (
            <Footer>Пока что тут ничего нет</Footer>
          )}
        </>
      )}
    </>
  );
};

export default Orders;
