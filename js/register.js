const $registerForm = document.querySelector(".register-form");

$registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = new FormData($registerForm);
  const data = {
    firstName: formData.get("firstname"),
    lastName: formData.get("lastname"),
    email: formData.get("email"),
    password: formData.get("apipassword"),
  };

  try {
    const res = await fetch(
      "https://prime-garfish-currently.ngrok-free.app/users",
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
      window.location.assign("../index.html");
    } else {
      const err = await res.json();
      console.log(`Erreur : ${err}`);
    }
  } catch (error) {
    console.log(`Erreur ${error}`);
  }
});
