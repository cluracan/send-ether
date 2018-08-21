#!/usr/bin/env node
'use strict'
const process = require('process');
const program = require('commander');
const VERSION = require('../package.json').version;
const {sendEther} = require('./lib');

if (require.main == module) {
	process.on('unhandledRejection', console.error);
	program
		.version(VERSION, '-v, --version')
		.arguments('<to> <amount>')
		.option('-b, --base <n>', `decimal places amount is expressed in (e.g, 0 for wei, 18 for ether)`, parseInt, 0)
		.option('-k, --key <hex>', `sending wallet's private key`)
		.option('-f, --key-file <file>', `sending wallet's private key file`)
		.option('-s, --keystore-file <file>', `sending wallet's keystore file`)
		.option('--password <password>', `keystore file password`)
		.option('-m, --mnemonic <phrase>', `sending wallet's HD wallet phrase`)
		.option('--mnemonic-index <n>', `sending wallet's HD wallet account index`, parseInt, 0)
		.option('-a, --account <hex>', `sending wallet's account address (provider wallet)`)
		.option('-c, --confirmations <n>', `number of confirmations to wait for before returning`, parseInt, 0)
		.option('-p, --provider <uri>', `provider URI`)
		.option('-n, --network <name>', 'network name')
		.option('-G, --gas-price <gwei>', `explicit gas price, in gwei (e.g., 20)`, parseFloat)
		.option('-l, --log <file>', `append a JSON log to a file`)
		.option('--confirm', `confirm before proceeding`)
		.action(async function (token, to, amount) {
			try {
				const r = await sendEther(token, to, amount, program);
				process.exit(r ? 0 : -1);
			} catch (err) {
				console.error(err.message);
				process.exit(-1);
			}
		});
	program.parse(process.argv);
	if (process.argv.slice(2).length == 0)
		program.outputHelp();
}
