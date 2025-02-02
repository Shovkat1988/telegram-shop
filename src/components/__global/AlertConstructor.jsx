import React from "react";
import { Alert } from "@vkontakte/vkui";
import { useRouterPopout } from "@kokateam/router-vkminiapps";

const AlertConstructor = ({
  header = "Подтвердите действие",
  text = "",
  action = () => {},
}) => {
  const [, toPopout] = useRouterPopout();

  return (
    <Alert
      actions={[
        {
          title: "Да, удалить",
          mode: "destructive",
          autoclose: true,
          action: () => action(),
        },
        {
          title: "Отмена",
          autoclose: true,
          mode: "cancel",
        },
      ]}
      actionsLayout="vertical"
      onClose={() => toPopout(null)}
      header={header}
      text={text}
    />
  );
};

export default AlertConstructor;
