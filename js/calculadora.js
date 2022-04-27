// Const
const JSON_DATES = "https://especialess3.lanacion.com.ar/22/03/mundial2022-fixture/data/fechas.json"
const JSON_MATCHES = "https://especialess3.lanacion.com.ar/22/03/mundial2022-fixture/data/diccEquipos.json"
const GROUP = "C";
//_____________

// Models
var teams = [];
var matches = [];
//_____________


// call JSON function
var getJSON = function(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onload = function() {
        var status = xhr.status;
        if (status === 200) {
            callback(null, xhr.response);
        } else {
            callback(status, xhr.response);
        }
    };
    xhr.send();
};

//call JSON FECHAS
getJSON(JSON_DATES,
    function(err, dataMatches) {
        if (err !== null) {
            alert('Error: ' + err);
        } else {
            teamListC = []; // Lista de códigos

            for (var i = 0; i < dataMatches.length; i++) {
                let match = dataMatches[i];
                if (match.grupo.includes("" + GROUP + "")) {
                    if (teamListC.indexOf(match.equipoA) == -1)
                        teamListC.push(match.equipoA);
                    if (teamListC.indexOf(match.equipoB) == -1)
                        teamListC.push(match.equipoB);

                    //populate Matches
                    matches.push({
                        "teamA": match.equipoA,
                        "teamB": match.equipoB,
                        "fecha": match.fecha,
                        "goalsA": 0,
                        "goalsB": 0,
                        "played": false
                    });
                }
            }

            //populate Teams
            for (var i = 0; i < teamListC.length; i++) {
                teams.push({
                    "code": teamListC[i],
                    "name": "",
                    "pts": 0,
                    "pj": 0,
                    "g": 0,
                    "e": 0,
                    "p": 0,
                    "gc": 0,
                    "gf": 0,
                    "dg": 0
                });
            }


            //call JSON DICCIONARIO EQUIPOS
            getJSON(JSON_MATCHES,
                function(err, dataTeamsNames) {
                    if (err !== null) {
                        alert('Error: ' + err);
                    } else {
                        for (var i = 0; i < teams.length; i++) {
                            for (var j = 0; j < dataTeamsNames.length; j++) {
                                //console.log(teams[i]);
                                if (teams[i].code == dataTeamsNames[j].grupo) {
                                    teams[i].name = dataTeamsNames[j].nombre;
                                }
                            }
                        }

                        //YA CARGÓ TODO 
                        orderCriteria(teams, matches);
                        showTable(teams);
                        showMatches();
                    }
                }
            );
        }
    });







//ORDENAR RESULTADOS
function orderCriteria(teamsData, matchesData) {
    // ordenar por todos los criterios
    teamsData.sort((a, b) => {

        //ordenar por puntos
        if (a.pts > b.pts)
            return -1;
        else if (a.pts < b.pts)
            return 1;
        else {
            // diferencia de gol
            if (a.dg > b.dg)
                return -1;
            else if (a.dg < b.dg)
                return 1;
            else {
                //goles a favor
                if (a.gf > b.gf)
                    return -1;
                else if (a.gf < b.gf)
                    return 1;
                else {
                    // quieén ganó el partido entre A y B????
                    for (var i = 0; i < matchesData.length; i++) {
                        if (matchesData[i].teamA == a.code && matchesData[i].teamB == b.code) {
                            // encontré el partido que jugaron
                            if (matchesData[i].goalsA > matchesData[i].goalsB)
                                return -1; // ganó el A
                            else if (matchesData[i].goalsA < matchesData[i].goalsB)
                                return 1; // ganó el B
                            else {
                                // empataron, ordeno por nombre
                                if (a.name == b.name)
                                    return 0;
                                if (a.name < b.name)
                                    return -1;
                                else
                                    return 1;
                            }
                        } else if (matchesData[i].teamB == a.code && matchesData[i].teamA == b.code) {
                            // encontré el partido que jugaron
                            if (matchesData[i].goalsA > matchesData[i].goalsB)
                                return 1; // ganó el B
                            else if (matchesData[i].goalsA < matchesData[i].goalsB)
                                return -1; // ganó el A                             
                            else {
                                // empataron, ordeno por nombre
                                if (a.name == b.name)
                                    return 0;
                                if (a.name < b.name)
                                    return -1;
                                else
                                    return 1;
                            }
                        }
                    }
                }
            }
        }

    });

}

