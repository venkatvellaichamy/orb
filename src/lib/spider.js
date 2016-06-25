import { SpiderBrain } from "./spider_brain";
import SpiderConfig from "./configs/spider_config";
import EVENTS from "./events";
import { Web } from "./web";
import { EventEmitter } from "events";

module.exports.Spider = (function() {

    /******************************** Private methods ********************************/

	const _obj_attachEvents = function () {
		this.spooky.on(EVENTS.SPIDER.INITIALIZED, () => { this.state = EVENTS.SPIDER.INITIALIZED; });
		this.spooky.on(EVENTS.SPIDER.CRAWLING, () => { this.state = EVENTS.SPIDER.CRAWLING; });
		this.spooky.on(EVENTS.SPIDER.FINISHED, () => { this.state = EVENTS.SPIDER.FINISHED; });
		this.spooky.on("error", () => { this.state = EVENTS.SPIDER.ERRORED; });

		this.spooky.on("ant", (e) => { this.web.emit("ant", e); });
    }

    const _obj_crawlSpider = function () {
    	// Object Instance scope
    	var { id, config, params } = this,
    		instFunctions,
    		stringifiedInstFunctions = {};
		
		// Get all the functions in the spider instance
		instFunctions = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
		instFunctions = instFunctions.filter(fn => { return fn != "constructor"; }).concat([ "_login", "_check" ]);

		for (let fn of instFunctions) {
			stringifiedInstFunctions[fn] = this[fn].toString();
		}
		
		this.spooky.on(this.id, function () {

			this.then (function () {
				this.emit("SPIDER:CRAWLING");
			});

			// Spookyjs Scope - function tuple
			this.then ([
				{ 
					spider 	: { id, config, params },
					privateFns	: { 
									captureStep: _cjs_captureStep.toString(), 
									clickLink: _cjs_clickLink.toString(),
									xPath: _cjs_xPath.toString()
								  },
					objectFns	: stringifiedInstFunctions,
				}, 
				_cjs_defineCapturejsScope 
			]);

			this.then(function() {
				this.emit("SPIDER:FINISHED");
			});
		});
    }

	// Casperjs Scoped private functions

    const _cjs_defineCapturejsScope = function () {
    	this.stepCount = 0;
		
		for (let key in objectFns) {
			eval("this.__proto__." + key + " = " + objectFns[key]);
			//this.__proto__[key] = new Function("return (" + objectFns[key] + ").apply(this, arguments)")
	    }

		for (let key in privateFns) {
			eval("this.__proto__." + key + " = " + privateFns[key]);
	    }

	 	//this._check.call(this);

		this._login.call(this);	
		this.crawl.call(this);

		// this.repeat(2, function () {
		// 	this.crawl.call(this);

		// 	this.wait (10000, function () {});
		// });
    }

    const _cjs_captureStep = function (stepDescription) {
    	++this.stepCount;

		var imageName = stepDescription.replace(/ /g, "_"),
			imagePath = spider.config.dirs.logs + '/' + spider.id + '/' + this.stepCount + '_' + imageName + '.png';

        console.log('Saving screen capture to ' + imagePath);
        this.capture(imagePath);
    }

    const _cjs_clickLink = function (config) {
        var that = this,
        	delay = config.delay ? config.delay : 2000,
            stepDescription = config.stepDescription || this.stepCount,
            selector = config.selector;

        var _pass = function () {

            this.echo("Step Pass: " + that.stepCount + ': ' + stepDescription);

            this.echo('Clicking the link - ' + this.fetchText(selector));
            this.click(selector, 'a');

            this.wait(delay, function () {
                that.captureStep (stepDescription);
            });
        }

        var _fail = function () {
            this.echo('Step Failed: ' + stepDescription);
            return false;
        }

        this.waitForSelector(selector, _pass, _fail);
    }

    const _cjs_xPath = function (expression) {
    	return { type: "xpath", path: expression,
    		toString: function() {
    			return this.type + " selector: " + this.path;
    		}
    	};
    };

    // spider class definition

	class Spider extends EventEmitter {
		
        /******************************** Life Cycle methods ********************************/

        constructor (web, params) {
        	// Validate the constructor arguments
        	if (!(web instanceof Web)) throw new Error ("First parameter should be instance of Web object. Spider died");

        	super ();

        	// Assign the object properties
			this.id 	= this.constructor.name;
			this.web 	= web;
			this.brain 	= new SpiderBrain (this.id, web.url);
			this.spooky = this.brain.spooky;
			this.config = SpiderConfig.spider;
			this.params = params || {};
			this.state 	= EVENTS.SPIDER.INITIALIZED;

			_obj_attachEvents.call(this);
			_obj_crawlSpider.call(this);

			web.registerSpider(this);
		}

		_check () {
			// this.captureStep('Login page loaded');

			// this.wait(1000, function(){
   //              this.echo("i waited");
   //          });

	  //       var stepDescription= 'Clicking login button',
	  //       	selector = '#close > center > div.hpmainwraper > div.hpmainwraper.pos-relative > div.innerwrapper.pos-relative.paddt10 > div.fright > form > div.fleft.paddl8 > input.hp-button.small';

	  //       this.waitForSelector(selector, function() {
	  //       	this.echo("got it");
	  //       }, function () {
	  //       	this.echo("oops it");
	  //       });
	  		// this.then(function () {
	  		// 	this.emit ("ant", { action:"run", params: "hello"});
	  		// });
	  		

	  		// this.then (function () {
	  		// 	this.emit ("ant", { id:"ExcelAnt", action: "run", params: { path: spider.params.path } });
	  		// })
	  		


	  		// this.then(function () {
	  		// 	this.echo (this.xPath);
	  		// })
		}

		_login () {
			this.echo("default login method _login not overridden")
		}

		crawl () {
			console.log ("spider not implemented the run command :(");
		}

		run () {
			if (this.state === EVENTS.SPIDER.CRAWLING) return;

			this.brain.run();
		}
	}

	return Spider;
})();