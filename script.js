document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN
    ===================================================== */

    const AI_BACKEND_URL =
        "https://bitter-band-b917.hectorcanojimenez.workers.dev";

    const STORAGE_KEY =
        "cv-facil-data-v3";


    /* =====================================================
       ELEMENTOS
    ===================================================== */

    const experienceList =
        document.getElementById("experienceList");

    const educationList =
        document.getElementById("educationList");

    const addExperienceButton =
        document.getElementById("addExperience");

    const addEducationButton =
        document.getElementById("addEducation");

    const generateButton =
        document.getElementById("generateButton");

    const printButton =
        document.getElementById("printButton");

    const themeToggle =
        document.getElementById("themeToggle");

    const photoInput =
        document.getElementById("photoInput");

    const photoPreview =
        document.getElementById("photoPreview");

    const cvPhoto =
        document.getElementById("cvPhoto");

    const removePhotoButton =
        document.getElementById("removePhoto");

    const saveStatus =
        document.getElementById("saveStatus");

    const toast =
        document.getElementById("toast");

    const templateButtons =
        document.querySelectorAll(".template-option");


    let experienceCounter = 0;
    let educationCounter = 0;
    let saveTimeout = null;


    /* =====================================================
       UTILIDADES
    ===================================================== */

    function getValue(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value.trim()
            : "";
    }


    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent =
            text ?? "";

        return div.innerHTML;
    }


    function showToast(message) {

        if (!toast) {
            return;
        }

        toast.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(
            showToast.timeout
        );

        showToast.timeout =
            setTimeout(() => {

                toast.classList.remove(
                    "show"
                );

            }, 3000);
    }


    function setSaveStatus(message) {

        if (!saveStatus) {
            return;
        }

        saveStatus.textContent =
            message;
    }


    /* =====================================================
       FOTO
    ===================================================== */

    function updatePhotoPreview(src) {

        if (!photoPreview || !cvPhoto) {
            return;
        }

        if (src) {

            photoPreview.innerHTML =
                `<img src="${src}" alt="Foto de perfil">`;

            cvPhoto.innerHTML =
                `<img src="${src}" alt="Foto del candidato">`;

        } else {

            photoPreview.innerHTML =
                "<span>Foto</span>";

            cvPhoto.innerHTML =
                "<span>Foto</span>";
        }
    }


    async function handlePhotoUpload(file) {

        if (!file) {
            return;
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (!allowedTypes.includes(file.type)) {

            showToast(
                "Utiliza una imagen JPG, PNG o WEBP."
            );

            return;
        }

        if (file.size > 3 * 1024 * 1024) {

            showToast(
                "La foto debe pesar menos de 3 MB."
            );

            return;
        }

        const reader =
            new FileReader();

        reader.onload = () => {

            const image =
                new Image();

            image.onload = () => {

                const maxSize = 500;

                const scale =
                    Math.min(
                        1,
                        maxSize /
                        Math.max(
                            image.width,
                            image.height
                        )
                    );

                const canvas =
                    document.createElement(
                        "canvas"
                    );

                canvas.width =
                    Math.round(
                        image.width * scale
                    );

                canvas.height =
                    Math.round(
                        image.height * scale
                    );

                const context =
                    canvas.getContext("2d");

                context.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

                const compressed =
                    canvas.toDataURL(
                        "image/jpeg",
                        0.82
                    );

                updatePhotoPreview(
                    compressed
                );

                saveData();
            };

            image.src =
                reader.result;
        };

        reader.readAsDataURL(file);
    }


    if (photoInput) {

        photoInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files?.[0];

                handlePhotoUpload(file);

            }
        );

    }


    if (removePhotoButton) {

        removePhotoButton.addEventListener(
            "click",
            () => {

                updatePhotoPreview("");

                if (photoInput) {
                    photoInput.value = "";
                }

                saveData();

            }
        );

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
                    maxlength="100"
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
                    maxlength="120"
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
                        maxlength="30"
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
                        maxlength="30"
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
                    maxlength="1500"
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


        const aiButton =
            item.querySelector(
                ".ai-button"
            );

        aiButton.addEventListener(
            "click",
            () => {

                mejorarTextoConIA(
                    item.querySelector(
                        ".experience-description"
                    ),
                    aiButton,
                    "experience"
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
                    maxlength="150"
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
                    maxlength="150"
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
                    maxlength="30"
                    value="${escapeHTML(data.date || "")}"
                >

            </div>
        `;


        item.querySelector(
            ".delete-button"
        ).addEventListener(
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
       OBTENER EXPERIENCIA
    ===================================================== */

    function getExperiences() {

        return Array.from(
            experienceList.querySelectorAll(
                ".repeatable-item"
            )
        ).map(item => ({

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

        }));
    }


    /* =====================================================
       OBTENER FORMACIÓN
    ===================================================== */

    function getEducation() {

        return Array.from(
            educationList.querySelectorAll(
                ".repeatable-item"
            )
        ).map(item => ({

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

        }));
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


        document.getElementById(
            "cvName"
        ).textContent =
            name || "Tu nombre";


        document.getElementById(
            "cvJob"
        ).textContent =
            job || "Tu profesión";


        const contact =
            document.getElementById(
                "cvContact"
            );

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

            span.textContent =
                value;

            contact.appendChild(span);

        });


        document.getElementById(
            "cvProfile"
        ).textContent =
            profile ||
            "Tu perfil profesional aparecerá aquí.";


        document.getElementById(
            "cvSkills"
        ).textContent =
            skills ||
            "Tus habilidades aparecerán aquí.";


        document.getElementById(
            "cvLanguages"
        ).textContent =
            languages ||
            "Tus idiomas aparecerán aquí.";
    }


    /* =====================================================
       EXPERIENCIA EN CV
    ===================================================== */

    function updateExperiences() {

        const container =
            document.getElementById(
                "cvExperienceList"
            );

        const experiences =
            getExperiences();

        container.innerHTML = "";


        if (!experiences.length) {

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
                        ` · ${start || ""} - ${end || ""}`;
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
       FORMACIÓN EN CV
    ===================================================== */

    function updateEducation() {

        const container =
            document.getElementById(
                "cvEducationList"
            );

        const education =
            getEducation();

        container.innerHTML = "";


        if (!education.length) {

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
                        ${date ? ` · ${date}` : ""}
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

        scheduleSave();
    }


    /* =====================================================
       GUARDADO AUTOMÁTICO
    ===================================================== */

    function collectData() {

        const activeTemplate =
            document.querySelector(
                ".template-option.active"
            )?.dataset.template ||
            "professional";


        return {

            version: 3,

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

            photo:
                cvPhoto?.querySelector("img")?.src ||
                "",

            experiences:
                getExperiences(),

            education:
                getEducation(),

            template:
                activeTemplate
        };
    }


    function saveData() {

        try {

            localStorage.setItem(
                STORAGE_KEY,
                JSON.stringify(
                    collectData()
                )
            );

            setSaveStatus(
                "✓ Guardado automáticamente"
            );

        } catch (error) {

            console.error(
                "Error guardando datos:",
                error
            );

            setSaveStatus(
                "No se pudo guardar"
            );
        }
    }


    function scheduleSave() {

        clearTimeout(
            saveTimeout
        );

        saveTimeout =
            setTimeout(
                saveData,
                500
            );
    }


    /* =====================================================
       CARGAR DATOS
    ===================================================== */

    function loadData() {

        let data;

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (!saved) {
                return;
            }

            data =
                JSON.parse(saved);

        } catch (error) {

            console.error(
                "No se pudieron cargar los datos:",
                error
            );

            return;
        }


        const fields = [
            "nombre",
            "profesion",
            "email",
            "telefono",
            "ubicacion",
            "perfil",
            "skills",
            "languages"
        ];


        fields.forEach(id => {

            const element =
                document.getElementById(id);

            if (element && typeof data[id] === "string") {

                element.value =
                    data[id];

            }

        });


        if (data.photo) {

            updatePhotoPreview(
                data.photo
            );

        }


        if (Array.isArray(data.experiences)) {

            data.experiences.forEach(
                experience => {

                    addExperience(
                        experience
                    );

                }
            );

        } else {

            addExperience();
        }


        if (Array.isArray(data.education)) {

            data.education.forEach(
                education => {

                    addEducation(
                        education
                    );

                }
            );

        } else {

            addEducation();
        }


        if (data.template) {

            applyTemplate(
                data.template
            );

        }


        updateCV();
    }


    /* =====================================================
       IA
    ===================================================== */

    async function mejorarTextoConIA(
        textarea,
        button,
        type
    ) {

        if (!textarea || !button) {
            return;
        }


        const originalText =
            textarea.value.trim();


        if (!originalText) {

            showToast(
                "Escribe primero un texto."
            );

            textarea.focus();

            return;
        }


        if (originalText.length < 5) {

            showToast(
                "Escribe un poco más de información para que la IA pueda ayudarte."
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

                        body: JSON.stringify({

                            type: type,

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

                throw new Error(
                    data?.error ||
                    "La IA no ha podido procesar el texto."
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

            showToast(
                "✓ Texto mejorado correctamente."
            );


        } catch (error) {

            console.error(
                "Error IA:",
                error
            );

            showToast(
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
       BOTONES IA
    ===================================================== */

    document
        .querySelectorAll(
            ".ai-button[data-ai-target]"
        )
        .forEach(button => {

            button.addEventListener(
                "click",
                () => {

                    const target =
                        button.dataset.aiTarget;

                    const textarea =
                        document.getElementById(
                            target
                        );

                    mejorarTextoConIA(
                        textarea,
                        button,
                        target
                    );

                }
            );

        });


    /* =====================================================
       TEMPLATES
    ===================================================== */

    function applyTemplate(template) {

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


        if (!validTemplates.includes(template)) {

            template =
                "professional";
        }


        cv.classList.remove(
            "template-professional",
            "template-minimal",
            "template-modern"
        );


        cv.classList.add(
            `template-${template}`
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


        scheduleSave();
    }


    templateButtons.forEach(
        button => {

            button.addEventListener(
                "click",
                () => {

                    applyTemplate(
                        button.dataset.template
                    );

                }
            );

        }
    );


    /* =====================================================
       TEMA CLARO / OSCURO
    ===================================================== */

    function applyTheme(theme) {

        if (theme === "dark") {

            document.documentElement
                .setAttribute(
                    "data-theme",
                    "dark"
                );

            if (themeToggle) {
                themeToggle.textContent =
                    "☀️";
            }

        } else {

            document.documentElement
                .removeAttribute(
                    "data-theme"
                );

            if (themeToggle) {
                themeToggle.textContent =
                    "🌙";
            }
        }

        localStorage.setItem(
            "cv-facil-theme",
            theme
        );
    }


    function loadTheme() {

        const savedTheme =
            localStorage.getItem(
                "cv-facil-theme"
            );

        if (savedTheme) {

            applyTheme(
                savedTheme
            );

            return;
        }


        const prefersDark =
            window.matchMedia &&
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        applyTheme(
            prefersDark
                ? "dark"
                : "light"
        );
    }


    if (themeToggle) {

        themeToggle.addEventListener(
            "click",
            () => {

                const current =
                    document.documentElement
                        .getAttribute(
                            "data-theme"
                        );

                applyTheme(
                    current === "dark"
                        ? "light"
                        : "dark"
                );

            }
        );

    }


    /* =====================================================
       BOTONES
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


    if (addEducationButton) {

        addEducationButton.addEventListener(
            "click",
            () => {

                addEducation();

                saveData();

            }
        );

    }


    if (generateButton) {

        generateButton.addEventListener(
            "click",
            () => {

                updateCV();

                showToast(
                    "✓ CV actualizado."
                );

            }
        );

    }


    if (printButton) {

        printButton.addEventListener(
            "click",
            () => {

                updateCV();

                setTimeout(
                    () => {

                        window.print();

                    },
                    100
                );

            }
        );

    }


    /* =====================================================
       VALIDACIÓN EMAIL
    ===================================================== */

    const emailInput =
        document.getElementById("email");


    if (emailInput) {

        emailInput.addEventListener(
            "blur",
            () => {

                if (
                    emailInput.value &&
                    !emailInput.checkValidity()
                ) {

                    emailInput.setCustomValidity(
                        "Introduce un email válido."
                    );

                    emailInput.reportValidity();

                } else {

                    emailInput.setCustomValidity(
                        ""
                    );

                }

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

            }

        }
    );


    /* =====================================================
       INICIO
    ===================================================== */

    loadTheme();

    loadData();

    updateCV();

});
