/* jslint esversion: 6 */

let accountChainId = '';

const signin = () => {
  console.log('signin');
  return window.lynxMobile.requestSetAccountName()
  .then((accountName) => window.lynxMobile.requestSetAccount(accountName));
}

const populateWelcomeScreen = () => {
  let timer = setTimeout(noConnectionError, 10000);
  signin()
  .then((accountData) => {
    clearTimeout(timer);
    if (
      accountData
      && (
        accountData.chainId === 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573'
        || accountData.chainId === 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b' // test net
      )
    ) {
      accountChainId = accountData.chainId;
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

const noConnectionError = () => {
  $('#error-box').css('display', 'block');
  $('#error-box .white-text').text(`Unable to singin.`);
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

window.addEventListener( "lynxMobileLoaded", () => {
  console.log('test');
  // lynx is on the window and ready!
  populateWelcomeScreen();
});
