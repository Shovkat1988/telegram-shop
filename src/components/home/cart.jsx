import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getCart,
  getProductId,
  getProducts,
  getTitle,
  getUserData,
} from "../../storage/selectors/main";
import {
  Avatar,
  Button,
  Card,
  ContentCard,
  Counter,
  Header,
  SimpleCell,
} from "@vkontakte/vkui";
import { Icon24Add, Icon24MinusOutline } from "@vkontakte/icons";
import { MainButton, useShowPopup } from "@vkruglikov/react-telegram-web-app";
import truncateText from "../../modules/truncateText";
import { useRouterModal, useRouterPanel } from "@kokateam/router-vkminiapps";
import compareArrays from "../../modules/compareArrays";

const Cart = () => {
  const userData = useRecoilValue(getUserData);

  const [cart, setCart] = useRecoilState(getCart);
  const [products] = useRecoilState(getProducts);

  const [, setTitle] = useRecoilState(getTitle);
  const [, setProductId] = useRecoilState(getProductId);
  const [modal, toModal] = useRouterModal();
  const [, toPanel] = useRouterPanel();

  const [activeModal] = useRouterModal();

  const [suggestedProducts, setSuggestedProducts] = useState([]);

  const [showButton, setShowButton] = useState(false);

  const showPopup = useShowPopup();

  useEffect(() => {
    setTimeout(() => {
      setShowButton(true);
    }, 750);

    return () => {
      setShowButton(false);
    };
  }, [modal]);

  useEffect(() => {
    if (cart.length === 0) {
      toPanel(-1);
    }
  }, [cart]);

  const addToCart = async (productData) => {
    const newCart = JSON.parse(JSON.stringify(cart));

    const findProductInCart = newCart.find(
      (product) =>
        product.id === productData.id &&
        compareArrays(
          product.options.map((option) => option.id),
          productData.options.map((option) => option.id)
        )
    );

    if (findProductInCart) {
      findProductInCart.quantity++;
    } else {
      newCart.push({
        ...productData,
        quantity: 1,
      });
    }

    setCart(newCart);
  };

  const removeFromCart = async (productData) => {
    const newCart = JSON.parse(JSON.stringify(cart));

    const findProductInCart = newCart.find(
      (product) =>
        product.id === productData.id &&
        compareArrays(
          product.options.map((option) => option.id),
          productData.options.map((option) => option.id)
        )
    );

    if (findProductInCart) {
      if (findProductInCart.quantity > 1) {
        findProductInCart.quantity--;
      } else {
        newCart.splice(
          newCart.findIndex(
            (product) =>
              product.id === productData.id &&
              compareArrays(
                product.options.map((option) => option.id),
                productData.options.map((option) => option.id)
              )
          ),
          1
        );
      }
    } else {
      newCart.push({
        ...productData,
        quantity: 1,
      });
    }

    setCart(newCart);
  };

  const totalPrice = cart.reduce((acc, product) => {
    return acc + product.sell_price * product.quantity;
  }, 0);

  const openProduct = (id, title) => {
    setProductId(id);
    setTitle(title);

    toModal("productInfo");
  };

  useEffect(() => {
    const suggests = products?.filter(
      (product) => !cart.find((cartProduct) => cartProduct.id === product.id)
    );

    setSuggestedProducts(suggests);
  }, [cart]);

  return (
    <div className={"DivFix cart"}>
      <Header
        subtitle={`Итого: ${
          totalPrice + userData.app_settings.delivery_price
        } ₽, включая доставку ${userData.app_settings.delivery_price} ₽`}
      >
        Корзина
      </Header>

      {cart.map((product, key) => {
        return (
          <SimpleCell
            className={"productCell"}
            key={key}
            hasHover={false}
            hasActive={false}
            after={
              <div className="basicFlex">
                <Button
                  size="m"
                  onClick={() => removeFromCart(product)}
                  style={{
                    background: "none",
                  }}
                  stretched
                  appearance="neutral"
                  before={<Icon24MinusOutline fill={"var(--secondary)"} />}
                />

                <Counter
                  mode={"contrast"}
                  size={"m"}
                  style={{
                    padding: "0 10px",
                  }}
                >
                  {product.quantity} шт
                </Counter>
                <Button
                  size="m"
                  onClick={() => addToCart(product)}
                  stretched
                  style={{
                    background: "none",
                  }}
                  appearance="neutral"
                  before={<Icon24Add fill={"var(--secondary)"} />}
                />
              </div>
            }
            multiline
            description={
              <>
                {product?.sell_price * product?.quantity} ₽
                {product?.options?.length
                  ? ` (${product?.options
                      .map((option) => option.title.toLowerCase())
                      .join(", ")})`
                  : ""}
              </>
            }
            before={
              <Avatar
                size={64}
                mode={"app"}
                src={`${import.meta.env.VITE_BACKEND_URL}${product.image_url}`}
              />
            }
          >
            {product?.title}
          </SimpleCell>
        );
      })}

      {suggestedProducts?.length ? (
        <>
          <Header mode={"secondary"}>Что-нибудь ещё?</Header>

          <div className={"p1 doubleflex"}>
            {suggestedProducts?.map((product, itemIndex) => {
              const isInCart = cart.find(
                (productInCart) => productInCart.id === product.id
              );

              return (
                <Card
                  className={"p1 tripleItems"}
                  mode={"outline"}
                  key={itemIndex}
                  onClick={() => {
                    setShowButton(false);

                    setTimeout(() => {
                      openProduct(product.id, product.title);
                    }, 300);
                  }}
                >
                  <ContentCard
                    header={
                      <span className={"itemName"}>
                        {truncateText(product.title, 30)}
                      </span>
                    }
                    src={`${import.meta.env.VITE_BACKEND_URL}${
                      product.image_url
                    }`}
                    mode={"outline"}
                  />

                  {!isInCart ? (
                    <Button
                      stretched
                      size={"m"}
                      mode={"secondary"}
                      hasActive={false}
                      onClick={() => {
                        setShowButton(false);

                        setTimeout(() => {
                          openProduct(product.id, product.title);
                        }, 300);
                      }}
                    >
                      {product.sell_price} ₽
                    </Button>
                  ) : (
                    ""
                  )}
                </Card>
              );
            })}
          </div>
        </>
      ) : (
        ""
      )}

      {showButton && (activeModal === null || activeModal?.modal === null) ? (
        <MainButton
          onClick={() => {
            if (totalPrice < userData.app_settings.min_order_price) {
              return showPopup({
                message: `Заказ от ${
                  userData.app_settings.min_order_price
                } ₽. Не хватает ещё ${
                  userData.app_settings.min_order_price - totalPrice
                } ₽`,
              });
            }

            toPanel("makeOrder");
          }}
          text={
            totalPrice >= userData.app_settings.min_order_price
              ? `Оформить заказ за ${
                  totalPrice + userData.app_settings.delivery_price
                } ₽`
              : `Ещё ${
                  userData.app_settings.min_order_price - totalPrice
                } ₽ до минимальной суммы`
          }
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default Cart;
