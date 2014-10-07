Shortly.LoginView = Backbone.View.extend({
  className: 'login',

  template: Templates['login'],

  render: function() {
    // this.model.attributes maybe
    this.$el.html(this.template);
    return this;
  }
});
