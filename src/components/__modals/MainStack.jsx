import { ModalRoot, useRouterModal } from "@kokateam/router-vkminiapps";
import ModalConstructor from "../__global/ModalConstructor";
import AddCategoryModal from "./AddCategoryModal";
import AddProductModal from "./AddProductModal";
import AddKeyModal from "./AddKeyModal";
import { useRecoilValue } from "recoil";
import { getTitle } from "../../storage/selectors/main";
import ProductInfoModal from "./ProductInfoModal";
import FeedbackModal from "./FeedbackModal";
import OrderDetailsModal from "./OrderDetailsModal";
import AdminFeedbackModal from "./AdminFeedbackModal";
import AdminAddPromocodeModal from "./AdminAddPromocodeModal";
import AdminOrderDetails from "./AdminOrderDetails";
import EditProductModal from "./EditProductModal";

const MainStack = () => {
  const [, toModal] = useRouterModal();

  const title = useRecoilValue(getTitle);

  return (
    <ModalRoot>
      <ModalConstructor
        id={"addCategory"}
        title={"Новая категория"}
        close={() => toModal(null)}
      >
        <AddCategoryModal toModal={toModal} />
      </ModalConstructor>

      <ModalConstructor
        id={"addProduct"}
        title={"Новый товар"}
        close={() => toModal(null)}
      >
        <AddProductModal toModal={toModal} />
      </ModalConstructor>

      <ModalConstructor
        id={"editProduct"}
        title={"Изменение товара"}
        close={() => toModal(null)}
      >
        <EditProductModal toModal={toModal} />
      </ModalConstructor>

      <ModalConstructor
        id={"productInfo"}
        dynamicContentHeight
        title={title}
        close={() => toModal(null)}
      >
        <ProductInfoModal toModal={toModal} />
      </ModalConstructor>

      <ModalConstructor
        id={"feedback"}
        title={"Обратная связь"}
        dynamicContentHeight
        close={() => toModal(null)}
      >
        <FeedbackModal toModal={toModal} />
      </ModalConstructor>

      <ModalConstructor
        id={"adminFeedback"}
        title={"Обратная связь"}
        dynamicContentHeight
        close={() => toModal(null)}
      >
        <AdminFeedbackModal toModal={toModal} />
      </ModalConstructor>

      <ModalConstructor
        id={"adminOrderDetails"}
        title={"Данные заказа"}
        dynamicContentHeight
        close={() => toModal(null)}
      >
        <AdminOrderDetails toModal={toModal} />
      </ModalConstructor>

      <ModalConstructor
        id={"adminAddPromocode"}
        title={"Новый промокод"}
        dynamicContentHeight
        close={() => toModal(null)}
      >
        <AdminAddPromocodeModal toModal={toModal} />
      </ModalConstructor>

      <ModalConstructor
        id={"orderDetails"}
        title={"Данные заказа"}
        dynamicContentHeight
        close={() => toModal(null)}
      >
        <OrderDetailsModal toModal={toModal} />
      </ModalConstructor>

      <ModalConstructor
        id={"addKey"}
        title={"Новый ключ"}
        close={() => toModal(null)}
      >
        <AddKeyModal toModal={toModal} />
      </ModalConstructor>
    </ModalRoot>
  );
};

export default MainStack;
