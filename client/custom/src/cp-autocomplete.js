define('custom:cp-autocomplete', [], function () {
    return {
        init: function () {
            this.listenTo(this.model, 'change:cCdigoPostal', function () {
                var cp = this.model.get('cCdigoPostal');
                if (!cp || cp.length !== 5) return;

                fetch('/api/cp-lookup.php?cp=' + cp)
                    .then(function (r) { return r.json(); })
                    .then(function (data) {
                        if (!data.error) {
                            this.model.set('cProvincia', data.provincia);
                            this.model.set('cPoblacin', data.poblacion);
                        }
                    }.bind(this));
            }.bind(this));
        }
    };
});
