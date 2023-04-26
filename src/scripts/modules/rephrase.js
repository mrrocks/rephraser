const backendUrl =
  process.env.NODE_ENV === "production"
    ? process.env.PROD_API_URL
    : process.env.DEV_API_URL;

export async function rephraseText(text, requestOptions) {
  const response = await fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text,
      ...requestOptions,
    }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return formatVariations(data);
}

function formatVariations(variationsData) {
  const variationsArray = variationsData
    .split("|||")
    .map((variation) => variation.trim());
  const variationsHTML = variationsArray
    .map((variation) => `<div>${variation}</div>`)
    .join("");
  return variationsHTML;
}
