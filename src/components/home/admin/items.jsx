import React, { useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getAdminCategoryId,
  getAdminProductId,
  getAdminProducts,
  getAdminWarehouses,
} from "../../../storage/selectors/admin";
import fetchData from "../../../modules/fetchData";
import {
  Avatar,
  Button,
  Card,
  Cell,
  ContentCard,
  Footer,
  List,
} from "@vkontakte/vkui";
import {
  useRouterModal,
  useRouterPanel,
  useRouterPopout,
} from "@kokateam/router-vkminiapps";
import declOfNum from "../../../modules/declOfNum";
import api from "../../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";
import Loader from "../../__global/Loader";
import AlertConstructor from "../../__global/AlertConstructor";
import {
  Icon24DeleteOutline,
  Icon24PenOutline,
  Icon24Reorder,
} from "@vkontakte/icons";

const AdminItems = () => {
  const [products, setProducts] = useRecoilState(getAdminProducts);
  const categoryId = useRecoilValue(getAdminCategoryId);
  const [, setProductId] = useRecoilState(getAdminProductId);
  const [, setWarehouse] = useRecoilState(getAdminWarehouses);

  const [rePositionMode, setRePositionMode] = useState(false);
  const [rePositionList, updateRePositionList] = useState([]);

  const [, toModal] = useRouterModal();
  const [, toPopout] = useRouterPopout();
  const [, toPanel] = useRouterPanel();

  const showPopup = useShowPopup();

  useEffect(() => {
    if (products === null)
      fetchData(`admin/products/${categoryId}`, "GET", setProducts);
    else updateRePositionList(products.map((product) => product.title));
  }, [products]);

  const deleteProductRequest = async (id) => {
    const req = await api(`admin/products/${categoryId}/${id}`, "DELETE");

    if (req.status) {
      setProducts(products.filter((product) => product.id !== id));

      await showPopup({
        message: `Товар успешно удален`,
      });
    }
  };

  const deleteProduct = async (id) => {
    toPopout(
      <AlertConstructor
        text={`Вы уверены, что хотите удалить товар?`}
        action={() => deleteProductRequest(id)}
      />
    );
  };

  const reorderList = ({ from, to }, list, updateListFn) => {
    const _list = [...list];
    _list.splice(from, 1);
    _list.splice(to, 0, list[from]);
    updateListFn(_list);
  };

  const savePositions = async (items) => {
    await api(`admin/products/${categoryId}/position`, "PATCH", {
      items,
    });
  };

  return products === null ? (
    <Loader />
  ) : rePositionMode ? (
    <>
      <div className="p5 basicFlex">
        <Button
          stretched
          size={"l"}
          onClick={() => {
            const newProducts = JSON.parse(JSON.stringify(products));

            const newOrder = rePositionList.map((title) =>
              newProducts.find((product) => product.title === title)
            );

            setProducts(newOrder);

            savePositions(
              newOrder.map((product, key) => {
                return {
                  id: product.id,
                  position: key,
                };
              })
            );

            setRePositionMode(!rePositionMode);
          }}
          mode={"primary"}
        >
          Сохранить
        </Button>
      </div>

      <List>
        {rePositionList.map((item) => {
          const product = products.find((product) => product.title === item);

          return (
            <Cell
              key={item}
              before={
                <Avatar
                  mode={"app"}
                  src={`${import.meta.env.VITE_BACKEND_URL}${
                    product.image_url
                  }`}
                />
              }
              multiline
              description={
                product.description || "У товара отсутствует описание"
              }
              draggable
              onDragFinish={({ from, to }) =>
                reorderList({ from, to }, rePositionList, (e) => {
                  updateRePositionList(e);
                })
              }
            >
              {item}
              <span className="gray">, {product.sell_price} ₽</span>
            </Cell>
          );
        })}
      </List>
    </>
  ) : (
    <>
      <div className="p5 basicFlex">
        <Button
          stretched
          className={"mb10 mr8"}
          size={"l"}
          onClick={() => toModal("addProduct")}
          mode={"primary"}
        >
          Добавить товар
        </Button>
        <Button
          className={"mb10"}
          size={"l"}
          onClick={() => setRePositionMode(!rePositionMode)}
          mode={"secondary"}
        >
          <Icon24Reorder />
        </Button>
      </div>

      <div className="flex">
        {products.map((product, index) => (
          <Card className={"p1"} mode={"outline"} key={index}>
            <ContentCard
              header={product.title}
              src={`${import.meta.env.VITE_BACKEND_URL}${product.image_url}`}
              caption={product.description || "У товара отсутствует описание"}
              onClick={() => {
                setProductId(product.id);
                setWarehouse(null);
                toPanel("adminWarehouse");
              }}
              mode={"outline"}
            />

            <div className="basicFlex mt10">
              <Button
                stretched
                mode={"secondary"}
                className={"mr8"}
                onClick={() => {
                  setProductId(product.id);

                  toModal("editProduct");
                }}
              >
                <Icon24PenOutline />
              </Button>

              <Button
                mode={"destructive"}
                onClick={() => deleteProduct(product.id)}
              >
                <Icon24DeleteOutline />
              </Button>
            </div>
          </Card>
        ))}
      </div>

      <Footer>
        {declOfNum(products.length, ["товар", "товара", "товаров"])}
      </Footer>
    </>
  );
};

export default AdminItems;
