const sectionContainer = document.querySelector("section.page-contain");
const advices = sectionContainer.querySelectorAll("div.data-card");
let allAdvices;
const editModal = $("#edit-modal");
const deleteModal = $("#delete-modal");
const deleteAdviceButton = editModal[0].querySelector("button#remove-advice");
const saveChangesButton = editModal[0].querySelector("button#save-changes");
const closeChangesButton = editModal[0].querySelector("button#close-changes");
const dayField = editModal[0].querySelector("#edit-day");
const timeField = editModal[0].querySelector("#edit-time");
const descriptionField = editModal[0].querySelector("#edit-description");
const modalBody = editModal[0].querySelector("div.modal-body");
const editForm = modalBody.querySelector("form#edit-form");

const alertEmptyField = document.createElement("div");
alertEmptyField.innerHTML = "Há um campo vazio, preencha-o antes de atualizar.";
alertEmptyField.classList = "alert alert-danger";
alertEmptyField.setAttribute("role", "alert");

const alertNotChangedData = document.createElement("div");
alertNotChangedData.innerHTML = "Altere pelo menos um dado para atualizar este aviso.";
alertNotChangedData.classList = "alert alert-warning";
alertNotChangedData.setAttribute("role", "alert");

function isEmptyString(value) {
    if (value == "" || (typeof value === 'string' && value.trim().length === 0) ) {
        return true; 
    }
    return false;
}

async function getAllAdvices() {
    const advices = await axios({
        method: 'GET',
        headers: { 'content-type': 'application/x-www-form-urlencoded' },
        url: `/api/avisos`
    });
    allAdvices = advices.data;
}

function getAdvice(id) {
    let filteredAdvice;
    return new Promise((res) => {
        filteredAdvice = allAdvices.find(advice => advice.id == id);
        res(filteredAdvice);
    })  
}

async function getAdviceById(id) {
    if (!allAdvices) {
        await getAllAdvices();
    }
    const filteredAdvice = await getAdvice(id);
    return filteredAdvice;
}

function addEditModalFields(data, day, time, description){
    day.value = data.day;
    time.value = data.time;
    description.value = data.description;
}

async function getAdviceAndShowEditModel(target) {
    const id = target.getAttribute('advice-id')
    const adviceReturned = await getAdviceById(id);
    addEditModalFields(adviceReturned, dayField, timeField, descriptionField);
    editModal[0].setAttribute("advice-id", id);
    editModal.modal();
}

advices.forEach((advice) => {
    advice.addEventListener("click", (e) => {
        const target = e.target;
        getAdviceAndShowEditModel(target);
    });
});

function isThereAtLeastOneUpdateAndReturn(newData, oldData) {
    if (oldData.hasOwnProperty("id")) {
        delete oldData.id;
    }
    const dataUpdate = {};
    return new Promise((res) => {
        for (let key in oldData) {
            if (oldData[key] != newData[key]) {
                dataUpdate[key] = newData[key];
            }
        }
        if (Object.entries(dataUpdate).length === 0) {
            res(false);
        } else {
            res(dataUpdate);
        }
    });
}

function deleteAdvice(id) {
    const options = {
        method: 'DELETE',
        url: `/api/avisos/${id}`
    };
    return axios(options);
}

function updateAdvice(id, dataUpdate) {
    const options = {
        method: 'PUT',
        headers: {'content-type': 'application/json'},
        data: JSON.stringify(dataUpdate),
        url: `/api/avisos/${id}`,
    };
    return axios(options);
}

function isAnyOneEmptyString(data) {
    return new Promise((res) => {
        for (let key in data) {
            if (isEmptyString(data[key])) {
                res(true);
            }
        }
        res(false);
    })
}

$('#edit-modal').on('hidden.bs.modal', () => {
    if (alertNotChangedData.closest("div.modal-body")) {
        alertNotChangedData.remove();
    }
    if (alertEmptyField.closest("div.modal-body")) {
        alertEmptyField.remove();
    }
});

let temporaryAdvice;
saveChangesButton.addEventListener("click", async (e) => {
    const target = e.target.closest("#edit-modal");
    let id = target.getAttribute('advice-id');
    let dataUpdate = {
        day: dayField.value,
        time: timeField.value,
        description: descriptionField.value
    }
    if (!temporaryAdvice) {
        temporaryAdvice = await getAdviceById(id)
    }
    dataUpdate = await isThereAtLeastOneUpdateAndReturn(dataUpdate, temporaryAdvice);
    let notEmptyString = true;
    if (await isAnyOneEmptyString(dataUpdate)) {
        dataUpdate = null;
        notEmptyString = false
        if (alertNotChangedData.closest("div.modal-body")) {
            alertNotChangedData.remove();
        }
        modalBody.insertBefore(alertEmptyField, editForm);
    }
    if (notEmptyString) {
        if (dataUpdate) {
            await updateAdvice(id, dataUpdate);
            editModal.modal('toggle');
            temporaryAdvice = null;
            allAdvices = null;
            window.location.href = window.location.href;
        } else {
            allAdvices = null;
            if (alertEmptyField.closest("div.modal-body")) {
                alertEmptyField.remove();
            }
            modalBody.insertBefore(alertNotChangedData, editForm);
        }
    }
});

deleteAdviceButton.addEventListener("click", async (e) => {
    const target = e.target.closest("#edit-modal");
    let id = target.getAttribute('advice-id');
    const deleteButton = deleteModal[0].querySelector("div.modal-footer button#delete-btn")
    await deleteButton.addEventListener("click", async () => {
        await deleteAdvice(id);
        window.location.href = window.location.href;
    })
    deleteModal.modal();
});

$('#delete-modal').on('hidden.bs.modal', () => {
    editModal.modal();
});