// MUESTRO TABLA DE POSICIONES
function showTable(teamsData) {

    for (var i = 0; i < teamsData.length; i++) {
        let posicion = "posicion" + i;
        document.getElementById(posicion).innerHTML =
            "<div class='column is-2 is-3-mobile has-text-left'>" + teamsData[i].name + "</div>" +
            "<div class='column is-ss-heavy'>" + teamsData[i].pts + "</div>" +  // PUNTOS TOTALES
            "<div class='column'>" + teamsData[i].pj + "</div>" +               // PARTIDOS JUGADOS
            "<div class='column is-ss-heavy'>" + teamsData[i].g + "</div>" +    // PARTIDOS GANADOS
            "<div class='column is-ss-heavy'>" + teamsData[i].e + "</div>" +    // PARTIDOS EMPATADOS
            "<div class='column is-ss-heavy'>" + teamsData[i].p + "</div>" +    // PARTIDOS PERDIDOS
            "<div class='column'>" + teamsData[i].gf + "</div>" +               // GOLES A FAVOR
            "<div class='column'>" + teamsData[i].gc + "</div>" +               // GOLES EN CONTRA
            "<div class='column'>" + teamsData[i].dg + "</div>";                //  DG: DIFERENCIA DE GOL (GF - GC) 
    }

    // TODO
    //console.log("ordenado:");
    //console.log(teamsData);

}


// CALCULAR PUNTOS
function calculatePoints() {
    console.log("Recalculo");
    // borro datos
    for (var i = 0; i < teams.length; i++) {
        teams[i].pts = 0;
        teams[i].pj = 0;
        teams[i].g = 0;
        teams[i].e = 0;
        teams[i].p = 0;
        teams[i].gc = 0;
        teams[i].gf = 0;
        teams[i].dg = 0;
    }

    // calculo puntos, gf gc
    for (var i = 0; i < matches.length; i++) {

        if (matches[i].played == true) {

            var teamIndexA = getTeamIndexByCode(matches[i].teamA);
            var teamIndexB = getTeamIndexByCode(matches[i].teamB);
            teams[teamIndexA].gf += matches[i].goalsA;
            teams[teamIndexA].gc += matches[i].goalsB;
            teams[teamIndexB].gc += matches[i].goalsA;
            teams[teamIndexB].gf += matches[i].goalsB;

            if (matches[i].goalsA > matches[i].goalsB) {
                //console.log("gano A");
                teams[teamIndexA].pts += 3;
                teams[teamIndexA].g += 1;
                teams[teamIndexB].p += 1;
            } else if (matches[i].goalsA < matches[i].goalsB) {
                //console.log("gano b");
                teams[teamIndexB].pts += 3;
                teams[teamIndexA].p += 1;
                teams[teamIndexB].g += 1;
            } else {
                //console.log("empate");          
                teams[teamIndexA].pts += 1;
                teams[teamIndexB].pts += 1;
                teams[teamIndexA].e += 1;
                teams[teamIndexB].e += 1;
            }

            teams[teamIndexA].pj += 1;
            teams[teamIndexB].pj += 1;
        }
    }

    // calculo diferencia
    for (var i = 0; i < teams.length; i++) {
        teams[i].dg = teams[i].gf - teams[i].gc;
    }

    console.log(teams);

}


// CHEQUEAR SI ES NRO +
function isPositiveInteger(str) {
    if (typeof str !== 'string') {
        return false;
    }
    const num = Number(str);
    if (Number.isInteger(num) && num >= 0) {
        return true;
    }
    return false;
}



