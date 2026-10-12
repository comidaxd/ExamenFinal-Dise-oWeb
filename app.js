/**
 * ============================================================================
 * LÓGICA DE INTERACCIÓN Y VALIDACIÓN - FACULTAD DE CIENCIAS SOCIALES
 * Proyecto: Examen Final - Diseño Web
 * Estudiante: Desarrollador Frontend / Ingeniería de Sistemas
 * ============================================================================
 */

document.addEventListener("DOMContentLoaded", () => {
  "use strict";

  // Actualización dinámica del año institucional en el footer
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  // Control interactivo de la Malla Curricular (plan-estudios.html)
  initCurriculumControls();

  // Validación y manejo accesible del Formulario de Admisión (admision.html)
  initAdmissionForm();
});

/**
 * Controla el filtrado por áreas formativas y la expansión del acordeón de estudios
 */
function initCurriculumControls() {
  const filterButtons = document.querySelectorAll("[data-filter-area]");
  const courseItems = document.querySelectorAll(".course-item-row");
  const toggleAllBtn = document.getElementById("btn-toggle-all-accordion");

  // Filtro por área de formación
  if (filterButtons.length > 0 && courseItems.length > 0) {
    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const area = btn.getAttribute("data-filter-area");

        // Actualizar estado visual y accesibilidad en botones
        filterButtons.forEach((b) => {
          b.classList.remove("active", "btn-institutional-primary");
          b.classList.add("btn-outline-secondary");
          b.setAttribute("aria-pressed", "false");
        });
        btn.classList.add("active", "btn-institutional-primary");
        btn.classList.remove("btn-outline-secondary");
        btn.setAttribute("aria-pressed", "true");

        // Filtrar elementos de asignaturas
        courseItems.forEach((item) => {
          const itemArea = item.getAttribute("data-area");
          if (area === "all" || itemArea === area) {
            item.style.display = "flex";
          } else {
            item.style.display = "none";
          }
        });
      });
    });
  }

  // Botón para desplegar / contraer todos los ciclos simultáneamente
  if (toggleAllBtn) {
    let isAllExpanded = false;
    toggleAllBtn.addEventListener("click", () => {
      const accordionCollapses = document.querySelectorAll("#accordionCurriculum .accordion-collapse");
      const accordionButtons = document.querySelectorAll("#accordionCurriculum .accordion-button");

      isAllExpanded = !isAllExpanded;

      accordionCollapses.forEach((collapseEl) => {
        if (isAllExpanded) {
          collapseEl.classList.add("show");
        } else {
          collapseEl.classList.remove("show");
        }
      });

      accordionButtons.forEach((btn) => {
        if (isAllExpanded) {
          btn.classList.remove("collapsed");
          btn.setAttribute("aria-expanded", "true");
        } else {
          btn.classList.add("collapsed");
          btn.setAttribute("aria-expanded", "false");
        }
      });

      toggleAllBtn.textContent = isAllExpanded
        ? "Contraer Todos los Ciclos"
        : "Expandir Todos los Ciclos";
      toggleAllBtn.setAttribute("aria-expanded", isAllExpanded ? "true" : "false");
    });
  }
}

/**
 * Validación robusta y accesible del formulario de postulación
 */
