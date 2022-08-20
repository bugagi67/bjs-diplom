"use strict";

const logoutBtn = new LogoutButton();

logoutBtn.action = () => {
  ApiConnector.logout((response) => {
    if (response.success) {
      location.reload();
    }
  });
};

ApiConnector.current((response) => {
  if (response.success) {
    ProfileWidget.showProfile(response.data);
  }
});

const ratesBoard = new RatesBoard();

function stocks() {
  ApiConnector.getStocks((response) => {
    if (response.success) {
      ratesBoard.clearTable();
      ratesBoard.fillTable(response.data);
    }
  });
}

stocks();
setInterval(() => stocks(), 60000);

const moneyManager = new MoneyManager();

moneyManager.addMoneyCallback = ({ currency, amount }) => {
  ApiConnector.addMoney({ currency, amount }, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Успешно");
    } else if (response.success === false) {
      moneyManager.setMessage(response.success, "Не выполнено");
    }
  });
};

moneyManager.conversionMoneyCallback = ({
  fromCurrency,
  targetCurrency,
  fromAmount,
}) => {
  ApiConnector.convertMoney(
    { fromCurrency, targetCurrency, fromAmount },
    (response) => {
      if (response.success) {
        ProfileWidget.showProfile(response.data);
        moneyManager.setMessage(response.success, "Успешно");
      } else if (response.success === false) {
        moneyManager.setMessage(response.success, "Не выполнено");
      }
    }
  );
};

moneyManager.sendMoneyCallback = ({ to, currency, amount }) => {
  ApiConnector.transferMoney({ to, currency, amount }, (response) => {
    if (response.success) {
      ProfileWidget.showProfile(response.data);
      moneyManager.setMessage(response.success, "Успешно");
    } else if (response.success === false) {
      moneyManager.setMessage(response.success, "Не выполнено");
    }
  });
};

const favoritesWidget = new FavoritesWidget();

ApiConnector.getFavorites((response) => {
  if (response.success) {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
  } 
});

favoritesWidget.addUserCallback = ({ id, name }) => {
  ApiConnector.addUserToFavorites({ id, name }, (response) => {
    if (response.success) {
      favoritesWidget.clearTable();
      favoritesWidget.fillTable(response.data);
      moneyManager.updateUsersList(response.data);
      favoritesWidget.setMessage(response.success, "Успешно");
    } else if (response.success === false) {
      favoritesWidget.setMessage(response.success, "Не выполнено");
    }
  });
};
favoritesWidget.removeUserCallback = (id) => {
  ApiConnector.removeUserFromFavorites(id, (response) => {
    favoritesWidget.clearTable();
    favoritesWidget.fillTable(response.data);
    moneyManager.updateUsersList(response.data);
    favoritesWidget.setMessage(response.success, "Успешно");
    if (response.success === false) {
      favoritesWidget.setMessage(response.success, "Не выполнено");
    }
  });
};
