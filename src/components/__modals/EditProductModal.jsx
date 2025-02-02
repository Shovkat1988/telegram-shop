import React, { useEffect, useState } from "react";
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
  getAdminProductId,
  getAdminProducts,
} from "../../storage/selectors/admin";
import api from "../../modules/apiRequest";
import UploadInput from "../__global/UploadInput";
import { getIsUploading } from "../../storage/selectors/main";

const EditProductModal = ({ toModal }) => {
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
  const productId = useRecoilValue(getAdminProductId);

  const [products, setProducts] = useRecoilState(getAdminProducts);

  useEffect(() => {
    if (productId) {
      const product = products.find((product) => product.id === productId);

      setData({
        title: product.title,
        description: product.description,
        image_id: product.image_id,
        sell_price: product.sell_price,
        options: product.options,
      });
    }
  }, []);

  const updateData = (key, value) => {
    setData({
      ...data,
      [key]: value,
    });
  };

  const makeAction = async () => {
    setLoading(true);

    const req = await api(
      `admin/products/${categoryId}/${productId}`,
      `PATCH`,
      {
        ...data,
        image_id: data?.image_id ? data.image_id : undefined,
      }
    );

    setLoading(false);

    if (req.data?.id) {
      const newProducts = JSON.parse(JSON.stringify(products));

      const index = newProducts.findIndex(
        (product) => product.id === productId
      );

      newProducts[index] = {
        ...newProducts[index],
        ...data,
        image_url: req?.data?.image_url
          ? req.data.image_url
          : newProducts[index].image_url,
      };

      setData({
        title: "",
        description: "",
        image_id: null,
        sell_price: null,
        options: [],
      });

      setProducts(newProducts);
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
                      const options = JSON.parse(JSON.stringify(data.options));
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
                    const options = JSON.parse(JSON.stringify(data.options));
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
              const options = JSON.parse(JSON.stringify(data.options));
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
              isUploading
            }
          >
            Сохранить
          </Button>
        </FormItem>
      </FormLayout>
    </>
  );
};
export default EditProductModal;
