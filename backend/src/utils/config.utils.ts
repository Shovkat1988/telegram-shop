import * as fs from 'fs';
import * as appRoot from 'app-root-path';

const getConfig = () => {
  const config = JSON.parse(fs.readFileSync(`${appRoot}/config.json`, 'utf-8'));

  return config;
};

const setConfig = (newData: any) => {
  const config = getConfig();

  fs.writeFileSync(
    `${appRoot}/config.json`,
    JSON.stringify(
      {
        ...config,
        ...newData,
      },
      null,
      2,
    ),
  );
};

export { getConfig, setConfig };
