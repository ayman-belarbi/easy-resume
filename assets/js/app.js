const regexPatterns = {
  TEXT: /^[a-zA-Z\s]*$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im,
  DIGIT: /^\d+$/,
};

const validTypes = {
  TEXT: "TEXT",
  TEXT_EMP: "TEXT",
  EMAIL: "EMAIL",
  DIGIT: "DIGIT",
  PHONE: "PHONE",
  ANY: "ANY",
};

const form = document.getElementById("cv-form");
const inputs = {
  firstname: form.firstname,
  middlename: form.middlename,
  lastname: form.lastname,
  image: form.image,
  designation: form.designation,
  address: form.address,
  email: form.email,
  phoneno: form.phoneno,
  summary: form.summary,
};

const displays = {
  fullname: document.getElementById("fullname_dsp"),
  image: document.getElementById("image_dsp"),
  phoneno: document.getElementById("phoneno_dsp"),
  email: document.getElementById("email_dsp"),
  address: document.getElementById("address_dsp"),
  designation: document.getElementById("designation_dsp"),
  summary: document.getElementById("summary_dsp"),
  projects: document.getElementById("projects_dsp"),
  achievements: document.getElementById("achievements_dsp"),
  skills: document.getElementById("skills_dsp"),
  educations: document.getElementById("educations_dsp"),
  experiences: document.getElementById("experiences_dsp"),
};

const fetchValues = (fields, ...elements) => {
  return Array.from(elements[0]).map((_, index) =>
    Object.fromEntries(
      fields.map((field, i) => [field, elements[i][index].value.trim()])
    )
  );
};

const validateInput = (input, type, name) => {
  const pattern = regexPatterns[type];
  const isValid =
    type === "ANY" ? input.value.trim() !== "" : pattern.test(input.value);
  input.nextElementSibling.textContent = isValid ? "" : `${name} is invalid`;
};

const getUserInputs = () => ({
  firstname: inputs.firstname.value.trim(),
  middlename: inputs.middlename.value.trim(),
  lastname: inputs.lastname.value.trim(),
  designation: inputs.designation.value.trim(),
  address: inputs.address.value.trim(),
  email: inputs.email.value.trim(),
  phoneno: inputs.phoneno.value.trim(),
  summary: inputs.summary.value.trim(),
  achievements: fetchValues(
    ["title", "description"],
    document.querySelectorAll(".achieve_title"),
    document.querySelectorAll(".achieve_description")
  ),
  experiences: fetchValues(
    [
      "title",
      "organization",
      "location",
      "start_date",
      "end_date",
      "description",
    ],
    document.querySelectorAll(".exp_title"),
    document.querySelectorAll(".exp_organization"),
    document.querySelectorAll(".exp_location"),
    document.querySelectorAll(".exp_start_date"),
    document.querySelectorAll(".exp_end_date"),
    document.querySelectorAll(".exp_description")
  ),
  educations: fetchValues(
    [
      "school",
      "degree",
      "city",
      "start_date",
      "graduation_date",
      "description",
    ],
    document.querySelectorAll(".edu_school"),
    document.querySelectorAll(".edu_degree"),
    document.querySelectorAll(".edu_city"),
    document.querySelectorAll(".edu_start_date"),
    document.querySelectorAll(".edu_graduation_date"),
    document.querySelectorAll(".edu_description")
  ),
  projects: fetchValues(
    ["title", "link", "description"],
    document.querySelectorAll(".proj_title"),
    document.querySelectorAll(".proj_link"),
    document.querySelectorAll(".proj_description")
  ),
  skills: fetchValues(["skill"], document.querySelectorAll(".skill")),
});

const displayCV = (userData) => {
  displays.fullname.textContent = `${userData.firstname} ${userData.middlename} ${userData.lastname}`;
  displays.phoneno.textContent = userData.phoneno;
  displays.email.textContent = userData.email;
  displays.address.textContent = userData.address;
  displays.designation.textContent = userData.designation;
  displays.summary.textContent = userData.summary;
  updateListDisplay(userData.projects, displays.projects);
  updateListDisplay(userData.achievements, displays.achievements);
  updateListDisplay(userData.skills, displays.skills);
  updateListDisplay(userData.educations, displays.educations);
  updateListDisplay(userData.experiences, displays.experiences);
};

const updateListDisplay = (listData, container) => {
  container.innerHTML = "";
  listData.forEach((item) => {
    let div = document.createElement("div");
    div.classList.add("preview-item");
    Object.values(item).forEach((value) => {
      let span = document.createElement("span");
      span.classList.add("preview-item-val");
      span.textContent = value;
      div.appendChild(span);
    });
    container.appendChild(div);
  });
};

const generateCV = () => {
  const userData = getUserInputs();
  displayCV(userData);
  console.log(userData);
};

const previewImage = () => {
  let file = inputs.image.files[0];
  if (file) {
    let reader = new FileReader();
    reader.onload = (event) => (displays.image.src = event.target.result);
    reader.readAsDataURL(file);
  }
};

const printCV = () => window.print();

[
  { elem: inputs.firstname, type: validTypes.TEXT, name: "First Name" },
  { elem: inputs.middlename, type: validTypes.TEXT_EMP, name: "Middle Name" },
  { elem: inputs.lastname, type: validTypes.TEXT, name: "Last Name" },
  { elem: inputs.email, type: validTypes.EMAIL, name: "Email" },
  { elem: inputs.phoneno, type: validTypes.PHONE, name: "Phone Number" },
  { elem: inputs.address, type: validTypes.ANY, name: "Address" },
  { elem: inputs.designation, type: validTypes.TEXT, name: "Designation" },
].forEach(({ elem, type, name }) =>
  elem.addEventListener("keyup", () => validateInput(elem, type, name))
);

const addValidationToFields = (selector, type, name) => {
  document
    .querySelectorAll(selector)
    .forEach((field) =>
      field.addEventListener("keyup", () => validateInput(field, type, name))
    );
};

addValidationToFields(".achieve_title", validTypes.ANY, "Achievement Title");
addValidationToFields(
  ".achieve_description",
  validTypes.ANY,
  "Achievement Description"
);
addValidationToFields(".exp_title", validTypes.ANY, "Experience Title");
addValidationToFields(".exp_organization", validTypes.ANY, "Organization");
addValidationToFields(".proj_title", validTypes.ANY, "Project Title");
addValidationToFields(".proj_link", validTypes.ANY, "Project Link");
addValidationToFields(".skill", validTypes.ANY, "Skill");
