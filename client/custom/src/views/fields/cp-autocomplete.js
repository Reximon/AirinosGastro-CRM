define('custom:views/fields/cp-autocomplete', ['views/fields/varchar'], function (Dep) {
    return Dep.extend({

        afterRender: function () {
            Dep.prototype.afterRender.call(this);

            var self = this;
            var lastCp = null;

            var $cp = this.$el.find('input');

            $cp.on('input', function () {
                var val = $(this).val().replace(/\D/g, '');
                lastCp = null;
                if (val.length === 5) {
                    fetch('/api/cp-lookup.php?cp=' + val)
                        .then(function (r) { return r.json(); })
                        .then(function (data) {
                            if (!data.error) {
                                self.model.set('cProvincia', data.provincia);
                                self.model.set('cPoblacin', data.poblacion);
                            }
                        });
                }
            });
        }
    });
});
