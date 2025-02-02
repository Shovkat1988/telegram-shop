import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  getAdminCategories,
  getAdminCategoryId,
  getAdminProducts,
} from "../../../storage/selectors/admin";
import { Button, Footer } from "@vkontakte/vkui";
import fetchData from "../../../modules/fetchData";
import declOfNum from "../../../modules/declOfNum";
import {
  useRouterModal,
  useRouterPanel,
  useRouterPopout,
} from "@kokateam/router-vkminiapps";
import api from "../../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";
import CategoryCard from "../__components/CategoryCard";
import Loader from "../../__global/Loader";
import AlertConstructor from "../../__global/AlertConstructor";

const AdminCategories = () => {
  const [categories, setCategories] = useRecoilState(getAdminCategories);
  const [, setCategoryId] = useRecoilState(getAdminCategoryId);
  const [, setProducts] = useRecoilState(getAdminProducts);

  const [, toPopout] = useRouterPopout();
  const [, toModal] = useRouterModal();
  const [, toPanel] = useRouterPanel();

  const showPopup = useShowPopup();

  useEffect(() => {
    if (categories === null)
      fetchData("admin/categories", "GET", setCategories);
  }, []);

  const deleteCategoryRequest = async (id) => {
    const req = await api(`admin/categories/${id}`, "DELETE");

    if (req.status) {
      setCategories(categories.filter((category) => category.id !== id));

      await showPopup({
        message: `Категория успешно удалена`,
      });
    }
  };

  const deleteCategory = async (id) => {
    toPopout(
      <AlertConstructor
        text={"Вы уверены, что хотите удалить категорию?"}
        action={() => deleteCategoryRequest(id)}
      />
    );
  };

  const openCategory = (id) => {
    setCategoryId(id);
    setProducts(null);

    toPanel("adminItems");
  };

  return categories === null ? (
    <Loader />
  ) : (
    <div className={"p5"}>
      <Button
        stretched
        className={"mb10"}
        size={"l"}
        onClick={() => toModal("addCategory")}
        mode={"primary"}
      >
        Добавить категорию
      </Button>

      {categories.map((category, index) => (
        <CategoryCard
          key={index}
          action={openCategory}
          {...category}
          deleteAction={deleteCategory}
        />
      ))}

      <Footer>
        {declOfNum(categories.length, ["категория", "категории", "категорий"])}
      </Footer>
    </div>
  );
};

export default AdminCategories;
