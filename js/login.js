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
      const resData = await res.json();
      localStorage.setItem("token", resData.access_token);
      window.location.assign("./pages/main.html");
    } else {
      const err = await res.json();
      console.log(`Erreur : ${err}`);
    }
  } catch (error) {
    console.log(`Erreur ${error}`);
  }
});
