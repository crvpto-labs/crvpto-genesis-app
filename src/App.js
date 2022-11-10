import { useState } from "react";
import {
  useAddress,
  ConnectWallet,
  useContract,
  Web3Button,
  useNFTs,
  useContractRead,
  ThirdwebNftMedia
} from "@thirdweb-dev/react";
import "./styles/Home.css";

const CONTRACT_ADDR = "0x25824B94fb2a9fEfad52ff97Cf56B0d98C56CD35";

export default function Home() {
  const address = useAddress();
  const { contract } = useContract(CONTRACT_ADDR);
  const { data: nfts, isLoading } = useNFTs(contract);
  const { data: genesisBalance } = useContractRead(contract, "balanceOf", address, "0");
  const [error, setError] = useState("");
  const { data: claimCondition } = useContractRead(contract, "claimCondition", "0");
  const claimable = claimCondition ? (Number(claimCondition.maxClaimableSupply) -
    Number(claimCondition.supplyClaimed) > 0) : 0;
  
  const totalClaimed = claimCondition ? Number(claimCondition.supplyClaimed) : 0;
  // const totalLeft = claimCondition ? Number(claimCondition.maxClaimableSupply) -
  //   Number(claimCondition.supplyClaimed) : 0;
  const maxClaimableSupply = claimCondition ? Number(claimCondition.maxClaimableSupply) : 0;

  return (
    <div className="container">
      <main className="main">
        <h1 className="title">
          Wellcome to the <a href="https://crvpto.io">Crvpto</a> membership community genesis
        </h1>
        
        <div className="connect">
          <ConnectWallet />
        </div>

        <div>
          {
            claimCondition && nfts ?
            <div className="description">
              <p>
                Each <b>Crvpto Soul</b> token will allow you to <b>claim one real jewel</b> 
                of our next jewelery collections about Proof of Work and Proof of Stake Blockchains
                 (<a href="https://crvpto.io">read more</a>)
              </p>
              { totalClaimed } of { maxClaimableSupply } Soul tokens already claimed
            </div> : <></>
          }
        </div>

        {
          nfts && address ?
          <div className="grid">
            <div className="card">
               {
                nfts && claimable ?
                  <>
                  {
                      genesisBalance && Number(genesisBalance) > 0 ?
                      <>
                        <h2>You have {Number(genesisBalance)} Soul tokens!</h2>
                        <p>
                          Thanks for being part of the Crvpto comunity.
                        </p>
                      </> :
                      <>
                        <h2>Join the Crvpto genesis!</h2>
                        <p>
                          Get Crvpto membership tokens and join the community.
                        </p>
                      </>
                  }
                  { 
                      nfts.filter(nft => nft.metadata.id === "0").map((nft) => (
                        <div key={nft.metadata.id.toString()} className="nft">
                          <ThirdwebNftMedia metadata={nft.metadata} width="300px" />
                          <h4>
                            {nft.metadata.name} - {nft.metadata.description}
                          </h4>
                        </div>
                      ))
                  }
                  <Web3Button
                      contractAddress={CONTRACT_ADDR}
                      accentColor="pink"
                      action={(contract) => contract.erc1155.claim(0, 1)}
                      onError={(error) => {
                        const errMsg = error.message.split('\n').find(i => i.includes('Message: '))
                        setError(`Error: ${errMsg.split('Message: ')[1]}`)
                      }}
                      onSubmit={() => setError("")}
                    >
                      {
                        genesisBalance && Number(genesisBalance) > 0 ?
                        <>Get another Soul</> :
                        <>Get a Soul token</>
                      }
                  </Web3Button>
                </> :
                <>
                {
                  genesisBalance && Number(genesisBalance) > 0 ?
                  <>
                    <h2>You have {Number(genesisBalance)} Crvpto genesis tokens!</h2>
                    <p>
                      Thanks for being part of this comunity. We are now building the next milestone of the project!
                    </p>
                  </> :
                  <>
                    <h2>Sorry, all the first edition of the Crvpto genesis tokens are over.</h2>
                    <p>
                      We are now building the next milestone of the project.
                    </p>
                  </>
                }
                </>
              }
            </div>
          </div> :
          <>
            { address && isLoading && <>Loading contract data...</>}
          </>
        }

        { error && <h3 style={{ color: "red" }}>{error}</h3> }
      </main>
    </div>
  );
}
