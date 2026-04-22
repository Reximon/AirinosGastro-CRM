define('custom:views/fields/actividad-enum', ['views/fields/enum'], function (Dep) {
    return Dep.extend({
        actividadesPorSector: {
            'Administración': ['Ayuntamientos', 'Diputaciones', 'Xunta de Galicia', 'Organismos colaboradores', 'Embajadas'],
            'Asociaciones': ['Empresariales', 'Territoriales', 'Sectoriales', 'Culturales', 'Denominaciones de Origen', 'Indicación Geográfica Protegida', 'Hostelería'],
            'Educación': ['Colegios Públicos', 'Colegios Concertados', 'Colegios Privados', 'Institutos', 'Centros de Formación Profesional', 'Escuelas de Hostelería', 'Centros de estudios / Academias'],
            'Hostelería': ['Restaurantes', 'Catering', 'Comedores colectivos', 'Restaurantes gallegos', 'Bar', 'Cafetería'],
            'Turismo': ['Agencias de viaje', 'Guías turísticos', 'Autocares', 'Agencias clientes', 'Agencias potenciales'],
            'Empresas': ['Agrícolas', 'Alimentación', 'Asesorías', 'Autoescuelas', 'Automoción', 'Bodegas', 'Cárnicas', 'Clínicas / Hospitales', 'Construcción', 'Consultoras', 'Distribuidores', 'Hoteles y Hostales', 'Inmobiliarias', 'Laboratorios', 'Notarías', 'Pescados y mariscos', 'Quesos'],
            'Para colocar': ['Tarjetas', 'Motor de reservas']
        },
        getAllActividades: function () {
            var todas = [];
            var self = this;
            Object.keys(this.actividadesPorSector).forEach(function (sector) {
                self.actividadesPorSector[sector].forEach(function (actividad) {
                    if (todas.indexOf(actividad) === -1) {
                        todas.push(actividad);
                    }
                });
            });
            return todas.sort();
        },
        render: function () {
            if (this.isSearchMode()) {
                this.params.options = this.getAllActividades();
                this.translatedOptions = {};
                var self = this;
                this.params.options.forEach(function (op) {
                    self.translatedOptions[op] = op;
                });
            }
            return Dep.prototype.render.call(this);
        },
        setup: function () {
            Dep.prototype.setup.call(this);
            this.listenTo(this.model, 'change:cSector', function (model, value) {
                this.model.set('cActividad', '');
                this.params.options = [''].concat(this.actividadesPorSector[value] || []);
                this.translatedOptions = {};
                this.params.options.forEach(function (op) {
                    this.translatedOptions[op] = op;
                }, this);
                if (this.isEditMode()) {
                    this.reRender();
                }
            }, this);
        },
        setupOptions: function () {
            if (this.isSearchMode()) {
                this.params.options = this.getAllActividades();
                this.translatedOptions = {};
                var self = this;
                this.params.options.forEach(function (op) {
                    self.translatedOptions[op] = op;
                });
                return;
            }
            var sector = this.model.get('cSector');
            var opciones = this.actividadesPorSector[sector] || [];
            this.params.options = [''].concat(opciones);
            this.translatedOptions = {};
            this.params.options.forEach(function (op) {
                this.translatedOptions[op] = op;
            }, this);
        },
        afterRender: function () {
            Dep.prototype.afterRender.call(this);
            if (this.isSearchMode()) return;
            var sector = this.model.get('cSector');
            if (sector && this.isEditMode()) {
                var opciones = this.actividadesPorSector[sector] || [];
                this.params.options = [''].concat(opciones);
                var selectize = this.$el.find('select')[0] && this.$el.find('select')[0].selectize;
                if (selectize) {
                    selectize.clearOptions();
                    opciones.forEach(function (op) {
                        selectize.addOption({value: op, text: op});
                    });
                    selectize.refreshOptions(false);
                }
            }
        }
    });
});
