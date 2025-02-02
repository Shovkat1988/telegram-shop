import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import fetchData from "../../modules/fetchData";
import { Header, SimpleCell } from "@vkontakte/vkui";
import declOfNum from "../../modules/declOfNum";
import {
  Icon20ChevronRightOutline,
  Icon28AllCategoriesOutline,
  Icon28CubeBoxOutline,
  Icon28MessageArrowRightOutline,
  Icon28MessageOutline,
  Icon28MoneyCircleOutline,
  Icon28SettingsOutline,
  Icon28ShoppingCartOutline,
  Icon28TagOutline,
  Icon28Users3Outline,
} from "@vkontakte/icons";
import { useRouterPanel } from "@kokateam/router-vkminiapps";
import { getAdminStatistics } from "../../storage/selectors/admin";
import Loader from "../__global/Loader";

const Admin = () => {
  const [statistics, setStatistics] = useRecoilState(getAdminStatistics);

  const [, toPanel] = useRouterPanel();

  useEffect(() => {
    if (statistics === null)
      fetchData("admin/statistics", "GET", setStatistics);
  }, []);

  return (
    <div className={"mt5"}>
      {statistics === null ? (
        <Loader />
      ) : (
        <>
          <Header mode={"secondary"}>Статистика</Header>

          <SimpleCell
            description={"Общее количество пользователей в боте"}
            onClick={() => toPanel("adminUsersList")}
            before={<Icon28Users3Outline />}
          >
            {declOfNum(statistics?.users_count, [
              "пользователь",
              "пользователя",
              "пользователей",
            ])}
          </SimpleCell>
          <SimpleCell
            description={"Общее количество заказов"}
            disabled
            before={<Icon28ShoppingCartOutline />}
          >
            {declOfNum(statistics?.total_orders, [
              "заказ",
              "заказа",
              "заказов",
            ])}
          </SimpleCell>
          <SimpleCell
            description={"Общая сумма заказов"}
            disabled
            before={<Icon28MoneyCircleOutline />}
          >
            {declOfNum(statistics?.total_amount, ["рубль", "рубля", "рублей"])}
          </SimpleCell>
        </>
      )}

      <Header mode={"secondary"}>Управление приложением</Header>
      <SimpleCell
        description={"Управление категориями и товарами"}
        after={<Icon20ChevronRightOutline />}
        before={<Icon28AllCategoriesOutline />}
        multiline
        onClick={() => toPanel("adminCategories")}
      >
        Категории и товары
      </SimpleCell>

      <SimpleCell
        description={"Управление заказами"}
        after={<Icon20ChevronRightOutline />}
        before={<Icon28CubeBoxOutline />}
        onClick={() => toPanel("adminOrders")}
      >
        Заказы
      </SimpleCell>

      <SimpleCell
        description={"Управление обратной связью"}
        after={<Icon20ChevronRightOutline />}
        before={<Icon28MessageArrowRightOutline />}
        onClick={() => toPanel("adminFeedback")}
      >
        Обратная связь
      </SimpleCell>

      <SimpleCell
        description={"Управление промокодами"}
        after={<Icon20ChevronRightOutline />}
        before={<Icon28TagOutline />}
        onClick={() => toPanel("adminPromocodes")}
      >
        Промокоды
      </SimpleCell>

      <SimpleCell
        description={"Управление рассылками"}
        after={<Icon20ChevronRightOutline />}
        before={<Icon28MessageOutline />}
        onClick={() => toPanel("adminMailing")}
      >
        Рассылки
      </SimpleCell>

      <SimpleCell
        description={"Управление пользователями"}
        after={<Icon20ChevronRightOutline />}
        before={<Icon28Users3Outline />}
        onClick={() => toPanel("adminUsers")}
      >
        Пользователи
      </SimpleCell>

      <SimpleCell
        description={"Управление настройками"}
        after={<Icon20ChevronRightOutline />}
        before={<Icon28SettingsOutline />}
        onClick={() => toPanel("adminSettings")}
      >
        Настройки
      </SimpleCell>
    </div>
  );
};

export default Admin;
