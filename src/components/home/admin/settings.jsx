import React, { useState } from "react";
import { useRecoilState } from "recoil";
import { getUserData } from "../../../storage/selectors/main";
import { FormItem, FormLayout, Input } from "@vkontakte/vkui";
import api from "../../../modules/apiRequest";

const AdminSettings = () => {
  const [userData, setUserData] = useRecoilState(getUserData);

  const [min_order_price, setMinOrderPrice] = useState(
    userData.app_settings.min_order_price
  );
  const [delivery_price, setDeliveryPrice] = useState(
    userData.app_settings.delivery_price
  );

  const updateValue = async (key, value) => {
    setUserData({
      ...userData,
      app_settings: {
        ...userData.app_settings,
        [key]: value,
      },
    });

    await api(`admin/settings`, `PATCH`, {
      [key]: value,
    });
  };

  return (
    <FormLayout>
      <FormItem top={"Минимальная сумма заказа"}>
        <Input
          onBlur={() => {
            if (userData.app_settings.min_order_price !== min_order_price) {
              updateValue("min_order_price", +min_order_price);
            }
          }}
          value={min_order_price}
          inputMode={"numeric"}
          onChange={(e) =>
            setMinOrderPrice(e.target.value.replace(/[^0-9+]/g, ""))
          }
        />
      </FormItem>

      <FormItem top={"Стоимость доставки"}>
        <Input
          onBlur={() => {
            if (userData.app_settings.delivery_price !== delivery_price) {
              updateValue("delivery_price", +delivery_price);
            }
          }}
          value={delivery_price}
          inputMode={"numeric"}
          onChange={(e) =>
            setDeliveryPrice(e.target.value.replace(/[^0-9+]/g, ""))
          }
        />
      </FormItem>
    </FormLayout>
  );
};

export default AdminSettings;
