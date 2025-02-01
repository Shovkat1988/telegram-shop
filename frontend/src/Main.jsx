import { AdaptivityProvider } from "@vkontakte/vkui";
import { RouterRoot } from "@kokateam/router-vkminiapps";
import { createRoot } from "react-dom/client";
import App from "/src/App";
import { WebAppProvider } from "@vkruglikov/react-telegram-web-app";
import api from "./modules/apiRequest";

import "/src/assets/css/global.scss";
import "@gravity-ui/uikit/styles/fonts.css";
import "@gravity-ui/uikit/styles/styles.css";

import { configure } from "@gravity-ui/uikit";

configure({
  lang: "ru",
});

const app = async () => {
  const initializeReq = await api("initialize", `GET`);

  if (initializeReq?.errorCode === 8) return window.Telegram.WebApp.close();

  const container = document.getElementById("root");

  const root = createRoot(container);

  root.render(
    initializeReq?.data?.id ? (
      <WebAppProvider
        options={{
          smoothButtonsTransition: true,
        }}
      >
        <RouterRoot>
          <AdaptivityProvider>
            <App initializeReq={initializeReq} />
          </AdaptivityProvider>
        </RouterRoot>
      </WebAppProvider>
    ) : (
      <div className={"centered"}>{`Bearer ${decodeURIComponent(
        window.location.hash
          ?.slice(1)
          ?.split("=")?.[1]
          ?.split("&tgWebAppVersion")?.[0]
      )}`}</div>
    )
  );
};

app().then(() => {
  if (import.meta.env.MODE === "development")
    import("/src/dev/eruda.js").then(({ default: {} }) => {});
});
