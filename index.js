const KEY_PRICE = "ordered";

const setLocal = (value) => {
  return localStorage.setItem(KEY_PRICE, parseToString(value));
};

const getLocal = () => {
  return parseToObject(localStorage.getItem(KEY_PRICE));
};

const removeLocal = () => {
  return localStorage.removeItem(KEY_PRICE);
};

const parseToString = (value) => {
  return JSON.stringify(value);
};

const parseToObject = (value) => {
  return value ? JSON.parse(value) : {};
};

const getAllValues = (values) => {
  return Object.values(values);
};

const handleRemove = (index) => {
  let ordered = getAllValues(getLocal());
  console.log("🔥 - handleRemove - ordered:1", ordered);
  ordered = ordered.filter((_, i) => {
    return i !== index;
  });
  console.log("🔥 - handleRemove - ordered:2", ordered);
  setLocal(ordered);
  handleRenderContent();
};

const handleCalculateOrder = () => {
  const totalElement = document.getElementById("total");
  let ordered = getAllValues(getLocal());
  let total = 0;
  ordered.forEach((item) => {
    const price = item?.split("-");
    total = total + Number(price[0]);
  });
  totalElement.innerText = `Total: ${total.toLocaleString("it-IT", {
    style: "currency",
    currency: "VND",
  })}`;
};

const handleRenderContent = () => {
  const oldContent = document.getElementById("content");
  const oldChill = oldContent.children?.[0];
  console.log("🔥 - handleRenderContent - oldChill:", oldChill);
  const ordered = getAllValues(getLocal());
  let newChill = document.createElement("div");
  ordered.forEach((item, index) => {
    let parentChill = document.createElement("div");
    parentChill.className = "content__chill";
    let chillContent = document.createElement("div");
    chillContent.innerText = item;
    let chillButton = document.createElement("button");
    chillButton.innerText = "Remove";
    chillButton.onclick = () => handleRemove(index);
    parentChill.appendChild(chillContent);
    parentChill.appendChild(chillButton);
    newChill.appendChild(parentChill);
  });
  try {
    oldContent.replaceChild(newChill, oldChill);
  } catch (error) {
    console.log("🔥 - handleRenderContent - error:", error);
    oldContent.appendChild(newChill);
  } finally {
    handleCalculateOrder();
  }
};

const handleAdd = () => {
  const price = document.getElementById("price")?.value;
  let ordered = getAllValues(getLocal());
  const currentTime = new Date().toLocaleDateString();
  ordered = { ...ordered, [ordered.length + 1]: `${price}--${currentTime}` };
  setLocal(ordered);
  handleRenderContent();
  handleCalculateOrder();
};

// first render
window.onload = function () {
  handleRenderContent();
};
