import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getCart,
  getProductId,
  getProducts,
  getTotalPrice,
} from "../../storage/selectors/main";
import { Checkbox, Header, SimpleCell } from "@vkontakte/vkui";
import { MainButton } from "@vkruglikov/react-telegram-web-app";
import compareArrays from "../../modules/compareArrays";

const ProductInfoModal = ({ toModal }) => {
  const productId = useRecoilValue(getProductId);
  const products = useRecoilValue(getProducts);
  const [cart, setCart] = useRecoilState(getCart);

  const [totalPrice, setTotalPrice] = useRecoilState(getTotalPrice);

  const [showButton, setShowButton] = useState(true);

  useEffect(() => {
    return () => {
      setShowButton(false);
    };
  }, []);

  const [options, setOptions] = useState([]);

  const productInfo = products?.find((product) => product.id === productId);

  useEffect(() => {
    setTotalPrice(productInfo?.sell_price);
  }, []);

  const addToCart = async (productData) => {
    const newCart = JSON.parse(JSON.stringify(cart));

    const newOptions = options.map((option) => {
      return {
        id: option.id,
        title: option.title,
        sell_price: option.sell_price,
        is_selected: options.includes(option.id),
      };
    });

    const optionIds = newOptions.map((option) => option.id);

    const findProductInCart = newCart.find(
      (product) =>
        product.id === productData.id &&
        compareArrays(
          product.options.map((option) => option.id),
          optionIds
        )
    );

    if (findProductInCart) {
      findProductInCart.quantity++;
    } else {
      newCart.push({
        ...productData,
        quantity: 1,
        sell_price: totalPrice,
        options: options.map((option) => {
          return {
            id: option.id,
            title: option.title,
            sell_price: option.sell_price,
            is_selected: options.includes(option.id),
          };
        }),
      });
    }

    setCart(newCart);
  };

  return (
    <div className={`productModal`}>
      <img
        src={`${import.meta.env.VITE_BACKEND_URL}${productInfo.image_url}`}
        alt={productInfo?.title}
      />
      <SimpleCell disabled multiline description={productInfo?.description}>
        {productInfo?.title}
      </SimpleCell>

      {productInfo?.options?.length ? (
        <>
          <Header mode={"secondary"}>Опции</Header>

          <div className="DivFix">
            {productInfo?.options?.map((option, index) => (
              <Checkbox
                key={index}
                onChange={() => {
                  if (options.includes(option)) {
                    setOptions(options.filter((el) => el !== option));

                    setTotalPrice(totalPrice - option.sell_price);
                  } else {
                    setOptions([...options, option]);

                    setTotalPrice(totalPrice + option.sell_price);
                  }
                }}
                checked={options.includes(option)}
              >
                {option.title}{" "}
                {option.sell_price === 0 ? (
                  ""
                ) : (
                  <>
                    ·{" "}
                    <span className={"secondary"}>{option.sell_price} ₽ </span>
                  </>
                )}
              </Checkbox>
            ))}
          </div>
        </>
      ) : null}

      {showButton ? (
        <MainButton
          onClick={() => {
            addToCart(productInfo);

            toModal(null);
          }}
          text={`В корзину за ${totalPrice} ₽`}
        />
      ) : (
        ""
      )}
    </div>
  );
};

export default ProductInfoModal;
