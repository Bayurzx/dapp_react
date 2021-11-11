// SPDX-License-Identifier: MIT
pragma solidity >= 0.8.7;

// This external contract is used mainly to approve funds that helps with transferring celo
interface IERC20Token {
    function transfer(address, uint256) external returns (bool);

    function approve(address, uint256) external returns (bool);

    function transferFrom(
        address,
        address,
        uint256
    ) external returns (bool);

    function totalSupply() external view returns (uint256);

    function balanceOf(address) external view returns (uint256);

    function allowance(address, address) external view returns (uint256);

    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(
        address indexed owner,
        address indexed spender,
        uint256 value
    );
}

// my contract starts here
contract AnimeRecomendation {
    // this creates the structure for our Voters and Anime similar to class in OOP
    struct Voter {
        address address_;
        string animeName;
        bool hasVoted;
        uint voteWeight;
    }
    
    struct Anime {
        string name;
        string image;
        string link;
        uint voteCount;
        uint group;

    }

    address internal cUsdTokenAddress = 0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1; // this address is used for celo transaction with the interface contract
    
    Anime [] public animes_; // array for where we keep our animes, with the Anime Struct

    mapping (address => Voter) internal voter_;

    Voter [] public voters;

    uint internal groupNum; // automatically starts at zero

    uint internal cost = 2;

    uint public totalVoteCount;

    uint contractStartAt = block.timestamp;

    function createAnimeList(string[][] memory animeNames) public {
        // careful with multi-dimensional arr, using ('' or ``) as input can cause error, use (") instead
        // [["Bayo", "bayo.png", "bayo.link"], ["adeBayo", "adebayo.png", "adebayo.link"]]

        voter_[msg.sender].voteWeight = 0;

        for (uint8 i = 0; i < animeNames.length; i++) {
            animes_.push(Anime({
                name: animeNames[i][0],
                image: animeNames[i][1],
                link: animeNames[i][2],
                voteCount: 0,
                group: groupNum
            }));
            // to know who added the anime
            voter_[msg.sender].animeName = animeNames[i][0];
        }
        ++groupNum;
    }

    function readAllAnime() view public returns (Anime [] memory animeData) {
        animeData = animes_;
    }

    // I used keccak256(abi.encodePacked(<String>)) because its difficult to compare different String storage types
    function readAnimeByName(string memory anime) view public returns (
        string memory theAnimeName,
        string memory theAnimeImg,
        string memory theAnimeLink,
        uint theAnimeVote,
        uint theAnimeGrp
    ) {
        for (uint256 i = 0; i < animes_.length; i++) {
            if (keccak256(abi.encodePacked(anime)) == keccak256(abi.encodePacked(animes_[i].name))) {
                theAnimeName = animes_[i].name;
                theAnimeImg = animes_[i].image;
                theAnimeLink = animes_[i].link;
                theAnimeVote = animes_[i].voteCount;
                theAnimeGrp = animes_[i].group;
            } 
        }
    }


    // function readAnimeGroup2(uint num) public returns (
    //     string memory name,
    //     string memory image,
    //     string memory link,
    //     uint voteCount,
    //     uint group

    // ) {
    //     delete grpAnimes_;
    //     for (uint256 i = 0; i < animes_.length; i++) {
    //         if (animes_[i].group == num) {
    //             return (
    //                 animes_[i].name,
    //                 animes_[i].image,
    //                 animes_[i].link,
    //                 animes_[i].voteCount,
    //                 animes_[i].group
    //             );
    //         }
    //     }
        
    //     // return animeData;
    // }

    Anime [] internal grpAnimes_;

    function readAnimeGroup(uint num) public {
        delete grpAnimes_;
        for (uint256 i = 0; i < animes_.length; i++) {
            if (animes_[i].group == num) {
                grpAnimes_.push(animes_[i]);
            }
        }
        // return animeData;
    }

    

    function getAnimeGroup( ) view public returns (Anime [] memory animeData) {
        animeData = grpAnimes_;
        
    }


    function rightToVote() internal {
        require(!voter_[msg.sender].hasVoted, "You can only vote once");
        require(voter_[msg.sender].voteWeight == 0, "checking if you paid in the past");
        require(
            IERC20Token(cUsdTokenAddress).transferFrom(
                msg.sender,
                address(this),
                cost
            ),
            "You need to pay to vote."
        );
        totalVoteCount++;
        voter_[msg.sender].voteWeight++ ;
    }

    function voting(string memory animeName) public payable {
        rightToVote();

        // Voter memory voter = voter_[msg.sender];

        for (uint256 i = 0; i < animes_.length; i++) {
            if (keccak256(abi.encodePacked(animeName)) == keccak256(abi.encodePacked(animes_[i].name))) {
                ++animes_[i].voteCount;

                voters.push(Voter({
                    address_: msg.sender,
                    animeName: animes_[i].name,
                    hasVoted: true,
                    voteWeight: voter_[msg.sender].voteWeight++
                }));
            } 
        }

    }

    function winningAnime() public view returns (uint winner) {
        if (contractStartAt > block.timestamp - 2 hours) {
            revert("It's too early to determine the winner");
        }
        uint winningVoteCount;
        for (uint8 i = 0; i < animes_.length; i++) {
            if (animes_[i].voteCount > winningVoteCount) {
                winningVoteCount = animes_[i].voteCount;
                winner = i;
            }
        }
    }

    function winningAnimeName() public view returns (string memory winnerName) {
        winnerName = animes_[winningAnime()].name;
    }

    address [] public winningAddress;

    function winningVoter() external {
        for (uint8 i = 0; i < voters.length; i++) {
            if (keccak256(abi.encodePacked(animes_[winningAnime()].name)) == keccak256(abi.encodePacked(voters[i].animeName))) {
                winningAddress.push(voters[i].address_);
            } 
        }

    }

    // This will be a random number
    function getWinningVoter(uint num) public view returns (address _address) {
        _address = winningAddress[num];
    }

    // This will be the same random number entered in winningVoter
    // make sure to run this functions together
    function payWinner(uint num) external {
        address _address = winningAddress[num] ;
        uint funds = totalVoteCount * cost; // All votes amount to the cost of 2

        require(
            IERC20Token(cUsdTokenAddress).transfer(
            payable(_address),
            funds), 
            "Something went wrong!"
        );

        delete animes_;
        delete voters;

    }


}

