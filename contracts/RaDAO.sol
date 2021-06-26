//SPDX-License-Identifier: MIT
pragma solidity 0.8.6;

interface IERC20 {
  function balanceOf(address owner) external returns (uint);
  function approve(address spender, uint amount) external returns (bool);
  function transfer(address recipient, uint amount) external returns (bool);
  function transferFrom(address sender, address recipient, uint amount) external returns (bool);
}

interface IVoters {
    function snapshot() external returns (uint);
    function totalSupplyAt(uint snapshotId) external view returns (uint);
    function balanceOfAt(address account, uint snapshotId) external view returns (uint);
}

contract RaDAO {
    bool private _initialized;

    constructor() {
        _initialized = true;
    }

    function initialize(
      string calldata _name, string calldata _symbol, address _wrappedToken, address owner,
      uint _minBalanceToPropose, uint _minPercentQuorum,
      uint _minVotingTime, uint _minExecutionDelay
    ) public {
        require(!_initialized, "init");
        _initialized = true;
        voters = IVoters(address(this));
        name = _name;
        symbol = _symbol;
        wrappedToken = IERC20(_wrappedToken);
        minBalanceToPropose = _minBalanceToPropose;
        minPercentQuorum = _minPercentQuorum;
        minVotingTime = _minVotingTime;
        minExecutionDelay = _minExecutionDelay;
        if (_wrappedToken == address(0)) {
            totalSupply = 1;
            balanceOf[owner] = 1;
        }
    }

    // ERC20
    ///////////////////////////////////////////////////////////////////////////

    event Transfer(address indexed from, address indexed to, uint value);
    event Approval(address indexed owner, address indexed spender, uint value);

    string public name;
    string public symbol;
    uint8 public constant decimals = 18;
    IERC20 public wrappedToken;
    uint public totalSupply;
    uint public totalWrapped;
    mapping(address => mapping(address => uint)) public allowance;
    mapping(address => uint) public balanceOf;

    function burn(address from, uint amount) external {
        require(msg.sender == address(this), "!dao");
        _burn(from, amount);
    }

    function _burn(address from, uint amount) private {
        balanceOf[from] = balanceOf[from] - amount;
        totalSupply = totalSupply - amount;
        _updateSnapshot(_balancesSnapshots[from], balanceOf[from]);
        _updateSnapshot(_totalSupplySnapshots, totalSupply);
        emit Transfer(from, address(0), amount);
    }

    function mint(address to, uint amount) external {
        require(msg.sender == address(this), "!dao");
        _mint(to, amount);
    }

    function _mint(address to, uint amount) private {
        balanceOf[to] = balanceOf[to] + amount;
        totalSupply = totalSupply + amount;
        _updateSnapshot(_balancesSnapshots[to], balanceOf[to]);
        _updateSnapshot(_totalSupplySnapshots, totalSupply);
        emit Transfer(address(0), to, amount);
    }

    function approve(address spender, uint amount) external returns (bool) {
        require(spender != address(0), "!zero");
        allowance[msg.sender][spender] = amount;
        emit Approval(msg.sender, spender, amount);
        return true;
    }

    function transfer(address to, uint amount) external returns (bool) {
        require(address(wrappedToken) != address(0), "!wrapped");
        balanceOf[msg.sender] = balanceOf[msg.sender] - amount;
        balanceOf[to] = balanceOf[to] + amount;
        _updateSnapshot(_balancesSnapshots[to], balanceOf[to]);
        _updateSnapshot(_balancesSnapshots[msg.sender], balanceOf[msg.sender]);
        emit Transfer(msg.sender, to, amount);
        return true;
    }

    function transferFrom(address from, address to, uint amount) external returns (bool) {
        require(address(wrappedToken) != address(0), "!wrapped");
        balanceOf[from] = balanceOf[from] - amount;
        balanceOf[to] = balanceOf[to] + amount;
        allowance[from][msg.sender] = allowance[from][msg.sender] - amount;
        _updateSnapshot(_balancesSnapshots[to], balanceOf[to]);
        _updateSnapshot(_balancesSnapshots[from], balanceOf[from]);
        emit Transfer(from, to, amount);
        return true;
    }

    // Voting power & delegation
    ///////////////////////////////////////////////////////////////////////////

    struct Snapshots {
        uint[] ids;
        uint[] values;
    }

    event Snapshot(uint id);
    /*
    event DelegateChanged(address indexed delegator, address indexed fromDelegate, address indexed toDelegate);
    event DelegateVotesChanged(address indexed delegate, uint previousBalance, uint newBalance);
    */

    uint private _currentSnapshotId;
    Snapshots private _totalSupplySnapshots;
    mapping(address => Snapshots) private _balancesSnapshots;
    /*
    mapping(address => address) public delegates;
    mapping(address => Snapshots) private _votesSnapshots;
    */

    function _snapshot() private returns (uint) {
        unchecked { _currentSnapshotId += 1; }
        emit Snapshot(_currentSnapshotId);
        return _currentSnapshotId;
    }

    function totalSupplyAt(uint snapshotId) public view returns (uint) {
        return _valueAt(_totalSupplySnapshots, snapshotId);
    }

    function balanceOfAt(uint snapshotId, address account) public view returns (uint) {
        return _valueAt(_balancesSnapshots[account], snapshotId);
    }

    function _valueAt(Snapshots storage snapshots, uint snapshotId) private view returns (uint) {
        uint lower = 0;
        uint upper = snapshots.ids.length;
        while (upper > lower) {
            uint center = upper - (upper - lower) / 2;
            uint id = snapshots.ids[center];
            if (id == snapshotId) {
              return snapshots.values[center];
            } else if (id < snapshotId){
              lower = center;
            } else {
              upper = center - 1;
            }
        }
        return snapshots.values[lower];
    }

    function _updateSnapshot(Snapshots storage snapshots, uint currentValue) private {
        uint currentId = _currentSnapshotId;
        uint lastSnapshotId = 0;
        if (snapshots.ids.length > 0) {
            lastSnapshotId = snapshots.ids[snapshots.ids.length - 1];
        }
        if (lastSnapshotId < currentId) {
            snapshots.ids.push(currentId);
            snapshots.values.push(currentValue);
        }
    }

    /*
    function delegate(address delegatee) external {
        _delegate(msg.sender, delegatee);
    }

    function _delegate(address delegator, address delegatee) private {
        address currentDelegate = delegates[delegator];
        delegates[delegator] = delegatee;
        emit DelegateChanged(delegator, currentDelegate, delegatee);
        _moveDelegates(currentDelegate, delegatee, uint96(balanceOf[delegator]));
    }

    function _moveDelegates(address srcRep, address dstRep, uint96 amount) private {
        if (srcRep != dstRep && amount > 0) {
            if (srcRep != address(0)) {
                uint32 srcRepNum = numCheckpoints[srcRep];
                uint96 srcRepOld = srcRepNum > 0 ? checkpoints[srcRep][srcRepNum - 1].votes : 0;
                uint96 srcRepNew = srcRepOld - amount;
                _writeCheckpoint(srcRep, srcRepNum, srcRepOld, srcRepNew);
            }
            if (dstRep != address(0)) {
                uint32 dstRepNum = numCheckpoints[dstRep];
                uint96 dstRepOld = dstRepNum > 0 ? checkpoints[dstRep][dstRepNum - 1].votes : 0;
                uint96 dstRepNew = dstRepOld + amount;
                _writeCheckpoint(dstRep, dstRepNum, dstRepOld, dstRepNew);
            }
        }
    }

    function _writeCheckpoint(address delegatee, uint32 nCheckpoints, uint96 oldVotes, uint96 newVotes) private {
        uint32 blockNumber = uint32(block.number);
        if (nCheckpoints > 0 && checkpoints[delegatee][nCheckpoints - 1].fromBlock == blockNumber) {
          checkpoints[delegatee][nCheckpoints - 1].votes = newVotes;
        } else {
          checkpoints[delegatee][nCheckpoints] = Checkpoint(blockNumber, newVotes);
          numCheckpoints[delegatee] = nCheckpoints + 1;
        }
        emit DelegateVotesChanged(delegatee, oldVotes, newVotes);
    }
    */

    // Lock / Unlock
    ///////////////////////////////////////////////////////////////////////////

    function adjustTotalWrapped(int value) external {
      require(msg.sender == address(this), "!dao");
      unchecked {
        if (value > 0) {
          totalWrapped += uint(value);
        } else {
          totalWrapped -= uint(0 - value);
        }
      }
    }

    function lock(uint amount) external {
        require(address(wrappedToken) != address(0), "!wrapped");
        uint _totalWrapped = totalWrapped;
        uint _totalSupply = totalSupply;
        safeTransferFrom(wrappedToken, msg.sender, address(this), amount);
        if (_totalSupply == 0 || _totalWrapped == 0) {
            unchecked { totalWrapped += amount; }
            _mint(msg.sender, amount); // Mint 1:1 when first
        } else {
            uint _value = (amount * _totalSupply) / _totalWrapped;
            unchecked { totalWrapped += _value; }
            _mint(msg.sender, _value);
        }
    }

    function unlock(uint amount) external {
        require(address(wrappedToken) != address(0), "!wrapped");
        uint _totalWrapped = totalWrapped;
        uint _totalSupply = totalSupply;
        _burn(msg.sender, amount);
        uint _value = (amount * _totalWrapped) / _totalSupply;
        totalWrapped -= _value;
        safeTransfer(wrappedToken, msg.sender, _value);
    }

    function safeTransfer(IERC20 token, address to, uint value) private {
      _callOptionalReturn(address(token), abi.encodeWithSelector(token.transfer.selector, to, value));
    }

    function safeTransferFrom(IERC20 token, address from, address to, uint value) private {
      _callOptionalReturn(address(token), abi.encodeWithSelector(token.transferFrom.selector, from, to, value));
    }

    function _callOptionalReturn(address token, bytes memory data) private {
        uint size;
        assembly { size := extcodesize(token) }
        require(size > 0, "!contract");
        (bool success, bytes memory returndata) = address(token).call(data);
        require(success, "erc20!call");
        if (returndata.length > 0) {
            require(abi.decode(returndata, (bool)), "erc20!success");
        }
    }

    // Proposals
    ///////////////////////////////////////////////////////////////////////////

    struct Proposal {
        uint id;
        address proposer;
        string title;
        string description;
        Option[] options;
        uint startAt;
        uint endAt;
        uint executableAt;
        uint executedAt;
        uint snapshotId;
        uint votersSupply;
    }
    struct Option {
        string name;
        bytes[] actions;
        uint votes;
    }

    event Proposed(uint indexed proposalId);
    event Voted(uint indexed proposalId, address indexed voter, uint optionId);
    event Executed(address indexed to, uint value, bytes data);
    event ExecutedProposal(uint indexed proposalId, address executer);

    string constant public AGAINST_OPTION_NAME = "-";
    bytes32 public constant DOMAIN_TYPEHASH = keccak256("EIP712Domain(string name,uint256 chainId,address verifyingContract)");
    bytes32 public constant BALLOT_TYPEHASH = keccak256("Ballot(uint256 proposalId,uint optionId)");
    uint public minBalanceToPropose;
    uint public minPercentQuorum;
    uint public minVotingTime;
    uint public minExecutionDelay;
    IVoters voters;
    Proposal[] public proposals;
    mapping(uint => mapping(address => uint)) public proposalVotes;
    mapping (address => uint) public latestProposalIds;

    function configure(address _voters, address _wrappedToken, uint _minBalanceToPropose, uint _minPercentQuorum, uint _minVotingTime, uint _minExecutionDelay) external {
      require(msg.sender == address(this), "!dao");
      voters = IVoters(_voters);
      wrappedToken = IERC20(_wrappedToken);
      minBalanceToPropose = _minBalanceToPropose;
      minPercentQuorum = _minPercentQuorum;
      minVotingTime = _minVotingTime;
      minExecutionDelay = _minExecutionDelay;
    }

    function propose(string calldata title, string calldata description, uint votingTime, uint executionDelay, string[] calldata optionNames, bytes[][] calldata optionActions) external returns (uint) {
        uint snapshotId;
        if (address(voters) == address(this)) {
          snapshotId = _snapshot();
        } else {
          snapshotId = voters.snapshot();
        }
        require(voters.balanceOfAt(msg.sender, snapshotId) >= minBalanceToPropose, "<balance");
        require(optionNames.length == optionActions.length, "option size");
        require(optionNames.length > 0 && optionNames.length <= 10, "option count");
        require(votingTime >= minVotingTime, "<voting time");
        require(executionDelay >= minExecutionDelay, "<exec delay");

        // Check the proposing address doesn't have an other active proposal
        uint latestProposalId = latestProposalIds[msg.sender];
        if (latestProposalId != 0) {
            require(block.timestamp > proposals[latestProposalId].endAt, "1 live proposal max");
        }

        // Add new proposal
        proposals.push();
        Proposal storage newProposal = proposals[proposals.length - 1];
        newProposal.id = proposals.length - 1;
        newProposal.proposer = msg.sender;
        newProposal.title = title;
        newProposal.description = description;
        newProposal.startAt = block.timestamp;
        newProposal.endAt = block.timestamp + votingTime;
        newProposal.executableAt = block.timestamp + votingTime + executionDelay;
        newProposal.snapshotId = snapshotId;
        newProposal.votersSupply = voters.totalSupplyAt(snapshotId);

        // Copy options into proposal in storage
        unchecked {
            for (uint i = 0; i < optionNames.length; i++) {
                newProposal.options.push(Option({
                    name: optionNames[i],
                    actions: optionActions[i],
                    votes: 0
                }));
            }
        }

        // Add the "Against" / "None" option so that the voters always have the option of voting to do nothing
        // Without this a proposer could submit 2 malicious options and one or the other would be guaranteed to execute
        newProposal.options.push();
        newProposal.options[newProposal.options.length - 1].name = AGAINST_OPTION_NAME;

        latestProposalIds[newProposal.proposer] = newProposal.id;
        emit Proposed(newProposal.id);
        return newProposal.id;
    }

    function vote(uint proposalId, uint optionId) external {
        _vote(msg.sender, proposalId, optionId);
    }

    function voteBySignature(uint proposalId, uint optionId, uint8 v, bytes32 r, bytes32 s) external {
        uint chainId;
        assembly { chainId := chainid() }
        bytes32 domainSeparator = keccak256(abi.encode(DOMAIN_TYPEHASH, keccak256(bytes(name)), chainId, address(this)));
        bytes32 structHash = keccak256(abi.encode(BALLOT_TYPEHASH, proposalId, optionId));
        bytes32 digest = keccak256(abi.encodePacked("\x19\x01", domainSeparator, structHash));
        address signatory = ecrecover(digest, v, r, s);
        require(signatory != address(0), "invalid signature");
        _vote(signatory, proposalId, optionId);
    }

    function _vote(address voter, uint proposalId, uint optionId) private {
        Proposal memory p = proposals[proposalId];
        require(block.timestamp < p.endAt, "voting ended");
        require(proposalVotes[proposalId][voter] == 0, "already voted");
        uint votes = voters.balanceOfAt(voter, p.snapshotId);
        unchecked {
          p.options[optionId].votes = p.options[optionId].votes + votes;
        }
        proposalVotes[proposalId][voter] = optionId;
        emit Voted(proposalId, voter, optionId);
    }

    // Executes an un-executed, with quorum, ready to be executed proposal
    // If the pre-conditions are met, anybody can call this
    // Part of this is establishing which option "won" and if quorum was reached
    function execute(uint proposalId) external {
        Proposal memory p = proposals[proposalId];
        require(block.timestamp > p.executableAt, "not yet executable");
        require(p.executedAt == 0, "already executed");
        p.executedAt = block.timestamp; // Mark as executed now to prevent re-entrancy

        // Pick the winning option (the one with the most votes, defaulting to the "Against" (last) option
        uint votesTotal;
        uint winningOptionIndex = p.options.length - 1; // Default to "Against"
        uint winningOptionVotes = 0;
        unchecked {
            for (uint i = p.options.length - 1; i >= 0; i--) {
                uint votes = p.options[i].votes;
                votesTotal = votesTotal + votes;
                // Use greater than (not equal) to avoid a proposal with 0 votes to default to the 1st option
                if (votes > winningOptionVotes) {
                    winningOptionIndex = i;
                    winningOptionVotes = votes;
                }
            }
        }

        require((votesTotal * 1e12) / p.votersSupply > minPercentQuorum, "execute: not at quorum");

        // Run all actions attached to the winning option
        Option memory winningOption = p.options[winningOptionIndex];
        for (uint i = 0; i < winningOption.actions.length; i++) {
            (address to, uint value, bytes memory data) = abi.decode(winningOption.actions[i], (address, uint, bytes));
            (bool success,) = to.call{value: value}(data);
            require(success, "action reverted");
            emit Executed(to, value, data);
        }

        emit ExecutedProposal(proposalId, msg.sender);
    }

    // Treasury
    ///////////////////////////////////////////////////////////////////////////

    event ValueReceived(address indexed sender, uint value);

    receive() external payable {
      emit ValueReceived(msg.sender, msg.value);
    }
}
