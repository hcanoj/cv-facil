document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       ELEMENTOS PRINCIPALES
    ===================================================== */

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


    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const AI_BACKEND_URL =
        "https://bitter-band-b917.hectorcanojimenez.workers.dev";

    const STORAGE_KEY =
        "cv_facil_data_v1";


    let experienceCounter = 0;
    let educationCounter = 0;


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function getValue(id) {

        const element =
            document.getElementById(id);

        if (!element) {
            return "";
        }

        return element.value.trim();

    }


    function setValue(id, value) {

        const element =
            document.getElementById(id);

        if (element) {
            element.value = value || "";
        }

    }


    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text || "";

        return div.innerHTML;

    }


    /* =====================================================
       GUARDADO AUTOMÁTICO
    ===================================================== */

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
                    document.getElementById("cv")
                        ?.className || ""

            };

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

        } catch (error) {

            console.error(
                "No se pudieron guardar los datos:",
                error
            );

        }

    }


    /* =====================================================
       CARGAR DATOS
    ===================================================== */

    function loadData() {

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (!saved) {
                return false;
            }

            const data =
                JSON.parse(saved);


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


            /* =============================================
               EXPERIENCIAS
            ============================================= */

            if (
                Array.isArray(data.experiences) &&
                data.experiences.length > 0
            ) {

                data.experiences.forEach(
                    function (experience) {

                        addExperience(
                            experience
                        );

                    }
                );

            }


            /* =============================================
               FORMACIÓN
            ============================================= */

            if (
                Array.isArray(data.education) &&
                data.education.length > 0
            ) {

                data.education.forEach(
                    function (education) {

                        addEducation(
                            education
                        );

                    }
                );

            }


            /* =============================================
               PLANTILLA
            ============================================= */

            if (data.template) {

                const cv =
                    document.getElementById("cv");

                const template =
                    data.template.match(
                        /template-(professional|minimal|modern)/
                    );

                if (
                    cv &&
                    template
                ) {

                    cv.classList.remove(
                        "template-professional",
                        "template-minimal",
                        "template-modern"
                    );

                    cv.classList.add(
                        template[0]
                    );


                    templateButtons.forEach(
                        function (button) {

                            button.classList.toggle(
                                "active",
                                button.dataset.template ===
                                template[1]
                            );

                        }
                    );

                }

            }


            return true;

        } catch (error) {

            console.error(
                "Error cargando datos:",
                error
            );

            return false;

        }

    }


    /* =====================================================
       EXPERIENCIA
    ===================================================== */

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
                    value="${escapeHTML(data.position || "")}"
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
                    value="${escapeHTML(data.company || "")}"
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
                        value="${escapeHTML(data.start || "")}"
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
                        value="${escapeHTML(data.end || "")}"
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
                >${escapeHTML(data.description || "")}</textarea>


                <button
                    type="button"
                    class="ai-button"
                >
                    ✨ Mejorar con IA
                </button>

            </div>

        `;


        /* =============================================
           ELIMINAR
        ============================================= */

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


        /* =============================================
           IA EXPERIENCIA
        ============================================= */

        const aiButton =
            item.querySelector(
                ".ai-button"
            );


        aiButton.addEventListener(
            "click",
            function () {

                mejorarTextoConIA(
                    item.querySelector(
                        ".experience-description"
                    ),
                    aiButton,
                    "experience",
                    "Escribe primero una descripción de tu experiencia."
                );

            }
        );


        experienceList.appendChild(item);

        updateCV();

    }


    /* =====================================================
       FORMACIÓN
    ===================================================== */

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
                    value="${escapeHTML(data.title || "")}"
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
                    value="${escapeHTML(data.school || "")}"
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
                    value="${escapeHTML(data.date || "")}"
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


    /* =====================================================
       OBTENER EXPERIENCIAS
    ===================================================== */

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


    /* =====================================================
       OBTENER FORMACIÓN
    ===================================================== */

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


    /* =====================================================
       DATOS PERSONALES
    ===================================================== */

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


        const cvProfile =
            document.getElementById(
                "cvProfile"
            );


        if (cvProfile) {

            cvProfile.textContent =
                profile ||
                "Tu perfil profesional aparecerá aquí.";

        }


        const cvSkills =
            document.getElementById(
                "cvSkills"
            );


        if (cvSkills) {

            cvSkills.textContent =
                skills ||
                "Tus habilidades aparecerán aquí.";

        }


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


    /* =====================================================
       EXPERIENCIAS EN CV
    ===================================================== */

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


    /* =====================================================
       FORMACIÓN EN CV
    ===================================================== */

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


    /* =====================================================
       ACTUALIZAR CV
    ===================================================== */

    function updateCV() {

        updatePersonalData();

        updateExperiences();

        updateEducation();

    }


    /* =====================================================
       IA - FUNCIÓN GENERAL
    ===================================================== */

    async function mejorarTextoConIA(
        textarea,
        button,
        type,
        mensajeVacio
    ) {

        if (!textarea) {
            return;
        }


        const originalText =
            textarea.value.trim();


        if (!originalText) {

            alert(
                mensajeVacio ||
                "Escribe primero un texto."
            );

            return;

        }


        if (originalText.length > 5000) {

            alert(
                "El texto es demasiado largo. Reduce el contenido antes de utilizar la IA."
            );

            return;

        }


        button.disabled = true;

        button.classList.add(
            "loading"
        );

        button.textContent =
            "✨ Mejorando...";


        try {

            const response =
                await fetch(
                    AI_BACKEND_URL,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body:
                            JSON.stringify({

                                type:
                                    type,

                                text:
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
                    "Error del Worker:",
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
                "✨ Mejorar con IA";

        }

    }


    /* =====================================================
       CREAR BOTÓN IA PARA PERFIL
    ===================================================== */

    function createProfileAIButton() {

        const textarea =
            document.getElementById(
                "perfil"
            );


        if (!textarea) {
            return;
        }


        if (
            textarea.parentElement.querySelector(
                ".ai-profile-button"
            )
        ) {

            return;

        }


        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.className =
            "ai-button ai-profile-button";

        button.textContent =
            "✨ Mejorar con IA";


        button.addEventListener(
            "click",
            function () {

                mejorarTextoConIA(
                    textarea,
                    button,
                    "profile",
                    "Escribe primero tu perfil profesional."
                );

            }
        );


        textarea.parentElement.appendChild(
            button
        );

    }


    /* =====================================================
       CREAR BOTÓN IA PARA HABILIDADES
    ===================================================== */

    function createSkillsAIButton() {

        const textarea =
            document.getElementById(
                "skills"
            );


        if (!textarea) {
            return;
        }


        if (
            textarea.parentElement.querySelector(
                ".ai-skills-button"
            )
        ) {

            return;

        }


        const button =
            document.createElement(
                "button"
            );


        button.type =
            "button";

        button.className =
            "ai-button ai-skills-button";

        button.textContent =
            "✨ Mejorar con IA";


        button.addEventListener(
            "click",
            function () {

                mejorarTextoConIA(
                    textarea,
                    button,
                    "skills",
                    "Escribe primero tus habilidades."
                );

            }
        );


        textarea.parentElement.appendChild(
            button
        );

    }


    /* =====================================================
       PLANTILLAS
    ===================================================== */

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


                    saveData();

                }
            );

        }
    );


    /* =====================================================
       BOTÓN AÑADIR EXPERIENCIA
    ===================================================== */

    if (addExperienceButton) {

        addExperienceButton.addEventListener(
            "click",
            function () {

                addExperience();

                saveData();

            }
        );

    }


    /* =====================================================
       BOTÓN AÑADIR FORMACIÓN
    ===================================================== */

    if (addEducationButton) {

        addEducationButton.addEventListener(
            "click",
            function () {

                addEducation();

                saveData();

            }
        );

    }


    /* =====================================================
       BOTÓN ACTUALIZAR CV
    ===================================================== */

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                updateCV();

                saveData();

            }
        );

    }


    /* =====================================================
       BOTÓN DESCARGAR PDF
    ===================================================== */

    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {

                updateCV();

                saveData();

                window.print();

            }
        );

    }


    /* =====================================================
       ACTUALIZACIÓN AUTOMÁTICA
    ===================================================== */

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


    /* =====================================================
       CARGAR DATOS GUARDADOS
    ===================================================== */

    const hasSavedData =
        loadData();


    /* =====================================================
       CREAR BOTONES IA
    ===================================================== */

    createProfileAIButton();

    createSkillsAIButton();


    /* =====================================================
       SI NO HAY DATOS GUARDADOS,
       CREAR CAMPOS INICIALES
    ===================================================== */

    if (
        !hasSavedData &&
        experienceList
    ) {

        addExperience();

    }


    if (
        !hasSavedData &&
        educationList
    ) {

        addEducation();

    }


    /* =====================================================
       ACTUALIZACIÓN INICIAL
    ===================================================== */

    updateCV();

});
