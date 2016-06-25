import _ from "lodash";
import { EventEmitter } from 'events';

export class Web extends EventEmitter {
	constructor (url) {
		super();

		this.url = url;
		this.spiders = {};
		this.ants = {};

		this._spiders = [];
		this._ants = [];

		this._attachEventListeners()
	}

	_attachEventListeners () {
		/**
		 * ef - event fascade
		 * Will have the following structure and if it is not valid, throw the error
		 * {
		 * 		id: "" // Spider or Ant id
		 * 		action: "" // What that ant or spider should do
		 * 		params: {} // Parameters to the event listener
		 * }
		 */
		const validateEf = function (ef) {
			if (ef.action == undefined || ef.action == null) throw new Error("event action should be provided");

			return true;
		}

		this.on("spider", (ef) => {
			validateEf(ef);

			if (ef.id) {
				let spider = this.spiders[ef.id]; 
				spider && spider.emit(ef.action, ef.params);
			} else {
				_.forEach(this._spiders, (spiderId) => { this.spiders[spiderId].emit(ef.action, ef.params); });
			}
		});

		this.on("ant", (ef) => { 
			validateEf(ef);

			if (ef.id) {
				let ant = this.ants[ef.id]; 
				ant && ant.emit(ef.action, ef.params);
			} else {
				_.forEach(this._ants, (antId) => { this.ants[antId].emit(ef.action, ef.params); });
			}
		});
	}

	registerSpider (spider) {
		this.spiders[spider.id] = spider;
		this._spiders.push(spider.id);
	}

	registerAnt (ant) {
		this.ants[ant.id] = ant;
		this._ants.push(ant.id);
	}

	deRegisterSpider (spider) {
		var spiderId = typeof spider === "object" ? spider.id : spider;

		delete spiders[spiderId];
		_.remove(this._spiders, spiderId);
	}

	deRegisterAnt  (ant) {
		var antId = typeof ant === "object" ? ant.id : ant;

		delete ants[antId];
		_.remove(this._ants, antId);
	}
}