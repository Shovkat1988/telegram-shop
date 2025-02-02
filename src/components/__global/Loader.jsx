import React from "react";
import { Avatar, Banner, Spinner } from "@vkontakte/vkui";

const Loader = () => {
  return (
    <Banner
      className={"loader"}
      before={
        <Avatar size={48} mode={"app"}>
          <Spinner />
        </Avatar>
      }
      header="Загружаем данные..."
      subheader={"Пожалуйста, подождите немного"}
    />
  );
};

export default Loader;
