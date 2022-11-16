import { 
    useParams
  } from "react-router-dom";

export default function Token() {
  let { tokenId, phaseId } = useParams();

  return (

    <div className="container">
      <div className="navbar">
        <div className="brand">
          <img src="/img/crvpto-platform.png" alt="Crvpto platform" />
        </div>
      </div>
      <div className="description">
        <h3>TokenId: {tokenId}</h3>
        <h3>phaseId: {phaseId}</h3>
      </div>
    </div>
  );
}
