/* =====================================================
   CV FÁCIL
   Aplicación principal
===================================================== */

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
       CREAR EXPERIENCIA
    ================================================= */

    function addExperience() {

        experienceCounter++;


        const item =
            document.createElement("div");

        item.className =
            "repeatable-item";


        item.dataset.id =
            experienceCounter;


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

            </div>

        `;


        item
            .querySelector(".delete-button")
            .addEventListener(
                "click",
                function () {

                    item.remove();

                    updateCV();

                }
            );


        experienceList.appendChild(item);


        updateCV();

    }


    /* =================================================
       CREAR FORMACIÓN
    ================================================= */

    function addEducation() {

        educationCounter++;


        const item =
            document.createElement("div");

        item.className =
            "repeatable-item";


        item.dataset.id =
            educationCounter;


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


        item
            .querySelector(".delete-button")
            .addEventListener(
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
                        item
                            .querySelector(
                                ".experience-position"
                            )
                            .value
                            .trim(),

                    company:
                        item
                            .querySelector(
                                ".experience-company"
                            )
                            .value
                            .trim(),

                    start:
                        item
                            .querySelector(
                                ".experience-start"
                            )
                            .value
                            .trim(),

                    end:
                        item
                            .querySelector(
                                ".experience-end"
                            )
                            .value
                            .trim(),

                    description:
                        item
                            .querySelector(
                                ".experience-description"
                            )
                            .value
                            .trim()

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
                        item
                            .querySelector(
                                ".education-title"
                            )
                            .value
                            .trim(),

                    school:
                        item
                            .querySelector(
                                ".education-school"
                            )
                            .value
                            .trim(),

                    date:
                        item
                            .querySelector(
                                ".education-date"
                            )
                            .value
                            .trim()

                };

            }
        );

    }


    /* =================================================
       ACTUALIZAR DATOS PERSONALES
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


        document
            .getElementById("cvName")
            .textContent =
            name || "Tu nombre";


        document
            .getElementById("cvJob")
            .textContent =
            job || "Tu profesión";


        const contact =
            document.getElementById(
                "cvContact"
            );


        contact.innerHTML = "";


        const contactValues = [
            email || "email@ejemplo.com",
            phone || "Teléfono",
            location || "Ubicación"
        ];


        contactValues.forEach(
            function (value) {

                const span =
                    document.createElement("span");

                span.textContent =
                    value;

                contact.appendChild(span);

            }
        );


        document
            .getElementById("cvProfile")
            .textContent =
            profile ||
            "Tu perfil profesional aparecerá aquí.";


        document
            .getElementById("cvSkills")
            .textContent =
            skills ||
            "Tus habilidades aparecerán aquí.";


        document
            .getElementById("cvLanguages")
            .textContent =
            languages ||
            "Tus idiomas aparecerán aquí.";

    }


    /* =================================================
       ACTUALIZAR EXPERIENCIA
    ================================================= */

    function updateExperiences() {

        const container =
            document.getElementById(
                "cvExperienceList"
            );


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
                    document.createElement("div");

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
       ACTUALIZAR FORMACIÓN
    ================================================= */

    function updateEducation() {

        const container =
            document.getElementById(
                "cvEducationList"
            );


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
            function (itemData) {

                const item =
                    document.createElement("div");

                item.className =
                    "cv-education";


                const title =
                    escapeHTML(
                        itemData.title ||
                        "Titulación"
                    );


                const school =
                    escapeHTML(
                        itemData.school ||
                        "Centro educativo"
                    );


                const date =
                    escapeHTML(
                        itemData.date
                    );


                item.innerHTML = `

                    <h4>
                        ${title}
                    </h4>

                    <div class="cv-meta">

                        ${school}

                        ${date
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
       ACTUALIZAR TODO EL CV
    ================================================= */

    function updateCV() {

        updatePersonalData();

        updateExperiences();

        updateEducation();

    }


    /* =================================================
       CAMBIAR PLANTILLA
    ================================================= */

    templateButtons.forEach(
        function (button) {

            button.addEventListener(
                "click",
                function () {

                    templateButtons.forEach(
                        function (otherButton) {

                            otherButton.classList.remove(
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


                    cv.classList.remove(
                        "template-professional",
                        "template-minimal",
                        "template-modern"
                    );


                    cv.classList.add(
                        "template-" + template
                    );

                }
            );

        }
    );


    /* =================================================
       BOTONES
    ================================================= */

    addExperienceButton.addEventListener(
        "click",
        addExperience
    );


    addEducationButton.addEventListener(
        "click",
        addEducation
    );


    generateButton.addEventListener(
        "click",
        updateCV
    );


    printButton.addEventListener(
        "click",
        function () {

            updateCV();

            window.print();

        }
    );


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
       INICIO
    ================================================= */

    addExperience();

    addEducation();

    updateCV();

});
