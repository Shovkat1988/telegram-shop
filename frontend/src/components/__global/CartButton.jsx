import React, { useEffect, useState } from "react";
import { MainButton } from "@vkruglikov/react-telegram-web-app";
import { useRecoilValue } from "recoil";
import { getCart, getUserData } from "../../storage/selectors/main";
import { useRouterModal, useRouterPanel } from "@kokateam/router-vkminiapps";

const CartButton = () => {
  const userData = useRecoilValue(getUserData);
  const cart = useRecoilValue(getCart);

  const [showButton, setShowButton] = useState(false);

  const [activeModal] = useRouterModal();
  const [activePanel] = useRouterPanel();

  const [, toPanel] = useRouterPanel();

  useEffect(() => {
    if (activeModal === null || activeModal?.modal === null)
      setTimeout(() => {
        setShowButton(true);
      }, 750);

    return () => {
      setShowButton(false);
    };
  }, [activeModal]);

  const total = cart.length
    ? cart.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.quantity * currentValue.sell_price,
        0
      )
    : 0;

  return cart.length > 0 &&
    activePanel.active === "home" &&
    showButton &&
    (activeModal === null || activeModal?.modal === null) ? (
    <MainButton
      onClick={() => {
        toPanel("cart");
      }}
      text={
        total >= userData.app_settings.min_order_price
          ? `Оформить доставку за ${
              total + userData.app_settings.delivery_price
            } ₽`
          : `Ещё ${
              userData.app_settings.min_order_price - total
            } ₽ до минимальной суммы`
      }
    />
  ) : (
    ""
  );
};

export default CartButton;
