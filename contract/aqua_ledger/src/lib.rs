#![no_std]
use soroban_sdk::{contract, contractimpl, contracttype, Address, Env, Map, Symbol, symbol_short};

/// A water credit record: who holds it, how many litres it represents, verified status.
#[contracttype]
#[derive(Clone)]
pub struct WaterCredit {
    pub owner: Address,
    pub litres: u64,
    pub verified: bool,
}

const CREDITS: Symbol = symbol_short!("CREDITS");
const ADMIN: Symbol = symbol_short!("ADMIN");

#[contract]
pub struct AquaLedger;

#[contractimpl]
impl AquaLedger {
    /// One-time initialisation — sets the contract admin.
    pub fn init(env: Env, admin: Address) {
        if env.storage().instance().has(&ADMIN) {
            panic!("already initialised");
        }
        env.storage().instance().set(&ADMIN, &admin);
        env.storage().instance().set(&CREDITS, &Map::<u64, WaterCredit>::new(&env));
    }

    /// Admin mints a new water credit for `owner`.
    pub fn mint(env: Env, id: u64, owner: Address, litres: u64) {
        Self::require_admin(&env);
        let mut credits: Map<u64, WaterCredit> = env.storage().instance().get(&CREDITS).unwrap();
        if credits.contains_key(id) {
            panic!("credit id exists");
        }
        credits.set(id, WaterCredit { owner, litres, verified: false });
        env.storage().instance().set(&CREDITS, &credits);
    }

    /// Admin verifies a credit (e.g. after IoT sensor confirmation).
    pub fn verify(env: Env, id: u64) {
        Self::require_admin(&env);
        let mut credits: Map<u64, WaterCredit> = env.storage().instance().get(&CREDITS).unwrap();
        let mut credit = credits.get(id).expect("not found");
        credit.verified = true;
        credits.set(id, credit);
        env.storage().instance().set(&CREDITS, &credits);
    }

    /// Transfer a verified credit to a new owner.
    pub fn transfer(env: Env, id: u64, to: Address) {
        let mut credits: Map<u64, WaterCredit> = env.storage().instance().get(&CREDITS).unwrap();
        let mut credit = credits.get(id).expect("not found");
        credit.owner.require_auth();
        if !credit.verified {
            panic!("credit not verified");
        }
        credit.owner = to;
        credits.set(id, credit);
        env.storage().instance().set(&CREDITS, &credits);
    }

    /// Read a credit by id.
    pub fn get(env: Env, id: u64) -> WaterCredit {
        let credits: Map<u64, WaterCredit> = env.storage().instance().get(&CREDITS).unwrap();
        credits.get(id).expect("not found")
    }

    // ── helpers ──────────────────────────────────────────────────────────────

    fn require_admin(env: &Env) {
        let admin: Address = env.storage().instance().get(&ADMIN).unwrap();
        admin.require_auth();
    }
}

#[cfg(test)]
mod test {
    use super::*;
    use soroban_sdk::testutils::Address as _;

    #[test]
    fn mint_verify_transfer() {
        let env = Env::default();
        env.mock_all_auths();
        let contract_id = env.register_contract(None, AquaLedger);
        let client = AquaLedgerClient::new(&env, &contract_id);

        let admin = Address::generate(&env);
        let user = Address::generate(&env);
        let buyer = Address::generate(&env);

        client.init(&admin);
        client.mint(&1u64, &user, &5000u64);
        client.verify(&1u64);
        client.transfer(&1u64, &buyer);

        let credit = client.get(&1u64);
        assert_eq!(credit.owner, buyer);
        assert!(credit.verified);
    }
}
