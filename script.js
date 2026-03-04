/* ======================================================
   VARIABLES GLOBALES
====================================================== */

let participantes = JSON.parse(localStorage.getItem("participantes")) || [];
let excluidos = JSON.parse(localStorage.getItem("excluidos")) || [];
let presupuestoSeleccionado = null;


/* ======================================================
   DOM CONTENT LOADED
====================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ===== Render inicial ===== */
    exclusionesNombres();
    renderParticipantes();
    renderExcluidosArriba();
    renderZonaIzquierda();
    configurarDrop();
    configurarPresupuesto();
    crearFechas();

    /* ===== Botones principales ===== */
    document.getElementById("btnAgregar").addEventListener("click", agregarParticipante);
    document.getElementById("btnGuardarCosto").addEventListener("click", guardarPresupuesto);
    document.getElementById("agregarNombre").addEventListener("click", agregarNombre);

    /* ===== Exclusiones ===== */
    document.getElementById("hechoBtn").addEventListener("click", guardarExclusiones);
    document.getElementById("cancelarBtn").addEventListener("click", cancelarExclusiones);

    /* ===== Calendario ===== */
    document.getElementById("fechaCalendario").addEventListener("click", mostrarCalendario);
    document.getElementById("cancelarFecha").addEventListener("click", cancelarFecha);
    document.getElementById("aceptarFecha").addEventListener("click", aceptarFecha);

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

    const nombreInput = document.getElementById("inputNombreOrganizador");
    const nombre = nombreInput.value.trim();

    if (nombre === "") {
        alert("Por favor, ingresa un nombre");
        return;
    }

    const check = document.querySelector("#zonaOrganizador input[type='checkbox']");
    const checkMarcado = check.checked;

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
    exclusionesDiv.innerHTML = "";

    let nombres = JSON.parse(localStorage.getItem("nombres")) || [];

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
}

function renderExcluidosArriba() {

    const contenedor = document.getElementById("divExcluidosArriba");
    contenedor.innerHTML = "";

    excluidos.forEach(nombre => {

        const div = document.createElement("div");
        div.textContent = nombre;
        div.className = "border p-2";
        div.draggable = true;

        div.addEventListener("dragstart", e => {
            e.dataTransfer.setData("text", nombre);
        });

        contenedor.appendChild(div);
    });
}



/* ======================================================
   DRAG & DROP
====================================================== */

function renderZonaIzquierda() {

    const zona = document.getElementById("zonaIzquierda");
    zona.innerHTML = "";

    participantes.forEach(nombre => {
        const div = document.createElement("div");
        div.textContent = nombre;
        div.className = "border p-2 mb-2";
        zona.appendChild(div);
    });
}

function configurarDrop() {

    const zonaDerecha = document.getElementById("zonaDerecha");

    zonaDerecha.addEventListener("dragover", e => e.preventDefault());

    zonaDerecha.addEventListener("drop", e => {

        e.preventDefault();
        const nombre = e.dataTransfer.getData("text");

        const div = document.createElement("div");
        div.textContent = nombre;
        div.className = "border p-2 mb-2";

        zonaDerecha.appendChild(div);
    });
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

// resultados de sorteo