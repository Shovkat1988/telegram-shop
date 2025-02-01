import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { getAdminOrderId, getAdminOrders } from "../../storage/selectors/admin";
import Loader from "../__global/Loader";
import {
  Avatar,
  Card,
  CustomSelectOption,
  Div,
  FormItem,
  Header,
  Input,
  Select,
  SimpleCell,
} from "@vkontakte/vkui";
import api from "../../modules/apiRequest";

const statuses = [
  "Создан и ожидает обработки",
  "Обрабатывается",
  "Передан в доставку",
  "Доставлен",
  "Отменен",
];

const AdminOrderDetails = () => {
  const [orders, setOrders] = useRecoilState(getAdminOrders);
  const orderId = useRecoilValue(getAdminOrderId);

  const [price, setPrice] = useState("");

  let selectedOrder = orders.find((order) => order.id === orderId);

  useEffect(() => {
    setPrice(selectedOrder?.amount);
  }, [selectedOrder]);

  const changeStatus = async (statusId) => {
    const newOrders = JSON.parse(JSON.stringify(orders));

    newOrders.forEach((order) => {
      if (order.id === selectedOrder.id) {
        order.status = statusId;
      }
    });

    setOrders(newOrders);

    await api(`admin/orders/${selectedOrder.id}/status/${statusId}`, "PATCH");
  };

  const changePrice = async (amount) => {
    const newOrders = JSON.parse(JSON.stringify(orders));

    newOrders.forEach((order) => {
      if (order.id === selectedOrder.id) {
        order.amount = amount;
      }
    });

    setOrders(newOrders);

    await api(`admin/orders/${selectedOrder.id}/price/${amount}`, "PATCH");
  };

  return selectedOrder?.id ? (
    <div className={"DivFix"}>
      <Header
        subtitle={`${statuses[selectedOrder.status]}, ${
          selectedOrder?.payment_type === 0 ? "наличными" : "картой"
        }${
          selectedOrder?.change_from === 0
            ? ""
            : `, сдача с ${selectedOrder?.change_from}`
        }`}
        multiline
      >
        Заказ №{selectedOrder.id} на сумму {selectedOrder.amount} ₽{" "}
        {selectedOrder?.previous_amount &&
        selectedOrder?.previous_amount !== selectedOrder.amount ? (
          <s className={"gray small"}>{selectedOrder.previous_amount} ₽</s>
        ) : (
          ""
        )}
      </Header>

      <Div className={"DivFix"}>
        <Card>
          <Div>
            <b>Адрес:</b> {selectedOrder.address}
            {selectedOrder?.comment ? (
              <>
                <br />
                <br />
                <b>Комментарий:</b> {selectedOrder?.comment}
              </>
            ) : (
              ""
            )}
          </Div>
        </Card>
      </Div>

      <Header mode={"secondary"}>Корзина</Header>
      {selectedOrder?.items.map((item, key) => (
        <SimpleCell
          className={"productCell"}
          multiline
          disabled
          description={`${item.quantity} шт ${
            item.options.length
              ? ` (${item.options
                  .map((option) => option.title.toLowerCase())
                  .join(", ")})`
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

      <div className="mt10 mb10" />

      <FormItem className={"mt10"} top={"Статус заказа"}>
        <Select
          placeholder="Не выбран"
          options={[
            { label: "Создан и ожидает обработки", value: 0 },
            { label: "Обрабатывается", value: 1 },
            { label: "Передан в доставку", value: 2 },
            { label: "Доставлен", value: 3 },
            { label: "Отменен", value: 4 },
          ]}
          renderOption={({ option, ...restProps }) => (
            <CustomSelectOption {...restProps} />
          )}
          value={selectedOrder.status}
          onChange={(e) => {
            changeStatus(e.target.value);
          }}
        />
      </FormItem>

      <FormItem top={"Стоимость заказа"}>
        <Input
          placeholder={"100"}
          name={"price"}
          value={price}
          onBlur={() => {
            if (price !== selectedOrder.amount) {
              changePrice(price);
            }
          }}
          inputMode={"numeric"}
          onChange={(e) => setPrice(e.target.value.replace(/[^0-9+]/g, ""))}
        />
      </FormItem>
    </div>
  ) : (
    <Loader />
  );
};

export default AdminOrderDetails;
