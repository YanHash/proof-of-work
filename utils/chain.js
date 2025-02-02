var validator = require('../utils/validator');

var validatorUtilities = require('./validator');

var ChainUtilities = function ChainUtilities(){

  var self = this;

  this.isValidChain = isValidChain;

  function isValidChain(chain){
    if(chain.length === 0) {
      return true;
    }
    if(chain.length>0){
      for (var i = 1; i < chain.length; i++) {
        var lastBlockHash = validator.calculateHash(chain[i-1].transaction[0]);
        if(lastBlockHash !== chain[i].previousHash){
          console.error(`Erreur de hash : attendu ${lastBlockHash}, trouvé ${chain[i].previousHash} au bloc ${chain[i].index}`);
          return false;
        }
        if(validatorUtilities.generateProof(chain[i].transaction[0]) !== chain[i].proof){
          console.error(`Erreur de preuve : attendu ${validatorUtilities.generateProof(chain[i].transaction[0])}, trouvé ${chain[i].proof} au bloc ${chain[i].index}`);
          return false;
        }
      }
    }
    return true;
  }

  if(ChainUtilities.caller != ChainUtilities.getInstance){
		throw new Error("This object cannot be instanciated");
	}

};


ChainUtilities.instance = null;
ChainUtilities.getInstance = function(){
	if(this.instance === null){
		this.instance = new ChainUtilities();
	}
	return this.instance;
};

module.exports = ChainUtilities.getInstance();
