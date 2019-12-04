/* jslint esversion: 6 */

const signin = () => {
  console.log('signin');
  return window.lynxMobile.requestSetAccountName()
  .then((accountName) => window.lynxMobile.requestSetAccount(accountName));
}

const showConnectionError = () => {
  $('#error-box').css('display', 'block');
  $('#error-box .white-text').text(`Unable to singin.`);
}

const showWalletError = () => {
  $('#error-box').css('display', 'block');
  $('#error-box .white-text').html(`No Wallet found. Please run this dapp inside the <a href="https://lynxwallet.io/downloads" title="Lynx Wallet">Lynx Wallet</a>.`);
}

const populateWelcomeScreen = () => {
  signin()
  .then((accountData) => {
    clearTimeout(timer1);
    if (
      accountData
      && (
        accountData.chainId === 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573'
        || accountData.chainId === 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b' // test net
      )
    ) {
      const tokens = accountData.tokens.filter(tokenEntry => tokenEntry.symbol === 'LNX').shift();
      $('.account-result').text(`logged in as @${accountData.account.account_name} | ${parseFloat(tokens.amount)} LNX`)
      $('#preloader').css('display', 'none');
      $('#mainscreen').css('display', 'block');
    } else {
      $('#error-box').css('display', 'block');
      $('#error-box .white-text').text(`Unable to singin, Please make sure you are on LYNX chain.`);
    }
  });
}

const handleDraw = () => {

  const data = {
    symbol: 'LNX',
    contract: 'eosio.token',
    toAccount: 'lynxwallet',
    amount: 1.00000000,
    memo: 'Test app draw'
  }

  console.log('window.lynxMobile', window.lynxMobile);

  window.lynxMobile.transfer(data)
  .then(result => {

    console.log('result', result);

    if (result) {
      populateWelcomeScreen();

      const luckyNumberOne = Math.floor(Math.random() * 10);
      const luckyNumberTwo = Math.floor(Math.random() * 10);
      const luckyNumberThree = Math.floor(Math.random() * 10);

      $('#result-box').css('display', 'block');
      $('#result-box .black-text').html(`Your lucky number are: <h2>${luckyNumberOne} ${luckyNumberTwo} ${luckyNumberThree}</h2>`);

      return true;
    }

    throw new Error('No result.');
  })
  .catch(e => {
    $('#error-box').css('display', 'block');
    $('#error-box .white-text').text(`Something went wrong. ${e.message}`);
  });
}


let timer0 = setTimeout(showWalletError, 10000);
window.addEventListener( "lynxMobileLoaded", () => {
  clearTimeout(timer0);
  // lynx is on the window and ready!
  let timer1 = setTimeout(showConnectionError, 10000);
  populateWelcomeScreen();
});
