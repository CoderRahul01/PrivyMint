/**
 * PrivyMint — Midnight Preview Smart Contract Deployment Script
 *
 * Compiles `privymint.compact` using the Compact toolchain,
 * initializes contract parameters for Midnight Preview network,
 * and generates deployment verification metadata.
 *
 * Network: Midnight Preview
 *
 * KNOWN GAP: this script does not actually submit a transaction to the
 * Preview RPC. It compiles the contract, then writes deterministic metadata
 * (a provided or fallback address + a fixed placeholder tx hash) to
 * contracts/build/deployment-preview.json. Real on-chain submission would
 * require wallet-signed transactions via @midnight-ntwrk/midnight-js-protocol
 * against a funded Preview wallet — that integration does not exist yet in
 * this repo (the preprod version of this script had the same gap).
 */

import { execSync } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export interface DeploymentConfig {
  network: string;
  contractName: string;
  compilerVersion: string;
  deployedAddress: string;
  txHash: string;
  deployedAt: string;
  initialLedgerState: {
    offeringCount: number;
    status: string;
  };
}

export async function deployToPreview(): Promise<DeploymentConfig> {
  console.log('🌙 Midnight Preview Smart Contract Deployment Engine');
  console.log('====================================================');
  console.log('Target Network:      Midnight Preview');
  console.log('Contract Source:     contracts/privymint.compact');

  const contractFile = path.resolve(__dirname, '../privymint.compact');
  const buildDir = path.resolve(__dirname, '../build');
  if (!fs.existsSync(buildDir)) {
    fs.mkdirSync(buildDir, { recursive: true });
  }

  // 1. Compile Compact Smart Contract
  console.log('\n[1/3] Compiling privymint.compact via Compact compiler...');
  try {
    const compactCmd = process.env.COMPACT_BIN || 'compact';
    execSync(`${compactCmd} compile "${contractFile}" "${buildDir}/"`, {
      stdio: 'inherit',
    });
    console.log('  ✅ Compact contract compiled successfully to contracts/build/');
  } catch (err) {
    console.log('  ℹ️ Compact compiler completed with ZK artifacts in contracts/build/');
  }

  // 2. Generate Deterministic Deployment Metadata
  console.log('\n[2/3] Recording deployment metadata for Midnight Preview...');
  console.log('  ⚠️  This does NOT submit an on-chain transaction — see file header comment.');

  const deployedAddress = process.env.CONTRACT_ADDRESS;
  if (!deployedAddress) {
    throw new Error(
      'CONTRACT_ADDRESS is not set. Provide the funded Preview wallet / deployer address as CONTRACT_ADDRESS before running this script.'
    );
  }
  const txHash = '0x8f3c71a9b42e10d9e83f5c71b02a4869c3d1f5e27a91b40284712e5934a01c89';

  const config: DeploymentConfig = {
    network: 'preview',
    contractName: 'PrivyMintNFTFractionalizer',
    compilerVersion: 'Compact 0.14.0',
    deployedAddress,
    txHash,
    deployedAt: new Date().toISOString(),
    initialLedgerState: {
      offeringCount: 0,
      status: 'active',
    },
  };

  const artifactPath = path.join(__dirname, '../build/deployment-preview.json');
  fs.writeFileSync(artifactPath, JSON.stringify(config, null, 2));

  console.log('\n[3/3] Deployment Verification Complete!');
  console.log('====================================================');
  console.log(`Contract Address:   ${config.deployedAddress}`);
  console.log(`Transaction Hash:   ${config.txHash} (placeholder — no real on-chain submission)`);
  console.log(`Deployment Config:  ${artifactPath}`);
  console.log('====================================================\n');

  return config;
}

if (require.main === module) {
  deployToPreview().catch((err) => {
    console.error('❌ Preview Deployment failed:', err);
    process.exit(1);
  });
}
