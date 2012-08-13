
/**
 * renders a form given fields
 *
 * var form = new cdb.forms.Form({
 *  form_data: [
      {
         name: 'Marker Fill',
         form: {
           'polygon-fill': {
                 type: 'color' ,
                 value: '#00FF00'
            },
            'polygon-opacity': {
                 type: 'opacity' ,
                 value: 0.6
            }
        }
      }
    ]
 * });
 */

cdb.forms.Form = cdb.core.View.extend({
 tagName: 'ul',

 widgets: {
   'color': 'Color',
   'opacity': 'Opacity',
   'number': 'Spinner',
   'width': 'Width'
 },

 field_template: _.template('<li><span><%=name %></span><span class="field"></li>'),

 initialize: function() {
   var self = this;
   this.form_data = this.options.form_data;

   var default_data = {};
   _(this.form_data).each(function(field) {
     _(field.form).each(function(v, k) {
       default_data[k] =  v.value;
     });
   });
   this.model.set(default_data);
 },

 _renderField: function(field) {
   var self = this;
   var e = $(this.field_template({ name: field.name }));
   _(field.form).each(function(form, name) {

     // create the class for this data type and add it to view
     var Class = window.cdb.forms[self.widgets[form.type]];
     if(Class) {
       var v = new Class({
         property: name,
         model: self.model
       });
       e.find('.field').append(v.render().el);
       self.addView(v);
     } else {
       cdb.error.log("field class not found "  + form.type);
     }
   });
   return e;
 },

 render: function() {
   var self = this;
   _(this.form_data).each(function(field) {
     self.$el.append(self._renderField(field));
   });
   return this;
 }

});
