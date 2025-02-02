import React, { useState } from "react";
import { Button, FormItem, FormLayout, Input } from "@vkontakte/vkui";
import { useRecoilState, useRecoilValue } from "recoil";
import { getAdminCategories } from "../../storage/selectors/admin";
import { getCategories as getUserCategories } from "../../storage/selectors/main";
import api from "../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";

const AddCategoryModal = ({ toModal }) => {
  const [loading, setLoading] = useState(false);

  const [data, setData] = useState({
    title: "",
  });

  const [categories, setCategories] = useRecoilState(getAdminCategories);
  const [, setUserCategories] = useRecoilState(getUserCategories);

  const showPopup = useShowPopup();

  const updateData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const makeAction = async () => {
    setLoading(true);

    const req = await api(`admin/categories`, `POST`, data);

    setLoading(false);

    if (req.data?.id) {
      setData({
        title: "",
      });

      const newCategories = JSON.parse(JSON.stringify(categories));

      newCategories.push({
        id: req.data.id,
        title: data.title,
        products_count: 0,
      });

      setCategories(newCategories);
      setUserCategories(newCategories);

      await showPopup({
        message: "Категория успешно создана",
      });

      toModal(null);
    }
  };

  return (
    <>
      <FormLayout className={"DivFix"}>
        <FormItem top={`Наименование категории (${data.title?.length}/128)`}>
          <Input
            placeholder={"Введите наименование категории"}
            maxLength={128}
            value={data.title}
            name={"title"}
            onChange={(e) => updateData(e.target.name, e.target.value)}
          />
        </FormItem>

        <FormItem className={"DivFix"}>
          <Button
            stretched
            size={"l"}
            onClick={() => {
              makeAction();
            }}
            loading={loading}
            disabled={data.title.length < 6}
          >
            Создать
          </Button>
        </FormItem>
      </FormLayout>
    </>
  );
};

export default AddCategoryModal;
