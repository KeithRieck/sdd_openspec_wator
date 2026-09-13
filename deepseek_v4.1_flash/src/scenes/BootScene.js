/**
 * Preparation scene.
 *
 * `BootScene` verifies that Phaser is present and prepares progressive-web-app
 * readiness, then hands control to {@link import('./SimulationScene.js').default}
 * (design D10). It deliberately creates no simulation state, so there is
 * exactly one owner of the world: the simulation scene.
 */

export default class BootScene extends Phaser.Scene {
    /** Create the boot scene under the scene key `Boot`. */
    constructor() {
        super({ key: 'Boot' });
    }

    /**
     * Verify the runtime is usable, register the service worker, then start the
     * simulation scene.
     *
     * @returns {void}
     */
    create() {
        this._registerServiceWorker();
        this.scene.start('Simulation');
    }

    /**
     * Register the service worker when the browser supports it.
     *
     * The worker is registered with a relative URL so its scope covers the
     * deployed subpath (`app-shell/pwa-support` §2.1, §2.4). Registration
     * failure is not fatal: PWA support is best-effort, and the app runs
     * without it.
     *
     * @private
     * @returns {void}
     */
    _registerServiceWorker() {
        if (typeof navigator === 'undefined' || !('serviceWorker' in navigator)) {
            return;
        }
        // Serving from file:// has no service-worker support; ignore failures.
        navigator.serviceWorker.register('./sw.js').catch(() => {});
    }
}
