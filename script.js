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

    const improveProfileButton =
        document.getElementById("improveProfile");

    const improveSkillsButton =
        document.getElementById("improveSkills");


    /* =================================================
       CONTADORES
    ================================================= */

    let experienceCounter = 0;
    let educationCounter = 0;


    /* =================================================
       CONFIGURACIÓN IA
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
       GUARDADO AUTOMÁTICO
    ================================================= */

    function saveData() {

        try {

            const data = {

                nombre:
                    getValue("nombre"),

                profesion:
                    getValue("profesion"),

                email:
                    getValue("email"),

                telefono:
                    getValue("telefono"),

                ubicacion:
                    getValue("ubicacion"),

                perfil:
                    getValue("perfil"),

                skills:
                    getValue("skills"),

                languages:
                    getValue("languages"),

                experiences:
                    getExperiences(),

                education:
                    getEducation(),

                template:
                    getCurrentTemplate()

            };

            localStorage.setItem(
                "cvFacilData",
                JSON.stringify(data)
            );

        } catch (error) {

            console.error(
                "No se pudieron guardar los datos:",
                error
            );

        }
    }


    /* =================================================
       OBTENER PLANTILLA ACTUAL
    ================================================= */

    function getCurrentTemplate() {

        const cv =
            document.getElementById("cv");

        if (!cv) {
            return "professional";
        }

        if (
            cv.classList.contains(
                "template-minimal"
            )
        ) {
            return "minimal";
        }

        if (
            cv.classList.contains(
                "template-modern"
            )
        ) {
            return "modern";
        }

        return "professional";
    }


    /* =================================================
       CARGAR DATOS GUARDADOS
    ================================================= */

    function loadData() {

        try {

            const saved =
                localStorage.getItem(
                    "cvFacilData"
                );

            if (!saved) {
                return;
            }

            const data =
                JSON.parse(saved);


            /* DATOS PERSONALES */

            setValue(
                "nombre",
                data.nombre
            );

            setValue(
                "profesion",
                data.profesion
            );

            setValue(
                "email",
                data.email
            );

            setValue(
                "telefono",
                data.telefono
            );

            setValue(
                "ubicacion",
                data.ubicacion
            );

            setValue(
                "perfil",
                data.perfil
            );

            setValue(
                "skills",
                data.skills
            );

            setValue(
                "languages",
                data.languages
            );


            /* EXPERIENCIA */

            if (
                Array.isArray(
                    data.experiences
                )
            ) {

                data.experiences.forEach(
                    function (experience) {

                        addExperience(
                            experience
                        );

                    }
                );

            }


            /* FORMACIÓN */

            if (
                Array.isArray(
                    data.education
                )
            ) {

                data.education.forEach(
                    function (education) {

                        addEducation(
                            education
                        );

                    }
                );

            }


            /* PLANTILLA */

            if (data.template) {

                setTemplate(
                    data.template
                );

            }

        } catch (error) {

            console.error(
                "No se pudieron cargar los datos guardados:",
                error
            );

        }
    }


    function setValue(id, value) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.value =
            typeof value === "string"
                ? value
                : "";
    }


    /* =================================================
       EXPERIENCIA
    ================================================= */

    function addExperience(data = {}) {

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
                    value="${escapeHTML(
                        data.position || ""
                    )}"
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
                    value="${escapeHTML(
                        data.company || ""
                    )}"
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
                        value="${escapeHTML(
                            data.start || ""
                        )}"
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
                        value="${escapeHTML(
                            data.end || ""
                        )}"
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
                >${escapeHTML(
                    data.description || ""
                )}</textarea>


                <button
                    type="button"
                    class="ai-button"
                >
                    ✨ Mejorar con IA
                </button>

            </div>

        `;


        /* ELIMINAR */

        const deleteButton =
            item.querySelector(
                ".delete-button"
            );


        deleteButton.addEventListener(
            "click",
            function () {

                item.remove();

                updateCV();

                saveData();

            }
        );


        /* IA */

        const aiButton =
            item.querySelector(
                ".ai-button"
            );


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

    function addEducation(data = {}) {

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
                    value="${escapeHTML(
                        data.title || ""
                    )}"
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
                    value="${escapeHTML(
                        data.school || ""
                    )}"
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
                    value="${escapeHTML(
                        data.date || ""
                    )}"
                >

            </div>

        `;


        const deleteButton =
            item.querySelector(
                ".delete-button"
            );


        deleteButton.addEventListener(
            "click",
            function () {

                item.remove();

                updateCV();

                saveData();

            }
        );


        educationList.appendChild(item);


        updateCV();
    }


    /* =================================================
       OBTENER EXPERIENCIAS
    ================================================= */

    function getExperiences() {

        if (!experienceList) {
            return [];
        }


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
                        )?.value.trim() || "",

                    company:
                        item.querySelector(
                            ".experience-company"
                        )?.value.trim() || "",

                    start:
                        item.querySelector(
                            ".experience-start"
                        )?.value.trim() || "",

                    end:
                        item.querySelector(
                            ".experience-end"
                        )?.value.trim() || "",

                    description:
                        item.querySelector(
                            ".experience-description"
                        )?.value.trim() || ""

                };

            }
        );
    }


    /* =================================================
       OBTENER FORMACIÓN
    ================================================= */

    function getEducation() {

        if (!educationList) {
            return [];
        }


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
                        )?.value.trim() || "",

                    school:
                        item.querySelector(
                            ".education-school"
                        )?.value.trim() || "",

                    date:
                        item.querySelector(
                            ".education-date"
                        )?.value.trim() || ""

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


        /* NOMBRE */

        const cvName =
            document.getElementById(
                "cvName"
            );

        if (cvName) {

            cvName.textContent =
                name || "Tu nombre";

        }


        /* PROFESIÓN */

        const cvJob =
            document.getElementById(
                "cvJob"
            );

        if (cvJob) {

            cvJob.textContent =
                job || "Tu profesión";

        }


        /* CONTACTO */

        const contact =
            document.getElementById(
                "cvContact"
            );


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


        /* PERFIL */

        const cvProfile =
            document.getElementById(
                "cvProfile"
            );


        if (cvProfile) {

            cvProfile.textContent =
                profile ||
                "Tu perfil profesional aparecerá aquí.";

        }


        /* HABILIDADES */

        const cvSkills =
            document.getElementById(
                "cvSkills"
            );


        if (cvSkills) {

            cvSkills.textContent =
                skills ||
                "Tus habilidades aparecerán aquí.";

        }


        /* IDIOMAS */

        const cvLanguages =
            document.getElementById(
                "cvLanguages"
            );


        if (cvLanguages) {

            cvLanguages.textContent =
                languages ||
                "Tus idiomas aparecerán aquí.";

        }

    }


    /* =================================================
       EXPERIENCIAS EN EL CV
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
       FORMACIÓN EN EL CV
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
        tipo = "experiencia",
        mensajeVacio = "Escribe primero un texto."
    ) {

        if (!textarea || !button) {
            return;
        }


        const originalText =
            textarea.value.trim();


        if (!originalText) {

            alert(mensajeVacio);

            textarea.focus();

            return;
        }


        /* LÍMITE DE SEGURIDAD */

        if (originalText.length > 5000) {

            alert(
                "El texto es demasiado largo. Utiliza un máximo de 5000 caracteres."
            );

            return;
        }


        const textoOriginal =
            button.textContent;


        button.disabled = true;

        button.classList.add(
            "loading"
        );

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
                                originalText,

                            type:
                                tipo

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
                    "Respuesta del Worker:",
                    data
                );


                throw new Error(
                    data?.error ||
                    "El servidor ha rechazado la petición."
                );
            }


            if (
                !data.text ||
                typeof data.text !== "string" ||
                !data.text.trim()
            ) {

                throw new Error(
                    "La IA no devolvió ningún texto."
                );

            }


            textarea.value =
                data.text.trim();


            updateCV();

            saveData();


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
                textoOriginal;

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
            "experiencia",
            "Escribe primero una descripción de tu experiencia."
        );

    }


    /* =================================================
       IA - PERFIL
    ================================================= */

    if (improveProfileButton) {

        improveProfileButton.addEventListener(
            "click",
            function () {

                const textarea =
                    document.getElementById(
                        "perfil"
                    );


                mejorarTextoConIA(
                    textarea,
                    improveProfileButton,
                    "perfil",
                    "Escribe primero tu perfil profesional."
                );

            }
        );

    }


    /* =================================================
       IA - HABILIDADES
    ================================================= */

    if (improveSkillsButton) {

        improveSkillsButton.addEventListener(
            "click",
            function () {

                const textarea =
                    document.getElementById(
                        "skills"
                    );


                mejorarTextoConIA(
                    textarea,
                    improveSkillsButton,
                    "habilidades",
                    "Escribe primero tus habilidades."
                );

            }
        );

    }


    /* =================================================
       PLANTILLAS
    ================================================= */

    function setTemplate(template) {

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
            "template-" + template
        );


        templateButtons.forEach(
            function (button) {

                button.classList.toggle(
                    "active",
                    button.dataset.template ===
                    template
                );

            }
        );


        saveData();
    }


    templateButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    setTemplate(
                        button.dataset.template
                    );

                }
            );

        }
    );


    /* =================================================
       BOTÓN AÑADIR EXPERIENCIA
    ================================================= */

    if (addExperienceButton) {

        addExperienceButton.addEventListener(
            "click",
            function () {

                addExperience();

                saveData();

            }
        );

    }


    /* =================================================
       BOTÓN AÑADIR FORMACIÓN
    ================================================= */

    if (addEducationButton) {

        addEducationButton.addEventListener(
            "click",
            function () {

                addEducation();

                saveData();

            }
        );

    }


    /* =================================================
       BOTÓN ACTUALIZAR
    ================================================= */

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                updateCV();

                saveData();

            }
        );

    }


    /* =================================================
       GUARDAR / IMPRIMIR PDF
    ================================================= */

    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {

                updateCV();

                saveData();


                setTimeout(
                    function () {

                        window.print();

                    },
                    100
                );

            }
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

                saveData();

            }

        }
    );


    /* =================================================
       INICIAR APLICACIÓN
    ================================================= */

    loadData();


    /*
       Si no existen datos guardados,
       añadimos una experiencia y una formación
       de ejemplo vacías.
    */

    if (
        experienceList &&
        experienceList.children.length === 0
    ) {

        addExperience();

    }


    if (
        educationList &&
        educationList.children.length === 0
    ) {

        addEducation();

    }


    updateCV();

});
