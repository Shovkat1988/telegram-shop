import React from "react";
import { Button, FormItem, FormLayout, Textarea } from "@vkontakte/vkui";
import { useRecoilState } from "recoil";
import { getFeedback } from "../../storage/selectors/main";
import api from "../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";

const FeedbackModal = ({ toModal }) => {
  const [feedback, setFeedback] = useRecoilState(getFeedback);

  const showPopup = useShowPopup();

  const sendFeedback = async () => {
    const req = await api("feedback", "POST", {
      message: feedback,
    });

    if (req.data) {
      toModal(-1);

      await showPopup({
        message: `Готово! Мы рассмотрим ваш вопрос и ответим в ближайшее время прямо в чате.`,
      });

      setFeedback("");
    }
  };

  return (
    <>
      <FormLayout>
        <FormItem
          bottom={"Не менее 10 и не более 4096 символов"}
          top={"Сообщение"}
        >
          <Textarea
            placeholder={"Напишите ваш вопрос"}
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
            disabled={feedback.length < 10 || feedback.length > 4096}
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

export default FeedbackModal;
