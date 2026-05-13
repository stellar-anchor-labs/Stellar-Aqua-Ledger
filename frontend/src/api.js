const BASE = import.meta.env.VITE_API_URL ?? "";

export async function getCredit(id) {
  const res = await fetch(`${BASE}/credits/${id}`);
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function mintCredit(id, owner, litres) {
  const res = await fetch(`${BASE}/credits/mint`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, owner, litres }),
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
