// URLs de los archivos CSV
const CSV_URLS = {
  campaigns: "./public/Campañas(2025.02.28-2025.03.09).csv",
  devices: "./public/Dispositivos(2025.02.28-2025.03.09).csv",
  timeData: "./public/Series_temporales(2025.02.28-2025.03.09).csv",
  networks: "./public/Redes(2025.02.28-2025.03.09).csv",
  demographicsGenderAge: "./public/Datos_demográficos(Género_Edad_2025.02.28-2025.03.09).csv",
  demographicsGender: "./public/Datos_demográficos(Género_2025.02.28-2025.03.09).csv",
  demographicsAge: "./public/Datos_demográficos(Edad_2025.02.28-2025.03.09).csv",
  facebook: "./public/PPyT---SF-Campañas-1-mar-2025---9-mar-2025.csv"
}

// Datos globales
const data = {
  campaigns: [],
  devices: [],
  timeData: [],
  networks: [],
  demographicsGenderAge: [],
  demographicsGender: [],
  demographicsAge: [],
  facebook: []
}

// Referencias a los gráficos
const charts = {
  timeChart: null,
  deviceChart: null,
  networkChart: null,
  genderChart: null,
  ageChart: null,
}

// Colores para los gráficos
const CHART_COLORS = {
  blue: "rgba(13, 110, 253, 0.7)",
  green: "rgba(25, 135, 84, 0.7)",
  yellow: "rgba(255, 193, 7, 0.7)",
  red: "rgba(220, 53, 69, 0.7)",
  purple: "rgba(111, 66, 193, 0.7)",
  pink: "rgba(214, 51, 132, 0.7)",
  orange: "rgba(253, 126, 20, 0.7)",
  teal: "rgba(32, 201, 151, 0.7)",
}

// Mapeo de estados de Facebook a español
const FACEBOOK_STATUS_MAP = {
  'active': 'Activa',
  'recently_completed': 'Recientemente completada',
  'inactive': 'Inactiva'
}

// Función para parsear CSV usando PapaParse
function parseCSV(url) {
  console.log('Intentando cargar:', url);
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
      download: true,
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        console.log('Datos cargados exitosamente de:', url, results.data);
        resolve(results.data);
      },
      error: (error) => {
        console.error('Error cargando:', url, error);
        reject(error);
      },
    });
  });
}

// Función para cargar todos los datos
async function loadAllData() {
  try {
    console.log('Iniciando carga de datos...');
    
    // Cargar datos de campañas
    data.campaigns = await parseCSV(CSV_URLS.campaigns);
    console.log('Campañas cargadas:', data.campaigns);

    // Cargar datos de dispositivos
    data.devices = await parseCSV(CSV_URLS.devices);
    console.log('Dispositivos cargados:', data.devices);

    // Cargar datos de series temporales
    data.timeData = await parseCSV(CSV_URLS.timeData);
    console.log('Series temporales cargadas:', data.timeData);

    // Cargar datos de redes
    data.networks = await parseCSV(CSV_URLS.networks);
    console.log('Redes cargadas:', data.networks);

    // Cargar datos demográficos (género y edad)
    data.demographicsGenderAge = await parseCSV(CSV_URLS.demographicsGenderAge);
    console.log('Datos demográficos (género y edad) cargados:', data.demographicsGenderAge);

    // Cargar datos demográficos (género)
    data.demographicsGender = await parseCSV(CSV_URLS.demographicsGender);
    console.log('Datos demográficos (género) cargados:', data.demographicsGender);

    // Cargar datos demográficos (edad)
    data.demographicsAge = await parseCSV(CSV_URLS.demographicsAge);
    console.log('Datos demográficos (edad) cargados:', data.demographicsAge);

    // Cargar datos de Facebook
    data.facebook = await parseCSV(CSV_URLS.facebook);
    console.log('Datos de Facebook cargados:', data.facebook);

    // Actualizar la interfaz con los datos cargados
    console.log('Actualizando dashboard...');
    updateDashboard();

    // Ocultar el spinner de carga y mostrar el contenido
    document.getElementById("loading").classList.add("d-none");
    document.getElementById("dashboard-content").classList.remove("d-none");
    console.log('Dashboard actualizado exitosamente');
  } catch (error) {
    console.error("Error detallado:", error);
    console.error("Stack trace:", error.stack);
    alert("Error al cargar los datos. Por favor, revisa la consola para más detalles.");
  }
}

