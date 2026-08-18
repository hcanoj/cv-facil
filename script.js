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

        const experiencia =
            document.getElementById("experiencia").value.trim();

        const formacion =
            document.getElementById("formacion").value.trim();

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


        document.getElementById("cvExperiencia").textContent =
            experiencia ||
            "Tu experiencia profesional aparecerá aquí.";


        document.getElementById("cvFormacion").textContent =
            formacion ||
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