// REACTIVIDAD
function goalsChangedEvent() {
    const selectGoals = document.querySelectorAll('input');

    //RESETEO A NO JUGADO
    for (var i = 0; i < matches.length; i++) {
        matches[i].played = false;
        matches[i].goalsA = -1;
        matches[i].goalsB = -1;
    }

    for (var i = 0; i < selectGoals.length; i++) {
        var parts = selectGoals[i].id.split('-');
        var index = parts[0];

        // no goles negativos, ni más de 20
        if (selectGoals[i].value < 0 || selectGoals[i].value > 20)
            selectGoals[i].value = "0";

        //de quien son los goles
        if (parts[2] == "golesA") {
            if (isPositiveInteger(selectGoals[i].value))
                matches[index].goalsA = parseInt(selectGoals[i].value);
            else
                matches[index].goalsA = -1;
        } else {
            if (isPositiveInteger(selectGoals[i].value))
                matches[index].goalsB = parseInt(selectGoals[i].value);
            else
                matches[index].goalsB = -1;
        }
        // PARTIDO FUE JUGADO
        if (matches[index].goalsA >= 0 && matches[index].goalsB >= 0) {
            matches[index].played = true;
        }
    }

    calculatePoints();
    orderCriteria(teams, matches);
    showTable(teams);
}


// EQUIPO POR CÓDIGO
function getTeamIndexByCode(code) {
    for (var i = 0; i < teams.length; i++) {
        if (teams[i].code == code)
            return i;
    }
    return -1;
}

//EQUIPO POR NOMBRE
function getTeamNamebyCode(code) {
    for (var i = 0; i < teams.length; i++) {
        //console.log(teams[i].code);
        if (teams[i].code == code) {
            return teams[i].name;
        }
    }
}

//INPUT ESPERA
var typewatch = function() {
    var timer = 0;
    return function(callback, ms) {
        clearTimeout(timer);
        timer = setTimeout(callback, ms);
    }
}();


// MOSTAR FECHAS DE PARTIDOS CON INPUT
function showMatches() {

    for (var i = 0; i < matches.length; i++) {
        const partidodiv = document.createElement('div');
        partidodiv.classList.add("partido");

        //FECHA
        var fecha = matches[i].fecha;
        var partsfecha = fecha.split('-');
        var anio = partsfecha[0];
        var dia = partsfecha[2];
        var nombreDelDia = fecha => ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', ][new Date(fecha).getDay()];
        var fechanombredia = nombreDelDia(fecha);
        var nombreDelMes = fecha => ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre', ][new Date(fecha).getMonth()];
        var mes = nombreDelMes(fecha);
        //FECHA

        var titulo;
        if (i % 2 == 0) {
            titulo = "<div class='date header'>" + fechanombredia + " " + dia + " " + mes + " " + anio + "</div> <hr>";
        } else {
            titulo = "";
        }

        partidodiv.innerHTML = `
           ${titulo}
           <div class="is-bg-rosa"> 
           <div class="equipo1 columns"> <div class="column has-text-left">` + getTeamNamebyCode(matches[i].teamA) + ` </div> <div class="column is-2 has-text-right"> <input class="is-ss-heavy" id="${i}-${matches[i].teamA}-golesA" type="number" min="0" max="20" value="" onKeyUp="typewatch(goalsChangedEvent, 1000);"> </div> </div>
           <div class="equipo2 columns"> <div class="column has-text-left">` + getTeamNamebyCode(matches[i].teamB) + ` </div> <div class="column is-2 has-text-right"> <input class="is-ss-heavy" id="${i}-${matches[i].teamB}-golesB" type="number" min="0" max="20" value="" onKeyUp="typewatch(goalsChangedEvent, 1000);"> </div> </div>
          </div>`;
        let nropartido = "partido" + i;
        document.getElementById(nropartido).appendChild(partidodiv);
    }

}