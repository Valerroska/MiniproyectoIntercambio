//PRESENTACIÓN --------------------------------------------------------------------------------------
function iniciarApp() {
  document.getElementById("presentacion").style.display = "none"; //Ocultar
}

//EXCLUSIONES SI/NO ------------------------------------------------------------------------------------
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
/* 
function mostrarExclusiones(valor) {

    // Guardamos en una variable el div que contiene
    // la sección que debe mostrarse u ocultarse.
    // Estamos buscando el elemento que tiene id="zonaExclusiones"
    const zona = document.getElementById("zonaExclusiones");


    // Aquí evaluamos el valor que llega desde el botón.
    // Si el botón presionado fue "Sí",
    // entonces el parámetro 'valor' será true.
    if (valor === true) {

        // Cambiamos la propiedad CSS "display" del div.
        // "block" significa que el elemento será visible en pantalla.
        zona.style.display = "block";

        // Guardamos en el localStorage la decisión del usuario.
        // "exclusiones" es la clave (nombre del dato).
        // "si" es el valor que estamos almacenando.
        // Esto permite que el dato no se pierda aunque se recargue la página.
        localStorage.setItem("exclusiones", "si");

    } else {

        // Si el usuario presionó "No",
        // entonces el parámetro 'valor' será false.

        // Ocultamos el div cambiando el display a "none".
        // "none" significa que el elemento desaparece de la pantalla.
        zona.style.display = "none";

        // Guardamos en el localStorage que no habrá exclusiones.
        localStorage.setItem("exclusiones", "no");
    }

}
*/

//TIPO DE EVENTO ------------------------------------------------------------------------------------
function verificarTipoEvento(valor) {
  // Buscamos el div que contiene el input personalizado
  const zonaPersonalizada = document.getElementById("eventoPersonalizado");

  // Si el usuario selecciona "Otro"
  if (valor === "Otro") {
    // Mostramos el campo para escribir el nombre del evento
    zonaPersonalizada.style.display = "block";

    // Guardamos temporalmente que eligió "Otro"
    localStorage.setItem("tipoEvento", "personalizado");
  } else {
    // Si eligió cualquier opción normal
    zonaPersonalizada.style.display = "none";

    // Guardamos directamente el tipo seleccionado
    localStorage.setItem("tipoEvento", valor);
  }
}

function guardarEventoPersonalizado() {
  // Tomamos lo que el usuario escribe en el input
  const nombre = document.getElementById("nombreEventoExtra").value;

  // Guardamos ese nombre en localStorage
  localStorage.setItem("nombreEventoPersonalizado", nombre);
}

//MOSTRAR CONFIGURACIÓN GUARDADA ----------------------------------------------------------------------
function mostrarDatos() {
  // LEER DATOS DESDE LOCALSTORAGE
  const organizador = localStorage.getItem("organizador");
  const tipoEvento = localStorage.getItem("tipoEvento");
  const nombrePersonalizado = localStorage.getItem("nombreEventoPersonalizado");
  const fecha = localStorage.getItem("fechaEvento");
  const presupuesto = localStorage.getItem("presupuesto");
  const participantes = localStorage.getItem("participantes");
  const exclusiones = localStorage.getItem("exclusiones");

  // DECIDIR QUÉ NOMBRE DE EVENTO MOSTRAR
  let nombreEventoFinal = "";

  if (tipoEvento === "personalizado") {
    nombreEventoFinal = nombrePersonalizado;
  } else {
    nombreEventoFinal = tipoEvento;
  }

  // CONSTRUIR EL HTML DINÁMICO
  const resultado = `
        <ul class="list-group">
            <li class="list-group-item"><strong>Organizador:</strong> ${organizador}</li>
            <li class="list-group-item"><strong>Evento:</strong> ${nombreEventoFinal}</li>
            <li class="list-group-item"><strong>Fecha:</strong> ${fecha}</li>
            <li class="list-group-item"><strong>Presupuesto:</strong> $${presupuesto}</li>
            <li class="list-group-item"><strong>Participantes:</strong> ${participantes}</li>
            <li class="list-group-item"><strong>Exclusiones:</strong> ${exclusiones}</li>
        </ul>
    `;

  // MOSTRARLO EN EL DIV
  document.getElementById("resultadoEvento").innerHTML = resultado;
}

function finalizarConfiguracion() {
  alert("Configuración finalizada. Proceder al sorteo");
}