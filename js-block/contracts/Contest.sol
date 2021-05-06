pragma solidity ^0.4.17;

contract Contest {
    address private manager;
    address private winnerAddress;
    bool private isWinnerSelected = false;
    
    struct Participant {
        string name ;
        string email ;
        string phone ;
    }
    
    function Contest() public {
        manager = msg.sender;
    }
    
    mapping (address => Participant) private participants;
    address[] private participantList;
    
    function register (string _name ,string  _phone ,string _email ) public payable {
        require(msg.value > .00001 ether);
        
        require(!isWinnerSelected);
        
        Participant storage participant = participants[msg.sender];
        
        participant.name = _name;
        participant.phone = _phone;
        participant.email = _email;
        
        participantList.push(msg.sender);
        
        sendAmount(msg.value, manager);
        
    }
    
    function pickWinner() public {
        require(msg.sender == manager);
        
        uint index = random() % participantList.length;
        winnerAddress = participantList[index];
        isWinnerSelected = true;
    }
    
    function transferAmount() public payable {
        require(msg.value > .0001 ether);
        
        require(msg.sender == manager);
        
        require(isWinnerSelected);
        
        sendAmount(msg.value, winnerAddress);
    }
    
    function random() private view returns(uint) {
        return uint(keccak256(block.difficulty, now, participantList));
    }
    
    function getIsWinnerSelected() public view returns (bool) {
        return isWinnerSelected;
    }
    
    function getParticepants() public view returns(address[]) {
        return participantList;
    }
    
    function getWinner() public view returns(string){
        require(isWinnerSelected);
        return participants[winnerAddress].name;
    }
    
    function getManager() public view returns(address) {
        return manager;
    }
    
    function sendAmount(uint _amount, address _account) private {
        _account.transfer(_amount);
    }
    
    
}