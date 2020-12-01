new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.turnos = []
        },
        atacar: function () {
            var dano = this.calcularHeridas(this.rangoAtaque)
            this.saludMonstruo -= dano;
            this.turnos.unshift({
                esJugador: true,
                text: `El jugador golpea al monstruo por  ${dano}` 
            });

            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        ataqueEspecial: function () {
            var dano = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= dano;
            let evento = {
                esJugador: true,
                text: `El jugador realiza un golpe especial al jugador por ${dano}` 
            }
            this.registrarEvento(evento)
            if (this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
      
            if (this.saludJugador <= 90) {
                this.saludJugador += 10;
                let evento = {
                    esJugador: true,
                    text: 'Te curaste en un 10 de HP',
                }
                this.registrarEvento(evento)
            } else  {
                let evento = {
                    esJugador: true,
                    text: 'Salud completa no te podes curar',
                }
                this.registrarEvento(evento)
            }
            this.ataqueDelMonstruo();
        },

        registrarEvento(evento) {
            this.turnos.unshift(evento);
        },
        
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            var dano = this.calcularHeridas(this.rangoAtaqueDelMonstruo)
            this.saludJugador -= dano;
            let evento = {
                esJugador: false,
                text: `El monstruo golpea al jugador por ${dano}` 
            };

            this.registrarEvento(evento);

            if (this.verificarGanador()) {
                return;
            }
        },

        calcularHeridas: function (rango) {
            let min = rango[0]
            let max = rango[1]
            return Math.max(Math.floor(Math.random() * max) + 1, min)

        },
        verificarGanador: function () {
            if (this.saludMonstruo <= 0) {
                if (confirm('Ganaste! Desea jugar de nuevo?')) {
                    this.empezarPartida();
                } else {
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            } else if (this.saludJugador <= 0) {
                if (confirm('Perdiste! Jugar de nuevo?')) {
                    this.empezarPartida();
                } else {
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            }
            return false;

        },
        cssEvento(turno) {
            //Este return de un objeto es prque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});