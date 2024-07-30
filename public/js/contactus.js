const contact_btn = document.getElementById('contact_btn');

contact_btn.addEventListener('click', function (event) {
    console.log('Button clicked'); // For debugging to confirm the button click event is captured

    event.preventDefault();

    // Retrieve the values entered in the name,contact number,email address and message fields by the user.(can be a registered user or other user)
    const name1 = document.getElementById('fullname').value;
    const contactnumber1 = document.getElementById('contactnumber').value;
    const emailaddress1 = document.getElementById('email').value;
    const message1 = document.getElementById('message').value;
    let isValid = true;
    let errors = [];

    if (name1.length < 2) {
        errors.push('Name cannot be empty');
        isValid = false;
    }

    if (contactnumber1.length < 10) {
        errors.push('Phone number cannot be empty');
        isValid = false;
    }

    if (!emailaddress1.includes('@')) {
        errors.push('Please enter valid email address');
        isValid = false;
    }

    if (message1.length < 2) {
        errors.push('Message cannot be empty');
        isValid = false;
    }

    if (!isValid) {
        displayError(errors);
        return false;
    }

    const reqPayLoad = JSON.stringify({ fullname: name1, contactnumber: contactnumber1, email: emailaddress1, message: message1 });

    try {
        // sending the request to the backend
        fetch('http://localhost:3001/contactus/contactus/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: reqPayLoad
        })

            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })

            .then((response) => {
                var form = document.getElementById(contact-us);
                form.reset();
                displayError(['Message sent Successfully, You will be redirected to the home page soon.'], 'success');
                setTimeout(function(){
                    window.location.href = '/public/index.html';
                }, 4000);
            })
    }

    catch (error) {
        console.log(error);
    }


});