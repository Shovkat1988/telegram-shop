import React, { useState } from "react";
import { Button, FormItem, FormLayout, Input } from "@vkontakte/vkui";
import api from "../../modules/apiRequest";
import { useRecoilState } from "recoil";
import { getAdminPromocodes } from "../../storage/selectors/admin";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";

const AdminAddPromocodeModal = ({ toModal }) => {
  const [code, setCode] = useState("");
  const [activationsLeft, setActivationsLeft] = useState("");
  const [discount, setDiscount] = useState("");

  const [promocodes, setPromocodes] = useRecoilState(getAdminPromocodes);

  const showPopup = useShowPopup();

  const createPromocode = async () => {
    const req = await api(`admin/promocodes`, `POST`, {
      code,
      discount,
      activations_left: activationsLeft,
    });

    if (req.data) {
      const newPromocodes = JSON.parse(JSON.stringify(promocodes));

      newPromocodes.unshift({
        id: req.data.id,
        code,
        discount,
        activations_left: activationsLeft,
        created_at: req.data.updated_at,
      });

      setPromocodes(newPromocodes);

      toModal(null);

      await showPopup({
        message: `Готово! Промокод создан.`,
      });
    }
  };

  return (
    <>
      <FormLayout>
        <FormItem top={"Код"}>
          <Input
            placeholder={"FREE50"}
            name={"code"}
            minLength={1}
            value={code}
            onChange={(e) => {
              setCode(e.target.value.trim());
            }}
            maxLength={14}
          />
        </FormItem>

        <FormItem top={"Процент скидки"}>
          <Input
            placeholder={"50"}
            name={"discount"}
            minLength={1}
            value={discount}
            inputMode={"numeric"}
            onChange={(e) =>
              setDiscount(e.target.value.replace(/[^0-9+]/g, ""))
            }
            maxLength={3}
          />
        </FormItem>

        <FormItem top={"Количество активаций"}>
          <Input
            placeholder={"150"}
            name={"activationsLeft"}
            minLength={1}
            value={activationsLeft}
            inputMode={"numeric"}
            onChange={(e) =>
              setActivationsLeft(e.target.value.replace(/[^0-9+]/g, ""))
            }
          />
        </FormItem>

        <FormItem>
          <Button
            size={"l"}
            stretched
            disabled={
              code.length < 1 ||
              discount.length < 1 ||
              activationsLeft.length < 1
            }
            mode={"primary"}
            onClick={() => {
              createPromocode();
            }}
          >
            Создать
          </Button>
        </FormItem>
      </FormLayout>
    </>
  );
};

export default AdminAddPromocodeModal;
