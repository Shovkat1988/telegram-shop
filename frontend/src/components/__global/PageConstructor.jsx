import { Suspense, useEffect, useState } from "react";
import { useRouterBack, useRouterPanel } from "@kokateam/router-vkminiapps";
import { Group, Panel } from "@vkontakte/vkui";
import { BackButton } from "@vkruglikov/react-telegram-web-app";
import { useRecoilState } from "recoil";
import { getActivePanel } from "../../storage/selectors/main";

const Page = ({ children, id, className = "", isBack = false }) => {
  const toBack = useRouterBack();

  const [history] = useRouterPanel();

  const [, setActivePanel] = useRecoilState(getActivePanel);

  const [isShowBackButton, setIsShowBackButton] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setIsShowBackButton(true);
    }, 800);

    return () => {
      setIsShowBackButton(false);
    };
  }, [history]);

  const updateActivePanel = () => {
    setActivePanel(history.panels[history.panels.length - 2]);
  };

  let historyLength = history.panels.length;

  return (
    <Panel id={id} className={`DivFix ${className}`}>
      {isBack && isShowBackButton && historyLength > 1 ? (
        <BackButton
          onClick={() => {
            updateActivePanel();

            historyLength--;
            toBack(-1);
          }}
        />
      ) : undefined}
      <Group className={"p3"}>
        <Suspense fallback={""}>{children}</Suspense>
      </Group>
    </Panel>
  );
};

export default Page;
