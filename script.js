'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2022-10-19T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'de-DE',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2, account3, account4];
let currentAccount, timer;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const formateDateMovements = function (date, locale) {
  const calcDaysPassed = Math.round(
    (new Date() - date) / (1000 * 60 * 60 * 24)
  );

  if (calcDaysPassed === 0) return 'Today';
  else if (calcDaysPassed === 1) return 'Yesterday';
  else if (calcDaysPassed < 7) return `${calcDaysPassed} days ago`;
  else return new Intl.DateTimeFormat(locale).format(date);

  /*`${`${date.getDate()}`.padStart(2, 0)}/${`${
      date.getMonth() + 1
    }`.padStart(2, 0)}/${date.getFullYear()}`;*/
};

const formatCurrency = function (value, locale, currency) {
  const options = {
    style: 'currency',
    currency: currency,
  };

  return new Intl.NumberFormat(locale, options).format(value);
};

const displayMovements = function (account, sort = false) {
  //clean movements
  containerMovements.innerHTML = '';

  const movementsToDisplay = sort
    ? [...account.movements].sort((a, b) => a - b)
    : account.movements;

  //insert movements
  movementsToDisplay.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const date = new Date(account.movementsDates[i]);

    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                    <div class="movements__date">${formateDateMovements(
                      date,
                      account.locale
                    )}</div>
                    <div class="movements__value">${formatCurrency(
                      mov,
                      account.locale,
                      account.currency
                    )}</div>
                  </div>`;

    /*<div class="movements__value">${mov.toFixed(2)}€</div>*/

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const createUsernames = function (accounts) {
  accounts.forEach(
    user =>
      (user.username = user.owner
        .toLowerCase()
        .split(' ')
        .map(name => name.charAt(0))
        .join(''))
  );
};

const calcPrintBalance = account => {
  account.balance = account.movements.reduce(
    (sumMovements, currentMovement) => sumMovements + currentMovement,
    0
  );
  labelBalance.textContent = `${formatCurrency(
    account.balance,
    account.locale,
    account.currency
  )}`;

  /*`${account.balance.toFixed(2)} €`;*/
};

const calcDisplaySummary = account => {
  const summaryIn = account.movements
    .filter(move => move > 0)
    .reduce((sum, move) => sum + move, 0);

  const summaryOut = account.movements
    .filter(move => move <= 0)
    .reduce((sum, move) => sum + move, 0);

  const interest = account.movements
    .filter(move => move > 0)
    .map(deposit => (deposit * account.interestRate) / 100)
    .filter(int => int >= 1)
    .reduce((sum, move) => sum + move, 0);

  labelSumIn.textContent = `${summaryIn.toFixed(2)}€`;
  labelSumOut.textContent = `${Math.abs(summaryOut).toFixed(2)}€`;
  labelSumInterest.textContent = `${interest.toFixed(2)}€`;
};

createUsernames(accounts);

//CALCULATE AND DISPLAY MOVEMENTS, BALACE AND SUMMARY
const updateUI = () => {
  displayMovements(currentAccount);
  calcPrintBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

//WELCOME MESSAGE AND DISPLAY APP CONTENT
const loginUI = () => {
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner
    .split(' ')
    .at(0)}`;

  const now = new Date();

  const options = {
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  };

  labelDate.textContent = new Intl.DateTimeFormat(
    currentAccount.locale,
    options
  ).format(now);

  /*`${`${now.getDate()}`.padStart(2, 0)}/${`${
    now.getMonth() + 1
  }`.padStart(2, 0)}/${now.getFullYear()}, ${`${now.getHours()}`.padStart(
    2,
    0
  )}:${`${now.getMinutes()}`.padStart(2, 0)}`;*/
  containerApp.style.opacity = 100;
};

//RESET APPLICATION
const logoutUI = () => {
  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
};

const displayTimeSession = function () {
  //const future = new Date().setMinutes(new Date().getMinutes() + 5);
  let time = 60 * 5; //5 minutes

  const showTime = function () {
    //const now = new Date();
    //const minuteTimeSession = new Date(future - now).getMinutes();
    //const secondTimeSession = new Date(future - now).getSeconds();

    const minuteTimeSession = Math.trunc(time / 60);
    const secondTimeSession = time % 60;

    labelTimer.textContent = `${`${minuteTimeSession}`.padStart(
      2,
      0
    )}:${`${secondTimeSession}`.padStart(2, 0)}`;

    if (time === 0 /*minuteTimeSession === 0 && secondTimeSession === 0*/) {
      clearInterval(timer);
      logoutUI();
    }

    time--;
  };

  showTime(); //1st second
  const timer = setInterval(showTime, 1000);
  return timer;
};

const restartTime = function () {
  timer && clearInterval(timer);
  timer = displayTimeSession();
};

//Event handler
//LOGIN
const login = function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    account =>
      account.username === inputLoginUsername.value &&
      account.pin === Number(inputLoginPin.value)
  );

  if (currentAccount) {
    updateUI();
    loginUI();
    restartTime();

    //CLEAN USER AND PIN INPUT FIELDS
    inputLoginUsername.value = inputLoginPin.value = '';
    inputLoginPin.blur();
  } else {
    console.log('username and password incorrect. try again!');
  }
};

//TRANSFER
const transfer = function (e) {
  e.preventDefault();
  restartTime();

  const receiverAccount = accounts.find(
    account =>
      account.username === inputTransferTo.value &&
      currentAccount.username !== inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  if (receiverAccount && amount > 0 && currentAccount.balance >= amount) {
    currentAccount.movements.push(-amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    receiverAccount.movements.push(amount);
    receiverAccount.movementsDates.push(new Date().toISOString());

    updateUI();

    inputTransferTo.value = inputTransferAmount.value = '';
    inputTransferTo.blur();
    inputTransferAmount.blur();
  } else {
    console.log('Transfer invalid!');
  }
};

//CLOSE ACCOUNT
const close = function (e) {
  e.preventDefault();

  const accountIndex = accounts.findIndex(
    account =>
      account.username === currentAccount.username &&
      account.username === inputCloseUsername.value &&
      account.pin === Number(inputClosePin.value)
  );

  if (accountIndex != -1) {
    accounts.splice(accountIndex, 1);
    logoutUI();
  } else {
    console.log("It's not possible close this account. Try again!");
  }
};

//LOAN
const loan = function (e) {
  e.preventDefault();
  const amount = Math.floor(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(move => move >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    currentAccount.movementsDates.push(new Date().toISOString());
    updateUI();
    restartTime();
    inputLoanAmount.value = '';
    inputLoanAmount.blur();
  } else {
    console.log('Loan request invalid!');
  }
};

//SORT MOVEMENTS
let sortMovements = false;
const sort = function (e) {
  e.preventDefault();
  sortMovements = !sortMovements;
  displayMovements(currentAccount, sortMovements);
};

btnLogin.addEventListener('click', login);
btnTransfer.addEventListener('click', transfer);
btnClose.addEventListener('click', close);
btnLoan.addEventListener('click', loan);
btnSort.addEventListener('click', sort);
