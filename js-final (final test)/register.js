document
  .getElementById("login-form")
  .addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.querySelector('input[type="email"]').value;
    const repeatEmail = document.querySelectorAll('input[type="email"]')[1]
      .value;
    const password = document.querySelector('input[type="password"]').value;

    if (!email || !repeatEmail || !password) {
      alert("Please fill in all fields.");
      return;
    }

    if (email !== repeatEmail) {
      alert("Emails do not match.");
      return;
    }

    const user = {
      email: email,
      password: password,
    };

    localStorage.setItem("user", JSON.stringify(user));

    localStorage.setItem("isLoggedIn", "true");

    window.location.href = "index.html";
  });
