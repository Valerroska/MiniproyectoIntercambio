/* ======================================================
   VARIABLES GLOBALES
====================================================== */

let participantes = JSON.parse(localStorage.getItem("participantes")) || [];
let excluidos = JSON.parse(localStorage.getItem("excluidos")) || [];
let exclusionesDrag = JSON.parse(localStorage.getItem("exclusionesDrag")) || [];
let presupuestoSeleccionado = null;
let exclusionesTemp = [];

/* ======================================================
   DOM CONTENT LOADED
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ===== Render inicial ===== */
    exclusionesNombres();
    renderParticipantes();
    configurarPresupuesto();
    crearFechas();
    renderZonaArrastre();
    renderParticipantesExcluidos();

    /* ===== Botones principales ===== */
    document.getElementById("btnAgregar").addEventListener("click", agregarParticipante);
    document.getElementById("btnGuardarCosto").addEventListener("click", guardarPresupuesto);
    document.getElementById("agregarNombre").addEventListener("click", agregarNombre);
    document.getElementById("confirmarExclusiones").addEventListener("click", confirmarExclusiones);

    /* ===== Exclusiones ===== */
    document.getElementById("hechoBtn").addEventListener("click", guardarExclusiones);
    document.getElementById("cancelarBtn").addEventListener("click", cancelarExclusiones);

    /* ===== Calendario ===== */
    document.getElementById("fechaCalendario").addEventListener("click", mostrarCalendario);
    document.getElementById("cancelarFecha").addEventListener("click", cancelarFecha);
    document.getElementById("aceptarFecha").addEventListener("click", aceptarFecha);

    /* ======= Resultado Sorteo ==========*/
    document.getElementById("btnSorteo").addEventListener("click", resultadoSorteo);

    /* ===== Fechas rápidas ===== */
    document.querySelectorAll("#fecha1, #fecha2, #fecha3").forEach(fecha => {
        fecha.addEventListener("click", function () {
            const fechaSeleccionada = this.textContent;
            localStorage.setItem("fechaIntercambio", fechaSeleccionada);
            alert("Fecha guardada correctamente: " + fechaSeleccionada);
        });
    });

    
});


/* ======================================================
   PRESENTACIÓN
====================================================== */

function iniciarApp() {
    document.getElementById("presentacion").style.display = "none";
}


/* ======================================================
   ORGANIZADOR
====================================================== */

function agregarNombre() {
    const organizadorGuardado = localStorage.getItem("organizador");
    const nombreInput = document.getElementById("inputNombreOrganizador");
    const nombre = nombreInput.value.trim();
    const check = document.querySelector("#zonaOrganizador input[type='checkbox']");
    const checkMarcado = check.checked;

    if(organizadorGuardado) {
        alert("Ya existe un organizador registrado: " + organizadorGuardado); 
        nombreInput.value = "";
        check.checked = false;
        return;
    }
    
    if (nombre === "") {
        alert("Por favor, ingresa un nombre");
        return;
    }

    localStorage.setItem("organizador", nombre);
    localStorage.setItem("incluirOrganizador", checkMarcado);

    if (checkMarcado) {
        if (!participantes.includes(nombre)) {
            participantes.push(nombre);
            localStorage.setItem("participantes", JSON.stringify(participantes));
            renderParticipantes();
            renderZonaIzquierda();
        }
    }

    alert("Nombre del organizador guardado correctamente: " + nombre);

    nombreInput.value = "";
    check.checked = false;
}


/* ======================================================
   PARTICIPANTES
====================================================== */

function agregarParticipante() {

    const input = document.getElementById("inputParticipante");
    const nombre = input.value.trim();

    if (!nombre) {
        alert("Ingresa un nombre");
        return;
    }

    if (participantes.includes(nombre)) {
        alert("Ya existe ese participante");
        return;
    }

    participantes.push(nombre);
    localStorage.setItem("participantes", JSON.stringify(participantes));

    input.value = "";

    renderParticipantes();
    renderZonaIzquierda();
}

function renderParticipantes() {

    const contenedor = document.getElementById("listaParticipantes");
    contenedor.innerHTML = "";

    participantes.forEach(nombre => {
        const div = document.createElement("div");
        div.textContent = nombre;
        div.className = "border p-2 mb-2";
        contenedor.appendChild(div);
    });
}




/* ======================================================
   EXCLUSIONES SI/NO
====================================================== */

