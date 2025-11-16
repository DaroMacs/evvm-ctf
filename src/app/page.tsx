// import { cookieStorage, createStorage, http } from '@wagmi/core'
import { ConnectButton } from "@/components/ConnectButton";
import { SigMenu } from "@/components/SigConstructors/SigMenu";
import Image from "next/image";
import { Suspense } from "react";
import { SimpleGovernanceDemo } from "@/components/governance/SimpleGovernanceDemo";

export default function Home() {
  return (
    <div className={"pages"}>
      <header
        style={{
          width: "90vw",
          minWidth: "90vw",
          height: 10,
          left: 0,
          top: 0,
          position: "relative",
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          background: "#03221E",
          borderRadius: 999,
          boxShadow: "0 2px 12px 0 rgba(0,0,0,0.07)",
          border: "none",
          padding: "0.5rem 2.5rem 0.5rem 1.5rem",
          minHeight: 70,
          marginBottom: 32,
          marginTop: 8,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", flex: 1 }}>
          <a
            href="https://www.evvm.info/docs/intro"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Image
              src="/evvm.svg"
              alt="Reown"
              width={60}
              height={90}
              priority
            />
          </a>
        </div>
        <div
          style={{
            display: "flex",
            gap: 0,
            flex: 1,
            justifyContent: "flex-end",
            alignItems: "center",
          }}
        >
          <a
            href="https://www.evvm.info/docs/intro"
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              style={{
                padding: "0.45rem 1.1rem",
                borderRadius: 999,
                border: "1.5px solid #00EE96",
                background: "#00EE96",
                color: "#03221E",
                fontWeight: 600,
                fontSize: 15,
                height: "45px",
                width: "100px",
                cursor: "pointer",
              }}
            >
              Docs
            </button>
          </a>
          <a href="https://evvm.org" target="_blank" rel="noopener noreferrer">
            <button
              style={{
                padding: "0.45rem 1.1rem",
                borderRadius: 999,
                border: "1.5px solid #00EE96",
                background: "#00EE96",
                color: "#03221E",
                fontWeight: 600,
                fontSize: 15,
                height: "45px",
                width: "100px",
                cursor: "pointer",
              }}
            >
              Website
            </button>
          </a>
          <div
            style={{
              marginLeft: 10,
              background: "#fff",
              borderRadius: 999,
              padding: "0rem 0rem",
              
              boxShadow: "0 1px 4px 0 rgba(0,0,0,0.06)",
            }}
          >
            <ConnectButton />
          </div>
        </div>
      </header>
      
      <br />
      <SigMenu />
      
      <div style={{ maxWidth: 1200, width: "90vw", margin: "24px auto" }}>
        <div
          style={{
            background: "#ffffff",
            borderRadius: 16,
            border: "1px solid rgba(0,0,0,0.06)",
            boxShadow: "0 2px 12px 0 rgba(0,0,0,0.04)"
          }}
        >
          <div style={{ borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "14px 18px" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600 }}>Simple Governance Demo</h2>
            <p style={{ fontSize: 12, color: "#1f2937", marginTop: 6 }}>Minimal example that routes fees via P2P Swap under the hood.</p>
          </div>
          <div style={{ padding: "18px" }}>
            <Suspense fallback={<div style={{ fontSize: 13, color: "#6b7280" }}>Loading form...</div>}>
              <SimpleGovernanceDemo />
            </Suspense>
          </div>
        </div>
      </div>
    </div>
  );
}
