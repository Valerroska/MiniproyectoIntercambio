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

  // Mantener abierto el apartado de exclusiones si ya dijeron "Sí" VALE
  if (localStorage.getItem("exclusiones") === "Sí") {
    const zona = document.getElementById("zonaExclusiones");
    zona.style.display = "block"; // mostrar la sección
    exclusionesNombres(); // refresca los checkboxes de excluidos
    renderZonaArrastre(); // refresca la zona de arrastre
    renderParticipantesExcluidos(); // refresca los participantes donde se suelta
  }

  /* ===== Botones principales ===== */
  document
    .getElementById("btnAgregar")
    .addEventListener("click", agregarParticipante);
  document
    .getElementById("btnGuardarCosto")
    .addEventListener("click", guardarPresupuesto);
  document
    .getElementById("agregarNombre")
    .addEventListener("click", agregarNombre);
  document
    .getElementById("confirmarExclusiones")
    .addEventListener("click", confirmarExclusiones);
  document.getElementById("btnComenzar").addEventListener("click", iniciarApp);

  /* ===== Exclusiones ===== */
  document
    .getElementById("hechoBtn")
    .addEventListener("click", guardarExclusiones);
  document
    .getElementById("cancelarBtn")
    .addEventListener("click", cancelarExclusiones);

  /* ===== Calendario ===== */
  document
    .getElementById("fechaCalendario")
    .addEventListener("click", mostrarCalendario);
  document
    .getElementById("cancelarFecha")
    .addEventListener("click", cancelarFecha);
  document
    .getElementById("aceptarFecha")
    .addEventListener("click", aceptarFecha);

  /* ======= Resultado Sorteo ==========*/
  document
    .getElementById("btnSorteo")
    .addEventListener("click", resultadoSorteo);

  /* ===== Fechas rápidas ===== */
  document.querySelectorAll("#fecha1, #fecha2, #fecha3").forEach((fecha) => {
    fecha.addEventListener("click", function () {
      const fechaSeleccionada = this.textContent;
      localStorage.setItem("fechaIntercambio", fechaSeleccionada);
      alert("Fecha guardada correctamente: " + fechaSeleccionada);
    });
  });

  /* ===== Presupuesto ===== */
  document.querySelectorAll(".presupuesto").forEach((p) => {
    p.addEventListener("click", seleccionarPresupuesto);
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
  const check = document.querySelector(
    "#zonaOrganizador input[type='checkbox']",
  );
  const checkMarcado = check.checked;

  if (organizadorGuardado) {
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

  participantes.forEach((nombre, index) => {
    const div = document.createElement("div");
    div.className =
      "border p-2 mb-2 d-flex justify-content-between align-items-center";

    const span = document.createElement("span");
    span.textContent = nombre;

    const btnEliminar = document.createElement("button");
    btnEliminar.textContent = "✖";
    btnEliminar.className = "btnEliminar";

    btnEliminar.addEventListener("click", () => {
      eliminarParticipante(index);
    });

    div.appendChild(span);
    div.appendChild(btnEliminar);

    contenedor.appendChild(div);
  });
}

function eliminarParticipante(index) {
  participantes.splice(index, 1);

  localStorage.setItem("participantes", JSON.stringify(participantes));

  renderParticipantes();
}

/* ======================================================
   EXCLUSIONES SI/NO
====================================================== */

function mostrarExclusiones(valor) {
  const zona = document.getElementById("zonaExclusiones");

  if (valor === true) {
    zona.style.display = "block";
    localStorage.setItem("exclusiones", "Sí");
    alert(
      "Se mostrarán las opciones de exclusiones. Recuerda guardar tus exclusiones para que se apliquen al sorteo!!",
    );
  } else {
    zona.style.display = "none";
    localStorage.setItem("exclusiones", "No");
    alert(
      "No se mostrarán las opciones de exclusiones. Recuerda que si ya habías guardado exclusiones, estas seguirán aplicándose al sorteo a menos que las elimines desde el apartado de exclusiones.",
    );
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

  nombres.forEach((nombre) => {
    exclusionesDiv.innerHTML += `
            <input class="form-check-input" type="checkbox" value="${nombre}">
            <label class="form-check-label">${nombre}</label>
            <br>`;
  });
}

function guardarExclusiones() {
  const preguntar = confirm("¿Deseas guardar las exclusiones seleccionadas?");

  if (preguntar) {
    const check = document.querySelectorAll(
      "#exclusiones input[type='checkbox']:checked",
    );

    check.forEach((c) => {
      if (!excluidos.includes(c.value)) {
        excluidos.push(c.value);
      }
    });

    localStorage.setItem("excluidos", JSON.stringify(excluidos));
    check.forEach((c) => (c.checked = false));
    renderZonaArrastre(); // VALE: es para que se actualice la zona de arrastre con los nuevos excluidos
    renderParticipantesExcluidos();
    alert("Exclusiones guardadas correctamente.");
  } else {
    alert("Se eliminaron las exclusiones seleccionadas.");
  }
}

function cancelarExclusiones() {
  const check = document.querySelectorAll(
    "#exclusiones input[type='checkbox']",
  );
  check.forEach((c) => (c.checked = false));

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

  participantes.forEach((nombre) => {
    const fila = document.createElement("div");
    fila.className =
      "d-flex justify-content-between align-items-center border p-2 mb-2";

    const izquierda = document.createElement("div");
    izquierda.textContent = nombre;
    izquierda.style.width = "50%";

    const derecha = document.createElement("div");
    derecha.textContent = "Soltar aquí";
    derecha.style.width = "50%";
    derecha.style.textAlign = "right";

    derecha.addEventListener("dragover", (e) => e.preventDefault());

    derecha.addEventListener("drop", (e) => {
      e.preventDefault();

      const quienExcluye = e.dataTransfer.getData("quienExcluye");

      if (!quienExcluye) return;

      if (quienExcluye === nombre) {
        alert("No puedes excluirte a ti mismo");
        return;
      }

      // 🚨 EVITAR REPETIDOS
      const yaExiste = exclusionesDrag.find(
        (e) => e.quien === quienExcluye && e.noPuedeRegalarA === nombre,
      );

      if (yaExiste) {
        alert("Esa exclusión ya existe");
        return;
      }

      exclusionesDrag.push({
        quien: nombre,
        noPuedeRegalarA: quienExcluye,
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

  excluidos.forEach((nombre) => {
    const div = document.createElement("div");
    div.className = "badge bg-secondary m-1";
    div.textContent = nombre;
    div.draggable = true;

    div.addEventListener("dragstart", (e) => {
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
    alert(
      "Seleccionaste el evento: " +
        valor +
        ". Recuerda que si ya habías guardado un nombre personalizado, este seguirá apareciendo en el resumen del evento a menos que lo elimines desde el apartado de evento personalizado.", //VALEEEE no estoy segura de que sea ceirto
    );
    // BORRAR EL NOMBRE PERSONALIZADO cuando no sea evento personalizado para que no aparezca en el resumen //VALE
    localStorage.removeItem("nombreEventoPersonalizado");
  }
}

function guardarEventoPersonalizado() {
  const nombre = document.getElementById("nombreEventoExtra").value;
  localStorage.setItem("nombreEventoPersonalizado", nombre);

  // BOTÓN PARA GUARDAR EL NOMBRE DEL EVENTO PERSONALIZADO VALE
  const btnGuardarEvento = document.getElementById("guardarEventoBtn");

  btnGuardarEvento.addEventListener("click", function () {
    const inputEvento = document.getElementById("nombreEventoExtra");
    const valor = inputEvento.value.trim();

    if (valor === "") {
      alert("Por favor, escribe un nombre para tu evento personalizado.");
      return;
    }

    localStorage.setItem("nombreEventoPersonalizado", valor);

    alert(
      "Seleccionaste el evento personalizado: " +
        valor +
        ". Ahora aparecerá en el resumen del evento!!",
    );

    inputEvento.value = ""; // opcional: limpiar input
  });
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
    element: document.getElementById("datePicker"),
    lang: "es-ES",
    format: "DD MMMM YYYY",
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

  document.getElementById("fecha1").textContent = fecha1.toLocaleDateString(
    "es-ES",
    { day: "numeric", month: "long", year: "numeric" },
  );

  document.getElementById("fecha2").textContent = fecha2.toLocaleDateString(
    "es-ES",
    { day: "numeric", month: "long", year: "numeric" },
  );

  document.getElementById("fecha3").textContent = fecha3.toLocaleDateString(
    "es-ES",
    { day: "numeric", month: "long", year: "numeric" },
  );
}

/* ======================================================
   PRESUPUESTO
====================================================== */

function configurarPresupuesto() {
  const divs = document.querySelectorAll(".presupuesto");

  divs.forEach((div) => {
    div.addEventListener("click", () => {
      presupuestoSeleccionado = div.dataset.valor;

      document
        .querySelectorAll(".presupuesto")
        .forEach((d) => d.classList.remove("presupuesto-seleccionado"));

      div.classList.add("presupuesto-seleccionado");

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

function seleccionarPresupuesto() {
  document
    .querySelectorAll(".presupuesto")
    .forEach((el) => el.classList.remove("seleccionado"));

  this.classList.add("seleccionado");
}

// mostrar datos de intercambio VALE: Vane por qué borraste esto?
// ------------------------------------------------------------------------------------
// Mostrar datos del intercambio (LINEAS MODIFICADAS)
// Función mostrar datos actualizada y segura
function mostrarDatos() {
  const resultadoDiv = document.getElementById("resultadoEvento");

  // LEER DATOS DESDE LOCALSTORAGE
  const organizador = localStorage.getItem("organizador") || "No definido";
  const tipoEvento = localStorage.getItem("tipoEvento") || "No definido";
  const nombrePersonalizado =
    localStorage.getItem("nombreEventoPersonalizado") || "No definido";
  const fecha = localStorage.getItem("fechaIntercambio") || "No definido";
  const presupuestoRaw = localStorage.getItem("presupuesto") || "0"; //Primero se obtiene el valor sin formato
  const presupuesto = `$${presupuestoRaw}`;

  // Manejar participantes y exclusiones como JSON o texto
  let participantes, exclusiones;
  try {
    participantes = JSON.parse(
      localStorage.getItem("participantes") || "[]",
    ).join(", ");
  } catch {
    participantes = localStorage.getItem("participantes") || "No definido";
  }

  try {
    exclusiones = JSON.parse(localStorage.getItem("exclusiones") || "[]").join(
      ", ",
    );
  } catch {
    const raw = localStorage.getItem("exclusiones") || "No definido";
    exclusiones = raw.toLowerCase() === "si" ? "Sí" : raw;
  }

  // Construir HTML para mostrarlo
  resultadoDiv.innerHTML = `
    <ul>
      <li><strong>Organizador:</strong> ${organizador}</li>
      <li><strong>Tipo de evento:</strong> ${tipoEvento}</li>
      <li><strong>Nombre personalizado:</strong> ${nombrePersonalizado}</li>
      <li><strong>Fecha:</strong> ${fecha}</li>
      <li><strong>Presupuesto:</strong> ${presupuesto}</li>
      <li><strong>Participantes:</strong> ${participantes}</li>
      <li><strong>Exclusiones:</strong> ${exclusiones}</li>
    </ul>
  `;

  alert("Mostrando resumen...");
}

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
      let opciones = disponibles.filter((p) => p !== persona);

      opciones = opciones.filter((p) => {
        return !exclusionesDrag.some(
          (ex) => ex.quien === persona && ex.noPuedeRegalarA === p,
        );
      });

      if (opciones.length === 0) {
        intentoValido = false;
        break;
      }

      let elegido = opciones[Math.floor(Math.random() * opciones.length)];

      resultadoFinal[persona] = elegido;

      disponibles = disponibles.filter((p) => p !== elegido);
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
