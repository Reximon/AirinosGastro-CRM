define('custom:views/fields/actividad-enum', ['views/fields/enum'], function (Dep) {
    return Dep.extend({

        actividadesPorSector: {
            'Administración': ['Ayuntamientos', 'Diputaciones', 'Xunta de Galicia', 'Organismos colaboradores', 'Embajadas'],
            'Asociaciones': ['Empresariales', 'Territoriales', 'Sectoriales', 'Denominaciones de Origen', 'Indicación Geográfica Protegida', 'Hostelería'],
            'Educación': ['Colegios Públicos', 'Colegios Concertados', 'Colegios Privados', 'Institutos', 'Centros de Formación Profesional', 'Escuelas de Hostelería', 'Centros de estudios / Academias'],
            'Hostelería': ['Restaurantes', 'Catering', 'Comedores colectivos', 'Restaurantes gallegos', 'Bar', 'Cafetería'],
            'Turismo': ['Agencias de viaje', 'Guías turísticos', 'Agencias de recepción', 'Agencias emisoras'],
            'Empresas': ['Agrícolas', 'Alimentación', 'Asesorías', 'Autoescuelas', 'Automoción', 'Bodegas', 'Cárnicas', 'Clínicas / Hospitales', 'Construcción', 'Consultoras', 'Distribuidores', 'Hoteles y Hostales', 'Inmobiliarias', 'Laboratorios', 'Notarías', 'Pescados y mariscos', 'Quesos'],
            'Para colocar': ['Tarjetas', 'Motor de reservas']
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
            var sector = this.model.get('cSector');
            var opciones = this.actividadesPorSector[sector] || [];
            this.params.options = [''].concat(opciones);
            this.translatedOptions = {};
            this.params.options.forEach(function (op) {
                this.translatedOptions[op] = op;
            }, this);
        }
    });
});
