var solc = require("solc");
var Web3 = require("web3");
var fs = require("fs"); 
var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
console.log("\n------------ LOGGING ACCOUNTS -------------\n");
console.log(web3.eth.accounts);
var code = fs.readFileSync("Voting.sol").toString();
var compiledCode = solc.compile(code);

console.log("\n------------ LOGGING COMPILED CODE -------------\n");
console.log(compiledCode);
var byteCode = compiledCode.contracts[":Voting"].bytecode;
console.log("\n------------ LOGGING BYTECODE -------------\n");
console.log(byteCode);

var abi = compiledCode.contracts[":Voting"].interface;
console.log(
  "\n------------ LOGGING Application Binary Interface (ABI) -------------\n"
);
//console.log(abi);
var abiDefinition = JSON.parse(abi);

var VotingContract = web3.eth.contract(abiDefinition);

var contractInstance;

var deployedContract = VotingContract.new(
  ["Cand1", "Cand2", "Cand3"],
  {
    data: byteCode,
    from: web3.eth.accounts[0],
    gas: 4700000
  },
  function(e, contract) {
    if (!e) {
      if (!contract.address) {
        console.log(
          "\n------------ Contract waiting to be mined -------------\n"
        );
        console.log(
          "Contract transaction send: TransactionHash: " +
            contract.transactionHash +
            " waiting to be mined...\n"
        );
      } else {
        console.log("Contract mined! Address: " + contract.address);
        console.log(
          "\n------------ LOGGING Deployed Contract  -------------\n"
        );
        console.log(contract);
        console.log("\n------------ LOGGING Contract Address -------------\n");
        console.log(contract.address);
        contractInstance = VotingContract.at(contract.address);
        console.log(
          "\n------------ LOGGING Executing contract calls -------------\n"
        );

        fs.writeFile(
          "./contract.json",
          JSON.stringify(
            {
              address: contract.address,
              abi: JSON.stringify(abiDefinition, null, 2)
            },
            null,
            2
          ),
          "utf-8",
          function(err) {
            if (err) {
              console.log("ERROR: ");
              console.log(err);
            } else {
              console.log(`The file ./contract.json was saved!`);
            }
          }
        );
      }
    } else {
      console.log(e);
    }
  }
);

