import _ from "lodash";
import EVENTS from "./events";
import { Web } from "./web";
import AntConfig from "./configs/ant_config";
import { EventEmitter } from 'events';

module.exports.Ant = (function () {

    /******************************** Private methods ********************************/
    
    /**
     * This function will attach the event listeners to this ant on all method names
     * So that the users can easily emit events between ants and to the spiders as well
     * @return {[type]} [description]
     */
    let _attachEvents = function () {
    	let instFunctions = instFunctions = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    	instFunctions = instFunctions.filter(fn => { return fn != "constructor" && fn != "ant" && fn != "spider" ; });

    	_.forEach(instFunctions, action => { 
    		this.on(action, params => { this[action](params); }); 
    	});

        this.on("ant", ef => { this.web.emit("ant", ef); });
        this.on("spider", ef => { this.web.emit("spider", ef); });
    }

    class Ant extends EventEmitter {
		constructor (web, params) {
			if (!(web instanceof Web)) throw new Error ("First parameter should be instance of Web object. Ant died");
        	super ();

        	// Assign the object properties
			this.id 	= this.constructor.name;
			this.web 	= web;
			this.config = AntConfig;
			this.params = params || {};
			this.state 	= EVENTS.ANT.INITIALIZED;

			_attachEvents.call(this);

			web.registerAnt(this);
		}
	}
	
	return Ant;
})();