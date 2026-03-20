define('custom:views/account/edit', ['views/edit'], function (Dep) {
    return Dep.extend({
        afterRender: function () {
            Dep.prototype.afterRender.call(this);

            var self = this;
            var lastCp = null;

            var checkCp = function (cp) {
                if (!cp || cp.length !== 5) return;
                if (cp === lastCp) return;
                lastCp = cp;

                fetch('/api/cp-lookup.php?cp=' + cp)
                    .then(function (r) { return r.json(); })
                    .then(function (data) {
                        if (!data.error) {
                            self.model.set('cProvincia', data.provincia);
                            self.model.set('cPoblacin', data.poblacion);
                        }
                    });
            };

            var $cp = this.$el.find('[data-name="cCdigoPostal"] input');
            $cp.on('input', function () {
                var val = $(this).val().replace(/\D/g, '');
                if (val.length === 5) {
                    checkCp(val);
                } else {
                    lastCp = null;
                }
            });
        }
    });
});