function mostrarExclusiones(valor) {
    const zona = document.getElementById("zonaExclusiones");

    if (valor === true) {
        zona.style.display = "block";
        localStorage.setItem("exclusiones", "si");
    } else {
        zona.style.display = "none";
        localStorage.setItem("exclusiones", "no");
    }
}



/* ======================================================
   EXCLUIDOS
====================================================== */

function exclusionesNombres() {

    const exclusionesDiv = document.getElementById("exclusiones");
    // const exclusionesDiv = document.getElementById("participantes");
    exclusionesDiv.innerHTML = "";

    let nombres = JSON.parse(localStorage.getItem("participantes")) || [];

    nombres.forEach(nombre => {
        exclusionesDiv.innerHTML += `
            <input class="form-check-input" type="checkbox" value="${nombre}">
            <label class="form-check-label">${nombre}</label>
            <br>`;
    });
}

function guardarExclusiones() {

    const preguntar = confirm("¿Deseas guardar las exclusiones seleccionadas?");

    if (preguntar) {

        const check = document.querySelectorAll("#exclusiones input[type='checkbox']:checked");

        check.forEach(c => {
            if (!excluidos.includes(c.value)) {
                excluidos.push(c.value);
            }
        });

        localStorage.setItem("excluidos", JSON.stringify(excluidos));
        check.forEach(c => c.checked = false);
        renderParticipantesExcluidos();
        alert("Exclusiones guardadas correctamente.");

    } else {
        alert("Se eliminaron las exclusiones seleccionadas.");
    }
}

function cancelarExclusiones() {

    const check = document.querySelectorAll("#exclusiones input[type='checkbox']");
    check.forEach(c => c.checked = false);

    localStorage.removeItem("excluidos");
    alert("Se eliminaron las exclusiones seleccionadas.");
    renderParticipantesExcluidos();
}





/* ======================================================
   DRAG & DROP
====================================================== */

function renderParticipantesExcluidos() {

    const contenedor = document.getElementById("listaParticipantesExcluidos");
    contenedor.innerHTML = "";

    participantes.forEach(nombre => {

        const fila = document.createElement("div");
        fila.className = "d-flex justify-content-between align-items-center border p-2 mb-2";

        const izquierda = document.createElement("div");
        izquierda.textContent = nombre;
        izquierda.style.width = "50%";

        const derecha = document.createElement("div");
        derecha.textContent = "Soltar aquí";
        derecha.style.width = "50%";
        derecha.style.textAlign = "right";

        derecha.addEventListener("dragover", e => e.preventDefault());

        derecha.addEventListener("drop", e => {

            e.preventDefault();

            const quienExcluye = e.dataTransfer.getData("quienExcluye");

            if (!quienExcluye) return;

            if (quienExcluye === nombre) {
                alert("No puedes excluirte a ti mismo");
                return;
            }

            // 🚨 EVITAR REPETIDOS
            const yaExiste = exclusionesDrag.find(e =>
                e.quien === quienExcluye &&
                e.noPuedeRegalarA === nombre
            );

            if (yaExiste) {
                alert("Esa exclusión ya existe");
                return;
            }

            exclusionesDrag.push({
                quien: nombre,
                noPuedeRegalarA: quienExcluye
            });

            localStorage.setItem("exclusionesDrag", JSON.stringify(exclusionesDrag));

            derecha.textContent = quienExcluye + "❌";
        });

        fila.appendChild(izquierda);
        fila.appendChild(derecha);
        contenedor.appendChild(fila);
    });
}

function renderZonaArrastre() {

    const contenedor = document.getElementById("zonaArrastre");
    contenedor.innerHTML = "";

    excluidos.forEach(nombre => {

        const div = document.createElement("div");
        div.className = "badge bg-secondary m-1";
        div.textContent = nombre;
        div.draggable = true;

        div.addEventListener("dragstart", e => {
            e.dataTransfer.setData("quienExcluye", nombre);
        });

        contenedor.appendChild(div);
    });
}

function confirmarExclusiones() {

    if (exclusionesDrag.length === 0) {
        alert("No hay exclusiones configuradas.");
        return;
    }

    alert("Exclusiones confirmadas correctamente");

    console.log("Exclusiones guardadas:", exclusionesDrag);
}

/* ======================================================
   TIPO DE EVENTO
====================================================== */

function verificarTipoEvento(valor) {

    const zonaPersonalizada = document.getElementById("eventoPersonalizado");

    if (valor === "Otro") {
        zonaPersonalizada.style.display = "block";
        localStorage.setItem("tipoEvento", "personalizado");
    } else {
        zonaPersonalizada.style.display = "none";
        localStorage.setItem("tipoEvento", valor);
    }
}

