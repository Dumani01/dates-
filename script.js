// ===============================
// CONFIGURACIÓN Y SELECTORES
// ===============================

// Obtenemos todas las etapas de la página.
const stages = [...document.querySelectorAll(".stage")];

// Botones y elementos de la primera pantalla.
const yesButton = document.getElementById("yes-btn");
const noButton = document.getElementById("no-btn");
const choiceZone = document.getElementById("choice-zone");
const noMessage = document.getElementById("no-message");

// Formulario de fecha.
const dateForm = document.getElementById("date-form");
const dateInput = document.getElementById("date-input");
const dateError = document.getElementById("date-error");

// Formulario de comida.
const foodForm = document.getElementById("food-form");
const foodError = document.getElementById("food-error");

// Resumen final.
const summaryDate = document.getElementById("summary-date");
const summaryFood = document.getElementById("summary-food");
const restartButton = document.getElementById("restart-btn");

// Cuenta cuántas veces el botón "No" se ha escapado.
let dodgeCount = 0;

// Configuración de envío por correo.
const API_URL = "http://localhost:3000/api/submit";

function sendEmailConfirmation(date, food) {
  fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({ date, food }),
  })
    .then(async (response) => {
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `HTTP ${response.status}`);
      }

      console.log("Correo enviado correctamente:", data.message);
    })
    .catch((error) => {
      console.error("No se pudo enviar el correo desde el backend:", error);
      alert("Hubo un problema al enviar el correo. Revisa la configuración del servidor SMTP.");
    });
}

// ===============================
// CAMBIO ENTRE ETAPAS
// ===============================

/**
 * Muestra una etapa y oculta las demás.
 * @param {number|string} stageNumber Número de la etapa.
 */
function showStage(stageNumber) {
  stages.forEach((stage) => {
    stage.classList.toggle(
      "active",
      stage.dataset.stage === String(stageNumber)
    );
  });
}


// ===============================
// BOTÓN "NO" QUE SE ESCAPA
// ===============================

/**
 * Mueve el botón "No" a una posición aleatoria dentro del área disponible.
 * También intenta alejarlo del puntero cuando recibe coordenadas.
 */
function moveNoButton(pointerX, pointerY) {
  const zoneRect = choiceZone.getBoundingClientRect();
  const buttonRect = noButton.getBoundingClientRect();

  const padding = 12;

  const maxX = Math.max(
    padding,
    zoneRect.width - buttonRect.width - padding
  );

  const maxY = Math.max(
    padding,
    zoneRect.height - buttonRect.height - padding
  );

  let x = Math.random() * maxX;
  let y = Math.random() * maxY;

  // Si conocemos la ubicación del mouse,
  // buscamos una posición que quede suficientemente lejos.
  if (Number.isFinite(pointerX) && Number.isFinite(pointerY)) {
    for (let attempt = 0; attempt < 10; attempt++) {
      const centerX = zoneRect.left + x + buttonRect.width / 2;
      const centerY = zoneRect.top + y + buttonRect.height / 2;

      const distance = Math.hypot(
        centerX - pointerX,
        centerY - pointerY
      );

      if (distance > 105) {
        break;
      }

      x = Math.random() * maxX;
      y = Math.random() * maxY;
    }
  }

  noButton.style.left = `${x + buttonRect.width / 2}px`;
  noButton.style.top = `${y + buttonRect.height / 2}px`;

  dodgeCount++;

  const messages = [
    "Casi me convence.",
    "Ese botón sigue dudando.",
    "Creo que ya sabes cuál es la respuesta.",
    "No te voy a hacer esperar tanto.",
    "La decisión ya está clara.",
  ];

  noMessage.textContent =
    messages[Math.min(dodgeCount - 1, messages.length - 1)];
}


// Detecta cuando el puntero se acerca al botón "No".
choiceZone.addEventListener("pointermove", (event) => {
  // En pantallas táctiles no usamos movimiento por cercanía.
  if (event.pointerType === "touch") return;

  const rect = noButton.getBoundingClientRect();

  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  const distance = Math.hypot(
    event.clientX - centerX,
    event.clientY - centerY
  );

  // Mientras más pequeño el número, más cerca debe estar el mouse.
  if (distance < 95) {
    moveNoButton(event.clientX, event.clientY);
  }
});


// En móviles, si intentan tocar "No", también se escapa.
noButton.addEventListener("pointerdown", (event) => {
  if (event.pointerType === "touch") {
    event.preventDefault();
    moveNoButton(event.clientX, event.clientY);
  }
});


// Evita que el botón "No" haga alguna acción real.
noButton.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton(event.clientX, event.clientY);
});


// ===============================
// BOTÓN "SÍ"
// ===============================

// Al presionar Sí, pasamos a la selección de fecha.
yesButton.addEventListener("click", () => {
  showStage(2);
});


// ===============================
// BOTONES PARA VOLVER
// ===============================

document.querySelectorAll("[data-back]").forEach((button) => {
  button.addEventListener("click", () => {
    showStage(button.dataset.back);
  });
});


// ===============================
// CONFIGURAR FECHA MÍNIMA
// ===============================

// Evita seleccionar días anteriores al día actual.
const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

dateInput.min = `${year}-${month}-${day}`;


// ===============================
// FORMULARIO DE FECHA
// ===============================

dateForm.addEventListener("submit", (event) => {
  event.preventDefault();

  dateError.textContent = "";

  if (!dateInput.value) {
    dateError.textContent =
      "Selecciona una fecha para continuar.";
    return;
  }

  if (dateInput.value < dateInput.min) {
    dateError.textContent =
      "Selecciona una fecha de hoy en adelante.";
    return;
  }

  showStage(3);
});


// ===============================
// FORMULARIO DE COMIDA
// ===============================

foodForm.addEventListener("submit", (event) => {
  event.preventDefault();

  foodError.textContent = "";

  const selectedFood = document.querySelector(
    'input[name="food"]:checked'
  );

  if (!selectedFood) {
    foodError.textContent =
      "Selecciona qué te gustaría cenar.";
    return;
  }

  // Convertimos la fecha sin permitir cambios por zona horaria.
  const [selectedYear, selectedMonth, selectedDay] =
    dateInput.value.split("-").map(Number);

  const utcDate = new Date(
    Date.UTC(
      selectedYear,
      selectedMonth - 1,
      selectedDay
    )
  );

  const formattedDate = new Intl.DateTimeFormat("es-CR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(utcDate);

  summaryDate.textContent = formattedDate;
  summaryFood.textContent = selectedFood.value;

  sendEmailConfirmation(formattedDate, selectedFood.value);
  showStage(4);
});


// ===============================
// REINICIAR
// ===============================

restartButton.addEventListener("click", () => {
  // Limpiamos la fecha.
  dateInput.value = "";

  // Quitamos cualquier comida seleccionada.
  document
    .querySelectorAll('input[name="food"]')
    .forEach((input) => {
      input.checked = false;
    });

  // Regresamos el botón "No" a su posición original.
  noButton.style.left = "72%";
  noButton.style.top = "50%";

  noMessage.textContent = "";
  dodgeCount = 0;

  showStage(1);
});
