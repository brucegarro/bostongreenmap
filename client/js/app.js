define(['backbone', 'marionette', 'build/templates', 'bootstrap', 'masonry'], function(Backbone, Marionette, templates) {
    var app = new Marionette.Application(),
        router;

    $('.carousel').carousel({
        interval: 2000
    });

    app.addRegions({
        navRegion: '#header',
        mainRegion: '#content-area',
        footerRegion: '#footer'
    });

    // Models
    var Park = Backbone.Model.extend({
        initialize: function (params) {
          this.park_slug = params.park_slug
			try {
				this.thumbnail_src = this.attributes.images[0].src;
			} catch (e) {
				this.thumbnail_src = '';
			}
			if (typeof params.images === 'undefined') {
				params.images = [];
			}
			if (params.images.length <= 0) {
				var img = new Image();
				img.src = 'http://www.thepuppyapi.com/puppy?format=src&' + Math.random();
				params.images[0] = {
					// src: 'http://fc04.deviantart.net/fs70/i/2012/102/4/9/beagle_by_ninaandbeagle-d4vvx4u.jpg'
					src: img.src
				}
			}
/*
		  console.log(params);
		  console.log(this.images);
console.log(this.name);
console.log(this.owner);
console.log(this);
*/
        },
        defaults: {
            'title': ''
        },
        url: function() {
            return window.location.origin + '/parks/search/?slug=' + this.park_slug;
        },
        parse: function (response) {
          var attributes = {};
          _.each(response, function(attribute, key) {
            _.each(attribute, function(attribute, key) {
              attributes[key] = attribute;
            })
          });
          return attributes;
        },
        render: function() {

        }
    });

    var SearchModel = Backbone.Model.extend({
        url: function() {
            return window.location.origin + '/parks/get_neighborhoods_and_activities_list/';
        },
        parse: function(response) {
            var data = {'neighborhoods': [], 'activities': []};
            _.each(response.neighborhoods, function(neighborhood) {
                data.neighborhoods.push({'id': neighborhood.id, 'name': neighborhood.name});
            });
            _.each(response.activities, function(activity) {
                data.activities.push({'id': activity.id, 'name': activity.name});
            });
            return data;
        }
    });

    var ParksCollection = Backbone.Collection.extend({
        model: Park,
        initialize: function(params) {
            this.queryString = params.queryString
        },
        url: function() {
            var search_url = 'parks/search?' + this.queryString;
            return search_url;
        },
        parse: function(response) {
            if (!response) {
                alert('no data for that search!');
            }
            var parks = _.map(_.values(response.parks), function(park) {
                return new Park(park);
            });
            return parks;
        }
    });

    Park.Collection = ParksCollection;
    
    // Views
    var HeaderView = Marionette.ItemView.extend({
        events: {
            'click #nav-about': 'goToAbout',
            'click #nav-mission': 'goToMission',
            'click #nav-index': 'goToIndex',
            'click #nav-contact': 'goToContact'
        },
        template: templates['templates/headerView.hbs'],
        tagName: 'div',
        className: 'header',
        goToAbout: function(evt) {
            Backbone.history.navigate('about', {'trigger': true});
        },
        goToMission: function(evt){
            Backbone.history.navigate('mission', {'trigger': true});
        },
        goToContact: function(evt) {
            Backbone.history.navigate('contact', {'trigger': true});
        },
        goToIndex: function(evt) {
            Backbone.history.navigate('', {'trigger': true});
        }
    });

    var SearchView = Marionette.ItemView.extend({
        template:templates['templates/search.hbs'],
        tagName: 'div',
        events: {
            'click .gobutton': 'doSearch'
        },
        doSearch: function() {
            var neighborhood_id = $('#neighborhoods option:selected').val(),
                activity_id = $('#facility__activity option:selected').val(),
                search_url = [
                    'results/',
                    'no_map=true',
                    (neighborhood_id ? '&neighborhoods=' + neighborhood_id.toString() : ''),
                    (activity_id ? '&facility__activity=' + activity_id.toString() : '')
                ].join('');
            Backbone.history.navigate(search_url, {'trigger': true});
        }
    });

    var FooterView = Marionette.ItemView.extend({
        template: templates['templates/footer.hbs'],
        tagName: 'div',
        className: 'footer'
    });

    var AboutView = Marionette.ItemView.extend({
        template: templates['templates/about.hbs'],
        tagName: 'div',
        className: 'about'
    });

    var MissionView = Marionette.ItemView.extend({
        template: templates['templates/mission.hbs'],
        tagName: 'div',
        className: 'mission'
    });
    
    var ContactView = Marionette.ItemView.extend({
        template: templates['templates/contact.hbs'],
        tagName: 'div',
        className: 'contact'
    });

    var ParkView = Marionette.ItemView.extend({
        template: templates['templates/park.hbs'],
        tagName: 'div',
        className: 'detail'
    });

    var ResultItemView = Marionette.ItemView.extend({
        template: templates['templates/resultItem.hbs']
    });

    var ResultsView = Marionette.CompositeView.extend({
        template: templates['templates/results.hbs'],
        itemView: ResultItemView,
        tagname: 'div',
        className: 'results',
		id: 'results'
    });


    app.Router = Backbone.Router.extend({
        routes: {
            '': 'home',
            'about': 'about',
            'mission': 'mission',
            'contact': 'contact',
            'results/:queryString': 'results',
            'parks/:park_slug/': 'park'
        },
        home: function() {
            var searchModel = new SearchModel();
            var searchView = 
            searchModel.once('sync', function() {
                app.getRegion('mainRegion').show(new SearchView({'model': searchModel}));
            });
            searchModel.fetch();
        },
        about: function() {
            app.getRegion('mainRegion').show(new AboutView());
        },
        mission: function () {
            app.getRegion('mainRegion').show(new MissionView());
        },
        contact: function () {
            app.getRegion('mainRegion').show(new ContactView());
        },
        results: function(queryString) {
            var results = new ParksCollection({'queryString': queryString});
            results.fetch({'success': function() {
                app.getRegion('mainRegion').show(new ResultsView({'collection': results}));
				var container = document.querySelector('#results');
				var msnry = new Masonry(container, {
					columnWidth: 200,
					itemSelector: '.result-item'
				});

            }});
        },
        park: function (park_slug) {
            console.log("fired!");
            var park = new Park({'park_slug': park_slug});
            park.fetch({'success': function() {
                app.getRegion('mainRegion').show(new ParkView({'model': park }));
            }});
            park.fetch();
        }
    });

    app.addInitializer(function(options) {
        app.getRegion('navRegion').show(new HeaderView());
        app.getRegion('footerRegion').show(new FooterView());

        router = new app.Router();
        app.execute('setRouter', router);
        Backbone.history.start();
        // Backbone.history.navigate('', {'trigger': true});
    });

    return {
        startModule: function(done) {
            app.start({});
        }
    };
});

