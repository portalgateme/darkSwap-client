import { Injectable, OnApplicationBootstrap, OnApplicationShutdown, Logger } from '@nestjs/common';
import { DarkSwapClientCore } from 'darkswap-client-core';

@Injectable()
export class BootstrapService implements OnApplicationBootstrap, OnApplicationShutdown {
    private isStarted = false;
    private startupPromise: Promise<void> | null = null;
    private logger = new Logger(BootstrapService.name);

    constructor(
        private readonly darkSwapClient: DarkSwapClientCore
    ) { }

    async onApplicationBootstrap() {
        await this.start();
    }

    async onApplicationShutdown(signal?: string) {
        await this.stop();
    }

    async start(): Promise<void> {
        if (this.isStarted) {
            return;
        }

        if (this.startupPromise) {
            await this.startupPromise;
            return;
        }

        this.startupPromise = this._start();
        await this.startupPromise;
    }

    private async _start(): Promise<void> {
        try {
            this.darkSwapClient.getWebSocketClient().startWebSocket();

            this.isStarted = true;
        } catch (error) {
            this.startupPromise = null;
            throw error;
        }

        try {
            await this.darkSwapClient.getAssetPairService().syncAssetPairs();
        } catch (error) {
            this.logger.error('Failed to sync asset pairs', error);
        }
    }

    /**
     * 停止服务
     */
    async stop(): Promise<void> {
        if (!this.isStarted) return;
        this.isStarted = false;
        this.startupPromise = null;
    }

    getStatus(): { isStarted: boolean; isStarting: boolean } {
        return {
            isStarted: this.isStarted,
            isStarting: !!this.startupPromise && !this.isStarted
        };
    }
}