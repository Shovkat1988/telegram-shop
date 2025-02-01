import { useRouterModal, useRouterPanel } from "@kokateam/router-vkminiapps";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getCategories,
  getProductId,
  getProducts,
  getTitle,
  getUserData,
} from "../../storage/selectors/main";
import React, { useEffect } from "react";
import fetchData from "../../modules/fetchData";
import Loader from "../__global/Loader";
import { Button, Card, ContentCard, Header, SimpleCell } from "@vkontakte/vkui";
import api from "../../modules/apiRequest";
import {
  Icon28MessageOutline,
  Icon28ShoppingCartOutline,
} from "@vkontakte/icons";
import truncateText from "../../modules/truncateText";
import CartButton from "../__global/CartButton";

const Home = () => {
  const userData = useRecoilValue(getUserData);

  const [categories, setCategories] = useRecoilState(getCategories);
  const [products, setProducts] = useRecoilState(getProducts);

  const [, setProductId] = useRecoilState(getProductId);
  const [, setTitle] = useRecoilState(getTitle);

  const [activeModal] = useRouterModal();
  const [, toPanel] = useRouterPanel();
  const [, toModal] = useRouterModal();

  useEffect(() => {
    if (categories === null) fetchData("categories", "GET", setCategoriesFunc);
  }, []);

  const setCategoriesFunc = async (categories) => {
    setCategories(categories);

    const ids = categories.map((category) => category.id).join(",");

    const req = await api(`products/categories?ids=${ids}`, `GET`);

    setProducts(req.data);
  };

  useEffect(() => {
    if (userData?.is_admin) {
      window.Telegram.WebApp.SettingsButton.show();

      window.Telegram.WebApp.SettingsButton.onClick(() => {
        toPanel("admin");
      });
    }
  }, [userData]);

  const openProduct = (id, title) => {
    setProductId(id);
    setTitle(title);

    toModal("productInfo");
  };

  return categories === null && products === null ? (
    <Loader />
  ) : (
    <div className={"DivFix"}>
      <Header>
        Здравств2уйте, {userData?.first_name}
        {userData?.last_name ? ` ${userData?.last_name}` : ""}!
      </Header>

      <SimpleCell
        onClick={() => toPanel("orders")}
        before={<Icon28ShoppingCartOutline />}
        expandable
        description={"История ваших заказов"}
      >
        Заказы
      </SimpleCell>
      <SimpleCell
        onClick={() => toModal("feedback")}
        before={<Icon28MessageOutline />}
        expandable
        description={"Если у вас есть вопросы или предложения"}
      >
        Обратная связь
      </SimpleCell>

      <Header>Меню</Header>

      {categories.map((category, index) => {
        const items = products?.filter(
          (product) => product.category_id === category.id
        );

        return (
          <div key={index} className={"DivFix"}>
            <Header mode={"secondary"}>{category.title}</Header>

            <div className={"p1 flex"}>
              {items?.map((product, itemIndex) => {
                return (
                  <Card
                    className={"p1"}
                    mode={"outline"}
                    key={itemIndex}
                    onClick={() => {
                      openProduct(product.id, product.title);
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

                    <Button
                      stretched
                      size={"m"}
                      hasActive={false}
                      onClick={() => openProduct(product.id, product.title)}
                    >
                      {product.sell_price} ₽
                    </Button>
                  </Card>
                );
              })}
            </div>
          </div>
        );
      })}

      {!activeModal || !activeModal.active ? <CartButton /> : ""}
    </div>
  );
};

export default Home;
