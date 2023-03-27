document.getElementById("fecha").addEventListener("input", calcularDolarBlue);
document.getElementById("valor").addEventListener("input", calcularDolarBlue);

function obtenerViernesAnterior(fecha) {
    const fechaObj = new Date(fecha);
    const diaSemana = fechaObj.getDay();
    const ajusteDias = diaSemana === 6 ? -1 : diaSemana === 0 ? -2 : 0;
    fechaObj.setDate(fechaObj.getDate() + ajusteDias);
    return fechaObj.toISOString().slice(0, 10);
}

function obtenerDolarBlueValue(data, fecha) {
    fecha = obtenerViernesAnterior(fecha);
    const dateData = data.filter(item => item.date === fecha && item.source === "Blue");

    if (dateData.length > 0) {
        return dateData[0].value_sell;
    }

    const fechaObj = new Date(fecha);
    fechaObj.setDate(fechaObj.getDate() - 1);
    const fechaAnterior = fechaObj.toISOString().slice(0, 10);
    return obtenerDolarBlueValue(data, fechaAnterior);
}

async function calcularDolarBlue() {
    let fecha = document.getElementById("fecha").value;
    const valor = parseFloat(document.getElementById("valor").value.replace(/[^0-9.-]+/g, ""));

    const resultadoDolaresElement = document.getElementById("resultado-dolares");
    const resultadoMonedaElement = document.getElementById("resultado-moneda");

    if (!fecha || !valor) {
        resultadoDolaresElement.textContent = "Por favor, completa los campos de fecha y valor.";
        resultadoMonedaElement.textContent = "";
        return;
    }

    try {
        const response = await fetch("https://api.bluelytics.com.ar/v2/evolution.json");
        const data = await response.json();

        const dolarBlueValue = obtenerDolarBlueValue(data, fecha);
        const resultado = valor / dolarBlueValue;
        const precioDolares = resultado.toFixed(2);

        let today = new Date();
        let todayStr = today.toISOString().slice(0, 10);
        const todayDolarBlueValue = obtenerDolarBlueValue(data, todayStr);
        const precioPesos = (resultado * todayDolarBlueValue).toFixed(2);

        resultadoDolaresElement.textContent = `${precioDolares} USD`;
        resultadoMonedaElement.textContent = ` -  ${precioPesos} ARS`;

    } catch (error) {
        console.error("Error al obtener los datos del dólar blue:", error);
        resultadoDolaresElement.textContent = "Error al obtener los datos del dólar blue. Por favor, intenta de nuevo más tarde.";
        resultadoMonedaElement.textContent = "";
    }
}

document.getElementById("dolar-form").addEventListener("submit", function(event) {
    event.preventDefault();
});

const valorInput = document.getElementById("valor");

valorInput.addEventListener("input", formatCurrency);

function formatCurrency(event) {
    const target = event.target;
    const value = target.value.replace(/\D/g, ""); // Elimina todos los caracteres no numéricos
    const formattedValue = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
maximumFractionDigits: 0, // No mostrar decimales
}).format(value);
target.value = formattedValue;
}



const logo = document.getElementById('logo');

logo.addEventListener('mousemove', (event) => {
const rect = logo.getBoundingClientRect();
const mouseX = event.clientX - rect.left;
const mouseY = event.clientY - rect.top;
const centerX = rect.width / 2;
const centerY = rect.height / 2;
const rotateY = (mouseX - centerX) / centerX * 30;
const rotateX = (mouseY - centerY) / centerY * -30;
  
  logo.style.transform = `scale(1.0) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
logo.style.filter = `drop-shadow(${rotateY / 2}px ${rotateX / 2}px 10px #0000FF)`;

  });

logo.addEventListener('mouseleave', () => {
logo.style.transform = 'scale(1) rotateX(0) rotateY(0)';
logo.style.filter = 'drop-shadow(0px 0px 0px transparent)';
});

async function fetchDollarRates() {
    try {
        const response = await fetch("https://api.bluelytics.com.ar/v2/latest");
        const data = await response.json();

        const blueBuyRate = data.blue.value_buy.toFixed(2);
        const blueSellRate = data.blue.value_sell.toFixed(2);
        const officialBuyRate = data.oficial.value_buy.toFixed(2);
        const officialSellRate = data.oficial.value_sell.toFixed(2);

        document.querySelector(".buy-rate").textContent = `${blueBuyRate} ARS`;
        document.querySelector(".sell-rate").textContent = `${blueSellRate} ARS`;
        document.querySelector(".official-buy-rate").textContent = `${officialBuyRate} ARS`;
        document.querySelector(".official-sell-rate").textContent = `${officialSellRate} ARS`;

    } catch (error) {
        console.error("Error al obtener los datos del dólar:", error);
    }
}

fetchDollarRates();
function setCurrentDate() {
    const today = new Date();
    const dateStr = today.toLocaleDateString("es-AR", {
        day: "numeric",
        month: "long",
        year: "numeric"
    });

    document.querySelector(".current-date").textContent = dateStr;
}

setCurrentDate();

const infoIcon = document.getElementById("info-icon");
const newTooltip = document.getElementById("new-tooltip");

infoIcon.addEventListener("mouseenter", () => {
    newTooltip.style.display = "block";
});

infoIcon.addEventListener("mouseleave", () => {
    newTooltip.style.display = "none";
});