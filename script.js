document.addEventListener("DOMContentLoaded", function() {
    mostrarNombres();
    exclusionesNombres();
});

const nombreInput = document.getElementById("inputNombre");
const agregarBtn = document.getElementById("agregarNombre");
const hechoBtn = document.getElementById("hechoBtn");
const cancelarBtn = document.getElementById("cancelarBtn");
const calendarioBtn = document.getElementById("fechaCalendario");
const cancelarFechaBtn = document.getElementById("cancelarFecha");
const aceptarFechaBtn = document.getElementById("aceptarFecha");
const fechas = document.querySelectorAll("#fecha1, #fecha2, #fecha3");

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


/****************SECCION 2*********************/

nombreInput.addEventListener("keypress", function(e) {
    if(e.key === "Enter") {
        e.preventDefault();
        agregarNombre();
    }
});

agregarBtn.addEventListener("click", function() {
    agregarNombre();
});

// Agregar un nombre en el organizador
function agregarNombre(){
    const nombreInput = document.getElementById("inputNombre");
    const nombre = nombreInput.value.trim();
    if(nombre === "") return;

    let nombres = JSON.parse(localStorage.getItem("nombres")) || [];
    nombres.push(nombre);
    localStorage.setItem("nombres", JSON.stringify(nombres));

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = nombre; 
    
    const boton = document.createElement("button");
    boton.className = "btn btn-sm btn-quitar";
    boton.textContent = "x";
    li.appendChild(boton);

    document.querySelector(".list-group").appendChild(li);
    nombreInput.value = "";
}

// Que persistan los nombres del organizador aunque se recargue la página
function mostrarNombres() {
    const lista = document.querySelector(".list-group");
    lista.innerHTML = "";
    let nombres = JSON.parse(localStorage.getItem("nombres")) || [];
    nombres.forEach(nombre =>{
        lista.innerHTML += `
        <li class="list-group-item d-flex justify-content-between align-items-center">
            ${nombre}
            <button class="btn btn-sm btn-quitar">x</button>
        </li>`;
    });
}

// Eliminar un nombre del organizador
document.addEventListener("click", function(e) {
    const boton = e.target.closest(".btn-quitar");

    if(boton) {
        const item = boton.closest(".list-group-item");
        const nombre = item.firstChild.textContent.trim(); 
        let nombres = JSON.parse(localStorage.getItem("nombres")) || [];
        nombres = nombres.filter(n => n !== nombre);
        localStorage.setItem("nombres", JSON.stringify(nombres));
        if(item){
            item.remove(); // Se elimina el li
        }
    }
});

/****************SECCION 5*********************/

// Muestra nombres para hacer lista de exluidos 
function exclusionesNombres(){
    const exclusionesDiv = document.getElementById("exclusiones");
    exclusionesDiv.innerHTML = "";
    
    let nombres = JSON.parse(localStorage.getItem("nombres")) || [];
    nombres.forEach(nombre =>{
        exclusionesDiv.innerHTML += `
        <input class="form-check-input" type="checkbox" value="${nombre}" id="checkDefault">
        <label class="form-check-label" for="checkDefault">
            ${nombre}
        </label>
        <br>`;
    });
    // Agregar mensaje de refrescar en HTML o refrescar automáticamente aquí ******PENDIENTE******
}

// Botón que guarda en local storage los nombre de los exluidos 
hechoBtn.addEventListener("click", function() {
    const preguntar = confirm("¿Deseas guardar las exclusiones seleccionadas?");
    if(preguntar){
        const check = document.querySelectorAll("#exclusiones input[type='checkbox']:checked");
        let excluidos = JSON.parse(localStorage.getItem("excluidos")) || [];
        check.forEach(c => {
            if(!excluidos.includes(c.value)){ // Evita que haya repetidos
                excluidos.push(c.value); 
            }
        });
        localStorage.setItem("excluidos", JSON.stringify(excluidos));
        check.forEach(c => c.checked = false);
        alert("Exclusiones guardadas correctamente.")
    }else{
        alert("Se eliminaron las exclusiones selccionadas.");
        check.forEach(c => c.checked = false);
    }
});

// Botón cancelar para desmarcar los checkboxes
cancelarBtn.addEventListener("click", function() {
    const check = document.querySelectorAll("#exclusiones input[type='checkbox']");
    check.forEach(c => c.checked = false);
    localStorage.removeItem("excluidos");
    alert("Se eliminaron las exclusiones selccionadas.");
});

/****************SECCION 8*********************/

// Botón para mostrar calendario 
calendarioBtn.addEventListener("click", function() {
    const divCalendario = document.getElementById("calendario");
    divCalendario.innerHTML = `
    <h6>Fecha del intercambio:</h6>
    <input type="text" id="datePicker" class="form-control">`;

    let datePicker = document.getElementById('datePicker');
    let picker = new Litepicker({
        element: datePicker,
        lang: 'es-ES',
        format: 'DD MMMM YYYY'
    });
    
    let dateRangePicker = document.getElementById('dateRangePicker');
    let pickerRange = new Litepicker({
        element: dateRangePicker,
        format: 'DD MMMM YYYY',
        lang: 'es-ES',
        singleMode: false,
    });
});

// Botón para eliminar la fecha 
cancelarFechaBtn.addEventListener("click", function() {
    const divCalendario = document.getElementById("calendario");
    divCalendario.innerHTML = "";
    localStorage.removeItem("fechaIntercambio");
    alert("Fecha eliminada correctamente.");
});

// Botón para guardar la fecha seleccionada del calendario
aceptarFechaBtn.addEventListener("click", function() {
    const fechaSeleccionada = document.getElementById("datePicker").value;
    localStorage.setItem("fechaIntercambio", fechaSeleccionada);
    alert("Fecha guardada correctamente: " + fechaSeleccionada);    
});

// Función para crear fechas cercanas a la fecha actual 
function crearFechas(){
    const actual = new Date();
    const fecha1 = new Date(actual);
    const fecha2 = new Date(actual);
    const fecha3 = new Date(actual);

    fecha2.setDate(actual.getDate() + 7); 
    fecha3.setDate(actual.getDate() + 14); 

    document.getElementById("fecha1").textContent = fecha1.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById("fecha2").textContent = fecha2.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    document.getElementById("fecha3").textContent = fecha3.toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' });
}

crearFechas(); 

// Guarda la fecha en el local storage de las opc predeterminadas 
fechas.forEach(fecha => {
    fecha.addEventListener("click", function() {
        const fechaSeleccionada = this.textContent;
        localStorage.setItem("fechaIntercambio", fechaSeleccionada);
        alert("Fecha guardada correctamente: " + fechaSeleccionada);
    });
});