import React, { useState } from "react";
import {
  FormItem,
  FormLayout,
  Placeholder,
  Textarea,
  Button,
} from "@vkontakte/vkui";
import { Icon56MailOutline } from "@vkontakte/icons";
import api from "../../../modules/apiRequest";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";
import UploadInput from "../../__global/UploadInput";
import { useRecoilValue } from "recoil";
import { getIsUploading } from "../../../storage/selectors/main";

const Mailing = () => {
  const [text, setText] = useState("");
  const [imageId, setImageId] = useState(null);
  const [loading, setLoading] = useState(false);

  const isUploading = useRecoilValue(getIsUploading);

  const showPopup = useShowPopup();

  const sendMailing = async () => {
    setLoading(true);

    const req = await api(`admin/mailing`, `POST`, {
      text,
      image_id: imageId ? imageId : undefined,
    });

    setLoading(false);

    if (req.data?.id) {
      setText("");
      setImageId(null);

      await showPopup({
        message: "Рассылка будет запущена через минуту",
      });
    }
  };

  return (
    <>
      <Placeholder header={"Система рассылки"} icon={<Icon56MailOutline />}>
        Введите текст и по желанию прикрепите фотографию, после чего нажмите на
        кнопку "Отправить"
      </Placeholder>

      <FormLayout className={"DivFix"}>
        <FormItem top={`Текст сообщения (${text.length}/4096)`}>
          <Textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={"Введите текст сообщения"}
            maxLength={4096}
          />
        </FormItem>

        <UploadInput imageId={imageId} setImageId={setImageId} />

        <FormItem className={"DivFix"}>
          <Button
            stretched
            onClick={sendMailing}
            loading={loading}
            size={"l"}
            disabled={(!text && !imageId) || isUploading}
          >
            Отправить
          </Button>
        </FormItem>
      </FormLayout>
    </>
  );
};

export default Mailing;
