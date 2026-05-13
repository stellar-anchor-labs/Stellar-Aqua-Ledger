import { Router } from "express";
import { nativeToScVal, scValToNative, Address } from "@stellar/stellar-sdk";
import { invokeContract } from "../stellar.js";

const router = Router();

// GET /credits/:id
router.get("/:id", async (req, res) => {
  try {
    const result = await invokeContract("get", [nativeToScVal(BigInt(req.params.id), { type: "u64" })]);
    const val = result.returnValue;
    res.json(scValToNative(val));
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// POST /credits/mint  { id, owner, litres }
router.post("/mint", async (req, res) => {
  try {
    const { id, owner, litres } = req.body;
    await invokeContract("mint", [
      nativeToScVal(BigInt(id), { type: "u64" }),
      new Address(owner).toScVal(),
      nativeToScVal(BigInt(litres), { type: "u64" }),
    ]);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// POST /credits/verify  { id }
router.post("/verify", async (req, res) => {
  try {
    await invokeContract("verify", [nativeToScVal(BigInt(req.body.id), { type: "u64" })]);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// POST /credits/transfer  { id, to }
router.post("/transfer", async (req, res) => {
  try {
    const { id, to } = req.body;
    await invokeContract("transfer", [
      nativeToScVal(BigInt(id), { type: "u64" }),
      new Address(to).toScVal(),
    ]);
    res.json({ ok: true });
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

export default router;
