const api = async (endpoint, method, params, isUpload) => {
  const headers = {
    authorization: `Bearer ${decodeURIComponent(
      window.location.hash
        ?.slice(1)
        ?.split("=")?.[1]
        ?.split("&tgWebAppVersion")?.[0]
    )}`,
  };

  if (!isUpload) headers["Content-Type"] = "application/json";

  const data = await fetch(`${import.meta.env.VITE_BACKEND_URL}/${endpoint}`, {
    method: method,
    headers: headers,
    body: !isUpload ? JSON.stringify(params) : params,
  });

  return await data.json();
};

export default api;
