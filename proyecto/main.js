// 1. Objeto del proyecto para el repositorio de clase
const objetoProyectoSanAgustin = {
  nombreApp: "GastroTurnos Pro",
  categoria: "Gestión Gastronómica y Operativa",
  integrantes: ["Juan Diego Triana", "Compañero de Equipo"],
  programa: "Tecnología en Desarrollo de Software",
  stack: ["Node.js", "Vite", "Vanilla JS", "Capacitor", "Android APK"],
  funcionalidades: [
    "Control de asistencia y turnos de personal por área en tiempo real",
    "Calculadora de escandallo y margen de rentabilidad por plato",
    "Persistencia local de datos con LocalStorage"
  ],
  fechaEntrega: "2026"
};

// 2. Estado inicial con datos de demostración
const turnosIniciales = [
  { id: 1, nombre: "Andrés Morales", rol: "🔥 Parrilla / Asadero", horario: "Apertura", horaIngreso: "06:00 AM", activo: true },
  { id: 2, nombre: "Laura Gómez", rol: "🍽️ Servicio / Mesas", horario: "Pico Almuerzo", horaIngreso: "10:00 AM", activo: true },
  { id: 3, nombre: "Camilo Rojas", rol: "💵 Caja / Admin", horario: "Cierre", horaIngreso: "01:55 PM", activo: false }
];

const costosIniciales = [
  { id: 1, nombre: "1/2 Pollo Asado + Papas", costo: 14500, margen: 40, precioVenta: 24200, utilidad: 9700 },
  { id: 2, nombre: "Pechuga a la Plancha Especial", costo: 12000, margen: 38, precioVenta: 19400, utilidad: 7400 }
];

let turnos = JSON.parse(localStorage.getItem("gastro_turnos")) || turnosIniciales;
let costos = JSON.parse(localStorage.getItem("gastro_costos")) || costosIniciales;

// 3. Referencias del DOM
const listaTurnosEl = document.getElementById("listaTurnos");
const listaCostosEl = document.getElementById("listaCostos");
const headerCountEl = document.getElementById("headerCount");
const formTurno = document.getElementById("formTurno");
const formCosto = document.getElementById("formCosto");
const jsonPreview = document.getElementById("jsonPreview");
const btnCopiarObjeto = document.getElementById("btnCopiarObjeto");
const btnLimpiarTurnos = document.getElementById("btnLimpiarTurnos");

// 4. Renderizar Turnos
function renderTurnos() {
  listaTurnosEl.innerHTML = "";
  const activosCount = turnos.filter((t) => t.activo).length;
  headerCountEl.textContent = `${activosCount} en turno`;

  turnos.forEach((persona) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-info">
        <h3>${persona.nombre}</h3>
        <p>${persona.rol} • ${persona.horario}</p>
        <p>Ingreso: ${persona.horaIngreso}</p>
      </div>
      <button class="status-btn ${persona.activo ? "activo" : "finalizado"}" data-id="${persona.id}">
        ${persona.activo ? "● En Turno" : "Finalizado"}
      </button>
    `;
    listaTurnosEl.appendChild(card);
  });

  // Eventos para cambiar estado activo/finalizado
  document.querySelectorAll(".status-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const id = Number(e.target.dataset.id);
      turnos = turnos.map((t) => (t.id === id ? { ...t, activo: !t.activo } : t));
      localStorage.setItem("gastro_turnos", JSON.stringify(turnos));
      renderTurnos();
    });
  });
}

// 5. Registrar nuevo colaborador en turno
formTurno.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("empNombre").value.trim();
  const rol = document.getElementById("empRol").value;
  const horario = document.getElementById("empHorario").value;

  const ahora = new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" });

  turnos.unshift({
    id: Date.now(),
    nombre,
    rol,
    horario,
    horaIngreso: ahora,
    activo: true
  });

  localStorage.setItem("gastro_turnos", JSON.stringify(turnos));
  formTurno.reset();
  renderTurnos();
});

// 6. Reiniciar turnos a valores de fábrica
btnLimpiarTurnos.addEventListener("click", () => {
  turnos = [...turnosIniciales];
  localStorage.setItem("gastro_turnos", JSON.stringify(turnos));
  renderTurnos();
});

// 7. Renderizar Calculadora de Costos
function renderCostos() {
  listaCostosEl.innerHTML = "";
  costos.forEach((item) => {
    const card = document.createElement("div");
    card.className = "item-card";
    card.innerHTML = `
      <div class="item-info">
        <h3>${item.nombre}</h3>
        <p>Costo base: $${item.costo.toLocaleString("es-CO")} • Margen: ${item.margen}%</p>
      </div>
      <div class="price-tag">
        <div class="venta">$${item.precioVenta.toLocaleString("es-CO")}</div>
        <div class="ganancia">+$${item.utilidad.toLocaleString("es-CO")} neto</div>
      </div>
    `;
    listaCostosEl.appendChild(card);
  });
}

// 8. Calcular nuevo plato
formCosto.addEventListener("submit", (e) => {
  e.preventDefault();
  const nombre = document.getElementById("platoNombre").value.trim();
  const costo = Number(document.getElementById("platoCosto").value);
  const margen = Number(document.getElementById("platoMargen").value);

  // Fórmula financiera de precio de venta según margen bruto: Costo / (1 - Margen%)
  const precioSinRedondeo = costo / (1 - margen / 100);
  const precioVenta = Math.ceil(precioSinRedondeo / 100) * 100; // Redondeo a la centena
  const utilidad = precioVenta - costo;

  costos.unshift({
    id: Date.now(),
    nombre,
    costo,
    margen,
    precioVenta,
    utilidad
  });

  localStorage.setItem("gastro_costos", JSON.stringify(costos));
  formCosto.reset();
  document.getElementById("platoMargen").value = 35;
  renderCostos();
});

// 9. Navegación por pestañas inferiores
document.querySelectorAll(".nav-item").forEach((btn) => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".nav-item").forEach((b) => b.classList.remove("active"));
    document.querySelectorAll(".view").forEach((v) => v.classList.remove("active"));

    btn.classList.add("active");
    const targetId = btn.dataset.target;
    document.getElementById(targetId).classList.add("active");
  });
});

// 10. Mostrar y copiar Objeto para el repo
jsonPreview.textContent = JSON.stringify(objetoProyectoSanAgustin, null, 2);

btnCopiarObjeto.addEventListener("click", () => {
  navigator.clipboard.writeText(JSON.stringify(objetoProyectoSanAgustin, null, 2));
  btnCopiarObjeto.textContent = "✅ ¡Copiado al portapapeles!";
  setTimeout(() => {
    btnCopiarObjeto.textContent = "📋 Copiar Objeto para el Repo";
  }, 2000);
});

// Inicializar vistas
renderTurnos();
renderCostos();