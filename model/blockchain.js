var addressUtilities = require('../utils/address');
var arrayUtilities = require('../utils/array');
var ChainUtilities = require('../utils/chain');
var validator = require('../utils/validator');


var blockchain = function blockchain() {

  var self = this;

  this.init = init;
  this.newBlock = newBlock;
  this.newTransaction = newTransaction;
  this.getChain = getChain;
  this.checkChain = checkChain;
  this.mine = mine;

  this.chain;
  this.currentTransactions;

  function init() {
    /*
    *  initialize the blockchain, creating a new empty chain,
    *  an empty transactions list and creating the first block
    */
    self.chain = [];
    // Modification du code car la PoW se basant sur les transaction elle ne sera jamais bonne
    // pour les 2 premiers blocs
    self.currentTransactions = [{
      sender: "127.0.0.1",
      receiver: "127.0.0.255",
      amount: 1
    }];
    var proof = validator.generateProof(self.currentTransactions[0])
    self.newBlock(proof, 1);
  }

  function getChain() {
    /*
    *  returns the chain
    */
    return self.chain;
  }

  function mine(miner) {
    /*
    *  implements the mining function. simple as is, it just
    *  creates a new transaction with "sender" 0 to show that
    *  this is a mined block.
    */

    var lastBlock = self.chain[self.chain.length - 1];
    var transaction = newTransaction("0", miner, 1);
    var proof = validator.generateProof(self.currentTransactions[0]);
    var previousHash = validator.calculateHash(lastBlock.transaction[0]);
    return newBlock(proof, previousHash);
  }

  function newBlock(proof, previousHash) {
    /*
    *  Generate a new blocks and adds it to the chain
    */
    var block = {
      "index": self.chain.length + 1,
      "timestamp": new Date().getTime(),
      "transaction": self.currentTransactions,
      "proof": proof,
      "previousHash": previousHash
    }
    self.currentTransactions = [];
    self.chain.push(block);
    return block;
  }

  function newTransaction(sender, receiver, amount) {
    /*
    *  Generate a new transaction
    */
    var transaction = {
      sender: sender,
      receiver: receiver,
      amount: amount
    };
    self.currentTransactions.push(transaction);
    return transaction;
  }

  function checkChain() {
    /* Le hash précédent de chaque bloc correspond bien au hash du bloc précédent */
    var isValidChain = ChainUtilities.isValidChain(self.chain);
    if (!isValidChain) {
      console.error("La chaîne globale est invalide.");
      return [];
    }

    for (var i = 0; i < self.chain.length; i++) {
      const block = self.chain[i];
      /* La structure de chaque bloc est complète */
      if (
        !block.index ||
        !block.timestamp ||
        !block.transaction ||
        !block.proof ||
        !block.previousHash
      ) {
        console.error(`Structure du bloc ${block.index} invalide.`);
        return [];
      }

      /* Les indices des blocs sont séquentiels */
      if (i > 0 && block.index !== self.chain[i - 1].index + 1) {
        console.error(`Les indices ne sont pas séquentiels au bloc ${block.index}.`);
        return [];
      };

      /* La preuve (proof) de chaque bloc est valide */
      var generatedProof = validator.generateProof(block.transaction[0]);
      var givenProof = block.proof;
      console.log(`block : ${block.transaction} - generated Proof ${generatedProof} - Given Proof : ${givenProof}}`)
      if (generatedProof != givenProof) {
        console.error(`La preuve du bloc ${block.index} est invalide.`);
        return [];
      }
    }

    /* Chaine valide */
    return self.chain;
  }


  if (blockchain.caller != blockchain.getInstance) {
    throw new Error("This object cannot be instanciated");
  }

};


blockchain.instance = null;
blockchain.getInstance = function () {
  if (this.instance === null) {
    this.instance = new blockchain();
  }
  return this.instance;
};

module.exports = blockchain.getInstance();
