const login_btn = document.getElementById('login_btn');

login_btn.addEventListener('click', function (event) {
    console.log('Button clicked'); // For debugging purposes to confirm the button click event is captured.

    event.preventDefault();
    let isValid = true;
    let errors = [];

    // Retrieve the values entered in the username and password fields by the user.
    const username1 = document.getElementById('username').value;
    const password1 = document.getElementById('password').value;

    const reqPayLoad = JSON.stringify({ username: username1, password: password1 });

    if (username1.length < 4)
    {
        errors.push('Username must be at least 4 characters long.');
        isValid = false;
    }

    if (password1.length < 2)
    {
        errors.push('Password cannot be empty');
        isValid = false;
    }

    if (!isValid) {
        displayError(errors);
        return false;
    }

    try {
        //Sending the request to the backend
        fetch('http://localhost:3001/login/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: reqPayLoad
        })

            .then((response) => {
                return response.json();
            })

            .then((response) => {

                if (response.message == 'Login successful') {
                    localStorage.setItem('token', response.token);  //Set token in the cache
                    localStorage.setItem('user', JSON.stringify(response.userDetails));

                    displayError(['You have successfully logged in. You will be redirected to the home page soon.'], 'success');
                    setTimeout(function(){
                        window.location.href = '/public/index.html';
                    }, 4000);
                }

                else {
                    displayError(['Your username or password is incorrect. Please check and try again.'],);
                }


            })

    }

    catch (error) {
        console.log(error);
    }


});

