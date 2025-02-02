import React, { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { getAdminUsersList } from "../../../storage/selectors/admin";
import Loader from "../../__global/Loader";
import fetchData from "../../../modules/fetchData";
import { InfScroll } from "kokateam-infscroll";
import { IconButton, Placeholder, SimpleCell } from "@vkontakte/vkui";
import localizeDate from "../../../modules/localizeDate";
import { Icon28MessageOutline } from "@vkontakte/icons";
import api from "../../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";

const UsersList = () => {
  const [users, setUsers] = useRecoilState(getAdminUsersList);

  const [showLoader, setShowLoader] = useState(false);

  const showPopup = useShowPopup();

  useEffect(() => {
    if (users === null) fetchData("admin/users?limit=1", "GET", setUsers);
  }, []);

  const updateData = async () => {
    setShowLoader(true);

    const req = await api(
      `admin/users?limit=100&offset=${users.length}`,
      "GET"
    );

    if (req.status) {
      const newUsers = JSON.parse(JSON.stringify(users));

      req.data.forEach((user) => {
        newUsers.push(user);
      });

      setUsers(newUsers);
    }

    setShowLoader(false);
  };

  return users === null ? (
    <Loader />
  ) : (
    <>
      <Placeholder header={"Раздел с пользователями"}>
        Здесь вы можете посмотреть всех пользователей бота. Для копирования ID
        пользователя нажмите на его имя, для перехода в его профиль в Telegram
        нажмите на иконку справа (если она есть).
      </Placeholder>
      <InfScroll onReachEnd={updateData} showLoader={showLoader}>
        {users.map((user, index) => (
          <SimpleCell
            key={index}
            onClick={() => {
              navigator.clipboard.writeText(user?.user_id);

              showPopup({
                message: "ID пользователя скопирован в буфер обмена",
              });
            }}
            after={
              user?.username ? (
                <IconButton
                  onClick={() => {
                    window.Telegram.WebApp.openTelegramLink(
                      `https://t.me/${user?.username}`
                    );
                  }}
                >
                  <Icon28MessageOutline />
                </IconButton>
              ) : (
                ""
              )
            }
            description={`Зашел в бота ${localizeDate(user?.joined_at)}`}
          >
            {user?.first_name} {user?.last_name}
          </SimpleCell>
        ))}
      </InfScroll>
    </>
  );
};

export default UsersList;
