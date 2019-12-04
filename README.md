# Lynx Wallet Dapp - Step by Stepd

[repository: https://github.com/needly/lynx-chain-example-dapp/](https://github.com/needly/lynx-chain-example-dapp/)
[demo: https://lynx-chain-example-dapp.firebaseapp.com/](https://lynx-chain-example-dapp.firebaseapp.com/)

### local developemnt environment and deployment
##### tools:
- node (version 11.10.0) https://nodejs.org/en/
- yarn (recommended) https://yarnpkg.com/en/docs/install#mac-stable
- nodemon (recommended) https://nodemon.io/
- firebase CLI https://firebase.google.com/docs/cli

##### to run localy:
got to your terminal and navigate to dapps directory
```
cd lynx-chain-example-dapp
```
to install dependencies:
```
yarn install
```
to run local server and watch for changes:
```
nodemon
```
after this step you can type `http://localhost:3000` into the wallet explorer omnibar and run the dapp in the wallet. You still need to click reload button in the wallet after each change.

##### to deploy to firebase hosting
I'm assuming that you have a firebase account (it's free).
this will initialize dapp and log you in the firebase in the case you are not yet. It will guide you through a few steps to select project and hosting target.
```
firebase init
```
to deploy:
```
firebase deploy --only hosting
```

### file structure
Our dapp can by any html page.
In our example all important stuff are inside the __public__ folder.
The rest of the files serves for developement and deployement.

```
lynx-chain-example-dapp
    ├── firebase.json
    ├── index.js
    ├── package.json
    └── public
        ├── index.html
        ├── script.js
        └── style.css
```
**index.html** holds basic document structure and some immutable text
**script.js** holds all the logic of our app
**style.css** holds some dapp specific styling

### Used technologies
To make everything easier we are using some basic frameworks. I didn't want to use fancy do it all frameworks because that tens to abstract away the basic principles of how it works and that would defet the purpose of this example.
So dapp is using [jQuery](https://api.jquery.com/) for basic DOM (html) manipulation and [Materialize](https://materializecss.com/) for styling.

### Code
All html we need to care about [is between line 13 and 48](https://github.com/needly/lynx-chain-example-dapp/blob/master/public/index.html#L13-L48) code above and below is just setting the stage.

##### html description
- #preloader - is shown right at the beginning and hidden when signin process finishes. It only contains spinning circle animation
- #error-box - is hidden at the beggining but will be shown when error is being thrown `.white-text` will be filled out with error description
- #mainscreen - is hidden at beginning and shown after signin process finishes
-- `.account-result` will show the name of the active wallet account as well as amount of LNX
-- `<a class="waves-effect waves-light btn-large" onClick="handleDraw()">Draw</a>` main draw button `onClick` attribute defines the javascript function that is going to be triggered by clicking the button

##### javascript description
Our code is using es6 javascript version. We are using "fat arrow" functions `() => {}` in this case just to make it more legible. We are using plain [lynxwallet SDK API](https://developers.lynxwallet.io/sdk)
we have 5 basic functions
- signin function requests the account name and account state
- populateWelcomeScreen function uses signin data to populate mainscreen html
- handleDraw function handles the actuall transaction with blockchain as well as random number generation
- noConnectionError and noWalletError are a helper function to show error

##### css styles description
included file is being only used to hide html elements on load and to center the preloader on the page.
All visuals are being pulled from the [Materialize](https://materializecss.com/) framework.

### first steps
##### how to change currency and or blockchain
Currency `LNX` it self is being processed/used in two main functions `populateWelcomeScreen` where we are showing current amount in the wallet

simple change `LNX` to `EOS` will suffice here.
```
const tokens = accountData.tokens.filter(tokenEntry => tokenEntry.symbol === 'LNX').shift();
$('.account-result').text(`logged in as @${accountData.account.account_name} | ${parseFloat(tokens.amount)} LNX`)
```

`handleDraw` where we push the transction to blockchain
```
const data = {
    symbol: 'LNX',
    contract: 'eosio.token',
    toAccount: 'lynxwallet',
    amount: 1.00000000,
    memo: 'Test app draw'
  }
```

Here we need to change `symbol: 'EOS'` as well as decimal points in amount `amount: 1.0000` EOS blockchain has only 4 decimal points.

These changes only affect currency to use EOS we need to also change blockchain restriction.
In the `populateWelcomeScreen` function we are using the `accountData.chainId` to  recognie the correct chain.
To use it on EOS main net we need eos main net chainId.

```
if (
      accountData
      && (
        accountData.chainId === 'b62febe5aadff3d5399090b9565cb420387d3c66f2ccd7c7ac1f532c4f50f573'
        || accountData.chainId === 'f11d5128e07177823924a07df63bf59fbd07e52c44bc77d16acc1c6e9d22d37b' // test net
      )
) {
```
change to:
```
if (accountData && accountData.chainId === 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906') {
```

##### improvement suggestion
Currently our dapp doesn't have any overdraw protection. If you try to make a transction withough enaugh money in the account app will throw general error "Something went wrong.". It would be nice to show currect error before the transaction attempts to go thruegh.
There are many ways how to achieve this. The easiest is to call `signin` function at the beginning of the `handleDraw` same way `populateWelcomeScreen` is using it. and then compare the result of `accountData.tokens`.
