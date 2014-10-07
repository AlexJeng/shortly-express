Shortly.LoginView = Backbone.View.extend({
  className: 'login',

  template: Templates['login'],

  render: function() {
    console.log(this);
    // this.model.attributes maybe
    // append(this.template);
    debugger;
    this.$el.append(this.template());
    return this;
  }
});
