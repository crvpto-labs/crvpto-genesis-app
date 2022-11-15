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

const CONTRACT_ADDR = "0x4bb2946EFF3f719F9e0D1919CeAc58c492021E3a";

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
      <div className="navbar">
        <div className="brand">
          <img src="/img/crvpto-platform.png" alt="Crvpto platform" />
        </div>
      </div>
      <main className="main">
        <div className="title-intro">
          <p>Welcome the future of jewelry with the Crvpto Soul edition</p>
        </div>
        <h1 className="title">
          Genesis
        </h1>
        <div>
          {
            claimCondition && nfts ?
            <div className="description">
              { totalClaimed } of { maxClaimableSupply } Genesis Souls have already an owner
            </div> : <></>
          }
        </div>
        <div className="description is-inverted">
          <p className="large"><strong>Each Crvpto Soul allows you to:</strong>
          </p>
          <ul className="large">
            <li>claim one physical jewel build in Q1 2023</li>
            <li>access the Discord community of Soul owners where you will be given the possibility to discuss and vote on different jewelry designs.</li>
          </ul>
          <p>Crvpto jewelry is designed and build by a curated list of jewelry designers and manufacturers only available on the Crvpto platform. <br />
          <a href="https://www.crvpto.io/#what">Read more on www.crvpto.io</a> </p>
        </div>
        <div className="connect">
          <ConnectWallet accentColor="#D3FBD6"/>
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
                        <h2>You have {Number(genesisBalance)} Crvpto Soul tokens!</h2>
                        <p>
                          Enjoy being part of the Crvpto comunity.
                        </p>
                      </> :
                      <>
                        <h2>Join the community of the Crvpto Genesis Soul edition.</h2>
                        <p>
                          Get Crvpto Soul tokens and join the community.
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
