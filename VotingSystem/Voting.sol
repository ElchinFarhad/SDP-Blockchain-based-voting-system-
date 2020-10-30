pragma solidity ^0.4.18;

contract Voting {

  mapping (bytes32 => uint8) public votesReceived;
  
  bytes32[] public candidateList;
  bytes32 public nowvoter;
  bytes32[] public voterlist = new bytes32[](100);
  uint numVoters = 0;

  function Voting(bytes32[] candidateNames) public {
    candidateList = candidateNames;
  }

  function totalVotesFor(bytes32 candidate) view public returns (uint8) {
    require(validCandidate(candidate));
    return votesReceived[candidate];
  }

  function voteForCandidate(bytes32 voter, bytes32 candidate) public {
    require(validCandidate(candidate));
    require(notvoted(voter));
    votesReceived[candidate] += 1;
    voterlist[numVoters] = voter;
    numVoters +=1;
  }

   function notvoted(bytes32 voter) view public returns (bool){
        for(uint i = 0; i < numVoters; i++) {
      if (voterlist[i] == voter) {
        return false;
      }
    }
    return true;
    }
    
  function validCandidate(bytes32 candidate) view public returns (bool) {
    for(uint i = 0; i < candidateList.length; i++) {
      if (candidateList[i] == candidate) {
        return true;
      }
    }
    return false;
  }
}
