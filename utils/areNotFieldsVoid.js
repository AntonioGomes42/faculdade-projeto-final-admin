function isNotVoid(field, errorMessage){
    if (field == null || field == undefined || field == "") {
        throw new Error(errorMessage);
    }
}

async function areNotAdvicesVoidFields(body) {
    return new Promise((res) => {
         isNotVoid(body.day, "Informe um dia, não pode ser vazio.");
         isNotVoid(body.time, "Informe um horário, não pode ser vazio.");
         isNotVoid(body.description, "Informe uma descrição, não pode ser vazia.");
        res();
    })
}

export {isNotVoid, areNotAdvicesVoidFields}