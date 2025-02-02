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

// Настройка языка для Gravity UI
configure({
  lang: "ru",
});

// Основная функция инициализации приложения
const initializeApp = async () => {
  try {
    // Запрос на инициализацию
    const initializeReq = await api("initialize", "GET");

    // Если ошибка 8, закрываем приложение
    if (initializeReq?.errorCode === 8) {
      window.Telegram.WebApp.close();
      return;
    }

    // Получаем контейнер для рендеринга
    const container = document.getElementById("root");
    if (!container) {
      throw new Error("Root container not found");
    }

    // Создаем корневой элемент для рендеринга
    const root = createRoot(container);

    // Рендерим приложение в зависимости от данных инициализации
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
        <div className="centered">
          {`Bearer ${decodeURIComponent(
            window.location.hash
              ?.slice(1)
              ?.split("=")?.[1]
              ?.split("&tgWebAppVersion")?.[0]
          )}`}
        </div>
      )
    );
  } catch (error) {
    console.error("Error during app initialization:", error);
  }
};

// Запуск приложения
initializeApp().then(() => {
  // В режиме разработки подключаем Eruda для отладки
  if (import.meta.env.MODE === "development") {
    import("/src/dev/eruda.js")
      .then(({ default: eruda }) => {
        eruda.init();
      })
      .catch((err) => {
        console.error("Failed to load Eruda:", err);
      });
  }
});