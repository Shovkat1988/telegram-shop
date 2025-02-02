import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import {
  AppearanceProvider,
  AppRoot,
  ConfigProvider,
  usePlatform,
} from "@vkontakte/vkui";
import Navigation from "/src/Navigation";
import main from "/src/storage/atoms/main";
import { useExpand, useThemeParams } from "@vkruglikov/react-telegram-web-app";
import { ThemeProvider } from "@gravity-ui/uikit";

const App = ({ initializeReq }) => {
  const [theme] = useThemeParams();
  const [mainCoil, updateMainCoil] = useRecoilState(main);

  const [, expand] = useExpand();

  const platform = usePlatform();

  useEffect(() => {
    expand();

    updateMainCoil({
      ...mainCoil,
      platform,
      userData: initializeReq.data,
    });
  }, []);

  return (
    <ThemeProvider theme={theme || "light"}>
      <ConfigProvider
        locale={"ru"}
        isWebView={false}
        appearance={theme || "light"}
        platform={platform}
      >
        <AppearanceProvider appearance={theme || "light"}>
          <AppRoot mode="full" className={"mobile"}>
            <Navigation />
          </AppRoot>
        </AppearanceProvider>
      </ConfigProvider>
    </ThemeProvider>
  );
};

export default App;
