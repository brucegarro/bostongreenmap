requirejs.config({
    shim: {
        underscore: {
            exports: '_'
        },
        jquery: {
            exports: '$'
        },
        backbone: {
            exports: 'Backbone',
            deps: ['underscore', 'jquery']
        },
        handlebars: {
            exports: 'Handlebars'
        },
        marionette: {
            deps: ['underscore', 'jquery', 'backbone'],
            exports: 'Marionette'
        },
        page: {
            exports: 'page'
        },
        masonry: {
            exports: 'Masonry'
        },
        // imagesLoaded for Masonry
        imagesloaded: {
            exports: 'imagesloaded'
        },
        bootstrap: {
            deps: ['jquery']
        }
    },
    baseUrl: '/static',
    paths: {
        underscore: 'lib/underscore-1.5.2.min',
        jquery: 'lib/jquery-1.10.2.min',
        backbone: 'lib/backbone-1.1.0.min',
        marionette: 'lib/backbone.marionette-1.5.1.min',
        handlebars: 'lib/handlebars-runtime.1.3.0.min',
        masonry: 'lib/masonry-3.1.5.min',
        imagesloaded: 'lib/imagesloaded.pkgd.min',
        js: 'js',
        build: 'build',
        bootstrap: 'lib/bootstrap.min'
    }
});

require(['js/app', 'js/helpers'], function(app, helpers) {
    helpers.register();
    app.startModule();
});
