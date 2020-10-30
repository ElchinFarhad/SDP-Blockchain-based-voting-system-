
window.onload = function() {
  var web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
  var contractInstance;
  $.getJSON("./contract.json", function(contract) {
    contractInstance = web3.eth.contract(JSON.parse(contract.abi))
      .at(contract.address);

  var username;

    window.voteForCandidate = function() {
      voterName = $("#voter").val();
      candidateName = $("#candidate").val();
      contractInstance.voteForCandidate(
        voterName, candidateName,
        { from: web3.eth.accounts[0] },
        function() {
          let div_id = candidates[candidateName];
          $("#" + div_id).html(
            contractInstance.totalVotesFor.call(candidateName).toString()
          );
        }
      );
    };

    for (var i = 0; i < candidateNames.length; i++) {
      let name = candidateNames[i];
      let val = contractInstance.totalVotesFor.call(name).toString();
      $("#" + candidates[name]).html(val);
    }
  });
  var candidates = {
    Cand1: "candidate-1",
    Cand2: "candidate-2",
    Cand3: "candidate-3"
  };

  var candidateNames = Object.keys(candidates);

  $(document).ready(function(event) {
    for (var i = 0; i < candidateNames.length; i++) {
      let name = candidateNames[i];
      $("#" + candidates[name]).html(0);
    }
  });
};
