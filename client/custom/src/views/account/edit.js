define('custom:views/account/edit', ['views/edit'], function (Dep) {
    return Dep.extend({

        actividadesPorSector: {
            'Administración': ['Ayuntamientos', 'Diputaciones', 'Xunta de Galicia', 'Organismos colaboradores', 'Embajadas'],
            'Asociaciones': ['Empresariales', 'Territoriales', 'Sectoriales', 'Denominaciones de Origen', 'Indicación Geográfica Protegida', 'Hostelería'],
            'Educación': ['Colegios Públicos', 'Colegios Concertados', 'Colegios Privados', 'Institutos', 'Centros de Formación Profesional', 'Escuelas de Hostelería', 'Centros de estudios / Academias'],
            'Hostelería': ['Restaurantes', 'Catering', 'Comedores colectivos', 'Restaurantes gallegos', 'Bar', 'Cafetería'],
            'Turismo': ['Agencias de viaje', 'Guías turísticos', 'Agencias clientes', 'Agencias potenciales'],
	    'Empresas': ['Agrícolas', 'Alimentación', 'Asesorías', 'Autoescuelas', 'Automoción', 'Bodegas', 'Cárnicas', 'Clínicas / Hospitales', 'Construcción', 'Consultoras', 'Distribuidores', 'Hoteles y Hostales', 'Inmobiliarias', 'Laboratorios', 'Notarías', 'Pescados y mariscos', 'Quesos'],
	    'Para colocar': ['Tarjetas', 'Motor de reservas']
        },

        afterRender: function () {
            Dep.prototype.afterRender.call(this);

            var self = this;

            var filtrarActividades = function (sector) {
                var opciones = self.actividadesPorSector[sector] || [];
                var $actividad = self.$el.find('[data-name="cActividad"] select');

                if (!$actividad[0] || !$actividad[0].selectize) return;

                var selectize = $actividad[0].selectize;

                // Limpiar opciones y valor actual
                selectize.clearOptions();
                selectize.clear();

                // Añadir opciones del sector
                opciones.forEach(function (op) {
                    selectize.addOption({value: op, text: op});
                });

                selectize.refreshOptions(false);
            };

            // Escuchar cambios en Sector
            var $sector = self.$el.find('[data-name="cSector"] select');
            if ($sector[0] && $sector[0].selectize) {
                $sector[0].selectize.on('change', function (val) {
                    self.model.set('cActividad', '');
                    filtrarActividades(val);
                });
            }

            // Aplicar al cargar si ya hay sector seleccionado
            var sectorInicial = self.model.get('cSector');
            if (sectorInicial) {
                filtrarActividades(sectorInicial);
            }

            // CP autocomplete
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

            var $cp = self.$el.find('[data-name="cCdigoPostal"] input');
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
