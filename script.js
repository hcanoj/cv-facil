document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       ELEMENTOS PRINCIPALES
    ================================================= */

    const generateButton =
        document.getElementById("generateButton");

    const printButton =
        document.getElementById("printButton");

    const addExperienceButton =
        document.getElementById("addExperience");

    const addEducationButton =
        document.getElementById("addEducation");

    const experienceList =
        document.getElementById("experienceList");

    const educationList =
        document.getElementById("educationList");

    const templateButtons =
        document.querySelectorAll(".template-option");


    let experienceCounter = 0;
    let educationCounter = 0;


    /* =================================================
       URL DEL BACKEND
    ================================================= */

    const AI_BACKEND_URL =
        "https://bitter-band-b917.hectorcanojimenez.workers.dev";


    /* =================================================
       UTILIDADES
    ================================================= */

    function getValue(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return "";
        }

        return element.value.trim();

    }


    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    /* =================================================
       EXPERIENCIA
    ================================================= */

    function addExperience() {

        experienceCounter++;

        const item =
            document.createElement("div");

        item.className =
            "repeatable-item";


        item.innerHTML = `

            <div class="repeatable-header">

                <span class="repeatable-title">
                    Experiencia ${experienceCounter}
                </span>

                <button
                    type="button"
                    class="delete-button"
                >
                    Eliminar
                </button>

            </div>


            <div class="field">

                <label>
                    Puesto
                </label>

                <input
                    type="text"
                    class="experience-position"
                    placeholder="Ej: Diseñador gráfico"
                >

            </div>


            <div class="field">

                <label>
                    Empresa
                </label>

                <input
                    type="text"
                    class="experience-company"
                    placeholder="Ej: Agencia Creativa"
                >

            </div>


            <div class="two-columns">

                <div class="field">

                    <label>
                        Fecha de inicio
                    </label>

                    <input
                        type="text"
                        class="experience-start"
                        placeholder="2022"
                    >

                </div>


                <div class="field">

                    <label>
                        Fecha de finalización
                    </label>

                    <input
                        type="text"
                        class="experience-end"
                        placeholder="Actualidad"
                    >

                </div>

            </div>


            <div class="field">

                <label>
                    Responsabilidades y logros
                </label>

                <textarea
                    class="experience-description"
                    rows="4"
                    placeholder="Describe tus principales responsabilidades y logros..."
                ></textarea>


                <button
                    type="button"
                    class="ai-button"
                >
                    ✨ Mejorar con IA
                </button>

            </div>

        `;


        const deleteButton =
            item.querySelector(".delete-button");


        deleteButton.addEventListener(
            "click",
            function () {

                item.remove();

                updateCV();

            }
        );


        const aiButton =
            item.querySelector(".ai-button");


        aiButton.addEventListener(
            "click",
            function () {

                mejorarExperienciaConIA(
                    item,
                    aiButton
                );

            }
        );


        experienceList.appendChild(item);

        updateCV();

    }


    /* =================================================
       FORMACIÓN
    ================================================= */

    function addEducation() {

        educationCounter++;

        const item =
            document.createElement("div");

        item.className =
            "repeatable-item";


        item.innerHTML = `

            <div class="repeatable-header">

                <span class="repeatable-title">
                    Formación ${educationCounter}
                </span>

                <button
                    type="button"
                    class="delete-button"
                >
                    Eliminar
                </button>

            </div>


            <div class="field">

                <label>
                    Titulación
                </label>

                <input
                    type="text"
                    class="education-title"
                    placeholder="Ej: Grado en Diseño Gráfico"
                >

            </div>


            <div class="field">

                <label>
                    Centro educativo
                </label>

                <input
                    type="text"
                    class="education-school"
                    placeholder="Ej: Universidad de Madrid"
                >

            </div>


            <div class="field">

                <label>
                    Año
                </label>

                <input
                    type="text"
                    class="education-date"
                    placeholder="2020"
                >

            </div>

        `;


        const deleteButton =
            item.querySelector(".delete-button");


        deleteButton.addEventListener(
            "click",
            function () {

                item.remove();

                updateCV();

            }
        );


        educationList.appendChild(item);

        updateCV();

    }


    /* =================================================
       OBTENER EXPERIENCIAS
    ================================================= */

    function getExperiences() {

        const items =
            experienceList.querySelectorAll(
                ".repeatable-item"
            );


        return Array.from(items).map(
            function (item) {

                return {

                    position:
                        item.querySelector(
                            ".experience-position"
                        ).value.trim(),

                    company:
                        item.querySelector(
                            ".experience-company"
                        ).value.trim(),

                    start:
                        item.querySelector(
                            ".experience-start"
                        ).value.trim(),

                    end:
                        item.querySelector(
                            ".experience-end"
                        ).value.trim(),

                    description:
                        item.querySelector(
                            ".experience-description"
                        ).value.trim()

                };

            }
        );

    }


    /* =================================================
       OBTENER FORMACIÓN
    ================================================= */

    function getEducation() {

        const items =
            educationList.querySelectorAll(
                ".repeatable-item"
            );


        return Array.from(items).map(
            function (item) {

                return {

                    title:
                        item.querySelector(
                            ".education-title"
                        ).value.trim(),

                    school:
                        item.querySelector(
                            ".education-school"
                        ).value.trim(),

                    date:
                        item.querySelector(
                            ".education-date"
                        ).value.trim()

                };

            }
        );

    }


    /* =================================================
       DATOS PERSONALES
    ================================================= */

    function updatePersonalData() {

        const name =
            getValue("nombre");

        const job =
            getValue("profesion");

        const email =
            getValue("email");

        const phone =
            getValue("telefono");

        const location =
            getValue("ubicacion");

        const profile =
            getValue("perfil");

        const skills =
            getValue("skills");

        const languages =
            getValue("languages");


        const cvName =
            document.getElementById("cvName");

        if (cvName) {

            cvName.textContent =
                name || "Tu nombre";

        }


        const cvJob =
            document.getElementById("cvJob");

        if (cvJob) {

            cvJob.textContent =
                job || "Tu profesión";

        }


        const contact =
            document.getElementById("cvContact");


        if (contact) {

            contact.innerHTML = "";


            [
                email || "email@ejemplo.com",
                phone || "Teléfono",
                location || "Ubicación"
            ].forEach(
                function (value) {

                    const span =
                        document.createElement(
                            "span"
                        );

                    span.textContent =
                        value;

                    contact.appendChild(
                        span
                    );

                }
            );

        }


        const cvProfile =
            document.getElementById("cvProfile");


        if (cvProfile) {

            cvProfile.textContent =
                profile ||
                "Tu perfil profesional aparecerá aquí.";

        }


        const cvSkills =
            document.getElementById("cvSkills");


        if (cvSkills) {

            cvSkills.textContent =
                skills ||
                "Tus habilidades aparecerán aquí.";

        }


        const cvLanguages =
            document.getElementById("cvLanguages");


        if (cvLanguages) {

            cvLanguages.textContent =
                languages ||
                "Tus idiomas aparecerán aquí.";

        }

    }


    /* =================================================
       ACTUALIZAR EXPERIENCIAS EN EL CV
    ================================================= */

    function updateExperiences() {

        const container =
            document.getElementById(
                "cvExperienceList"
            );


        if (!container) {
            return;
        }


        const experiences =
            getExperiences();


        container.innerHTML = "";


        if (experiences.length === 0) {

            container.innerHTML = `
                <div class="empty-cv">
                    Tu experiencia aparecerá aquí.
                </div>
            `;

            return;

        }


        experiences.forEach(
            function (experience) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "cv-experience";


                const position =
                    escapeHTML(
                        experience.position ||
                        "Puesto"
                    );


                const company =
                    escapeHTML(
                        experience.company ||
                        "Empresa"
                    );


                const start =
                    escapeHTML(
                        experience.start
                    );


                const end =
                    escapeHTML(
                        experience.end
                    );


                const description =
                    escapeHTML(
                        experience.description ||
                        "Descripción de la experiencia."
                    );


                let dates = "";


                if (start || end) {

                    dates =
                        " · " +
                        (start || "") +
                        " - " +
                        (end || "");

                }


                item.innerHTML = `

                    <h4>
                        ${position}
                    </h4>

                    <div class="cv-meta">
                        ${company}${dates}
                    </div>

                    <p>
                        ${description}
                    </p>

                `;


                container.appendChild(
                    item
                );

            }
        );

    }


    /* =================================================
       ACTUALIZAR FORMACIÓN
    ================================================= */

    function updateEducation() {

        const container =
            document.getElementById(
                "cvEducationList"
            );


        if (!container) {
            return;
        }


        const education =
            getEducation();


        container.innerHTML = "";


        if (education.length === 0) {

            container.innerHTML = `
                <div class="empty-cv">
                    Tu formación aparecerá aquí.
                </div>
            `;

            return;

        }


        education.forEach(
            function (data) {

                const item =
                    document.createElement(
                        "div"
                    );


                item.className =
                    "cv-education";


                const title =
                    escapeHTML(
                        data.title ||
                        "Titulación"
                    );


                const school =
                    escapeHTML(
                        data.school ||
                        "Centro educativo"
                    );


                const date =
                    escapeHTML(
                        data.date
                    );


                item.innerHTML = `

                    <h4>
                        ${title}
                    </h4>

                    <div class="cv-meta">

                        ${school}

                        ${
                            date
                                ? " · " + date
                                : ""
                        }

                    </div>

                `;


                container.appendChild(
                    item
                );

            }
        );

    }


    /* =================================================
       ACTUALIZAR CV
    ================================================= */

    function updateCV() {

        updatePersonalData();

        updateExperiences();

        updateEducation();

    }


    /* =================================================
       IA - FUNCIÓN GENERAL
    ================================================= */

    async function mejorarTextoConIA(
        textarea,
        button,
        mensajeVacio = "Escribe primero un texto."
    ) {

        if (!textarea || !button) {
            return;
        }


        const originalText =
            textarea.value.trim();


        if (!originalText) {

            alert(mensajeVacio);

            return;

        }


        button.disabled = true;

        button.classList.add("loading");

        button.textContent =
            "✨ Mejorando...";


        try {

            console.log(
                "IA: enviando petición..."
            );


            const response =
                await fetch(
                    AI_BACKEND_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({
                            description:
                                originalText
                        })
                    }
                );


            let data;


            try {

                data =
                    await response.json();

            } catch {

                throw new Error(
                    "El servidor no devolvió una respuesta válida."
                );

            }


            if (!response.ok) {

                console.error(
                    "Respuesta del servidor:",
                    data
                );


                throw new Error(
                    data.error ||
                    "El servidor ha rechazado la petición."
                );

            }


            if (
                !data.text ||
                typeof data.text !== "string" ||
                !data.text.trim()
            ) {

                console.error(
                    "Respuesta IA sin texto:",
                    data
                );


                throw new Error(
                    "La IA no devolvió ningún texto."
                );

            }


            textarea.value =
                data.text.trim();


            updateCV();


        } catch (error) {

            console.error(
                "Error IA:",
                error
            );


            alert(
                error.message ||
                "No se ha podido mejorar el texto."
            );


        } finally {

            button.disabled = false;

            button.classList.remove(
                "loading"
            );

            button.textContent =
                "✨ Mejorar con IA";

        }

    }


    /* =================================================
       IA - EXPERIENCIA
    ================================================= */

    async function mejorarExperienciaConIA(
        item,
        button
    ) {

        const textarea =
            item.querySelector(
                ".experience-description"
            );


        await mejorarTextoConIA(
            textarea,
            button,
            "Escribe primero una descripción de tu experiencia."
        );

    }


    /* =================================================
       IA - PERFIL
    ================================================= */

    async function mejorarPerfilConIA() {

        const textarea =
            document.getElementById("perfil");

        const button =
            document.getElementById("improveProfile");


        await mejorarTextoConIA(
            textarea,
            button,
            "Escribe primero tu perfil profesional."
        );

    }


    /* =================================================
       IA - HABILIDADES
    ================================================= */

    async function mejorarHabilidadesConIA() {

        const textarea =
            document.getElementById("skills");

        const button =
            document.getElementById("improveSkills");


        await mejorarTextoConIA(
            textarea,
            button,
            "Escribe primero tus habilidades."
        );

    }


    /* =================================================
       PLANTILLAS
    ================================================= */

    templateButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    templateButtons.forEach(
                        function (other) {

                            other.classList.remove(
                                "active"
                            );

                        }
                    );


                    button.classList.add(
                        "active"
                    );


                    const template =
                        button.dataset.template;


                    const cv =
                        document.getElementById(
                            "cv"
                        );


                    if (!cv) {
                        return;
                    }


                    cv.classList.remove(
                        "template-professional",
                        "template-minimal",
                        "template-modern"
                    );


                    cv.classList.add(
                        "template-" +
                        template
                    );

                }
            );

        }
    );


    /* =================================================
       BOTONES
    ================================================= */

    if (addExperienceButton) {

        addExperienceButton.addEventListener(
            "click",
            addExperience
        );

    }


    if (addEducationButton) {

        addEducationButton.addEventListener(
            "click",
            addEducation
        );

    }


    if (generateButton) {

        generateButton.addEventListener(
            "click",
            updateCV
        );

    }


    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {

                updateCV();

                window.print();

            }
        );

    }


    /* =================================================
       BOTONES IA
    ================================================= */

    const improveProfileButton =
        document.getElementById("improveProfile");

    const improveSkillsButton =
        document.getElementById("improveSkills");


    if (improveProfileButton) {

        improveProfileButton.addEventListener(
            "click",
            mejorarPerfilConIA
        );

    }


    if (improveSkillsButton) {

        improveSkillsButton.addEventListener(
            "click",
            mejorarHabilidadesConIA
        );

    }


    /* =================================================
       ACTUALIZACIÓN AUTOMÁTICA
    ================================================= */

    document.addEventListener(
        "input",
        function (event) {

            if (
                event.target.matches(
                    "input, textarea"
                )
            ) {

                updateCV();

            }

        }
    );


    /* =================================================
       INICIAR
    ================================================= */

    if (experienceList) {

        addExperience();

    }


    if (educationList) {

        addEducation();

    }


    updateCV();

});
