import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { getAdminPromocodes } from "../../../storage/selectors/admin";
import fetchData from "../../../modules/fetchData";
import Loader from "../../__global/Loader";
import { Alert, Button, Footer, IconButton, SimpleCell } from "@vkontakte/vkui";
import declOfNum from "../../../modules/declOfNum";
import { Icon24DeleteOutline } from "@vkontakte/icons";
import { useRouterModal, useRouterPopout } from "@kokateam/router-vkminiapps";
import api from "../../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";

const AdminPromocodes = () => {
  const [promocodes, setPromocodes] = useRecoilState(getAdminPromocodes);

  const [, toPopout] = useRouterPopout();
  const [, toModal] = useRouterModal();

  const showPopup = useShowPopup();

  useEffect(() => {
    if (promocodes === null)
      fetchData("admin/promocodes", "GET", setPromocodes);
  }, []);

  const confirmedDelete = async (id) => {
    const req = await api(`admin/promocodes/${id}`, "DELETE");

    if (req.data) {
      const newPromocodes = JSON.parse(JSON.stringify(promocodes));

      setPromocodes(newPromocodes.filter((el) => el.id !== id));

      await showPopup({
        message: `Промокод удалён.`,
      });
    }
  };

  const deletePopout = (id) =>
    toPopout(
      <Alert
        actions={[
          {
            title: "Удалить",
            mode: "destructive",
            autoclose: true,
            action: () => confirmedDelete(id),
          },
          {
            title: "Отмена",
            autoclose: true,
            mode: "cancel",
          },
        ]}
        actionsLayout="vertical"
        onClose={() => toPopout(null)}
        header="Подтвердите действие"
        text="Вы уверены, что хотите удалить промокод?"
      />
    );

  return promocodes === null ? (
    <Loader />
  ) : (
    <>
      <Button
        stretched
        className={"mb10"}
        onClick={() => toModal("adminAddPromocode")}
        size={"l"}
      >
        Создать промокод
      </Button>

      {promocodes.length ? (
        <>
          {promocodes.map((el, key) => (
            <SimpleCell
              key={key}
              disabled
              after={
                <IconButton onClick={() => deletePopout(el.id)}>
                  <Icon24DeleteOutline fill={"var(--destructive)"} />
                </IconButton>
              }
              description={`Ещё ${declOfNum(el.activations_left, [
                "активация",
                "активации",
                "активаций",
              ])}`}
            >
              <b>{el.code}</b> на -{el.discount}%
            </SimpleCell>
          ))}

          <Footer>
            {declOfNum(promocodes.length, [
              "промокод",
              "промокода",
              "промокодов",
            ])}
          </Footer>
        </>
      ) : (
        <Footer>Ничего не найдено</Footer>
      )}
    </>
  );
};

export default AdminPromocodes;
