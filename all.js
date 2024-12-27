const getVegetableList = async () => {
  try {
    const response = await fetch(
      "https://hexschool.github.io/js-filter-data/data.json"
    );
    const data = await response.json();
    vegetableList = data.filter((vegetable) => vegetable["作物名稱"]); // 過濾 null 資料
    tableBody.innerHTML =
      '<tr><td colspan="7" class="text-center p-3">請輸入並搜尋想比價的作物名稱^＿^</td></tr>';
  } catch (error) {
    alert("發生錯誤，請稍後再試");
  }
};

let sortType = "";
let sortPriceTarget = "";
let sortPriceFactor = 1;

const searchData = (dataList) => {
  const searchKey = searchInput.value;
  const searchText = document.querySelector("#js-crop-name");

  if (searchKey) {
    searchText.textContent = `查看「${searchKey}」的比價結果`;
    return dataList.filter((vegetable) =>
      vegetable["作物名稱"].includes(searchKey)
    );
  } else {
    searchText.textContent = "";
    return dataList;
  }
};

const sortDataByType = (dataList) => {
  return sortType
    ? dataList.filter((vegetable) => vegetable["種類代碼"] === sortType)
    : dataList;
};

const sortDataByPrice = (dataList) => {
  return sortPriceTarget
    ? dataList.sort(
        (a, b) => (a[sortPriceTarget] - b[sortPriceTarget]) * sortPriceFactor
      )
    : dataList;
};

const showSortIconButton = () =>
  sortIconButtons.forEach((button) => button.classList.remove("d-none"));

const hideSortIconButton = () =>
  sortIconButtons.forEach((button) => button.classList.add("d-none"));

const renderLoading = () => {
  renderText("資料載入中...");
};

const renderNoData = () => {
  renderText("查詢不到當日的交易資訊ＱＱ");
  hideSortIconButton();
};

const renderText = (text) => {
  tableBody.innerHTML = `<tr><td colspan="7" class="text-center p-3">${text}</td></tr>`;
};

const renderData = (dataList) => {
  let htmlString = "";
  dataList.forEach((vegetable) => {
    htmlString += `<tr>
            <td>${vegetable["作物名稱"]}</td>
            <td>${vegetable["市場名稱"]}</td>
            <td>${vegetable["上價"]}</td>
            <td>${vegetable["中價"]}</td>
            <td>${vegetable["下價"]}</td>
            <td>${vegetable["平均價"]}</td>
            <td>${vegetable["交易量"]}</td>
          </tr>`;
  });
  tableBody.innerHTML = htmlString;
  showSortIconButton();
};

const filterData = () => {
  renderLoading();
  let showData = [];
  showData = searchData(vegetableList);
  showData = sortDataByType(showData);

  if (!showData.length) {
    renderNoData();
    return;
  }

  showData = sortDataByPrice(showData);
  renderData(showData);
};

const handleSearch = (event) => {
  if (event.key === "Enter") {
    filterData();
  }
};

const handleSortType = (event) => {
  const type = event.target.dataset.type;
  categoryButtons.forEach((button) => {
    if (button.dataset.type !== type) {
      button.classList.remove("active");
    } else {
      button.classList.add("active");
    }
  });
  sortType = type;
  filterData();
};

const handleSortPrice = (event) => {
  const tagName = event.target.tagName;
  if (tagName === "SELECT") {
    sortPriceTarget = event.target.value;
    sortPriceFactor = 1;
  } else if (tagName === "I") {
    sortSelect.value = "";
    sortPriceTarget = event.target.dataset.price;
    sortPriceFactor = event.target.dataset.sort === "down" ? 1 : -1;
  }
  filterData();
};

let vegetableList = [];
const tableBody = document.querySelector(".showList");

const categoryButtons = document.querySelectorAll(".categoryButtons .btn");

const searchBtn = document.querySelector(".search");
const searchInput = document.querySelector("#crop");
const sortSelect = document.querySelector(".sort-select");
const sortSelectMobile = document.querySelector(".mobile-select");
const sortIconButtons = document.querySelectorAll(".js-sort-advanced .fas");

// sort type
categoryButtons.forEach((button) =>
  button.addEventListener("click", handleSortType)
);

// search
searchBtn.addEventListener("click", filterData);
searchInput.addEventListener("keyup", handleSearch);

// sort price
sortSelect.addEventListener("change", handleSortPrice);
sortSelectMobile.addEventListener("change", handleSortPrice);
sortIconButtons.forEach((button) =>
  button.addEventListener("click", handleSortPrice)
);

// 取得資料
getVegetableList();
