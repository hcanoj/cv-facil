document.addEventListener("DOMContentLoaded", function () {

    const botonGenerar = document.getElementById("generarCV");
    const botonImprimir = document.getElementById("imprimirCV");


    /* =========================================
       ACTUALIZAR CV
    ========================================= */

    botonGenerar.addEventListener("click", function () {

        const nombre =
            document.getElementById("nombre").value.trim();

        const profesion =
            document.getElementById("profesion").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const telefono =
            document.getElementById("telefono").value.trim();

        const ubicacion =
            document.getElementById("ubicacion").value.trim();

        const perfil =
            document.getElementById("perfil").value.trim();

     const puesto =
    document.getElementById("puesto").value.trim();

const empresa =
    document.getElementById("empresa").value.trim();

const fechaInicio =
    document.getElementById("fechaInicio").value.trim();

const fechaFin =
    document.getElementById("fechaFin").value.trim();

const experiencia =
    document.getElementById("experiencia").value.trim();

const titulo =
    document.getElementById("titulo").value.trim();

const centro =
    document.getElementById("centro").value.trim();

const fechaFormacion =
    document.getElementById("fechaFormacion").value.trim();

        const habilidades =
            document.getElementById("habilidades").value.trim();


        document.getElementById("cvNombre").textContent =
            nombre || "Tu nombre";


        document.getElementById("cvProfesion").textContent =
            profesion || "Tu profesión";


        const contacto = [
            email || "email@ejemplo.com",
            telefono || "Teléfono",
            ubicacion || "Ubicación"
        ];


        document.getElementById("cvContacto").textContent =
            contacto.join(" · ");


        document.getElementById("cvPerfil").textContent =
            perfil ||
            "Tu perfil profesional aparecerá aquí.";


      const experienciaCompleta = [
    puesto,
    empresa,
    fechaInicio || fechaFin
].filter(Boolean).join(" · ");


document.getElementById("cvExperiencia").textContent =
    experienciaCompleta
        ? experienciaCompleta + "\n" + experiencia
        : "Tu experiencia profesional aparecerá aquí.";


const formacionCompleta = [
    titulo,
    centro,
    fechaFormacion
].filter(Boolean).join(" · ");


document.getElementById("cvFormacion").textContent =
    formacionCompleta ||
    "Tu formación aparecerá aquí.";


        document.getElementById("cvHabilidades").textContent =
            habilidades ||
            "Tus habilidades aparecerán aquí.";

    });


    /* =========================================
       DESCARGAR / IMPRIMIR PDF
    ========================================= */

    botonImprimir.addEventListener("click", function () {

        window.print();

    });

});
