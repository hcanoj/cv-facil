
document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const AI_BACKEND_URL =
        "https://bitter-band-b917.hectorcanojimenez.workers.dev";

    const STORAGE_KEY = "cv-facil-datos";

    let experienceCounter = 0;
    let educationCounter = 0;


    /* =====================================================
       ELEMENTOS
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
       UTILIDADES
    ===================================================== */

    function getValue(id) {

        const element = document.getElementById(id);

        if (!element) {
            return "";
        }

        return element.value.trim();
    }


    function setValue(id, value) {

        const element = document.getElementById(id);

        if (!element) {
            return;
        }

        element.value = value || "";
    }


    function escapeHTML(text) {

        const div = document.createElement("div");

        div.textContent = text || "";

        return div.innerHTML;
    }


    function showMessage(message) {

        alert(message);
    }


    /* =====================================================
       GUARDADO AUTOMÁTICO
    ===================================================== */

    function collectData() {

        return {

            personal: {

                nombre: getValue("nombre"),

                profesion: getValue("profesion"),

                email: getValue("email"),

                telefono: getValue("telefono"),

                ubicacion: getValue("ubicacion"),

                perfil: getValue("perfil"),

                skills: getValue("skills"),

                languages: getValue("languages")

            },

            experiences: getExperiences(),

            education: getEducation(),

            template:
                document.querySelector(
                    ".template-option.active"
                )?.dataset.template || "professional"

        };

    }


    function saveData() {

        try {

            const data = collectData();

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


    function loadData() {

        try {

            const saved =
                localStorage.getItem(STORAGE_KEY);

            if (!saved) {
                return;
            }

            const data = JSON.parse(saved);

            if (!data) {
                return;
            }


            /* DATOS PERSONALES */

            if (data.personal) {

                Object.entries(data.personal).forEach(
                    ([key, value]) => {

                        setValue(key, value);

                    }
                );

            }


            /* EXPERIENCIA */

            if (
                Array.isArray(data.experiences)
            ) {

                data.experiences.forEach(
                    experience => {

                        addExperience(
                            experience
                        );

                    }
                );

            }


            /* FORMACIÓN */

            if (
                Array.isArray(data.education)
            ) {

                data.education.forEach(
                    education => {

                        addEducation(
                            education
                        );

                    }
                );

            }


            /* PLANTILLA */

            if (data.template) {

                selectTemplate(
                    data.template
                );

            }


            updateCV();

        } catch (error) {

            console.error(
                "No se pudieron recuperar los datos:",
                error
            );

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


        /* ELIMINAR */

        const deleteButton =
            item.querySelector(
                ".delete-button"
            );


        deleteButton.addEventListener(
            "click",
            () => {

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
            () => {

                mejorarExperienciaConIA(
                    item,
                    aiButton
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
            () => {

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

        const items =
            experienceList.querySelectorAll(
                ".repeatable-item"
            );


        return Array.from(items).map(
            item => ({

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

            })
        );

    }


    /* =====================================================
       OBTENER FORMACIÓN
    ===================================================== */

    function getEducation() {

        const items =
            educationList.querySelectorAll(
                ".repeatable-item"
            );


        return Array.from(items).map(
            item => ({

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

            })
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
            document.getElementById("cvContact");


        if (contact) {

            contact.innerHTML = "";


            [
                email || "email@ejemplo.com",
                phone || "Teléfono",
                location || "Ubicación"
            ].forEach(value => {

                const span =
                    document.createElement(
                        "span"
                    );

                span.textContent = value;

                contact.appendChild(span);

            });

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
       ACTUALIZAR EXPERIENCIAS
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
            experience => {

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


                container.appendChild(item);

            }
        );

    }


    /* =====================================================
       ACTUALIZAR FORMACIÓN
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
            data => {

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


                container.appendChild(item);

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
       IA
    ===================================================== */

    async function mejorarTextoConIA(
        textarea,
        button,
        mensajeVacio
    ) {

        if (!textarea || !button) {
            return;
        }


        const originalText =
            textarea.value.trim();


        if (!originalText) {

            showMessage(
                mensajeVacio ||
                "Escribe primero un texto."
            );

            textarea.focus();

            return;

        }


        if (originalText.length < 10) {

            showMessage(
                "Escribe un poco más de información para que la IA pueda mejorarla."
            );

            textarea.focus();

            return;

        }


        if (originalText.length > 5000) {

            showMessage(
                "El texto es demasiado largo. Intenta reducirlo."
            );

            return;

        }


        button.disabled = true;

        button.classList.add("loading");

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

                        body: JSON.stringify({

                            description:
                                originalText

                        })

                    }
                );


            let data = null;


            try {

                data =
                    await response.json();

            } catch {

                throw new Error(
                    "El servidor no devolvió una respuesta válida."
                );

            }


            if (!response.ok) {

                throw new Error(
                    data?.error ||
                    "No se pudo utilizar la IA."
                );

            }


            if (
                !data?.text ||
                typeof data.text !== "string"
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
                "Error de IA:",
                error
            );


            showMessage(
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
       IA EXPERIENCIA
    ===================================================== */

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

const improveProfileButton =
    document.getElementById("improveProfile");

if (improveProfileButton) {

    improveProfileButton.addEventListener(
        "click",
        function () {

            const textarea =
                document.getElementById("perfil");

            mejorarTextoConIA(
                textarea,
                improveProfileButton,
                "Escribe primero tu perfil profesional."
            );

        }
    );

}


/* =================================================
   IA - HABILIDADES
================================================= */

const improveSkillsButton =
    document.getElementById("improveSkills");

if (improveSkillsButton) {

    improveSkillsButton.addEventListener(
        "click",
        function () {

            const textarea =
                document.getElementById("skills");

            mejorarTextoConIA(
                textarea,
                improveSkillsButton,
                "Escribe primero tus habilidades."
            );

        }
    );

}


    /* =====================================================
       PLANTILLAS
    ===================================================== */

    function selectTemplate(template) {

        const cv =
            document.getElementById("cv");


        if (!cv) {
            return;
        }


        const validTemplates = [
            "professional",
            "minimal",
            "modern"
        ];


        if (
            !validTemplates.includes(template)
        ) {

            template = "professional";

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
            button => {

                button.classList.toggle(
                    "active",
                    button.dataset.template ===
                    template
                );

            }
        );

    }


    templateButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    selectTemplate(
                        button.dataset.template
                    );

                    saveData();

                }
            );

        }
    );


    /* =====================================================
       VALIDACIÓN
    ===================================================== */

    function validateCV() {

        const name =
            getValue("nombre");

        const email =
            getValue("email");


        if (!name) {

            showMessage(
                "Escribe tu nombre completo antes de descargar el CV."
            );

            document
                .getElementById("nombre")
                ?.focus();

            return false;

        }


        if (
            email &&
            !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ) {

            showMessage(
                "El email no parece válido. Revísalo antes de descargar el CV."
            );

            document
                .getElementById("email")
                ?.focus();

            return false;

        }


        return true;

    }


    /* =====================================================
       BOTÓN EXPERIENCIA
    ===================================================== */

    if (addExperienceButton) {

        addExperienceButton.addEventListener(
            "click",
            () => {

                addExperience();

                saveData();

            }
        );

    }


    /* =====================================================
       BOTÓN FORMACIÓN
    ===================================================== */

    if (addEducationButton) {

        addEducationButton.addEventListener(
            "click",
            () => {

                addEducation();

                saveData();

            }
        );

    }


    /* =====================================================
       BOTÓN ACTUALIZAR
    ===================================================== */

    if (generateButton) {

        generateButton.addEventListener(
            "click",
            () => {

                updateCV();

                saveData();

            }
        );

    }


    /* =====================================================
       BOTÓN PDF
    ===================================================== */

if (printButton) {

    printButton.addEventListener(
        "click",
        function () {

            updateCV();

            setTimeout(function () {

                window.print();

            }, 100);

        }
    );

}


    /* =====================================================
       ACTUALIZACIÓN AUTOMÁTICA
    ===================================================== */

    document.addEventListener(
        "input",
        event => {

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
       INICIALIZACIÓN
    ===================================================== */

    loadData();


    /*
       Si no había datos guardados,
       añadimos un ejemplo vacío.
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
