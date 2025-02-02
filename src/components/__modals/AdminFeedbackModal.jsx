import React, { useState } from "react";
import { Button, FormItem, FormLayout, Textarea } from "@vkontakte/vkui";
import api from "../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";
import { useRecoilValue } from "recoil";
import {
  getAdminFeedback,
  getAdminFeedbackId,
} from "../../storage/selectors/admin";

const AdminFeedbackModal = ({ toModal }) => {
  const feedbackId = useRecoilValue(getAdminFeedbackId);

  const [feedback, setFeedback] = useState("");

  const [feedbacks, setFeedbacks] = useRecoilValue(getAdminFeedback);

  const showPopup = useShowPopup();

  const sendFeedback = async () => {
    const req = await api(`admin/feedbacks/${feedbackId}`, "POST", {
      message: feedback,
    });

    if (req.data) {
      toModal(-1);

      let newFeedbacks = JSON.parse(JSON.stringify(feedbacks));

      newFeedbacks = newFeedbacks.filter((el) => el.id !== feedbackId);

      setFeedbacks(newFeedbacks);

      await showPopup({
        message: `Готово! Ответ отправлен пользователю.`,
      });
    }
  };

  return (
    <>
      <FormLayout>
        <FormItem
          bottom={"Не менее 10 и не более 4096 символов"}
          top={"Ответ пользователю"}
        >
          <Textarea
            placeholder={"Напишите ваш ответ"}
            name={"feedback"}
            minLength={10}
            value={feedback}
            onChange={(e) => {
              setFeedback(e.target.value);
            }}
            maxLength={4096}
          />
        </FormItem>

        <FormItem>
          <Button
            size={"l"}
            stretched
            disabled={feedback < 10 || feedback > 4096}
            mode={"primary"}
            onClick={() => {
              sendFeedback();
            }}
          >
            Отправить
          </Button>
        </FormItem>
      </FormLayout>
    </>
  );
};

export default AdminFeedbackModal;