function initAdmissionForm() {
  const form = document.getElementById("form-postulacion");
  if (!form) return;

  const confirmationContainer = document.getElementById("mensaje-confirmacion");

  // Definición de reglas de validación
  const fields = {
    nombres: {
      element: document.getElementById("nombres"),
      errorId: "error-nombres",
      validate: (val) => {
        if (!val.trim()) return "Ingrese sus nombres completos.";
        if (val.trim().length < 3) return "El nombre debe contener al menos 3 caracteres.";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) return "El nombre solo debe contener letras y espacios.";
        return null;
      },
    },
    apellidos: {
      element: document.getElementById("apellidos"),
      errorId: "error-apellidos",
      validate: (val) => {
        if (!val.trim()) return "Ingrese sus apellidos completos.";
        if (val.trim().length < 3) return "Los apellidos deben contener al menos 3 caracteres.";
        if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(val)) return "Los apellidos solo deben contener letras.";
        return null;
      },
    },
    tipoDocumento: {
      element: document.getElementById("tipo-documento"),
      errorId: "error-tipo-documento",
      validate: (val) => {
        if (!val) return "Seleccione el tipo de documento de identidad.";
        return null;
      },
    },
    numeroDocumento: {
      element: document.getElementById("numero-documento"),
      errorId: "error-numero-documento",
      validate: (val) => {
        const tipo = document.getElementById("tipo-documento")?.value;
        if (!val.trim()) return "Ingrese su número de documento.";
        if (tipo === "DNI" && !/^\d{8}$/.test(val.trim())) {
          return "El DNI debe contener exactamente 8 dígitos numéricos.";
        }
        if (tipo === "CE" && !/^[a-zA-Z0-9]{9,12}$/.test(val.trim())) {
          return "El Carné de Extranjería debe tener entre 9 y 12 caracteres.";
        }
        if (tipo === "PASAPORTE" && !/^[a-zA-Z0-9]{6,12}$/.test(val.trim())) {
          return "El Pasaporte debe tener entre 6 y 12 caracteres alfanuméricos.";
        }
        return null;
      },
    },
    correo: {
      element: document.getElementById("correo"),
      errorId: "error-correo",
      validate: (val) => {
        if (!val.trim()) return "Ingrese su correo electrónico.";
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(val.trim())) return "Ingrese un correo electrónico con formato válido (ejemplo@dominio.com).";
        return null;
      },
    },
    telefono: {
      element: document.getElementById("telefono"),
      errorId: "error-telefono",
      validate: (val) => {
        if (!val.trim()) return "Ingrese un número telefónico de contacto.";
        if (!/^\d{9}$/.test(val.replace(/\s+/g, ""))) return "El número telefónico debe tener 9 dígitos numéricos.";
        return null;
      },
    },
    modalidad: {
      element: document.getElementById("modalidad-ingreso"),
      errorId: "error-modalidad-ingreso",
      validate: (val) => {
        if (!val) return "Seleccione una modalidad de admisión.";
        return null;
      },
    },
    sede: {
      element: document.getElementById("sede-preferencia"),
      errorId: "error-sede-preferencia",
      validate: (val) => {
        if (!val) return "Seleccione su sede o modalidad de estudio.";
        return null;
      },
    },
    terminos: {
      element: document.getElementById("check-terminos"),
      errorId: "error-check-terminos",
      validate: (val, el) => {
        if (!el.checked) return "Debe aceptar el tratamiento de datos para procesar su postulación.";
        return null;
      },
    },
  };

  // Función para validar un campo específico con retroalimentación visual accesible
  function validateSingleField(fieldKey) {
    const config = fields[fieldKey];
    if (!config || !config.element) return true;

    const el = config.element;
    const value = el.value;
    const errorMsg = config.validate(value, el);
    const errorContainer = document.getElementById(config.errorId);
    const parentFormGroup = el.closest(".form-group-wrapper") || el.parentElement;

    if (errorMsg) {
      el.classList.add("is-invalid");
      el.classList.remove("is-valid");
      el.setAttribute("aria-invalid", "true");
      if (errorContainer) {
        errorContainer.textContent = errorMsg;
      }
      if (parentFormGroup) {
        parentFormGroup.classList.add("has-error");
        parentFormGroup.classList.remove("has-success");
      }
      return false;
    } else {
      el.classList.remove("is-invalid");
      el.classList.add("is-valid");
      el.setAttribute("aria-invalid", "false");
      if (errorContainer) {
        errorContainer.textContent = "";
      }
      if (parentFormGroup) {
        parentFormGroup.classList.remove("has-error");
        parentFormGroup.classList.add("has-success");
      }
      return true;
    }
  }

  // Escuchar eventos en tiempo real (blur e input)
  Object.keys(fields).forEach((key) => {
    const el = fields[key].element;
    if (!el) return;

    el.addEventListener("blur", () => validateSingleField(key));

    const eventName = el.type === "checkbox" || el.tagName === "SELECT" ? "change" : "input";
    el.addEventListener(eventName, () => {
      if (el.classList.contains("is-invalid")) {
        validateSingleField(key);
      }
    });
  });

  // Manejo del evento Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isFormValid = true;
    let firstInvalidElement = null;

    Object.keys(fields).forEach((key) => {
      const isValid = validateSingleField(key);
      if (!isValid) {
        isFormValid = false;
        if (!firstInvalidElement) {
          firstInvalidElement = fields[key].element;
        }
      }
    });

    if (!isFormValid) {
      if (firstInvalidElement) {
        firstInvalidElement.focus();
        firstInvalidElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    // Proceso de simulación de envío exitoso
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Procesando postulación...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;

      const applicantName = `${fields.nombres.element.value.trim()} ${fields.apellidos.element.value.trim()}`;
      const applicantEmail = fields.correo.element.value.trim();
      const applicantDoc = fields.numeroDocumento.element.value.trim();
      const applicantMod = fields.modalidad.element.options[fields.modalidad.element.selectedIndex].text;
      const applicantSede = fields.sede.element.options[fields.sede.element.selectedIndex].text;
      const codeGenerated = `EXP-SOC-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`;

      if (confirmationContainer) {
        confirmationContainer.innerHTML = `
          <div class="confirmation-card alert alert-success" role="alert" tabindex="-1" id="alert-confirmacion-registro">
            <div class="d-flex align-items-start gap-3">
              <span class="fs-2 text-success" aria-hidden="true">✓</span>
              <div>
                <h3 class="h4 text-success fw-bold mb-2">¡Expediente de Postulación Registrado con Éxito!</h3>
                <p class="mb-2">
                  Estimado(a) <strong>${escapeHtml(applicantName)}</strong>, tu solicitud para la <strong>Licenciatura en Innovación Social y Gestión Pública</strong> ha sido recibida en el sistema institucional.
                </p>
                <div class="bg-white p-3 rounded border border-success mb-3 text-dark">
                  <p class="mb-1"><strong>Código de Expediente:</strong> <span class="badge bg-primary text-white fs-6">${codeGenerated}</span></p>
                  <p class="mb-1"><strong>Documento de Identidad:</strong> ${escapeHtml(applicantDoc)}</p>
                  <p class="mb-1"><strong>Modalidad Seleccionada:</strong> ${escapeHtml(applicantMod)}</p>
                  <p class="mb-1"><strong>Sede:</strong> ${escapeHtml(applicantSede)}</p>
                  <p class="mb-0"><strong>Correo de contacto:</strong> ${escapeHtml(applicantEmail)}</p>
                </div>
                <p class="small text-muted mb-0">
                  Hemos enviado una copia del comprobante y el instructivo de la carpeta de admisión a tu correo institucional/personal. Un asesor de la Facultad te contactará dentro de las próximas 24 horas hábiles.
                </p>
              </div>
            </div>
          </div>
        `;

        confirmationContainer.style.display = "block";
        const alertEl = document.getElementById("alert-confirmacion-registro");
        if (alertEl) {
          alertEl.focus();
          alertEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }

      // Reiniciar formulario y clases de validación
      form.reset();
      Object.keys(fields).forEach((key) => {
        const el = fields[key].element;
        if (el) {
          el.classList.remove("is-valid", "is-invalid");
          el.removeAttribute("aria-invalid");
          const parent = el.closest(".form-group-wrapper") || el.parentElement;
          if (parent) {
            parent.classList.remove("has-error", "has-success");
          }
        }
      });
    }, 700);
  });
}

/**
 * Escapa cadenas para prevenir inyecciones de código en renderizado dinámico
 */
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
