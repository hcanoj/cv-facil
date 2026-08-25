document.addEventListener("DOMContentLoaded", () => {

    /* =====================================================
       CONFIGURACIÓN
    ====================================================== */

    const AI_BACKEND_URL =
        "https://bitter-band-b917.hectorcanojimenez.workers.dev";

    const STORAGE_KEY =
        "cv-facil-data-v4";

    const THEME_KEY =
        "cv-facil-theme";


    /* =====================================================
       ELEMENTOS
    ====================================================== */

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

    const themeIcon =
        document.getElementById("themeIcon");

    const themeText =
        document.getElementById("themeText");

    const photoInput =
        document.getElementById("photoInput");

    const cvPhoto =
        document.getElementById("cvPhoto");

    const cvPhotoContainer =
        document.getElementById("cvPhotoContainer");

    const removePhotoButton =
        document.getElementById("removePhoto");

    const templateButtons =
        document.querySelectorAll(".template-option");

    const aiButtons =
        document.querySelectorAll(".ai-button[data-ai-target]");


    let experienceCounter = 0;
    let educationCounter = 0;
    let saveTimeout = null;


    /* =====================================================
       UTILIDADES
    ====================================================== */

    function getValue(id) {

        const element =
            document.getElementById(id);

        return element
            ? element.value.trim()
            : "";
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
            text ?? "";

        return div.innerHTML;
    }


    function showToast(message) {

        let toast =
            document.getElementById("toast");

        if (!toast) {
            return;
        }

        toast.textContent =
            message;

        toast.classList.add("show");

        clearTimeout(showToast.timeout);

        showToast.timeout =
            setTimeout(() => {

                toast.classList.remove("show");

            }, 3000);
    }


    function scheduleSave() {

        clearTimeout(saveTimeout);

        saveTimeout =
            setTimeout(() => {

                saveData();

            }, 400);
    }


    /* =====================================================
       FOTO
    ====================================================== */

    function setPhoto(src) {

        if (!cvPhoto || !cvPhotoContainer) {
            return;
        }

        if (src) {

            cvPhoto.src = src;

            cvPhoto.hidden = false;

            const placeholder =
                cvPhotoContainer.querySelector(
                    ".cv-photo-placeholder"
                );

            if (placeholder) {
                placeholder.hidden = true;
            }

            if (removePhotoButton) {
                removePhotoButton.hidden = false;
            }

        } else {

            cvPhoto.removeAttribute("src");

            cvPhoto.hidden = true;

            const placeholder =
                cvPhotoContainer.querySelector(
                    ".cv-photo-placeholder"
                );

            if (placeholder) {
                placeholder.hidden = false;
            }

            if (removePhotoButton) {
                removePhotoButton.hidden = true;
            }
        }
    }


    function handlePhotoUpload(file) {

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

                const maxSize = 600;

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
                    document.createElement("canvas");

                canvas.width =
                    Math.max(
                        1,
                        Math.round(
                            image.width * scale
                        )
                    );

                canvas.height =
                    Math.max(
                        1,
                        Math.round(
                            image.height * scale
                        )
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

                setPhoto(compressed);

                saveData();

                showToast(
                    "✓ Fotografía añadida."
                );
            };

            image.src = reader.result;
        };

        reader.readAsDataURL(file);
    }


    if (photoInput) {

        photoInput.addEventListener(
            "change",
            event => {

                const file =
                    event.target.files &&
                    event.target.files[0];

                handlePhotoUpload(file);

            }
        );
    }


    if (removePhotoButton) {

        removePhotoButton.addEventListener(
            "click",
            () => {

                setPhoto("");

                if (photoInput) {
                    photoInput.value = "";
                }

                saveData();

                showToast(
                    "Fotografía eliminada."
                );
            }
        );
    }


    /* =====================================================
       EXPERIENCIA
    ====================================================== */

    function addExperience(data = {}) {

        if (!experienceList) {
            return;
        }

        experienceCounter++;

        const item =
            document.createElement("div");

        item.className =
            "repeatable-item dynamic-item";

        item.innerHTML = `
            <div class="repeatable-header">

                <span class="repeatable-title">
                    Experiencia ${experienceCounter}
                </span>

                <button
                    type="button"
                    class="delete-button remove-button"
                >
                    Eliminar
                </button>

            </div>

            <div class="field">

                <label>Puesto</label>

                <input
                    type="text"
                    class="experience-position"
                    placeholder="Ej: Diseñador gráfico"
                    maxlength="100"
                >

            </div>

            <div class="field">

                <label>Empresa</label>

                <input
                    type="text"
                    class="experience-company"
                    placeholder="Ej: Agencia Creativa"
                    maxlength="120"
                >

            </div>

            <div class="two-columns">

                <div class="field">

                    <label>Fecha de inicio</label>

                    <input
                        type="text"
                        class="experience-start"
                        placeholder="2022"
                        maxlength="30"
                    >

                </div>

                <div class="field">

                    <label>Fecha de finalización</label>

                    <input
                        type="text"
                        class="experience-end"
                        placeholder="Actualidad"
                        maxlength="30"
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
                ></textarea>

                <button
                    type="button"
                    class="ai-button experience-ai"
                >
                    ✨ Mejorar con IA
                </button>

            </div>
        `;


        item.querySelector(
            ".experience-position"
        ).value =
            data.position || "";

        item.querySelector(
            ".experience-company"
        ).value =
            data.company || "";

        item.querySelector(
            ".experience-start"
        ).value =
            data.start || "";

        item.querySelector(
            ".experience-end"
        ).value =
            data.end || "";

        item.querySelector(
            ".experience-description"
        ).value =
            data.description || "";


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
                ".experience-ai"
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
    ====================================================== */

    function addEducation(data = {}) {

        if (!educationList) {
            return;
        }

        educationCounter++;

        const item =
            document.createElement("div");

        item.className =
            "repeatable-item dynamic-item";

        item.innerHTML = `
            <div class="repeatable-header">

                <span class="repeatable-title">
                    Formación ${educationCounter}
                </span>

                <button
                    type="button"
                    class="delete-button remove-button"
                >
                    Eliminar
                </button>

            </div>

            <div class="field">

                <label>Titulación</label>

                <input
                    type="text"
                    class="education-title"
                    placeholder="Ej: Grado en Diseño Gráfico"
                    maxlength="150"
                >

            </div>

            <div class="field">

                <label>Centro educativo</label>

                <input
                    type="text"
                    class="education-school"
                    placeholder="Ej: Universidad de Madrid"
                    maxlength="150"
                >

            </div>

            <div class="field">

                <label>Año</label>

                <input
                    type="text"
                    class="education-date"
                    placeholder="2020"
                    maxlength="30"
                >

            </div>
        `;


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
    ====================================================== */

    function getExperiences() {

        if (!experienceList) {
            return [];
        }

        return Array.from(
            experienceList.querySelectorAll(
                ".repeatable-item"
            )
        ).map(item => {

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

        });
    }


    /* =====================================================
       OBTENER FORMACIÓN
    ====================================================== */

    function getEducation() {

        if (!educationList) {
            return [];
        }

        return Array.from(
            educationList.querySelectorAll(
                ".repeatable-item"
            )
        ).map(item => {

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

        });
    }


    /* =====================================================
       DATOS PERSONALES
    ====================================================== */

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
                    document.createElement("span");

                span.textContent =
                    value;

                contact.appendChild(span);

            });
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


    /* =====================================================
       EXPERIENCIA EN CV
    ====================================================== */

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


        if (!experiences.length) {

            container.innerHTML = `
                <div class="empty-cv">
                    Tu experiencia aparecerá aquí.
                </div>
            `;

            return;
        }


        experiences.forEach(experience => {

            const item =
                document.createElement("div");

            item.className =
                "cv-item";


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
                    ""
                );


            const dates =
                start || end
                    ? `${start || ""} - ${end || ""}`
                    : "";


            item.innerHTML = `

                <div class="cv-item-header">

                    <div>

                        <h4>
                            ${position}
                        </h4>

                        <div class="cv-company">
                            ${company}
                        </div>

                    </div>

                    ${
                        dates
                            ? `
                                <div class="cv-date">
                                    ${dates}
                                </div>
                              `
                            : ""
                    }

                </div>

                ${
                    description
                        ? `
                            <div class="cv-item-description">
                                ${description}
                            </div>
                          `
                        : ""
                }

            `;


            container.appendChild(item);

        });
    }


    /* =====================================================
       FORMACIÓN EN CV
    ====================================================== */

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


        if (!education.length) {

            container.innerHTML = `
                <div class="empty-cv">
                    Tu formación aparecerá aquí.
                </div>
            `;

            return;
        }


        education.forEach(data => {

            const item =
                document.createElement("div");

            item.className =
                "cv-item";


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

                <div class="cv-item-header">

                    <div>

                        <h4>
                            ${title}
                        </h4>

                        <div class="cv-company">
                            ${school}
                        </div>

                    </div>

                    ${
                        date
                            ? `
                                <div class="cv-date">
                                    ${date}
                                </div>
                              `
                            : ""
                    }

                </div>

            `;


            container.appendChild(item);

        });
    }


    /* =====================================================
       ACTUALIZAR CV
    ====================================================== */

    function updateCV() {

        updatePersonalData();

        updateExperiences();

        updateEducation();

        scheduleSave();
    }


    /* =====================================================
       PLANTILLAS
    ====================================================== */

    function getCurrentTemplate() {

        const activeButton =
            document.querySelector(
                ".template-option.active"
            );

        return (
            activeButton?.dataset.template ||
            "professional"
        );
    }


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


        templateButtons.forEach(button => {

            button.classList.toggle(
                "active",
                button.dataset.template ===
                template
            );

        });


        scheduleSave();
    }


    templateButtons.forEach(button => {

        button.addEventListener(
            "click",
            () => {

                const template =
                    button.dataset.template;

                applyTemplate(template);

                showToast(
                    `✓ Plantilla ${getTemplateName(template)} seleccionada.`
                );

            }
        );

    });


    function getTemplateName(template) {

        const names = {

            professional:
                "Profesional",

            minimal:
                "Minimalista",

            modern:
                "Moderno"

        };

        return (
            names[template] ||
            "Profesional"
        );
    }


    /* =====================================================
       GUARDAR DATOS
    ====================================================== */

    function collectData() {

        return {

            version: 4,

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
                cvPhoto?.src || "",

            experiences:
                getExperiences(),

            education:
                getEducation(),

            template:
                getCurrentTemplate()

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

        } catch (error) {

            console.error(
                "Error guardando datos:",
                error
            );
        }
    }


    /* =====================================================
       CARGAR DATOS
    ====================================================== */

    function loadData() {

        let data = null;

        try {

            const saved =
                localStorage.getItem(
                    STORAGE_KEY
                );

            if (saved) {

                data =
                    JSON.parse(saved);
            }

        } catch (error) {

            console.error(
                "Error cargando datos:",
                error
            );
        }


        if (!data) {

            addExperience();

            addEducation();

            applyTemplate(
                "professional"
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

            if (
                typeof data[id] ===
                "string"
            ) {

                setValue(
                    id,
                    data[id]
                );
            }

        });


        if (data.photo) {

            setPhoto(
                data.photo
            );

        }


        if (
            Array.isArray(
                data.experiences
            ) &&
            data.experiences.length
        ) {

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


        if (
            Array.isArray(
                data.education
            ) &&
            data.education.length
        ) {

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


        applyTemplate(
            data.template ||
            "professional"
        );
    }


    /* =====================================================
       LIMPIAR DATOS
    ====================================================== */

    const clearButton =
        document.getElementById("clearButton");


    if (clearButton) {

        clearButton.addEventListener(
            "click",
            () => {

                const confirmed =
                    window.confirm(
                        "¿Quieres borrar todos los datos del CV?"
                    );

                if (!confirmed) {
                    return;
                }


                localStorage.removeItem(
                    STORAGE_KEY
                );


                [
                    "nombre",
                    "profesion",
                    "email",
                    "telefono",
                    "ubicacion",
                    "perfil",
                    "skills",
                    "languages"
                ].forEach(id => {

                    setValue(id, "");

                });


                if (experienceList) {
                    experienceList.innerHTML = "";
                }

                if (educationList) {
                    educationList.innerHTML = "";
                }


                experienceCounter = 0;
                educationCounter = 0;


                setPhoto("");


                if (photoInput) {
                    photoInput.value = "";
                }


                addExperience();

                addEducation();

                applyTemplate(
                    "professional"
                );

                updateCV();

                saveData();

                showToast(
                    "✓ Datos eliminados."
                );
            }
        );
    }


    /* =====================================================
       IA
    ====================================================== */

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
                "Escribe un poco más de información."
            );

            textarea.focus();

            return;
        }


        button.disabled = true;

        const originalLabel =
            button.textContent;

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
                    "La IA no ha podido procesar el texto."
                );
            }


            if (
                !data ||
                typeof data.text !==
                "string" ||
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

            showToast(
                "✓ Texto mejorado correctamente."
            );

        } catch (error) {

            console.error(
                "Error de IA:",
                error
            );

            showToast(
                error.message ||
                "No se ha podido mejorar el texto."
            );

        } finally {

            button.disabled = false;

            button.textContent =
                originalLabel ||
                "✨ Mejorar con IA";
        }
    }


    aiButtons.forEach(button => {

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
       IA DE EXPERIENCIA
    ====================================================== */

    /* Los botones de experiencia se conectan al crearse
       dentro de addExperience(). */


    /* =====================================================
       TEMA
    ====================================================== */

    function applyTheme(theme) {

        if (theme === "dark") {

            document.documentElement.classList.add(
                "dark"
            );

            document.documentElement.setAttribute(
                "data-theme",
                "dark"
            );

            if (themeIcon) {
                themeIcon.textContent = "☀";
            }

            if (themeText) {
                themeText.textContent = "Claro";
            }

        } else {

            document.documentElement.classList.remove(
                "dark"
            );

            document.documentElement.removeAttribute(
                "data-theme"
            );

            if (themeIcon) {
                themeIcon.textContent = "☾";
            }

            if (themeText) {
                themeText.textContent = "Oscuro";
            }
        }


        localStorage.setItem(
            THEME_KEY,
            theme
        );
    }


    function loadTheme() {

        const saved =
            localStorage.getItem(
                THEME_KEY
            );


        if (
            saved === "dark" ||
            saved === "light"
        ) {

            applyTheme(saved);

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
                    document.documentElement.classList.contains(
                        "dark"
                    )
                        ? "dark"
                        : "light";


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
    ====================================================== */

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

                saveData();

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
                    150
                );

            }
        );
    }


    /* =====================================================
       ACTUALIZACIÓN AUTOMÁTICA
    ====================================================== */

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
    ====================================================== */

    loadTheme();

    loadData();

    updateCV();

});
