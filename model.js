
var User = Backbone.Model.extend({
    url: '/user'
});

var af83 = Backbone.Collection.extend({
    url: '/users',
    model: User,
    comparator: function(user) {
        return user.get('username');
    }
});

var ViewUser = Backbone.View.extend({
    template: _.template("Hello <%= username %>"),
    tagName: 'li',
    events: {
        'click': 'alert'
    },
    initialize: function() {
        this.model.bind('change:username', _.bind(this.render, this));
    },
    render: function() {
        window.user = this.model;
        $(this.el).empty().append(this.template(this.model.toJSON()));
    },
    alert: function() {
        alert(this.model.get('username'));
    }
});

var ViewUsers = Backbone.View.extend({
    tagName: 'ul',
    initialize: function() {
        var self = this;
        this.collection.bind('refresh', _.bind(this.render, this));
        this.collection.bind('add', _.bind(this.add, this));
    },

    add: function(user) {
        var view = new ViewUser({model: user});
        view.render();
        $(this.el).append(view.el);
    },

    render: function() {
        this.collection.each(_.bind(this.add, this));
        window.col = this.collection;
    }
});

var MainController = Backbone.Controller.extend({
    routes: {
        "":         "index",
    },

    index: function() {
        var users = new af83();
        var view = new ViewUsers({collection: users});
        $('body').append(view.el);
        users.fetch();
        window.users = users;
    }
});
$(document).ready(function() {
    new MainController();
    Backbone.history.start();
});
