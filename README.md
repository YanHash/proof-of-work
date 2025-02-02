### Blockchain.js

* **newBlock** (proof, previousHash) => block
  Generate a new block given the already calculated proof and the previous Hash and returns the obtained block
* **newTransaction** (sender, receiver, amount) => transaction
  Generate a new transaction and adds it to the currentTransactions array which will be added in the next new block
* **mine** (miner) => block
  Mines a new block, assigns it to the miner and generate the associated block

### Network.js

* **registerNode** (address) => boolean
  Enable the insertion of new nodes and returns if the address has been added (cannot add twice the same address)
* **nodeExists** (address) => boolean
  Fetches in the nodes array if the provided node already exists and returns this information

## Updates : 
**blockchain.init()**
Le previous hash et la proof of work dépandent directement du champs transaction de chaque bloc et celui du précédant, de ce fait, la blockchain n'est jamais valide à cause des 2 premiers blocs et du retour "false" de **generateProof** et **calculateHash** losque ces fontions recevoient une transaction vide (ce qui est le cas avec l'initiation existante de la blockchain)

**blockchain.newTransaction()**
NewTransaction engendre à présent un nouveau bloc. De par la fonctionnement de la fonciton isValidChain qui vérifie uniquement la transaction d'indice 0 de chaque bloc, il fallait que chaque bloc porte une seule transaction.

**chain.isValidChain()**
Un import était mannquant : **validator.calculateHash()**

**route : /transaction**
La logique n'était pas encore implémentée