// Función para actualizar el dashboard con los datos cargados
function updateDashboard() {
  updateMetrics()
  updateCampaignsTable()
  updateFacebookTable()
  createTimeChart()
  createDeviceChart()
  createNetworkChart()
  createGenderChart()
  createAgeChart()
}

// Función para actualizar las métricas principales
function updateMetrics() {
  // Calcular total de clics
  const totalClics = data.campaigns.reduce((sum, campaign) => {
    return sum + Number.parseInt(campaign["Clics"].replace(/,/g, ""), 10) || 0
  }, 0)

  // Calcular total de impresiones
  const totalImpressions = data.devices.reduce((sum, device) => {
    return sum + Number.parseInt(device["Impresiones"].replace(/,/g, ""), 10) || 0
  }, 0)

  // Calcular costo total de Google Ads
  const totalCostGoogle = data.campaigns.reduce((sum, campaign) => {
    const costValue = campaign["Costo"].replace("ARS", "").replace(/,/g, "")
    return sum + Number.parseFloat(costValue) || 0
  }, 0)

  // Calcular costo total de Facebook Ads
  const totalCostFacebook = data.facebook.reduce((sum, campaign) => {
    const costValue = campaign["Importe gastado (ARS)"].replace("ARS", "").replace(/,/g, "")
    return sum + Number.parseFloat(costValue) || 0
  }, 0)

  // Calcular costo total combinado
  const totalCostCombined = totalCostGoogle + totalCostFacebook

  console.log('Total Google:', totalCostGoogle)
  console.log('Total Facebook:', totalCostFacebook)
  console.log('Total Combinado:', totalCostCombined)

  // Actualizar los elementos HTML
  document.getElementById("total-clicks").textContent = totalClics.toLocaleString()
  document.getElementById("total-impressions").textContent = totalImpressions.toLocaleString()
  document.getElementById("total-cost").textContent = `ARS ${totalCostGoogle.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
  document.getElementById("total-total").textContent = `ARS ${totalCostCombined.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// Función para actualizar la tabla de campañas
function updateCampaignsTable() {
  const tableBody = document.getElementById("campaigns-table-body")
  tableBody.innerHTML = ""

  // Mostrar solo las primeras 5 campañas
  data.campaigns.slice(0, 5).forEach((campaign) => {
    const row = document.createElement("tr")

    // Nombre de la campaña
    const nameCell = document.createElement("td")
    nameCell.textContent = campaign["Nombre de la campaña"]
    row.appendChild(nameCell)

    // Estado de la campaña
    const statusCell = document.createElement("td")
    const statusSpan = document.createElement("span")
    statusSpan.textContent = campaign["Estado de la campaña"]
    statusSpan.className =
      campaign["Estado de la campaña"] === "Activa" ? "campaign-status-active" : "campaign-status-paused"
    statusCell.appendChild(statusSpan)
    row.appendChild(statusCell)

    // Clics
    const clicsCell = document.createElement("td")
    clicsCell.textContent = campaign["Clics"]
    clicsCell.className = "text-end"
    row.appendChild(clicsCell)

    // CTR
    const ctrCell = document.createElement("td")
    ctrCell.textContent = campaign["CTR"]
    ctrCell.className = "text-end"
    row.appendChild(ctrCell)

    // Costo
    const costCell = document.createElement("td")
    costCell.textContent = campaign["Costo"]
    costCell.className = "text-end"
    row.appendChild(costCell)

    tableBody.appendChild(row)
  })
}

// Función para actualizar la tabla de campañas de Facebook
function updateFacebookTable() {
  const tableBody = document.getElementById("facebook-campaigns-table-body")
  tableBody.innerHTML = ""

  let totalGastado = 0

  data.facebook.forEach((campaign) => {
    const row = document.createElement("tr")

    // Nombre de la campaña
    const nameCell = document.createElement("td")
    nameCell.textContent = campaign["Nombre de la campaña"]
    row.appendChild(nameCell)

    // Estado de la campaña
    const statusCell = document.createElement("td")
    const statusSpan = document.createElement("span")
    const statusEnglish = campaign["Entrega de la campaña"].toLowerCase().replace(/ /g, "_")
    statusSpan.textContent = FACEBOOK_STATUS_MAP[statusEnglish] || campaign["Entrega de la campaña"]
    statusSpan.className = `campaign-status-${statusEnglish}`
    statusCell.appendChild(statusSpan)
    row.appendChild(statusCell)

    // Alcance
    const reachCell = document.createElement("td")
    reachCell.textContent = parseInt(campaign["Alcance"]).toLocaleString()
    reachCell.className = "text-end"
    row.appendChild(reachCell)

    // Impresiones
    const impressionsCell = document.createElement("td")
    impressionsCell.textContent = parseInt(campaign["Impresiones"]).toLocaleString()
    impressionsCell.className = "text-end"
    row.appendChild(impressionsCell)

    // Costo por resultado
    const cprCell = document.createElement("td")
    cprCell.textContent = `ARS ${parseFloat(campaign["Costo por resultados"]).toFixed(2)}`
    cprCell.className = "text-end"
    row.appendChild(cprCell)

    // Importe gastado
    const costCell = document.createElement("td")
    const importeGastado = campaign["Importe gastado (ARS)"]
    costCell.textContent = importeGastado
    costCell.className = "text-end"
    row.appendChild(costCell)

    // Sumar al total
    const importeNumerico = parseFloat(importeGastado.replace("ARS", "").replace(/,/g, ""))
    totalGastado += importeNumerico

    tableBody.appendChild(row)
  })

  // Agregar fila de total
  const totalRow = document.createElement("tr")
  totalRow.className = "table-light fw-bold"

  // Celdas vacías para mantener el alineamiento
  for (let i = 0; i < 5; i++) {
    const emptyCell = document.createElement("td")
    if (i === 0) {
      emptyCell.textContent = "Total"
      emptyCell.className = "text-end"
    }
    totalRow.appendChild(emptyCell)
  }

  // Celda del total
  const totalCell = document.createElement("td")
  totalCell.textContent = `ARS ${totalGastado.toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`
  totalCell.className = "text-end"
  totalRow.appendChild(totalCell)

  tableBody.appendChild(totalRow)
}

// Función para crear el gráfico de tendencia temporal
function createTimeChart() {
  const ctx = document.getElementById("time-chart").getContext("2d")

  // Preparar datos para el gráfico
  const labels = data.timeData.map((item) => {
    // Convertir la fecha a un formato más corto
    const date = new Date(item["Fecha"])
    return date.toLocaleDateString("es-ES", { day: "numeric", month: "short" })
  })

  const impresionesData = data.timeData.map((item) => Number.parseInt(item["Impresiones"].replace(/,/g, ""), 10) || 0)
  const costoData = data.timeData.map(
    (item) => Number.parseFloat(item["Costo"].replace("ARS", "").replace(/,/g, "")) || 0
  )

  // Crear el gráfico
  charts.timeChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Impresiones",
          data: impresionesData,
          borderColor: CHART_COLORS.yellow,
          backgroundColor: CHART_COLORS.yellow,
          tension: 0.3,
          yAxisID: "y",
        },
        {
          label: "Costo (ARS)",
          data: costoData,
          borderColor: CHART_COLORS.green,
          backgroundColor: CHART_COLORS.green,
          tension: 0.3,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: "index",
        intersect: false,
      },
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Impresiones",
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Costo (ARS)",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  })
}

// Función para crear el gráfico de dispositivos
function createDeviceChart() {
  const ctx = document.getElementById("device-chart").getContext("2d")

  // Preparar datos para el gráfico
  const labels = data.devices.map((device) => device["Dispositivo"])

  const costoData = data.devices.map(
    (device) => Number.parseFloat(device["Costo"].replace("ARS", "").replace(/,/g, "")) || 0,
  )

  // Crear el gráfico
  charts.deviceChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: labels,
      datasets: [
        {
          data: costoData,
          backgroundColor: [CHART_COLORS.blue, CHART_COLORS.green, CHART_COLORS.yellow, CHART_COLORS.purple],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw
              return `ARS ${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            },
          },
        },
      },
    },
  })
}

// Función para crear el gráfico de redes
function createNetworkChart() {
  const ctx = document.getElementById("network-chart").getContext("2d")

  // Preparar datos para el gráfico
  const labels = data.networks.map((network) => network["Red"])

  const clicsData = data.networks.map((network) => Number.parseInt(network["Clics"].replace(/,/g, ""), 10) || 0)
  const costoData = data.networks.map(
    (network) => Number.parseFloat(network["Costo"].replace("ARS", "").replace(/,/g, "")) || 0,
  )

  // Crear el gráfico
  charts.networkChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Clics",
          data: clicsData,
          backgroundColor: CHART_COLORS.blue,
          yAxisID: "y",
        },
        {
          label: "Costo (ARS)",
          data: costoData,
          backgroundColor: CHART_COLORS.green,
          yAxisID: "y1",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          type: "linear",
          display: true,
          position: "left",
          title: {
            display: true,
            text: "Clics",
          },
        },
        y1: {
          type: "linear",
          display: true,
          position: "right",
          title: {
            display: true,
            text: "Costo (ARS)",
          },
          grid: {
            drawOnChartArea: false,
          },
        },
      },
    },
  })
}

// Función para crear el gráfico de género
function createGenderChart() {
  const ctx = document.getElementById("gender-chart").getContext("2d")

  // Preparar datos para el gráfico
  const labels = data.demographicsGender.map((demo) => demo["Género"])

  const porcentajeData = data.demographicsGender.map(
    (demo) => Number.parseFloat(demo["Porcentaje del total conocido"].replace("%", "")) || 0,
  )

  // Crear el gráfico
  charts.genderChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: labels,
      datasets: [
        {
          data: porcentajeData,
          backgroundColor: [CHART_COLORS.blue, CHART_COLORS.pink],
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "right",
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw
              return `${value.toFixed(1)}%`
            },
          },
        },
      },
    },
  })
}

// Función para crear el gráfico de edad
function createAgeChart() {
  const ctx = document.getElementById("age-chart").getContext("2d")

  // Preparar datos para el gráfico
  const labels = data.demographicsAge.map((demo) => demo["Rango de edades"])

  const porcentajeData = data.demographicsAge.map(
    (demo) => Number.parseFloat(demo["Porcentaje del total conocido"].replace("%", "")) || 0,
  )

  // Crear el gráfico
  charts.ageChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labels,
      datasets: [
        {
          label: "Porcentaje",
          data: porcentajeData,
          backgroundColor: CHART_COLORS.purple,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      indexAxis: "y",
      plugins: {
        legend: {
          display: false,
        },
        tooltip: {
          callbacks: {
            label: (context) => {
              const value = context.raw
              return `${value.toFixed(1)}%`
            },
          },
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: "Porcentaje (%)",
          },
        },
      },
    },
  })
}

// Cargar todos los datos al cargar la página
document.addEventListener("DOMContentLoaded", loadAllData)

