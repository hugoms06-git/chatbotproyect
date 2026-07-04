/* ============================================
   JAVASCRIPT - toda la "magia" está aquí
   ============================================ */

/* ---------- 1. Rotación automática de pasos ---------- */

const steps = document.querySelectorAll(".step");
const STEP_DURATION = 5000; // 5 segundos por paso
let currentStep = 0;
let paused = false;
let stepTimer;

function activateStep(index) {
    // Quita "active" de todos los pasos y resetea sus barras
    steps.forEach(function (step) {
        step.classList.remove("active");
        const bar = step.querySelector(".step-progress");
        bar.style.transition = "none"; // sin animación al resetear
        bar.style.width = "0%";
    });

    // Activa el paso pedido
    const step = steps[index];
    step.classList.add("active");

    // Lanza su barra de progreso de 0 a 100%
    // (el pequeño setTimeout deja que el navegador aplique
    //  primero el width 0 antes de animar al 100)
    const bar = step.querySelector(".step-progress");
    setTimeout(function () {
        bar.style.transition = "width " + STEP_DURATION + "ms linear";
        bar.style.width = "100%";
    }, 50);
}

function nextStep() {
    currentStep = (currentStep + 1) % steps.length; // 0,1,2,3,0,1...
    activateStep(currentStep);
}

function startRotation() {
    stepTimer = setInterval(function () {
        if (!paused) nextStep();
    }, STEP_DURATION);
}

// Clic manual en un paso: salta a él y reinicia el reloj
steps.forEach(function (step, index) {
    step.addEventListener("click", function () {
        currentStep = index;
        activateStep(index);
        clearInterval(stepTimer);
        startRotation();
    });
});

/* ---------- 2. Botón de pausa ---------- */

const pauseBtn = document.getElementById("pauseBtn");

pauseBtn.addEventListener("click", function () {
    paused = !paused; // alterna true/false
    pauseBtn.textContent = paused ? "▶" : "❚❚";
});

/* ---------- 3. Contadores animados ---------- */

// Anima un número de 0 a "target" en "duration" ms
function animateCounter(element, target, duration, suffix) {
    const start = performance.now();

    function update(now) {
        const progress = Math.min((now - start) / duration, 1); // 0 a 1
        const value = (target * progress).toFixed(1);
        element.textContent = value + suffix;
        if (progress < 1) requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
}

animateCounter(document.getElementById("metric1"), 83.9, 1200, "%");
animateCounter(document.getElementById("metric3"), 90, 1200, "%");

/* ---------- 4. Barras de topics ---------- */

// Cada barra crece hasta el % guardado en su data-value
document.querySelectorAll(".topic-fill").forEach(function (fill) {
    setTimeout(function () {
        fill.style.width = fill.dataset.value + "%";
    }, 300);
});

/* ---------- 5. Datos por industria (las pestañas) ---------- */

const industryData = {
    saas: {
        metrics: ["83.9%", "3d 20h", "90%"],
        topics: [
            ["Billing disputes", 41],
            ["Plan changes", 24],
            ["Access issues", 18],
            ["FAQs", 10]
        ]
    },
    ecommerce: {
        metrics: ["76.2%", "1d 4h", "88%"],
        topics: [
            ["Order tracking", 47],
            ["Returns", 28],
            ["Product questions", 15],
            ["Discounts", 7]
        ]
    },
    fintech: {
        metrics: ["91.4%", "2d 11h", "93%"],
        topics: [
            ["Account access", 38],
            ["Transactions", 31],
            ["KYC verification", 19],
            ["Card issues", 9]
        ]
    }
};

const tabs = document.querySelectorAll(".tab");

tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
        // Mueve la clase "active" a la pestaña pulsada
        tabs.forEach(function (t) { t.classList.remove("active"); });
        tab.classList.add("active");

        // Carga los datos de esa industria
        const data = industryData[tab.dataset.industry];

        // Actualiza métricas (la 1 y la 3 con contador animado)
        animateCounter(document.getElementById("metric1"), parseFloat(data.metrics[0]), 800, "%");
        document.getElementById("metric2").textContent = data.metrics[1];
        animateCounter(document.getElementById("metric3"), parseFloat(data.metrics[2]), 800, "%");

        // Actualiza nombres, porcentajes y barras de topics
        const rows = document.querySelectorAll(".topic-row");
        rows.forEach(function (row, i) {
            row.querySelector(".topic-name").textContent = data.topics[i][0];
            row.querySelector(".topic-pct").textContent = data.topics[i][1] + "%";
            const fill = row.querySelector(".topic-fill");
            fill.style.width = "0%";
            setTimeout(function () {
                fill.style.width = data.topics[i][1] + "%";
            }, 100);
        });
    });
});

/* ---------- Arranque ---------- */
activateStep(0);
startRotation();