import React, { useEffect } from "react";
import {
  getAdminFeedback,
  getAdminFeedbackId,
} from "../../../storage/selectors/admin";
import { useRecoilState } from "recoil";
import fetchData from "../../../modules/fetchData";
import Loader from "../../__global/Loader";
import { Footer, SimpleCell } from "@vkontakte/vkui";
import declOfNum from "../../../modules/declOfNum";
import { Icon28MessageOutline } from "@vkontakte/icons";
import { useRouterModal } from "@kokateam/router-vkminiapps";

const AdminFeedback = () => {
  const [feedback, setFeedback] = useRecoilState(getAdminFeedback);
  const [, setFeedbackId] = useRecoilState(getAdminFeedbackId);

  const [, toModal] = useRouterModal();

  useEffect(() => {
    if (feedback === null) fetchData("admin/feedbacks", "GET", setFeedback);
  }, []);

  return feedback === null ? (
    <Loader />
  ) : (
    <>
      {feedback.length ? (
        <>
          {feedback.map((el, key) => (
            <SimpleCell
              key={key}
              onClick={() => {
                setFeedbackId(el.id);

                toModal("adminFeedback");
              }}
              description={el.message}
              multiline
              expandable
              hasHover={false}
              hasActive={false}
              before={<Icon28MessageOutline />}
            >
              Обращение от{" "}
              {new Date(el?.created_at * 1000).toLocaleString("ru", {
                month: "long",
                day: "numeric",
              })}
            </SimpleCell>
          ))}

          <Footer>
            {declOfNum(feedback.length, [
              "обращение",
              "обращения",
              "обращений",
            ])}
          </Footer>
        </>
      ) : (
        <Footer>Ничего не найдено</Footer>
      )}
    </>
  );
};

export default AdminFeedback;
