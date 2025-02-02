import { PanelHeader, SplitCol, SplitLayout } from "@vkontakte/vkui";
import { Epic, View, useRouterPopout } from "@kokateam/router-vkminiapps";
import PageConstructor from "/src/components/__global/PageConstructor";
import Home from "./components/home/base";
import { lazy, Suspense } from "react";
import Cart from "./components/home/cart";
import MakeOrder from "./components/home/makeOrder";
import Orders from "./components/home/orders";

const Admin = lazy(() => import("./components/home/admin"));
const Mailing = lazy(() => import("./components/home/admin/mailing"));
const Users = lazy(() => import("./components/home/admin/users"));
const AdminCategories = lazy(() =>
  import("./components/home/admin/categories")
);
const MainStack = lazy(() => import("./components/__modals/MainStack"));
const AdminItems = lazy(() => import("./components/home/admin/items"));
const AdminUsersList = lazy(() => import("./components/home/admin/usersList"));
const AdminFeedback = lazy(() => import("./components/home/admin/feedback"));
const AdminPromocodes = lazy(() =>
  import("./components/home/admin/promocodes")
);
const AdminOrders = lazy(() => import("./components/home/admin/orders"));
const AdminSettings = lazy(() => import("./components/home/admin/settings"));

const Navigation = () => {
  const [popout] = useRouterPopout();

  return (
    <SplitLayout
      header={<PanelHeader separator={false} />}
      popout={popout}
      modal={
        <Suspense fallback={""}>
          <MainStack />
        </Suspense>
      }
    >
      <SplitCol animate={true} spaced={false} width={"100%"} maxWidth={"100%"}>
        <Epic>
          <View id="home">
            <PageConstructor id={"home"}>
              <Home />
            </PageConstructor>

            <PageConstructor id={"cart"} isBack>
              <Cart />
            </PageConstructor>

            <PageConstructor id={"makeOrder"} isBack>
              <MakeOrder />
            </PageConstructor>

            <PageConstructor id={"orders"} isBack>
              <Orders />
            </PageConstructor>

            <PageConstructor id={"admin"} isBack>
              <Admin />
            </PageConstructor>

            <PageConstructor id={"adminMailing"} isBack>
              <Mailing />
            </PageConstructor>

            <PageConstructor id={"adminUsers"} isBack>
              <Users />
            </PageConstructor>

            <PageConstructor id={"adminCategories"} isBack>
              <AdminCategories />
            </PageConstructor>

            <PageConstructor id={"adminItems"} isBack>
              <AdminItems />
            </PageConstructor>

            <PageConstructor id={"adminUsersList"} isBack>
              <AdminUsersList />
            </PageConstructor>

            <PageConstructor id={"adminFeedback"} isBack>
              <AdminFeedback />
            </PageConstructor>

            <PageConstructor id={"adminPromocodes"} isBack>
              <AdminPromocodes />
            </PageConstructor>

            <PageConstructor id={"adminOrders"} isBack>
              <AdminOrders />
            </PageConstructor>

            <PageConstructor id={"adminSettings"} isBack>
              <AdminSettings />
            </PageConstructor>
          </View>
        </Epic>
      </SplitCol>
    </SplitLayout>
  );
};

export default Navigation;
