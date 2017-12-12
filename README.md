[![License: GPL v3](https://img.shields.io/badge/License-GPL%20v3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

# Crypto Arbitrage - a node.js script to help find and act on arbitrage opportunities. 
A cryptocurrency arbitrage opportunity calculator and trading bot. Over 800 currencies and 50 markets.

To use, go to http://www.diffbit.com , for development install nodejs ^V8.00 and run `npm install` in the folder where the script `main.js` is. To run the program write `node main` or `npm start`. To change market settings, and to add your own markets edit the `settings.js` file.

## Notice: 
I am now only focusing on the trading bot. Unfortunately I am going to keep that code private, and will not have time to work on this public version. Feel free to still make pull requests - I will still take a look at any issues when they pop up.

## How it works

In short it collects JSON from multipile different cryptocurrency markets, and goes through the results and finds the highest and lowest price for each coin. For example if the results look like this for LTC:
```javascript
ltc : {
  'bittrex' : 38.23,
  'jubi' : 39.78,
  'chbtc' : 51.8,
}
```
the script will find the the highest price (chbtc.com), lowest price (bittrex), and divide the two: 51.8/38.23 = ~1.35 (~35% profit margin) and then pushes these results to the browser. It will also find the next highest market pairs, e.g. chbtc / jubi is the second highest pair and chbtc/bittrex the third, jubi/bittrex the fourth and so on until every possible combination has been computed.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

Required: Node.js **^ V8.0.0** this program uses ES7 features such as async/await and requires a newer version of node.

### Installing

In a terminal write the following:

CD into the correct folder.

```shell
cd arbitrage
```

Install the required npm modules

```shell
npm install
```

To run the program

```shell
npm start
```

Go to ```localhost:3000``` to see a minimal display of the raw data

Currently you will have to add a market object with the correct settings in the array `markets`, situated in the `settings.js` file.

You can temporarily stop loading a market from the frontend, or remove the market by deleting the object in `settings.js`

## Built and deployed with

* [Node.JS](https://nodejs.org) - For the backend

## Contributing

Feel free to suggest edits / pull requests or email me at efi.jeremiah@gmail.com

## Authors

* **Efi Jeremiah**

## License

See the [LICENSE.md](LICENSE.md) file for details

## Donating

* BTC: 1LGuJchewvHovpzwoGnswxYbfAfPfNq4Uc
* ETH: 0x9db93092debc4da9f72a259eee8a65ad81a677b6
* LTC: LVJkTsLn7RtxQfF4sCJyeiX2h31URj9M4n
