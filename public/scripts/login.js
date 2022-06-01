const emailLoginField = document.querySelector("input#email");
const passwordLoginField = document.querySelector("input#password");
const buttonLogin = document.querySelector("button#login-btn");
const loginForm = document.querySelector("form#login-form");
const h1FormTitle = loginForm.querySelector("h1");

const alertBadRequest= document.createElement("div");
alertBadRequest.classList = "alert alert-danger";
alertBadRequest.setAttribute("role", "alert");

buttonLogin.addEventListener("click", async (e) => {
    e.preventDefault();
    await loginUser({ email: emailLoginField.value, password: passwordLoginField.value }).then(
        (result) => {
            console.log(result.data);
        }
    ).catch((error) => {
        if (error.response.status == 400) {
            alertBadRequest.innerText = `${error.response.data.message}`  
            console.log(error.response.data.message);
            loginForm.insertBefore(alertBadRequest, h1FormTitle);
        }
        alertBadRequest.innerText = `${error.response.data.message}`;
        loginForm.insertBefore(alertBadRequest, h1FormTitle);
    });
    console.log("done");
})

async function loginUser(dataLogin) {
    const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        data: JSON.stringify(dataLogin),
        url: `/api/login`,
    };
    return axios(options);
}