function guardarEventoPersonalizado() {
    const nombre = document.getElementById("nombreEventoExtra").value;
    localStorage.setItem("nombreEventoPersonalizado", nombre);
}



/* ======================================================
   FECHAS
====================================================== */

function mostrarCalendario() {

    const divCalendario = document.getElementById("calendario");

    divCalendario.innerHTML = `
        <h6>Fecha del intercambio:</h6>
        <input type="text" id="datePicker" class="form-control">
    `;

    new Litepicker({
        element: document.getElementById('datePicker'),
        lang: 'es-ES',
        format: 'DD MMMM YYYY'
    });
}

function cancelarFecha() {
    document.getElementById("calendario").innerHTML = "";
    localStorage.removeItem("fechaIntercambio");
    alert("Fecha eliminada correctamente.");
}

function aceptarFecha() {
    const fechaSeleccionada = document.getElementById("datePicker").value;
    localStorage.setItem("fechaIntercambio", fechaSeleccionada);
    alert("Fecha guardada correctamente: " + fechaSeleccionada);
}

function crearFechas() {

    const actual = new Date();

    const fecha1 = new Date(actual);
    const fecha2 = new Date(actual);
    const fecha3 = new Date(actual);

    fecha2.setDate(actual.getDate() + 7);
    fecha3.setDate(actual.getDate() + 14);

    document.getElementById("fecha1").textContent =
        fecha1.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById("fecha2").textContent =
        fecha2.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });

    document.getElementById("fecha3").textContent =
        fecha3.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}


/* ======================================================
   PRESUPUESTO
====================================================== */

function configurarPresupuesto() {

    const divs = document.querySelectorAll(".presupuesto");

    divs.forEach(div => {

        div.addEventListener("click", () => {

            presupuestoSeleccionado = div.dataset.valor;

            document.querySelectorAll(".presupuesto")
                .forEach(d => d.classList.remove("bg-primary", "text-white"));

            div.classList.add("bg-primary", "text-white");

            if (presupuestoSeleccionado === "otro") {

                document.getElementById("contenedorInputOtro").innerHTML = `
                    <input 
                        type="number" 
                        id="inputOtro" 
                        class="form-control mt-2" 
                        placeholder="Escribe otro presupuesto">
                `;

            } else {
                document.getElementById("contenedorInputOtro").innerHTML = "";
            }
        });
    });
}

function guardarPresupuesto() {

    if (!presupuestoSeleccionado) {
        alert("Selecciona un presupuesto");
        return;
    }

    let valorFinal = presupuestoSeleccionado;

    if (presupuestoSeleccionado === "otro") {

        const input = document.getElementById("inputOtro");

        if (!input || !input.value) {
            alert("Escribe un valor");
            return;
        }

        valorFinal = input.value;
    }

    localStorage.setItem("presupuesto", valorFinal);
    alert("Presupuesto guardado correctamente");
}


// mostrar datos de evento


/* =============================================
    REALIZAR SORTEO 
================================================ */
function resultadoSorteo() {

    if (participantes.length < 2) {
        alert("Necesitas al menos 2 participantes.");
        return;
    }

    let intentoValido = false;
    let resultadoFinal = {};
    let intentos = 0;

    while (!intentoValido && intentos < 500) {

        intentos++;
        let disponibles = [...participantes];
        resultadoFinal = {};
        intentoValido = true;

        for (let persona of participantes) {

            let opciones = disponibles.filter(p => p !== persona);

            opciones = opciones.filter(p => {
                return !exclusionesDrag.some(ex =>
                    ex.quien === persona && ex.noPuedeRegalarA === p
                );
            });

            if (opciones.length === 0) {
                intentoValido = false;
                break;
            }

            let elegido = opciones[Math.floor(Math.random() * opciones.length)];

            resultadoFinal[persona] = elegido;

            disponibles = disponibles.filter(p => p !== elegido);
        }
    }

    if (!intentoValido) {
        alert("No se puede generar un sorteo válido con las exclusiones actuales.");
        return;
    }

    let contenedor = document.getElementById("resultadoSorteo");
    contenedor.innerHTML = "";

    for (let persona in resultadoFinal) {
        contenedor.innerHTML += `
            <p><strong>${persona}</strong> regala a <strong>${resultadoFinal[persona]}</strong></p>
        `;
    }
}