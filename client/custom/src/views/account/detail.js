define('custom:views/account/detail', ['views/detail'], function (Dep) {
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

            var self = this;

            this.listenTo(this.model, 'change:cSector', function () {
                self.model.set('cActividad', '');
            });
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);

            var self = this;

            var filtrarActividades = function (sector) {
                var opciones = self.actividadesPorSector[sector] || [];
                var $actividad = self.$el.find('[data-name="cActividad"] select');
                if (!$actividad[0] || !$actividad[0].selectize) return;

                var selectize = $actividad[0].selectize;
                selectize.clearOptions();
                selectize.clear();
                opciones.forEach(function (op) {
                    selectize.addOption({value: op, text: op});
                });
                selectize.refreshOptions(false);
            };

            var $sector = self.$el.find('[data-name="cSector"] select');
            if ($sector[0] && $sector[0].selectize) {
                $sector[0].selectize.on('change', function (val) {
                    self.model.set('cActividad', '');
                    filtrarActividades(val);
                });
            }

            var sectorInicial = self.model.get('cSector');
            if (sectorInicial) {
                filtrarActividades(sectorInicial);
            }
        }
    });
});
