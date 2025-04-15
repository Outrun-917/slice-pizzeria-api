const $loginForm = document.querySelector(".login-form");

$loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData($loginForm);
  const data = {
    email: formData.get("email"),
    password: formData.get("apipassword"),
  };

  try {
    const res = await fetch(
      "https://prime-garfish-currently.ngrok-free.app/auth/login",
      {
        method: "POST",
        headers: {
          "ngrok-skip-browser-warning": "1",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      }
    );

    if (res.ok) {
      const resData = res.json();
      console.log(resData);
      console.log(resData.access_token);
    } else {
      const err = await res.json();
      console.log(`Erreur : ${err}`);
    }
  } catch (error) {
    console.log(`Erreur ${error}`);
  }
});
