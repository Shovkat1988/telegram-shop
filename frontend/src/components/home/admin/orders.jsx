import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  getAdminOrderId,
  getAdminOrders,
} from "../../../storage/selectors/admin";
import fetchData from "../../../modules/fetchData";
import Loader from "../../__global/Loader";
import { Avatar, Footer, SimpleCell } from "@vkontakte/vkui";
import declOfNum from "../../../modules/declOfNum";
import { useRouterModal } from "@kokateam/router-vkminiapps";

const statuses = [
  "Создан и ожидает обработки",
  "Обрабатывается",
  "Передан в доставку",
  "Доставлен",
  "Отменен",
];

const AdminOrders = () => {
  const [orders, setOrders] = useRecoilState(getAdminOrders);
  const [, setOrderId] = useRecoilState(getAdminOrderId);

  const [, toModal] = useRouterModal();

  useEffect(() => {
    if (orders === null) fetchData("admin/orders", "GET", setOrders);
  }, []);

  return orders === null ? (
    <Loader />
  ) : (
    <>
      {orders.length ? (
        <>
          <div className={"cart"}>
            {orders.map((order, index) => (
              <SimpleCell
                key={index}
                className={"productCell"}
                description={`${order?.amount} ₽, статус: ${statuses[
                  order?.status
                ].toLowerCase()}`}
                onClick={() => {
                  setOrderId(order.id);

                  toModal("adminOrderDetails");
                }}
                before={
                  <Avatar
                    size={40}
                    mode={"app"}
                    src={`${import.meta.env.VITE_BACKEND_URL}${
                      order?.items[0].image_url
                    }`}
                  />
                }
              >
                Заказ №{order?.id} от{" "}
                {new Date(order?.created_at * 1000).toLocaleString("ru", {
                  month: "long",
                  day: "numeric",
                })}{" "}
                на {order.amount} ₽
              </SimpleCell>
            ))}
          </div>

          <Footer>
            {declOfNum(orders.length, ["заказ", "заказа", "заказов"])}
          </Footer>
        </>
      ) : (
        <Footer>Пока что тут ничего нет</Footer>
      )}
    </>
  );
};

export default AdminOrders;
