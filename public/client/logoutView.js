Shortly.LogoutView = Backbone.View.extend({
  className: 'logout',

  template: Templates['logout'],

  render: function() {
    this.$el.html(this.template());
    return this;
  }
});
