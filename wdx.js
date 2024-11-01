/**
 * Elrest - Node RED - Runtime Node
 * 
 * @copyright 2024 Elrest Automations Systeme GMBH
 */

module.exports = function (RED) {

	"use strict";

	const WDXSchema = require("@wago/wdx-schema");

	const WS_STATUS_ONLINE_COLOR = 'green';
	const WS_STATUS_OFFLINE_COLOR = 'red';
	const WS_STATUS_ERROR_COLOR = 'red';
	const WS_STATUS_CONNECTING_COLOR = 'blue';

	const NODE_STATUS = {
		OPEN: {
			fill: WS_STATUS_ONLINE_COLOR,
			shape: "dot",
			text: "Open"
		},
		ERROR: {
			fill: WS_STATUS_ERROR_COLOR,
			shape: "dot",
			text: "Error"
		},
		CLOSED: {
			fill: WS_STATUS_OFFLINE_COLOR,
			shape: "dot",
			text: "Closed"
		},
		CONNECTING: {
			fill: WS_STATUS_CONNECTING_COLOR,
			shape: "dot",
			text: "Connecting"
		},
		CLOSING: {
			fill: WS_STATUS_CONNECTING_COLOR,
			shape: "dot",
			text: "Closing"
		}
	};

	function EDesignRuntimeDataGetSchema(config) {

		RED.nodes.createNode(this, config);

		this.status(NODE_STATUS.CONNECTING);

		const wsClient = RED.nodes.getNode(config.client);

		wsClient.on('opened', (event) => {
			this.status(Object.assign(NODE_STATUS.OPEN, {
				event: "connect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('erro', (event) => {
			this.status(Object.assign(NODE_STATUS.ERROR, {
				event: "error",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('closed', (event) => {
			this.status(Object.assign(NODE_STATUS.CLOSED, {
				event: "disconnect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		this.on('input', (msg, nodeSend, nodeDone) => {

			//console.log("EDesignRuntimeDataGetSchema.input", msg, config);

			const request = new WDXSchema.WDX.Schema.Message.Data.GetSchemaRequest(
				msg.path ?? config['path'] ?? "",
				msg.level ?? config['level'] ?? 1
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.DataGetSchemaResponse
							&& wsMessage.uuid === request.uuid) {

							if (undefined !== wsMessage.error) {
								msg.payload = wsMessage.error;
								this.send([null, msg]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}
							subscription.unsubscribe();
						}
					},

					error: (wsError) => {
						console.error("EDesignRuntimeDataGetSchema.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						msg.payload = wsError;
						this.send([null, msg.payload, null]);
					},

					complete: () => {
						console.debug("EDesignRuntimeDataGetSchema.input.complete");
						msg.payload = 'completed';
						this.send([null, null, msg]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeDataGetSchema.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}

	RED.nodes.registerType("wago.wdx.data.get-schema", EDesignRuntimeDataGetSchema);

	function EDesignRuntimeDataSetSchema(config) {

		//console.log("EDesignRuntimeDataSetSchema", config);

		RED.nodes.createNode(this, config);

		this.status(NODE_STATUS.CONNECTING);

		const wsClient = RED.nodes.getNode(config.client);

		wsClient.on('opened', (event) => {
			this.status(Object.assign(NODE_STATUS.OPEN, {
				event: "connect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('erro', (event) => {
			this.status(Object.assign(NODE_STATUS.ERROR, {
				event: "error",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('closed', (event) => {
			this.status(Object.assign(NODE_STATUS.CLOSED, {
				event: "disconnect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		this.on('input', (msg, nodeSend, nodeDone) => {

			console.log("EDesignRuntimeDataSetSchema.input", { msg: msg, config: config, });

			const schema = msg.schema ?? config['schema'] ?? undefined;

			if (undefined === schema) {
				return;
			}

			const request = new WDXSchema.WDX.Schema.Message.Data.SetSchemaRequest(
				schema,
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.DataSetSchemaResponse
							&& wsMessage.uuid === request.uuid) {

							if (undefined !== wsMessage.error) {
								msg.payload = wsMessage.error;
								this.send([null, msg]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}
							subscription.unsubscribe();
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeDataSetSchema.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeDataSetSchema.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.data.set-schema", EDesignRuntimeDataSetSchema);

	function EDesignRuntimeDataGetValue(config) {

		//console.log("EDesignRuntimeDataGetValue", config);

		RED.nodes.createNode(this, config);

		this.status(NODE_STATUS.CONNECTING);

		const wsClient = RED.nodes.getNode(config.client);

		wsClient.on('opened', (event) => {
			this.status(Object.assign(NODE_STATUS.OPEN, {
				event: "connect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('erro', (event) => {
			this.status(Object.assign(NODE_STATUS.ERROR, {
				event: "error",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('closed', (event) => {
			this.status(Object.assign(NODE_STATUS.CLOSED, {
				event: "disconnect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		this.on('input', (msg, nodeSend, nodeDone) => {

			//console.log("EDesignRuntimeDataGetValue.input", msg, config);

			const request = new WDXSchema.WDX.Schema.Message.Data.GetValueRequest(
				msg.path ?? config['path'] ?? "",
				msg.level ?? config['level'] ?? "",
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.DataGetValueResponse
							&& wsMessage.uuid === request.uuid) {

							if (undefined !== wsMessage.error) {
								msg.payload = wsMessage.error;
								this.send([null, msg]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null]);
							}
							subscription.unsubscribe();
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeDataGetValue.input.wsMessages.error", wsError);
						subscription.unsubscribe();
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeDataGetValue.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.data.get-value", EDesignRuntimeDataGetValue);

	function EDesignRuntimeDataSetValue(config) {

		//console.log("EDesignRuntimeDataSetValue", config);

		RED.nodes.createNode(this, config);

		this.status(NODE_STATUS.CONNECTING);

		const wsClient = RED.nodes.getNode(config.client);

		wsClient.on('opened', (event) => {
			this.status(Object.assign(NODE_STATUS.OPEN, {
				event: "connect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('erro', (event) => {
			this.status(Object.assign(NODE_STATUS.ERROR, {
				event: "error",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('closed', (event) => {
			this.status(Object.assign(NODE_STATUS.CLOSED, {
				event: "disconnect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		this.on('input', (msg, nodeSend, nodeDone) => {

			console.log("EDesignRuntimeDataSetValue.input", { msg: msg, config: config });

			const path = msg.path ?? config['path'] ?? undefined;
			const value = msg.value ?? config['value'] ?? undefined;

			if (undefined === path) {
				return;
			}

			const request = new WDXSchema.WDX.Schema.Message.Data.SetValueRequest(
				new WDXSchema.WDX.Schema.Model.Data.DataValue(
					path,
					value,
				)
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.DataSetValueResponse
							&& wsMessage.uuid === request.uuid) {

							if (undefined !== wsMessage.error) {
								msg.payload = wsMessage.error;
								this.send([null, msg]);
							} else {
								msg.payload = wsMessage.body;
								this.send([msg, null, null,]);
							}

							subscription.unsubscribe();
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeDataSetValue.input.wsMessages.error", wsError);
						this.send([null, wsError]);
						subscription.unsubscribe();
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeDataSetValue.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.data.set-value", EDesignRuntimeDataSetValue);

	function EDesignRuntimeDataMonitorValue(config) {

		console.debug('EDesignRuntimeDataMonitorValue', config);

		RED.nodes.createNode(this, config);

		this.status(NODE_STATUS.CONNECTING);

		const wsClient = RED.nodes.getNode(config.client);

		wsClient.on('opened', (event) => {
			this.status(Object.assign(NODE_STATUS.OPEN, {
				event: "connect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('erro', (event) => {
			this.status(Object.assign(NODE_STATUS.ERROR, {
				event: "error",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('closed', (event) => {
			this.status(Object.assign(NODE_STATUS.CLOSED, {
				event: "disconnect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		this.on('input', (msg, nodeSend, nodeDone) => {

			if (true === msg.subscribe) {

				console.debug('EDesignRuntimeDataMonitorValue.input.subscribe',);

				if (undefined === this.subscription || true === this.subscription.closed) {
					const path = msg.path ?? config['path'] ?? "";

					const request = new WDXSchema.WDX.Schema.Message.Data.RegisterValueRequest(
						path
					);

					this.subscription = wsClient.wsMessages().subscribe(
						{
							next: (wsMessage) => {
								if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.DataRegisterValueResponse
									&& wsMessage.uuid === request.uuid) {

									if (undefined !== wsMessage.error) {
										msg.payload = wsMessage.error;
										this.send([null, msg]);
									} else {
										msg.payload = wsMessage.body;

										this.status(
											{ fill: "green", shape: "ring", text: "Open - Subscribed" },
										);

										this.send([msg, null, null,]);
									}
								}
								else if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.DataUpdate
									&& wsMessage.body.path === path) {
									if (undefined !== wsMessage.error) {
										msg.payload = wsMessage.error;
										this.send([null, msg]);
									} else {
										this.status(
											{ fill: "green", shape: "ring", text: "Open - Subscribed" },
										);
										msg.payload = wsMessage.body;
										this.send([msg, null, null]);
									}
								}
							},
							error: (subscribtionError) => {
								console.error("EDesignRuntimeDataMonitorValue.input.subscription.error", subscribtionError);
								msg.payload = subscribtionError;
								this.send([null, msg]);
							},
							complete: () => {
								console.debug("EDesignRuntimeDataMonitorValue.input.subscription.complete",);
								this.status(NODE_STATUS.OPEN);
								msg.payload = "complete";
								this.send([null, null, msg]);
							}
						}
					);

					wsClient.wsSend(request);
				}

			} else if (undefined !== this.subscription && false === this.subscription.closed) {
				console.debug('EDesignRuntimeDataMonitorValue.input.unsubscribe');
				this.subscription.unsubscribe();
				this.status(NODE_STATUS.OPEN);
				msg.payload = "complete";
				this.send([null, null, msg]);
			}
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeDataRegister.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.data.monitor-value", EDesignRuntimeDataMonitorValue);

	function EDesignRuntimeDataUnregister(config) {

		//console.log("EDesignRuntimeDataUnregister", config);

		RED.nodes.createNode(this, config);

		this.status(NODE_STATUS.CONNECTING);

		const wsClient = RED.nodes.getNode(config.client);

		wsClient.on('opened', (event) => {
			this.status(Object.assign(NODE_STATUS.OPEN, {
				event: "connect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('erro', (event) => {
			this.status(Object.assign(NODE_STATUS.ERROR, {
				event: "error",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('closed', (event) => {
			this.status(Object.assign(NODE_STATUS.CLOSED, {
				event: "disconnect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		this.on('input', (msg, nodeSend, nodeDone) => {

			//console.log("EDesignRuntimeDataUnregister.input", msg, config);

			const request = new WDXSchema.WDX.Schema.Message.Data.UnregisterRequest(
				msg.path ?? config['path'] ?? ""
			);

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.DataUnregisterResponse
							&& wsMessage.uuid === request.uuid) {
							if (undefined !== wsMessage.error) {
								this.send([null, wsMessage.error]);
							} else {
								this.send(wsMessage);
								subscription.unsubscribe();
							}
						}
					},
					error: (wsError) => {
						console.error("EDesignRuntimeDataUnregister.input.wsMessages.error", wsError);
						subscription.unsubscribe();
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeDataUnregister.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.data.unregister", EDesignRuntimeDataUnregister);

	function EDesignRuntimeDataMonitorSchema(config) {
		RED.nodes.createNode(this, config);
		this.status(NODE_STATUS.CONNECTING);

		const wsClient = RED.nodes.getNode(config.client);

		wsClient.on('opened', (event) => {
			this.status(Object.assign(NODE_STATUS.OPEN, {
				event: "connect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('erro', (event) => {
			this.status(Object.assign(NODE_STATUS.ERROR, {
				event: "error",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('closed', (event) => {
			this.status(Object.assign(NODE_STATUS.CLOSED, {
				event: "disconnect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		this.on('input', (msg, nodeSend, nodeDone) => {

			//console.log("EDesignRuntimeDataMonitorSchema.input", msg, config);


			if (true === msg.subscribe) {

				console.debug('EDesignRuntimeDataMonitorSchema.subscribe',);

				if (undefined === this.subscription || true === this.subscription.closed) {

					const request = new WDXSchema.WDX.Schema.Message.Data.RegisterSchemaChangesRequest();

					this.subscription = wsClient.wsMessages().subscribe(
						{
							next: (wsMessage) => {
								if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.DataSchemaChanges) {
									if (undefined !== wsMessage.error) {
										this.send([null, wsMessage.error]);
									} else {
										msg.payload = wsMessage.body;
										this.send([msg, null, null]);
									}
								}
							},

							error: (wsError) => {
								console.error("EDesignRuntimeDataMonitorSchema.input.wsMessages.error", wsError);
								this.send([null, wsError]);
							},

							complete: () => {
								console.error("EDesignRuntimeDataMonitorSchema.input.wsMessages.complete", wsError);
								this.send([null, null, msg]);
							}
						}
					);

					wsClient.wsSend(request);
				}

			} else if (undefined !== this.subscription && false === this.subscription.closed) {
				console.debug('EDesignRuntimeDataMonitorSchema.unsubscribe');
				this.subscription.unsubscribe();
			}
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeDataGetValue.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.data.monitor-schema", EDesignRuntimeDataMonitorSchema);

	function EDesignRuntimeDataUnsubscribeSchema(config) {
		RED.nodes.createNode(this, config);

		this.status(NODE_STATUS.CONNECTING);

		const wsClient = RED.nodes.getNode(config.client);

		wsClient.on('opened', (event) => {
			this.status(Object.assign(NODE_STATUS.OPEN, {
				event: "connect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('erro', (event) => {
			this.status(Object.assign(NODE_STATUS.ERROR, {
				event: "error",
				_session: { type: "websocket", id: event.id }
			}));
		});

		wsClient.on('closed', (event) => {
			this.status(Object.assign(NODE_STATUS.CLOSED, {
				event: "disconnect",
				_session: { type: "websocket", id: event.id }
			}));
		});

		this.on('input', (msg, nodeSend, nodeDone) => {

			//console.log("EDesignRuntimeDataGetValue.input", msg, config);

			const request = new WDXSchema.WDX.Schema.Message.Data.UnregisterSchemaChangesRequest();

			const subscription = wsClient.wsMessages().subscribe(
				{
					next: (wsMessage) => {
						if (wsMessage.type === WDXSchema.WDX.Schema.Message.Type.DataUnregisterSchemaChangesResponse && request.uuid === wsMessage.uuid) {
							if (undefined !== wsMessage.error) {
								this.send([null, wsMessage.error]);
							} else {
								this.send(wsMessage);
							}
							subscription.unsubscribe();
						}

					},
					error: (wsError) => {
						console.error("EDesignRuntimeDataUnsubscribeSchema.input.wsMessages.error", wsError);
						this.send([null, wsError]);
					}
				}
			);

			wsClient.wsSend(request);
		});

		this.on('close', () => {
			//console.log("EDesignRuntimeDataGetValue.close");

			this.status(NODE_STATUS.CLOSED);
		});
	}
	RED.nodes.registerType("wago.wdx.data.unsubscribe-schema", EDesignRuntimeDataUnsubscribeSchema);
}