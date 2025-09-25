import { Global, Module } from '@nestjs/common';
import { DarkSwapClientCore } from 'darkswap-client-core';
import { ConfigLoader, configToDarkSwapConfig } from '../utils/configUtil';
import Database from 'better-sqlite3';

@Global()
@Module({
    providers: [
        {
            provide: DarkSwapClientCore,
            useFactory: () => {
                const config = ConfigLoader.getInstance().getConfig();
                const darkSwapConfig = configToDarkSwapConfig(config);
                const dbFilePath = ConfigLoader.getInstance().getConfig().dbFilePath;
                const db = new Database(dbFilePath);
                return new DarkSwapClientCore(darkSwapConfig, db);
            }
        }
    ],
    exports: [DarkSwapClientCore]
})
export class CommonModule { }