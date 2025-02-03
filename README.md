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


# Analse critique de la proof of work : 

## Faiblesses de l'implémentation : 
### La PoW dépendant fortement de l'adresse
La fonction `generateProof` fait appel à `generateIntegerFromAddress` qui extrait des nombres depuis une adresse en chaine de caractères. Le problème de cette implémentation vient du fait qu'un attaquant pourrait manipuler l'adresse pour influencer la valeur de la PoW

### Pas de vérification des montants 
Aucune vérification dans la fonction ne s'assure de la validité ou la cohérence du montant (il pourrait être négatif ou avec une très grande décimal) ce qui rend la blockchain vulnérable aux attaques par dépassement de capacité

### Le cas du minage
Quand un noeud mine, la fonction de PoW reçoit un sender égal à 0 ainsi celle-ci est calculée uniquement en se basant sur le montant qui est fixe et au noeud qui reçoit le montant ainsi ce qui réduit déjà les paramétres rendant la PoW prévisible et donc manipulable. Normalement, une blockchain s'assure que les transactions proviennent d'un véritable expéditeur légitime si le sender est à 0 il n'y a alors aucune preuve cryptographique pour s'assurer que la transaction est légitime

### Absence de validation cryptographique 
Le calcule implémenté dans la PoW est assez simples avec des paramètres connus, on n'utilise pas de fonctions cryptographiques (connues et approuvées), de ce fait, ça rend la blockchaioe attaquable en produisant des PoW valides

# Recommandations :
- Remplacer les opérations simples de la PoW par une méthode qui utilise des primitives cryptographiques
- AJouter un nonce à la PoW pour introduire un paramètre inconnu et infalcifiable 
- Intégration de signatures comme ECDSA
- Vérification strictes du format des champs sender et receiver, vérification de la validité du montant (positif, non nul, avec un nombre de décimal maximal, vérifier si l'adresse émettrice dispose du montant)
- Se défaire de l'usage de `generateIntegerFromAddress` car elle ouvre la porte à des manipulations, on pourrait utiliser à la place une foction de hachage pour obtenir un identifiant unique comme avec SHA-256
- Revoir le cas du minage avec sender égal à 0 et exiger une signature numérique des mineurs pour prouver que la transaction est légitime

-> On peut proposer cette petite amélioration : 
```
const crypto = require('crypto');

function generateProof(transaction, nonce) {
  if (!transaction || !transaction.sender || !transaction.receiver || typeof transaction.amount !== 'number' || transaction.amount <= 0) {
    throw new Error("Transaction invalide");
  }

  const data = `${transaction.sender}:${transaction.receiver}:${transaction.amount}:${nonce}`;
  return crypto.createHash('sha256').update(data).digest('hex');
}
```