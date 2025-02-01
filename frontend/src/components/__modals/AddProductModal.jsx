import React, { useState } from "react";
import {
  Button,
  FormItem,
  FormLayout,
  FormLayoutGroup,
  Input,
  Link,
} from "@vkontakte/vkui";
import { useRecoilState, useRecoilValue } from "recoil";
import {
  getAdminCategoryId,
  getAdminProducts,
} from "../../storage/selectors/admin";
import api from "../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";
import UploadInput from "../__global/UploadInput";
import { getIsUploading } from "../../storage/selectors/main";

const AddProductModal = ({ toModal }) => {
  const [data, setData] = useState({
    title: "",
    description: "",
    image_id: null,
    sell_price: null,
    options: [],
  });

  const [loading, setLoading] = useState(false);

  const isUploading = useRecoilValue(getIsUploading);
  const categoryId = useRecoilValue(getAdminCategoryId);
  const [, setProducts] = useRecoilState(getAdminProducts);

  const showPopup = useShowPopup();

  const updateData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const makeAction = async () => {
    setLoading(true);

    const req = await api(`admin/products/${categoryId}`, `POST`, data);

    setLoading(false);

    if (req.data?.id) {
      setProducts(null);

      await showPopup({
        message: "Товар успешно создан",
      });
    }

    toModal(null);
  };

  return (
    <>
      <FormLayout className={"DivFix"}>
        <FormItem top={`Наименование товара (${data.title.length}/128)`}>
          <Input
            placeholder={"Введите наименование товара"}
            maxLength={128}
            value={data.title}
            name={"title"}
            onChange={(e) => updateData("title", e.target.value)}
          />
        </FormItem>

        <FormItem
          top={`Описание товара (${data.description.length}/128)`}
          className={"DivFix"}
        >
          <Input
            placeholder={"Введите описание товара"}
            maxLength={128}
            value={data.description}
            name={"description"}
            onChange={(e) => updateData("description", e.target.value)}
          />
        </FormItem>

        <FormItem top={`Цена для продажи`} className={"DivFix"}>
          <Input
            placeholder={"Введите цену для продажи"}
            type={"text"}
            inputMode={"numeric"}
            value={data.sell_price}
            name={"sell_price"}
            onChange={(e) => {
              updateData("sell_price", e.target.value);
            }}
          />
        </FormItem>

        {data.options.map((option, index) => {
          return (
            <FormLayoutGroup
              mode="horizontal"
              segmented
              key={index}
              className={"DivFix"}
            >
              <FormItem
                top={`Наименование (${option.title.length}/128)`}
                bottom={
                  <Link
                    mode={"destructive"}
                    onClick={() => {
                      const options = data.options;
                      options.splice(index, 1);
                      updateData("options", options);
                    }}
                  >
                    Удалить опцию?
                  </Link>
                }
              >
                <Input
                  placeholder={"Халапеньо"}
                  maxLength={128}
                  value={option.title}
                  name={"title"}
                  onChange={(e) => {
                    const options = data.options;
                    options[index].title = e.target.value;
                    updateData("options", options);
                  }}
                />
              </FormItem>

              <FormItem top={`Цена`} className={"DivFix"}>
                <Input
                  placeholder={"150"}
                  type={"number"}
                  value={option.sell_price}
                  name={"sell_price"}
                  onChange={(e) => {
                    const options = data.options;
                    options[index].sell_price = e.target.value;
                    updateData("options", options);
                  }}
                />
              </FormItem>
            </FormLayoutGroup>
          );
        })}

        <FormItem top={"Опции"}>
          <Button
            stretched
            onClick={() => {
              const options = data.options;
              options.push({
                title: "",
                sell_price: "",
              });
              updateData("options", options);
            }}
          >
            Добавить опцию
          </Button>
        </FormItem>

        <UploadInput
          imageId={data.image_id}
          setImageId={(imageId) => updateData("image_id", imageId)}
        />

        <FormItem className={"DivFix"}>
          <Button
            stretched
            size={"l"}
            onClick={() => {
              makeAction();
            }}
            loading={loading}
            disabled={
              !data.title ||
              data.title.length < 1 ||
              !data.description ||
              data.description.length < 1 ||
              !data.sell_price ||
              !data.image_id ||
              isUploading
            }
          >
            Создать
          </Button>
        </FormItem>
      </FormLayout>
    </>
  );
};
export default AddProductModal;
