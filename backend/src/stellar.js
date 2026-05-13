import { SorobanRpc, Keypair, Networks, TransactionBuilder, BASE_FEE, xdr, Contract } from "@stellar/stellar-sdk";
import "dotenv/config";

const server = new SorobanRpc.Server(process.env.STELLAR_RPC_URL);
const adminKeypair = Keypair.fromSecret(process.env.ADMIN_SECRET);
const contractId = process.env.CONTRACT_ID;
const networkPassphrase = process.env.STELLAR_NETWORK === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;

async function invokeContract(method, args = []) {
  const account = await server.getAccount(adminKeypair.publicKey());
  const contract = new Contract(contractId);
  const tx = new TransactionBuilder(account, { fee: BASE_FEE, networkPassphrase })
    .addOperation(contract.call(method, ...args))
    .setTimeout(30)
    .build();

  const prepared = await server.prepareTransaction(tx);
  prepared.sign(adminKeypair);

  const result = await server.sendTransaction(prepared);
  if (result.status === "ERROR") throw new Error(JSON.stringify(result.errorResult));

  // poll for confirmation
  let response;
  do {
    await new Promise(r => setTimeout(r, 1000));
    response = await server.getTransaction(result.hash);
  } while (response.status === "NOT_FOUND");

  if (response.status !== "SUCCESS") throw new Error("tx failed: " + response.status);
  return response;
}

export { server, adminKeypair, networkPassphrase, invokeContract };
