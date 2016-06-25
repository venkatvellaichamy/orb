var outputFolder = __dirname + '/../../../dist/';

module.exports = {
    spider: {
        // Custom properties that will be used for debugging
        debug: true,
        console: true,
        logs: false,

        dirs: {
            logs: outputFolder + "logs",
            downloads: outputFolder + "downloads"
        }
    },

    spider_brain: {
        // configs for spookjs
        child: {
            transport: 'http'
        },

        // configs for casperjs
        casper: {
            logLevel: 'debug',
            verbose: true,
            options: {
                clientScripts: ['https://code.jquery.com/jquery-2.1.4.js']
            },
            pageSettings: {
                userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/34.0.1847.137 Safari/537.36'
            },
            waitTimeout: 5000,
            exitOnError: true
        }
    }
}