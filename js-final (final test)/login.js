document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();


    const email = document.querySelector('input[type="email"]').value;
    const password = document.querySelector('input[type="password"]').value;


    if (!email || !password) {
        alert('Please fill in all fields.');
        return;
    }


    const storedUser   = JSON.parse(localStorage.getItem('user'));


    if (storedUser   && storedUser  .email === email && storedUser  .password === password) {
    
        localStorage.setItem('isLoggedIn', 'true');

       
        window.location.href = 'index.html';
    } else {
        alert('Invalid email or password.');
    }
});