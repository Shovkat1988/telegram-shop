import React, { useEffect, useState } from "react";
import {
  FormItem,
  FormLayout,
  Header,
  Input,
  Link,
  Radio,
  Textarea,
} from "@vkontakte/vkui";
import {
  getCart,
  getOrderData,
  getUserData,
} from "../../storage/selectors/main";
import { useRecoilState, useRecoilValue } from "recoil";
import Inputmask from "inputmask";
import { MainButton, useShowPopup } from "@vkruglikov/react-telegram-web-app";
import api from "../../modules/apiRequest";
import useDebounce from "../../modules/useDebounce";
import isNumber from "@kokateam/router-vkminiapps/lib/utils/isNum";

const MakeOrder = () => {
  const userData = useRecoilValue(getUserData);

  const [orderData, setOrderData] = useRecoilState(getOrderData);
  const cart = useRecoilValue(getCart);

  const showPopup = useShowPopup();

  const [showButton, setShowButton] = useState(false);
  const [discount, setDiscount] = useState("");

  let totalCost = cart.reduce((acc, product) => {
    return acc + product.sell_price * product.quantity;
  }, userData.app_settings.delivery_price);

  useEffect(() => {
    setTimeout(() => {
      setShowButton(true);
    }, 750);

    return () => {
      setShowButton(false);
    };
  }, []);

  const updateData = (key, value) => {
    setOrderData({
      ...orderData,
      [key]: value,
    });
  };

  const getDiscount = async (code) => {
    const req = await api(`promocodes/${code}`, "GET");

    if (isNumber(req?.data)) {
      setDiscount(req.data);
    } else {
      setDiscount(0);
    }
  };

  const createOrder = async () => {
    const req = await api("products/purchase", "POST", {
      ...orderData,
      phone: orderData.phone.slice(1),
      change_from: orderData.change_from ? orderData.change_from : 0,
      promocode:
        orderData.promocode.length > 0 ? orderData.promocode : undefined,
      comment: orderData.comment ? orderData.comment : undefined,
      items: cart.map((product) => ({
        id: product.id,
        quantity: product.quantity,
        options:
          product?.options?.length > 0
            ? product.options.map((el) => el.id)
            : undefined,
      })),
    });

    if (req.data?.id) {
      setOrderData({
        full_name: "",
        address: "",
        phone: "",
        payment_type: 0,
        change_from: "",
        promocode: "",
      });

      window.Telegram.WebApp.close();
    } else {
      await showPopup({
        message: req.ru_message,
      });
    }
  };

  useEffect(() => {
    setTimeout(() => {
      new Inputmask("+7 (999) 999-99-99")?.mask(
        document.getElementById("phone")
      );
    }, 500);

    if (userData.phone) {
      updateData("phone", userData.phone.slice(1));
    }

    if (userData?.first_name) {
      updateData("full_name", userData.first_name);
    }
  }, []);

  const checkPromocode = useDebounce(async (code) => {
    if (code) {
      getDiscount(code);
    } else {
      setDiscount("");
    }
  }, 300);

  return (
    <div className={"DivFix"}>
      <Header>Оформление заказа</Header>

      <FormLayout>
        <FormItem top="Как Вас зовут?">
          <Input
            type="text"
            maxLength={128}
            placeholder={"Егор"}
            required
            onChange={(e) =>
              updateData(
                "full_name",
                e.target.value.replace(/[^а-яА-ЯA-Za-z ]/g, "")
              )
            }
            value={orderData.full_name}
          />
        </FormItem>
        <FormItem
          top="Адрес доставки"
          bottom={
            <>
              Мы доставляем только в{" "}
              <Link
                href={
                  "https://yandex.ru/map-widget/v1/?um=constructor:dff5289036b35af07cd244cdcb56d2a8bd1681085de8e58d5dd52ffe11b19b9d&source=constructorLink"
                }
                target={"_blank"}
              >
                определённой зоне
              </Link>
            </>
          }
        >
          <Input
            type="text"
            value={orderData.address}
            name={"address"}
            required
            onChange={(e) => updateData("address", e.target.value)}
            maxLength={128}
            placeholder={
              "ул. Ленина дом 45, корп. 2 кв 4, 3 подъезд, 5 этаж, домофон 4#"
            }
          />
        </FormItem>
        <FormItem top="Номер телефона">
          <Input
            type="text"
            id={"phone"}
            inputMode={"numeric"}
            required
            maxLength={20}
            onChange={(e) =>
              updateData("phone", e.target.value.replace(/[^0-9+]/g, ""))
            }
            placeholder={"+7 (123) 456-7890"}
          />
        </FormItem>
        <FormItem top="Способ оплаты при получении">
          <Radio
            name="payment_type"
            value="0"
            checked={orderData.payment_type === 0}
            onChange={(e) => updateData("payment_type", +e.target.value)}
          >
            Наличными
          </Radio>
          <Radio
            name="payment_type"
            value="1"
            checked={orderData.payment_type === 1}
            onChange={(e) => updateData("payment_type", +e.target.value)}
          >
            Переводом на карту
          </Radio>
        </FormItem>
        {orderData.payment_type === 0 ? (
          <FormItem top="Сдача (необязательно)">
            <Input
              inputMode={"numeric"}
              type="text"
              id={"change_from"}
              onChange={(e) =>
                updateData(
                  "change_from",
                  e.target.value.replace(/[^0-9+]/g, "")
                )
              }
              value={orderData.change_from}
              placeholder={"1000"}
            />
          </FormItem>
        ) : (
          ""
        )}
        <FormItem top="Комментарий к заказу (необязательно)">
          <Textarea
            type="text"
            id={"comment"}
            maxLength={128}
            onChange={(e) => updateData("comment", e.target.value)}
            value={orderData.comment}
            placeholder={"Домофон не работает, позвоните по приезду"}
          />
        </FormItem>
        <FormItem
          top="Промокод, если есть"
          bottom={
            discount !== "" && discount !== 0
              ? `Скидка: ${discount}%`
              : discount === 0 && orderData.promocode
              ? "Промокод не найден или не действителен"
              : ""
          }
          status={
            discount !== "" && discount !== 0
              ? "valid"
              : discount === 0 && orderData.promocode
              ? "error"
              : ""
          }
        >
          <Input
            type="text"
            maxLength={128}
            placeholder={"Ваш промокод"}
            required
            onChange={(e) => {
              updateData("promocode", e.target.value.trim());

              checkPromocode(e.target.value.trim());
            }}
            value={orderData.promocode}
          />
        </FormItem>
      </FormLayout>

      {showButton &&
        orderData.full_name.length > 0 &&
        orderData.address.length > 0 &&
        orderData.phone.length === 12 && (
          <MainButton
            onClick={() => {
              createOrder();
            }}
            text={`Создать заказ за ${
              discount !== "" && discount !== 0
                ? totalCost - (totalCost * discount) / 100
                : totalCost
            } ₽`}
          />
        )}
    </div>
  );
};

export default MakeOrder;
