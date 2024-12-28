import dotenv from 'dotenv';
dotenv.config();

export default{
    dbFile: process.env.DB_FILE_PATH || "/data/db.sqlite",
    tables:[
        `CREATE TABLE IF NOT EXISTS WALLETS (
            public_key TEXT PRIMARY KEY, 
            address TEXT NOT NULL, 
            private_key TEXT NOT NULL);`,

        //status: 0: normal, 1: used, 2: created
        `CREATE TABLE IF NOT EXISTS NOTES (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            chain_id TEXT NOT NULL, 
            public_key TEXT NOT NULL, 
            note_commitment TEXT NOT NULL, 
            rho TEXT NOT NULL, 
            asset TEXT NOT NULL, 
            amount TEXT NOT NULL
            status INTEGER NOT NULL);`,
            
        `CREATE TABLE IF NOT EXISTS ASSETS_PAIR (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            asset_a TEXT NOT NULL, 
            asset_b TEXT NOT NULL, 
            chain_id TEXT NOT NULL);`,

        //order_direction: 0: buy, 1: sell
        //order_type: 0: market, 1: limit, 2: stop loss, 3: stop loss limit, 4: take profit, 5: take profit limit, 6: limit maker
        //time_in_force in bitmap 
        // GTC: 0000
        // GTD: 0001
        // IOC: 0010
        // FOK: 0100
        // AON (GTC): 1000
        // AON (GTD): 1001
        //stp in bitmap
        // none: 00
        // expire_maker: 01
        // expire_taker: 10
        // both: 11
        //status: 0: open, 1: matched, 2: cancelled
    
        `CREATE TABLE IF NOT EXISTS ORDERS (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            order_id TEXT NOT NULL,
            chain_id TEXT NOT NULL, 
            asset_pair_id INTEGER NOT NULL,
            order_direction integer NOT NULL,
            order_type integer NOT NULL,
            time_in_force integer NOT NULL,
            stp_mode integer NOT NULL,
            price TEXT NOT NULL,
            status integer NOT NULL,
            signature TEXT NOT NULL);`,
    ]
}