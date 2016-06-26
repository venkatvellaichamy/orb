import Spooky from "spooky";
import util from "utils";
import SpiderConfig from "../configs/spider_config";

let spiderBrain = (function () {

    /******************************** Private methods ********************************/

    const _logErrors = function (error) {
        error = error.data ? error.data : error;
        this.spooky.errors.push(error);
        if (SpiderConfig.spider.debug) {
            console.error('spooky error', error);
        }
    }

    const _logConsoleMessages = function (line) {
        this.spooky.console.push(line);
        if (SpiderConfig.spider.console) {
            console.log(line);
        }
    }

    const _logLogs = function (entry) {
        if (!SpiderConfig.spider.logs) { return; }
        var message = entry.message;
        var event = (message.event || '').toLowerCase();

        if (event === 'request') {
            console.log('%s: %s %s', this.spooky.options.port, message.method, message.request.url);
            console.log(' Headers: %s', util.inspect(message.request.headers));
            console.log(' Payload: %s', util.inspect(JSON.parse(message.request.post)));
        } else if (event === 'response') {
            console.log('%s: %s %s', this.spooky.options.port, message.code, util.inspect(JSON.parse(message.body)));
        } else {
            console.log(this.spooky.options.port + ':');
            console.dir(entry);
        }
    }

    class SpiderBrain {

        /******************************** Life Cycle methods ********************************/

        constructor (id, url) {
            this.spiderId = id;
            this.url = url;
            this.spooky = new Spooky (SpiderConfig.spider_brain, this._brainDeveloped.bind(this));
            this.spooky.errors = [];
            this.spooky.console = [];

            this.spooky.on('error', _logErrors.bind(this));
            this.spooky.on('console', _logConsoleMessages.bind(this));
            this.spooky.on('log', _logLogs.bind(this));
        }

        /******************************** Protected methods ********************************/

        _brainDeveloped (error, response)  {
            if (error) {
                console.dir(error);
                throw new Error('Brain did not develop for the spider: ' + error.code + ' - '  + error.message);
            } else {
                this.spooky.start(this.url);
                this.spooky.__instantiated = true;
            }     
        }

        /******************************** Public methods ********************************/

        run () {
            if (this.spooky && this.spooky.__instantiated) {
                this.spooky.emit(this.spiderId);
                this.spooky.run();
            } else {
                console.log("Waiting for the brain to develop in the spider: " + this.spiderId);
                setTimeout(this.run.bind(this), 500);
            }
        }
    }

    return SpiderBrain;
})();

module.exports.SpiderBrain = spiderBrain;