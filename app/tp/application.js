goog.provide('tp.Application');
goog.require('tp.BaseApplication');
goog.require('tp.service.Torrent');
goog.require('tp.backend.config');


/**
 */
tp.Application = class extends tp.BaseApplication {
	/**
	 */
	constructor() {
		zb.console.setLevel(zb.console.Level.ALL);
		super();

		/**
		 * @type {{
		 *      torrent: tp.service.Torrent
		 * }}
		 */
		this.service = {
			torrent: new tp.service.Torrent('http://' + tp.backend.config.api.ip + ':' + tp.backend.config.api.port + '/')
		};
	}

	/**
	 * @override
	 */
	home() {
		this.clearHistory();
		// TODO: DEBUG ONLY
		const homeScene = this.getLayerManager().getLayer('asset-list');
		return this.service.torrent.search('ubuntu')
			.then((items) => {
				if (!items.length) {
					return;
				}
				const item = items[0];
				return this.service.torrent.load(item.magnet);
			})
			.then((url) => {
				return this.getSceneOpener().open(homeScene, () => {
					return url;
				});
			});
	}

	/**
	 * @override
	 */
	onStart() {
		// login, splashscreen, timeout, etc.
		this.home();
	}
};
