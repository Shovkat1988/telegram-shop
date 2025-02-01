import React from "react";
import { Div, File, FormLayout } from "@vkontakte/vkui";
import { Icon20PictureOutline } from "@vkontakte/icons";
import { useRecoilValue } from "recoil";
import { getIsUploading } from "../../storage/selectors/main";
import { useShowPopup } from "@vkruglikov/react-telegram-web-app";
import api from "../../modules/apiRequest";

const UploadInput = ({ imageId, setImageId }) => {
  const isUploading = useRecoilValue(getIsUploading);

  const showPopup = useShowPopup();

  const notify = async (message) => {
    await showPopup({
      content: message,
    });
  };

  const uploadPhoto = async (func = () => {}) => {
    const req = await api(
      "admin/uploads",
      "POST",
      new FormData(document.getElementById("image")),
      true
    );

    if (req.status) func(req.data.id);
  };

  return (
    <Div className={"DivFix"}>
      <FormLayout id="image">
        <File
          mode={imageId ? "primary" : "secondary"}
          name="image"
          accept="image/png,image/webp,image/jpeg,image/jpg"
          required
          stretched
          before={<Icon20PictureOutline />}
          size={"l"}
          loading={isUploading}
          onChange={(e) => {
            e.preventDefault();
            if (e.target.files[0].size > 20000000)
              return notify("Загрузите фото не более 20 мб");

            uploadPhoto((photo_id) => {
              setImageId(photo_id);
            }).then(() => console.log("Image uploaded"));
          }}
        >
          {imageId ? "Фото загружено" : "Загрузить фото"}
        </File>
      </FormLayout>
    </Div>
  );
};

export default UploadInput;
