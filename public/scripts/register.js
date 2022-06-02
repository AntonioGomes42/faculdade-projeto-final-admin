const registerForm = document.querySelector("form#register-form");
const h1FormRegister = registerForm.querySelector("h1")
const nameRegisterInput = registerForm.querySelector("input#name");
const emailRegisterInput = registerForm.querySelector("input#email");
const passwordRegisterInput = registerForm.querySelector("input#password");
const registerButton = registerForm.querySelector("button#register-btn");

const alertBadRequestRegister= document.createElement("div");
alertBadRequestRegister.classList = "alert alert-danger";
alertBadRequestRegister.setAttribute("role", "alert");

const sucessInnerHTML = (name) => {
    const sucessHtml = `
    <main id="sucess">
        <div>
        <div id="sucess-icon">
            <svg version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
                viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve">
                <circle style="fill:#25AE88;" cx="25" cy="25" r="25"/>
                <polyline style="fill:none;stroke:#FFFFFF;stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-miterlimit:10;" points="
                    38,15 22,33 12,25 "/>
                <g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g><g></g>
            </svg>
        </div> 
        <div id="text-info">
            <h1>O usuário <b>${name}</b> foi criado com sucesso</h1>
        </div>
        </div>
        <span>Para ir para a página de login <a href="/login">Clique aqui</a>.</span>
    </main>`;
  return sucessHtml;
}

registerButton.addEventListener("click", async (e) => {
    e.preventDefault();
    let isPasswordValid = await validatePassword(passwordRegisterInput.value);
    if (isPasswordValid) {
        await registerUser({ name: nameRegisterInput.value, email: emailRegisterInput.value, password: passwordRegisterInput.value })
            .then((returnedData) => {
                document.body.innerHTML = sucessInnerHTML(nameRegisterInput.value);
        }).catch((error) => {
            if (error.response.hasOwnProperty("status")) {
                if (error.response.status == 400) {
                    if (error.response.hasOwnProperty("data")) {
                        alertBadRequestRegister.innerText = `${error.response.data.message}`;
                        registerForm.insertBefore(alertBadRequestRegister, h1FormRegister);
                    } else {
                        alertBadRequestRegister.innerText = `${JSON.stringify(error.response)}`;
                        registerForm.insertBefore(alertBadRequestRegister, h1FormRegister);
                    }
                }
            }      
        });
    }
});

async function registerUser(dataRegister) {
    const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        data: JSON.stringify(dataRegister),
        url: `/api/cadastro`,
    };
    return axios(options);
}

function validatePassword(password) {
    return new Promise((res) => {
        let isValidPassword = true;
        const regexValidation = /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])([a-zA-Z0-9]{8,})$/;
        if (!(password.match(regexValidation))) {
            alertBadRequestRegister.innerText = `Senha fraca. A senha deve conter: 
                ●  Pelo menos 8 caracters.
                ●  Pelo menos 1 número.
                ●  Pelo menos uma letra minúscula.
                ●  Pelo menos uma letra maiúscula.
                ●  Somente letras e números.
            `;
            registerForm.insertBefore(alertBadRequestRegister, h1FormRegister);
            isValidPassword = false;
        }
        res(isValidPassword);
    })
}