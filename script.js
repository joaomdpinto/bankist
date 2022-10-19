'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];
let currentAccount;

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

const displayMovements = function (movements, sort = false) {
  //clean movements
  containerMovements.innerHTML = '';

  const movementsToDisplay = sort
    ? [...movements].sort((a, b) => a - b)
    : movements;

  //insert movements
  movementsToDisplay.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `<div class="movements__row">
                    <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
                    <div class="movements__value">${mov}€</div>
                  </div>`;

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
  labelBalance.textContent = `${account.balance} €`;
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

  labelSumIn.textContent = `${summaryIn}€`;
  labelSumOut.textContent = `${Math.abs(summaryOut)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

createUsernames(accounts);

//CALCULATE AND DISPLAY MOVEMENTS, BALACE AND SUMMARY
const updateUI = () => {
  displayMovements(currentAccount.movements);
  calcPrintBalance(currentAccount);
  calcDisplaySummary(currentAccount);
};

//WELCOME MESSAGE AND DISPLAY APP CONTENT
const loginUI = () => {
  labelWelcome.textContent = `Welcome back, ${currentAccount.owner
    .split(' ')
    .at(0)}`;
  containerApp.style.opacity = 100;
};

//RESET APPLICATION
const logoutUI = () => {
  labelWelcome.textContent = 'Log in to get started';
  containerApp.style.opacity = 0;
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

  const receiverAccount = accounts.find(
    account =>
      account.username === inputTransferTo.value &&
      currentAccount.username !== inputTransferTo.value
  );

  const amount = Number(inputTransferAmount.value);

  if (receiverAccount && amount > 0 && currentAccount.balance >= amount) {
    currentAccount.movements.push(-amount);
    receiverAccount.movements.push(amount);

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
  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(move => move >= amount * 0.1)
  ) {
    currentAccount.movements.push(amount);
    updateUI();
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
  displayMovements(currentAccount.movements, sortMovements);
};

btnLogin.addEventListener('click', login);
btnTransfer.addEventListener('click', transfer);
btnClose.addEventListener('click', close);
btnSort.addEventListener('click', sort);
