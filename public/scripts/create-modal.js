const main = document.querySelector("main");
const createButton = main.querySelector("div#add-button img");
const createModal = $("#create-modal");
const modalBodyCreate = createModal[0].querySelector("div.modal-body");
const createForm = modalBodyCreate.querySelector("form#create-form");
const createAdviceButton = createModal[0].querySelector("button#save-create");
const dayFieldCreate = createModal[0].querySelector("#create-day");
const timeFieldCreate = createModal[0].querySelector("#create-time");
const descriptionFieldCreate = createModal[0].querySelector("#create-description");

const alertEmptyFieldCreate = document.createElement("div");
alertEmptyFieldCreate.innerHTML = "Há um campo vazio, preencha-o antes de criar este aviso.";
alertEmptyFieldCreate.classList = "alert alert-danger";
alertEmptyFieldCreate.setAttribute("role", "alert");

createButton.addEventListener("click", () => {
    createModal.modal();
});

function clearCreateFields() {
    dayFieldCreate.value = "";
    timeFieldCreate.value = "";
    descriptionFieldCreate.value = "";
}

function isEmptyStringCreate(value) {
    if (value == "" || (typeof value === 'string' && value.trim().length === 0) ) {
        return true; 
    }
    return false;
}

function isThereEmptyString(data) {
    return new Promise((res) => {
        for (let key in data) {
            if (isEmptyStringCreate(data[key])) {
                res(true);
            }
        }
        res(false);
    })
}

function createAdvice(newData) {
    const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        data: JSON.stringify(newData),
        url: `/api/avisos`,
    };
    return axios(options); 
}

$('#create-modal').on('hidden.bs.modal', () => {
    if (alertEmptyFieldCreate.closest("div.modal-body")) {
        alertEmptyFieldCreate.remove();
    }
    clearCreateFields();
});

createAdviceButton.addEventListener("click", async (e) => {
    let createData = {
        day: dayFieldCreate.value,
        time: timeFieldCreate.value,
        description: descriptionFieldCreate.value
    }
    let notEmptyString = true;
    if (await isThereEmptyString(createData)) {
        createData = null;
        notEmptyString = false
        if (alertNotChangedData.closest("div.modal-body")) {
            alertNotChangedData.remove();
        }
        modalBodyCreate.insertBefore(alertEmptyFieldCreate, createForm);
    }
    if (notEmptyString) {
        await createAdvice(createData);
        createModal.modal('toggle');
        window.location.href = window.location.href;
    }
});



