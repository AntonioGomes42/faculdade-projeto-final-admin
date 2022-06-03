const loginForm = document.querySelector("form#login-form");
const emailLoginField = loginForm.querySelector("input#email");
const passwordLoginField = loginForm.querySelector("input#password");
const buttonLogin = loginForm.querySelector("button#login-btn");
const h1FormTitle = loginForm.querySelector("h1");

const alertBadRequest= document.createElement("div");
alertBadRequest.classList = "alert alert-danger";
alertBadRequest.setAttribute("role", "alert");

buttonLogin.addEventListener("click", async (e) => {
    e.preventDefault();
    await loginUser({ email: emailLoginField.value, password: passwordLoginField.value }).then(
        (result) => {
            window.location.href = '/';
        }
    ).catch((error) => {
        if (error.response.status == 400) {
            alertBadRequest.innerText = `${error.response.data.message}`  
            loginForm.insertBefore(alertBadRequest, h1FormTitle);
        }
        alertBadRequest.innerText = `${error.response.data.message}`;
        loginForm.insertBefore(alertBadRequest, h1FormTitle);
    }); 
})

async function loginUser(dataLogin) {
    const options = {
        method: 'POST',
        headers: {'content-type': 'application/json'},
        data: JSON.stringify(dataLogin),
        url: `/api/login`,
        withCredentials: true
    };
    return axios(options);
}