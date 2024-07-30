//................................. NAV BAR ITEM's RELATED CODES .................................//

function isLogin() {
    if (localStorage.getItem('user')) {
        const logiUserElement = document.querySelectorAll(".sesion-active");
        logiUserElement.forEach((userItem) => {
            userItem.style.display = 'block';
        });
        document.querySelector(".btn-login").style.display = 'none';
        
        return true
    } else {
        const logiUserElement = document.querySelectorAll(".sesion-inactive");
        logiUserElement.forEach((userItem) => {
            //userItem.style.display = 'none';
        });
        return false
    }
}

//Login Nav Item Related Code
addEventListener('DOMContentLoaded', () => {
    isLogin()
});


//Logout related code
const logoutLink = document.getElementById('logout_nav_item');

logoutLink.addEventListener('click', () => {
    localStorage.clear();
    window.location.href = 'index.html'
});

function displayError(messages, mtype='danger') {
    const errorMessages  = document.getElementById('errorMessages');
    errorMessages.innerHTML = '';

    messages.forEach((message) => {
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${mtype}`;
        alertDiv.textContent = message;
        errorMessages.appendChild(alertDiv);
    });
    
  }

  const formatDate = (dateString) =>{
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
  }