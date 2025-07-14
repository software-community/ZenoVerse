  "use client";
  import React, { useState, useEffect } from "react";

  export default function NftWalletModal() {
    const [popupNft, setPopupNft] = useState(null);

    const staticNFTs = [
      { name: "Iron Ape", image: "/ironman.jpg", tokenId: "1001", price: "2.1 ETH", chain: "Ethereum" },
      { name: "Golden Cat", image: "/profile.webp", tokenId: "1002", price: "0.8 ETH", chain: "Ethereum" },
      { name: "Cyber Fox", image: "/profile2.jpg", tokenId: "1003", price: "0.3 ETH", chain: "Polygon" },
      { name: "Steel Hero", image: "/spiderman.png", tokenId: "1004", price: "5.0 ETH", chain: "Ethereum" },
      { name: "Pixel Punk", image: "/thumb2.jpg", tokenId: "1005", price: "1.2 ETH", chain: "Polygon" },
      { name: "Mystic Wolf", image: "/ironman.jpg", tokenId: "1006", price: "0.1 ETH", chain: "Polygon" },
      { name: "Shadow Ninja", image: "/spiderman.png", tokenId: "1007", price: "0.5 ETH", chain: "Ethereum" },
      { name: "Mecha Titan", image: "/profile.webp", tokenId: "1008", price: "7.8 ETH", chain: "Ethereum" },
      { name: "Steel", image: "/thumb2.jpg", tokenId: "1034", price: "5.0 ETH", chain: "Ethereum" },
    ];

    useEffect(() => {
      document.body.style.overflow = popupNft ? "hidden" : "";
      return () => {
        document.body.style.overflow = "";
      };
    }, [popupNft]);

    return (
      <>
        <div className="modal">
          <div className="modal-header">
            <span className="header-text">Your NFT Collection</span>
          </div>
          <div className="modal-body">
            <div className="nft-grid">
              {staticNFTs.map((nft, index) => (
                <div className="nft-card" key={index} onClick={() => setPopupNft(nft)}>
                  <img src={nft.image} alt={nft.name} className="nft-img-card" />
                  <div className="nft-info">
                    <div className="nft-name">{nft.name}</div>
                    <div className="nft-id">Token ID: #{nft.tokenId}</div>
                    <div className="nft-rows">
                      <div className="nft-row price-row">
                        <span className="nft-row-label">Price</span>
                        <span className="nft-row-value">{nft.price}</span>
                      </div>
                      <div className="nft-row">
                        <span className="nft-row-label">Chain</span>
                        <span className="nft-row-value">{nft.chain}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="modal-footer">
            <span className="footer-text">Status: Connected | Wallet: 0x1234...abcd</span>
          </div>
        </div>

        {popupNft && (
          <div className="nft-popup-overlay" onClick={() => setPopupNft(null)}>
            <div className="nft-popup-card" onClick={(e) => e.stopPropagation()}>
              <button className="close-popup" onClick={() => setPopupNft(null)}>×</button>
              <img src={popupNft.image} alt={popupNft.name} className="nft-img-card-popup" />
              <div className="nft-info-popup">
                <div className="nft-name-popup">{popupNft.name}</div>
                <div className="nft-id-popup">Token ID: #{popupNft.tokenId}</div>
                <div className="nft-popup-row">
                  <span className="nft-popup-label">Price</span>
                  <span className="nft-popup-value">{popupNft.price}</span>
                </div>
                <div className="nft-popup-row">
                  <span className="nft-popup-label">Chain</span>
                  <span className="nft-popup-value">{popupNft.chain}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        <style jsx>{`
          body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            background: #010f2e;
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
          }
          .modal {
            background: #fff;
            border-radius: 20px;
            box-shadow: 0 8px 40px rgba(0,0,0,0.18);
            width: 902px;
            height: 540px;
            max-width: 100vw;
            max-height: 92vh;
            display: flex;
            flex-direction: column;
            margin: 48px auto;
            overflow: hidden;
          }
          .modal-header, .modal-footer {
            padding: 20px;
            background: #070838;
            color: #fff;
            text-align: center;
          }
          .modal-header {
            font-size: 1.3rem;
            font-weight: bold;
            border-bottom: 1px solid gray;
          }
          .modal-footer {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            color: #b0b6c1;
            gap: 10px;
            border-top: 1px solid grey;
          }
          .modal-body {
            background: #070838;
            padding: 20px;
            box-sizing: border-box;
            overflow-y: auto;
            height: 100%;
          }
          .nft-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 18px 20px;
            justify-items: center;
            align-items: start;
          }
          .nft-card {
            background: #1f1f1f;
            border-radius: 16px;
            width: 190px;
            height: 295px;
            display: flex;
            flex-direction: column;
            cursor: pointer;
            transition: box-shadow 0.2s;
            color: white;
          }
          .nft-card:hover {
            background: #070416;
            box-shadow: 0 4px 24px rgba(0,0,0,0.18);
          }
          .nft-img-card {
            height: 60%;
            width: 100%;
            object-fit: cover;
            border-top-left-radius: 16px;
            border-top-right-radius: 16px;
          }
          .nft-info {
            padding: 8px 12px 10px;
            display: flex;
            flex-direction: column;
            gap: 4px;
            height: 40%;
          }
          .nft-name {
            font-size: 1.08rem;
            font-weight: 400;
            text-align: center;
          }
          .nft-id {
            font-size: 15px;
            font-weight: 500;
            text-align: center;
          }
          .nft-rows {
            display: flex;
            flex-direction: column;
            gap: 1px;
          }
          .nft-row {
            display: flex;
            justify-content: space-between;
            font-size: 0.97rem;
          }
          .nft-row-label {
            color: #b0b6c1;
            font-weight: 500;
          }
          .nft-row-value {
            font-weight: 500;
          }

          /* 🆕 POPUP ROW STYLES */
          .nft-popup-row {
            display: flex;
            justify-content: space-between;
            width: 100%;
            font-size: 0.97rem;
            margin-bottom: 10px;
          }
          .nft-popup-label {
            color: #b0b6c1;
            font-weight: 500;
          }
          .nft-popup-value {
            font-weight: 500;
          }

          .nft-popup-overlay {
            position: fixed;
            top: 0;
            left: 0;
            height: 100vh;
            width: 100vw;
            background: rgba(0,0,0,0.45);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
          }
          .nft-popup-card {
            background: #070838;
            color: white;
            border-radius: 20px;
            width: 300px;
            height: 420px;
            padding: 32px 24px;
            position: relative;
            animation: popup-in 0.18s cubic-bezier(.4,2,.6,1) both;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .nft-img-card-popup {
            width: 100%;
            height: 60%;
            object-fit: cover;
            border-radius: 10px;
          }
          .nft-info-popup {
            margin-top: 20px;
            width: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
          .nft-name-popup {
            font-size: 1.18rem;
            font-weight: 700;
            text-align: center;
            margin-bottom: 6px;
          }
          .nft-id-popup {
            font-size: 1.01rem;
            color: #b0b6c1;
            margin-bottom: 18px;
          }
          .close-popup {
            position: absolute;
            top: 1px;
            right: 1px;
            background: none;
            border: none;
            color: white;
            font-size: 2.1rem;
            cursor: pointer;
          }
          .close-popup:hover {
            color: #ff5252;
          }
          @keyframes popup-in {
            from { transform: scale(0.7); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
      </>
    );
  }
  3

