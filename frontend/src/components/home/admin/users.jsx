import React, { useState } from "react";
import { Icon56Users3Outline } from "@vkontakte/icons";
import {
  Button,
  FormItem,
  FormLayout,
  Input,
  Placeholder,
  Radio,
} from "@vkontakte/vkui";
import api from "../../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";

const Users = () => {
  const [id, setId] = useState("");
  const [type, setType] = useState("ban");

  const [loading, setLoading] = useState(false);

  const showPopup = useShowPopup();

  const makeAction = async () => {
    setLoading(true);

    const req = await api(
      `admin/users/${type}/${id}`,
      type === "ban" || type === "admin" ? "POST" : "DELETE"
    );

    setLoading(false);

    if (req.status) {
      setId("");
    } else {
      await showPopup({
        message: req.ru_message,
      });
    }
  };

  return (
    <>
      <Placeholder
        header={"Система управления пользователями"}
        icon={<Icon56Users3Outline />}
      >
        Тут вы можете заблокировать или разблокировать пользователя, а также
        назначить или снять администратора
      </Placeholder>

      <FormLayout className={"DivFix"}>
        <FormItem top={"ID пользователя"}>
          <Input
            maxLength={16}
            placeholder={"Введите ID пользователя"}
            value={id}
            onChange={(e) => setId(e.target.value)}
          />
        </FormItem>

        <FormItem top={"Тип действия"} className={"DivFix"}>
          <Radio
            name="type"
            value="ban"
            checked={type === "ban"}
            onChange={() => setType("ban")}
          >
            Заблокировать
          </Radio>

          <Radio
            name="type"
            value="unban"
            checked={type === "unban"}
            onChange={() => setType("unban")}
          >
            Разблокировать
          </Radio>

          <Radio
            name="type"
            value="admin"
            checked={type === "admin"}
            onChange={() => setType("admin")}
          >
            Назначить администратором
          </Radio>

          <Radio
            name="type"
            value="unadmin"
            checked={type === "unadmin"}
            onChange={() => setType("unadmin")}
          >
            Снять администратора
          </Radio>
        </FormItem>

        <FormItem className={"DivFix"}>
          <Button
            size={"l"}
            onClick={() => {
              makeAction();
            }}
            loading={loading}
            disabled={id.length === 0}
            stretched
          >
            Выполнить
          </Button>
        </FormItem>
      </FormLayout>
    </>
  );
};

export default Users;
