import React, { useState } from "react";
import { Button, FormItem, FormLayout, Input } from "@vkontakte/vkui";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";
import api from "../../modules/apiRequest";
import {
  getAdminCategoryId,
  getAdminProductId,
  getAdminWarehouses,
} from "../../storage/selectors/admin";
import { useRecoilState, useRecoilValue } from "recoil";

const AddKeyModal = ({ toModal }) => {
  const [itemKey, setItemKey] = useState("");
  const [loading, setLoading] = useState(false);

  const [warehouses, setWarehouses] = useRecoilState(getAdminWarehouses);
  const productId = useRecoilValue(getAdminProductId);
  const categoryId = useRecoilValue(getAdminCategoryId);

  const showPopup = useShowPopup();

  const makeAction = async () => {
    setLoading(true);

    const req = await api(
      `admin/warehouse/${categoryId}/${productId}`,
      `POST`,
      {
        itemKey,
      }
    );

    setLoading(false);

    if (req.data?.id) {
      setItemKey("");

      const newWarehouses = JSON.parse(JSON.stringify(warehouses));

      newWarehouses.push({
        id: req.data.id,
        itemKey,
      });

      setWarehouses(newWarehouses);

      await showPopup({
        message: "Ключ успешно добавлен",
      });

      toModal(null);
    }
  };

  return (
    <FormLayout className={"DivFix"}>
      <FormItem top={`Ключ (${itemKey.length}/256)`}>
        <Input
          placeholder={"Введите ключ"}
          maxLength={256}
          value={itemKey}
          onChange={(e) => setItemKey(e.target.value)}
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
          disabled={itemKey.length < 1}
        >
          Добавить
        </Button>
      </FormItem>
    </FormLayout>
  );
};

export default AddKeyModal;
