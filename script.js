document.addEventListener("DOMContentLoaded", function () {

    /* =================================================
       CONFIGURACIÓN
    ================================================= */

    const AI_BACKEND_URL =
        "https://bitter-band-b917.hectorcanojimenez.workers.dev";

    const STORAGE_KEY =
        "cv-facil-datos-v1";

    const MAX_AI_TEXT_LENGTH = 3000;


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


    function setValue(id, value) {

        const element =
            document.getElementById(id);

        if (!element) {
            return;
        }

        element.value = value || "";

    }


    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }


    function showMessage(message) {

        alert(message);

    }


    /* =================================================
       DATOS PERSONALES
    ================================================= */

    function getPersonalData() {

        return {

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
                getValue("languages")

        };

    }


    /* =================================================
       EXPERIENCIA
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
       FORMACIÓN
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
       OBTENER TODO EL CV
    ================================================= */

    function getCVData() {

        const data =
            getPersonalData();


        data.experiences =
            getExperiences();


        data.education =
            getEducation();


        const activeTemplate =
            document.querySelector(
                ".template-option.active"
            );


        data.template =
            activeTemplate?.dataset.template ||
            "professional";


        return data;

    }


    /* =================================================
       GUARDAR AUTOMÁTICAMENTE
    ================================================= */

    function saveCV() {

        try {

            const data =
                getCVData();


            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(data)
            );

        } catch (error) {

            console.error(
                "No se pudo guardar el CV:",
                error
            );

        }

    }


    /* =================================================
       CARGAR CV GUARDADO
    ================================================= */

    function loadCV() {

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


            if (!data || typeof data !== "object") {
                return false;
            }


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


            if (data.template) {

                setTemplate(
                    data.template
                );

            }


            return true;

        } catch (error) {

            console.error(
                "No se pudo cargar el CV guardado:",
                error
            );

            return false;

        }

    }


    /* =================================================
       BORRAR CV
    ================================================= */

    function clearCV() {

        const confirmed =
            confirm(
                "¿Seguro que quieres empezar un CV nuevo? Se borrarán los datos guardados en este navegador."
            );


        if (!confirmed) {
            return;
        }


        localStorage.removeItem(
            STORAGE_KEY
        );


        window.location.reload();

    }


    /* =================================================
       EXPERIENCIA
    ================================================= */

    function addExperience(data = null) {

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
                    maxlength="${MAX_AI_TEXT_LENGTH}"
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


        const positionInput =
            item.querySelector(
                ".experience-position"
            );

        const companyInput =
            item.querySelector(
                ".experience-company"
            );

        const startInput =
            item.querySelector(
                ".experience-start"
            );

        const endInput =
            item.querySelector(
                ".experience-end"
            );

        const descriptionInput =
            item.querySelector(
                ".experience-description"
            );


        if (data) {

            positionInput.value =
                data.position || "";

            companyInput.value =
                data.company || "";

            startInput.value =
                data.start || "";

            endInput.value =
                data.end || "";

            descriptionInput.value =
                data.description || "";

        }


        const deleteButton =
            item.querySelector(
                ".delete-button"
            );


        deleteButton.addEventListener(
            "click",
            function () {

                item.remove();

                updateCV();

                saveCV();

            }
        );


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

    function addEducation(data = null) {

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


        if (data) {

            item.querySelector(
                ".education-title"
            ).value =
                data.title || "";


            item.querySelector(
                ".education-school"
            ).value =
                data.school || "";


            item.querySelector(
                ".education-date"
            ).value =
                data.date || "";

        }


        const deleteButton =
            item.querySelector(
                ".delete-button"
            );


        deleteButton.addEventListener(
            "click",
            function () {

                item.remove();

                updateCV();

                saveCV();

            }
        );


        educationList.appendChild(item);


        updateCV();

    }


    /* =================================================
       DATOS PERSONALES → CV
    ================================================= */

    function updatePersonalData() {

        const data =
            getPersonalData();


        const cvName =
            document.getElementById("cvName");


        if (cvName) {

            cvName.textContent =
                data.nombre ||
                "Tu nombre";

        }


        const cvJob =
            document.getElementById("cvJob");


        if (cvJob) {

            cvJob.textContent =
                data.profesion ||
                "Tu profesión";

        }


        const contact =
            document.getElementById(
                "cvContact"
            );


        if (contact) {

            contact.innerHTML = "";


            [
                data.email || "email@ejemplo.com",
                data.telefono || "Teléfono",
                data.ubicacion || "Ubicación"
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
                data.perfil ||
                "Tu perfil profesional aparecerá aquí.";

        }


        const cvSkills =
            document.getElementById(
                "cvSkills"
            );


        if (cvSkills) {

            cvSkills.textContent =
                data.skills ||
                "Tus habilidades aparecerán aquí.";

        }


        const cvLanguages =
            document.getElementById(
                "cvLanguages"
            );


        if (cvLanguages) {

            cvLanguages.textContent =
                data.languages ||
                "Tus idiomas aparecerán aquí.";

        }

    }


    /* =================================================
       ACTUALIZAR EXPERIENCIAS EN CV
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


                container.appendChild(item);

            }
        );

    }


    /* =================================================
       ACTUALIZAR FORMACIÓN EN CV
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


                container.appendChild(item);

            }
        );

    }


    /* =================================================
       PLANTILLAS
    ================================================= */

    function setTemplate(template) {

        const validTemplates = [
            "professional",
            "minimal",
            "modern"
        ];


        if (
            !validTemplates.includes(template)
        ) {

            template =
                "professional";

        }


        const cv =
            document.getElementById("cv");


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

    }


    templateButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    setTemplate(
                        button.dataset.template
                    );

                    saveCV();

                }
            );

        }
    );


    /* =================================================
       ACTUALIZAR CV
    ================================================= */

    function updateCV() {

        updatePersonalData();

        updateExperiences();

        updateEducation();

    }


    /* =================================================
       VALIDAR TEXTO PARA IA
    ================================================= */

    function validateAIText(textarea) {

        if (!textarea) {

            return {
                valid: false,
                message: "No se encontró el campo de texto."
            };

        }


        const text =
            textarea.value.trim();


        if (!text) {

            return {
                valid: false,
                message: "Escribe primero un texto."
            };

        }


        if (text.length < 10) {

            return {
                valid: false,
                message:
                    "Escribe un poco más de información para que la IA pueda ayudarte."
            };

        }


        if (
            text.length >
            MAX_AI_TEXT_LENGTH
        ) {

            return {
                valid: false,
                message:
                    `El texto es demasiado largo. Máximo ${MAX_AI_TEXT_LENGTH} caracteres.`
            };

        }


        return {
            valid: true,
            text: text
        };

    }


    /* =================================================
       IA - FUNCIÓN GENERAL
    ================================================= */

    async function mejorarTextoConIA(
        textarea,
        button,
        tipo,
        mensajeVacio
    ) {

        const validation =
            validateAIText(textarea);


        if (!validation.valid) {

            showMessage(
                mensajeVacio ||
                validation.message
            );

            return;

        }


        const originalText =
            validation.text;


        const originalButtonText =
            button.textContent;


        button.disabled = true;

        button.classList.add(
            "loading"
        );

        button.textContent =
            "✨ Mejorando...";


        try {

            let instruction;


            if (tipo === "perfil") {

                instruction = `
Mejora este perfil profesional para un currículum.

Debe sonar profesional, natural, claro y atractivo.
Resume la experiencia y fortalezas de la persona.
Utiliza verbos de acción.
No inventes información.
No inventes años, cifras, empresas, cargos, habilidades ni resultados.
Mantén exactamente el significado de la información proporcionada.
Devuelve únicamente el texto mejorado, sin comillas ni explicaciones.
`;

            } else if (tipo === "habilidades") {

                instruction = `
Mejora y organiza estas habilidades para un currículum profesional.

Corrige la redacción y elimina repeticiones.
Organiza las habilidades de forma clara.
No inventes habilidades que no aparezcan en el texto original.
No añadas conocimientos que la persona no haya indicado.
Devuelve únicamente el resultado final, sin explicaciones.
`;

            } else {

                instruction = `
Mejora esta descripción de experiencia laboral para un currículum profesional.

Utiliza español profesional.
Sé claro, natural y conciso.
Utiliza verbos de acción.
Destaca responsabilidades y logros únicamente cuando aparezcan en el texto original.
No inventes cifras.
No inventes resultados.
No inventes responsabilidades.
No inventes empresas.
No inventes cargos.
Mantén el significado original.
Devuelve únicamente el texto mejorado, sin comillas ni explicaciones.
`;

            }


            const prompt =
                `${instruction}

Texto original:

${originalText}`;


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
                                prompt

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
                    data?.error ||
                    "No se pudo conectar con la inteligencia artificial."
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


            const improvedText =
                data.text.trim();


            if (!improvedText) {

                throw new Error(
                    "La IA devolvió una respuesta vacía."
                );

            }


            textarea.value =
                improvedText;


            updateCV();

            saveCV();


        } catch (error) {

            console.error(
                "Error IA:",
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
                originalButtonText;

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

    async function mejorarPerfilConIA() {

        const textarea =
            document.getElementById(
                "perfil"
            );

        const button =
            document.getElementById(
                "improveProfile"
            );


        if (!button) {
            return;
        }


        await mejorarTextoConIA(
            textarea,
            button,
            "perfil",
            "Escribe primero tu perfil profesional."
        );

    }


    /* =================================================
       IA - HABILIDADES
    ================================================= */

    async function mejorarHabilidadesConIA() {

        const textarea =
            document.getElementById(
                "skills"
            );

        const button =
            document.getElementById(
                "improveSkills"
            );


        if (!button) {
            return;
        }


        await mejorarTextoConIA(
            textarea,
            button,
            "habilidades",
            "Escribe primero tus habilidades."
        );

    }


    /* =================================================
       BOTONES IA
    ================================================= */

    const improveProfileButton =
        document.getElementById(
            "improveProfile"
        );

    const improveSkillsButton =
        document.getElementById(
            "improveSkills"
        );


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
       BOTONES PRINCIPALES
    ================================================= */

    if (addExperienceButton) {

        addExperienceButton.addEventListener(
            "click",
            function () {

                addExperience();

                saveCV();

            }
        );

    }


    if (addEducationButton) {

        addEducationButton.addEventListener(
            "click",
            function () {

                addEducation();

                saveCV();

            }
        );

    }


    if (generateButton) {

        generateButton.addEventListener(
            "click",
            function () {

                updateCV();

                saveCV();

            }
        );

    }


    if (printButton) {

        printButton.addEventListener(
            "click",
            function () {

                updateCV();

                saveCV();

                window.print();

            }
        );

    }


    /* =================================================
       GUARDADO AUTOMÁTICO
    ================================================= */

    let saveTimeout;


    document.addEventListener(
        "input",
        function (event) {

            if (
                event.target.matches(
                    "input, textarea"
                )
            ) {

                updateCV();


                clearTimeout(
                    saveTimeout
                );


                saveTimeout =
                    setTimeout(
                        saveCV,
                        500
                    );

            }

        }
    );


    /* =================================================
       BOTÓN NUEVO CV
    ================================================= */

    const newCVButton =
        document.getElementById(
            "newCVButton"
        );


    if (newCVButton) {

        newCVButton.addEventListener(
            "click",
            clearCV
        );

    }


    /* =================================================
       INICIAR
    ================================================= */

    const loaded =
        loadCV();


    if (!loaded) {

        if (experienceList) {
            addExperience();
        }


        if (educationList) {
            addEducation();
        }

    }


    updateCV();

    saveCV();

});
