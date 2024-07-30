//To Check Whether User Logged in or Not
document.addEventListener('DOMContentLoaded', ()=>{
    if(!localStorage.getItem('token'))
    {
        alert('Please Log in')
        window.location.href = '/public/index.html';
    }
});


//................................. FETCH THE PROFILE HEADERS FROM BACKEND TO THE FRONTEND .................................//

// Define an asynchronous function to fetch user details from the server.
async function fetchUserDetails() {
    try {
        
        fetch('http://localhost:3001/profile/headerDetails', {
            method: 'GET', 
            headers: {
                'Content-Type': 'application/json', 
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the authentication token stored in localStorage in the Authorization header.
            },
        })
        
        .then((response)=>
        {
            return response.json();
        })

        .then((response)=>
        {
            // Update the DOM elements with the user's details.
            document.getElementById('userName').textContent = response.username;
            document.getElementById('userBio').textContent = response.bio;
            document.getElementById('user_id').textContent = response.user_id;
        })

    } 
    
    catch (error) 
    {
        console.error('Error fetching user details:', error);
    }
}

// Call fetchUserDetails to initiate the fetch operation.
fetchUserDetails();






//................................. FETCH THE TRAVEL STATS FROM BACKEND TO THE FRONTEND .................................//
async function fetchTravelerStats() {
    try 
    {        
        fetch('http://localhost:3001/profile/travelerStats', 
        {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
        })
        
        .then((response)=>
        {
            return response.json();
        })


        .then((response)=>
        {
            // Update the DOM elements with the travel stat details.
            document.getElementById('countriesVisited').textContent = response.countries_visited;
            document.getElementById('citiesExplored').textContent = response.cities_explored;
            document.getElementById('favoriteDestination').textContent = response.favorite_destination;
            document.getElementById('bucketList').textContent = response.bucket_list;
        })
        
    } 
    catch (error) 
    {
        console.error('Error fetching traveler stats:', error);
    }
}


// Ensure to call fetchTravelerStats along with fetchUserDetails or at the appropriate time
fetchTravelerStats();






//................................. FUNCTION TO GET USER's DATA to FROM CONTROL INPUT FIELDS .................................//
document.addEventListener('DOMContentLoaded', ()=>
{
    //Create the function
    async function getUsersDataToInputFields()
    {
        fetch('http://localhost:3001/profile/getUserDetails',
        {
            method:'GET',
            headers:
            {
                'Content-type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })

        .then(response=> {
            return response.json()
        })

        .then(response=> {
            
            //console.log("Get Response of Form Input data is: " + response.username)
            document.getElementById('username').value = response.username;
            document.getElementById('bio').value = response.bio;
        })       
    }
    //Call the function
    getUsersDataToInputFields()
});



//................................. FUNCTION TO SUBMIT FORM DATA (USER'S NEW DETAILS) .................................//
document.addEventListener('DOMContentLoaded', function() 
{
    document.getElementById('saveChangesBtn').addEventListener('click', function(event) 
    {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const newPassword = document.getElementById('newPassword').value;
        const confirmPassword = document.getElementById('confirmPassword').value;
        const bio = document.getElementById('bio').value;

        // Simple password match check
        if (newPassword !== confirmPassword) 
        {
            return alert('Passwords do not match!');
        }

        // Check password field empty or not
        if (newPassword == '') 
        {
            return alert('Password fields cannot keep empty!');
        }

        // Prepare data to be sent
        const userData = { username, password: newPassword, bio };        

        // Make fetch request to update user details
        fetch('http://localhost:3001/profile/saveNewUserDetails', 
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: JSON.stringify(userData)
        })

        .then(response => {           
            return response.json();
        })

        // After the fetch request inside your form submission handler
        .then(data => {
            // Assuming 'data' contains the updated user information
            alert('User details updated successfully');

            // Directly update the Profile Header with the new details
            document.getElementById('userName').textContent = data.username;
            document.getElementById('userBio').textContent = data.bio;

            // Reset the form input fields if necessary
            document.getElementById('editUserForm').reset();
            
            // Directly update the User Inputs with the new details
            document.getElementById('username').value = data.username;
            document.getElementById('bio').value = data.bio;

            
        })

        .catch(error => {
            console.error('Error updating user details:', error);
            alert('Failed to update user details. Please try again.');
        });
    });
});







//................................. NOW THE Travel Stat EACH Edit Button's Modals .................................//

//................................. i. POST(UPDATE) THE Travel Stat - Countries Visited with it's Edit Button's Modal .................................//
// JavaScript to handle modal form submission
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for form submission
    document.getElementById('editCountriesForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission

        const countriesVisited = document.getElementById('countriesVisitedInput').value; // Get the new value

        // Call the function to update the server and UI
        updateCountriesVisited(countriesVisited);

        
        
    });
});

function updateCountriesVisited(value) {
    fetch('http://localhost:3001/profile/countriesVisited', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Ensure you're sending the token for authorization
        },
        body: JSON.stringify({ countriesVisited: value })
    })

    .then(response => {           
        return response.json();
    })

    .then(data => {
        // Assuming the server responds with the updated value
        document.getElementById('countriesVisited').textContent = data.countries_visited;

        // Hide the modal using Bootstrap's JavaScript method
        const modalElement = document.getElementById('editCountriesModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide(); // Hide the modal
    })
    .catch(error => {
        console.error('Error updating countries visited:', error);
        alert('Failed to update countries visited.');
    });
}



//................................. ii. POST(UPDATE) THE Travel Stat - Cities Explored with it's Edit Button's Modal .................................//
document.addEventListener('DOMContentLoaded', function() 
{
    const editCitiesForm = document.getElementById('editCitiesForm');
    
    // Assuming we've fetched and stored the current number of cities explored
    // document.getElementById('citiesExploredInput').value = currentUserCitiesExplored;

    editCitiesForm.addEventListener('submit', function(event) 
    {
        event.preventDefault(); // Prevent the default form submission behavior
        const citiesExplored = document.getElementById('citiesExploredInput').value; // Get the updated value

        updateCitiesExplored(citiesExplored); // Call the function to handle the update
    });
});

function updateCitiesExplored(value) {
    fetch('http://localhost:3001/profile/citiesExplored', { 
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the auth token
        },
        body: JSON.stringify({ citiesExplored: value })
    })
    
    .then(response => {           
            return response.json();
    })

    .then(data => {
        // Update the UI with the new value and close the modal
        document.getElementById('citiesExplored').textContent = data.cities_explored;

        // Hide the modal using Bootstrap's JavaScript method
        const modalElement = document.getElementById('editCitiesModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide(); // Hide the modal
    })

    .catch(error => {
        console.error('Error updating cities explored:', error);
        alert('Failed to update cities explored.');
    });
}




//................................. iii. POST(UPDATE) THE Travel Stat - Favorite Destination with it's Edit Button's Modal .................................//
document.addEventListener('DOMContentLoaded', function() {
    const editDestinationForm = document.getElementById('editDestinationForm');
    
    // Event listener for form submission
    editDestinationForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent default form submission
        const favoriteDestination = document.getElementById('favoriteDestinationInput').value; // Get updated value
        
        updateFavoriteDestination(favoriteDestination); // Function to handle the update
    });
});

function updateFavoriteDestination(value) {
    fetch('http://localhost:3001/profile/favoriteDestination', { // Adjust endpoint as necessary
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include auth token
        },
        body: JSON.stringify({ favoriteDestination: value })
    })

    .then(response => {           
        return response.json();
    })

    .then(data => {
        // Update UI with new value and close the modal
        document.getElementById('favoriteDestination').textContent = data.favorite_destination;

        // Hide the modal using Bootstrap's JavaScript method
        const modalElement = document.getElementById('editDestinationModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide(); // Hide the modal
    })
    
    .catch(error => {
        console.error('Error updating favorite destination:', error);
        alert('Failed to update favorite destination.');
    });
}





//................................. iv. POST(UPDATE) THE Travel Stat - Bucket List with it's Edit Button's Modal .................................//
document.addEventListener('DOMContentLoaded', function() {
    const editBucketListForm = document.getElementById('editBucketListForm');
    
    editBucketListForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the default form submission
        const bucketList = document.getElementById('bucketListInput').value; // Get the updated bucket list
        
        updateBucketList(bucketList); // Function to handle the update
    });
});

function updateBucketList(value) {
    fetch('http://localhost:3001/profile/bucketList', { // Adjust this to your actual API endpoint
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the auth token
        },
        body: JSON.stringify({ bucketList: value })
    })
    
    .then(response => {           
        return response.json();
    })

    .then(data => {
        // Update the UI with the new bucket list and close the modal
        document.getElementById('bucketList').textContent = data.bucket_list;

        // Hide the modal using Bootstrap's JavaScript method
        const modalElement = document.getElementById('editBucketListModal');
        const modalInstance = bootstrap.Modal.getInstance(modalElement);
        modalInstance.hide(); // Hide the modal

    })

    .catch(error => {
        console.error('Error updating bucket list:', error);
        alert('Failed to update bucket list.');
    });
}















//................................. PROFILE PIC UPLOADING .................................//
// Profile Pic Uploading
document.getElementById('profilePicUpload').addEventListener('change', function() {
    const fileInput = this; // this refers to the file input element
    if (fileInput.files && fileInput.files[0]) {
        const formData = new FormData();
        formData.append('profilePic', fileInput.files[0]);

        fetch('http://localhost:3001/profile/newpic', {
            method: 'POST',
            body: formData,
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(response => {
            console.log( response.user_id);
            // Update profile picture on the page
            const image_container = document.getElementById('image_container');
            image_container.innerHTML = `
            <img src="http://localhost:3001/${response.profile_picture}" id="profilePicture" alt="Profile Picture" class="profile-header-img mb-3 profile-img">
            `;
            
        })
        .catch(error => {
            console.error('Error uploading image:', error);
            alert('Failed to upload image. Please try again.');
        });
    } else {
        alert('Please select a file to upload');
    }
});


// Function to redirect to the post detail page
function redirectToPost(userId) {
    window.location.href = `post.html?postId=${userId}`;
}


// ------------------------------------ To Get Profile Pic ------------------------------------
fetch('http://localhost:3001/profile/getUserDetails' ,{
    method: 'GET',
    headers : {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    }
})

.then((response) =>
{
    return response.json();
})

.then((response)=>
{   

    console.log(response);
    //Set Post Cover Pic
    const coverImageElement = document.getElementById('profilePicture');
    coverImageElement.src = `http://localhost:3001/${response.propic}`;   

})





//................................. MODAL OPENING RELATED CODES .................................//

// JavaScript to handle modal opening
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for modal opening
    document.getElementById('edit_btn_countriesVisited').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action of the button

        // Get the current value of "Countries Visited"
        const currentCountriesVisited = document.getElementById('countriesVisited').textContent;

        // Set the value of the input field in the modal
        document.getElementById('countriesVisitedInput').value = currentCountriesVisited;
    });
});

// JavaScript to handle modal opening
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for modal opening
    document.getElementById('edit_btn_citiesExplored').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action of the button

        // Get the current value of "Countries Visited"
        const currentCountriesVisited = document.getElementById('citiesExplored').textContent;

        // Set the value of the input field in the modal
        document.getElementById('citiesExploredInput').value = currentCountriesVisited;
    });
});

// JavaScript to handle modal opening
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for modal opening
    document.getElementById('edit_btn_favoriteDestination').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action of the button

        // Get the current value of "Countries Visited"
        const currentCountriesVisited = document.getElementById('favoriteDestination').textContent;

        // Set the value of the input field in the modal
        document.getElementById('favoriteDestinationInput').value = currentCountriesVisited;
    });
});

// JavaScript to handle modal opening
document.addEventListener('DOMContentLoaded', function() {
    // Event listener for modal opening
    document.getElementById('edit_btn_bucketList').addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the default action of the button

        // Get the current value of "Countries Visited"
        const currentCountriesVisited = document.getElementById('bucketList').textContent;

        // Set the value of the input field in the modal
        document.getElementById('bucketListInput').value = currentCountriesVisited;
    });
});



// ------------------------------------ Profile Image Click ------------------------------------
document.getElementById('profilePicture').addEventListener('click', function() {
    const userId = document.getElementById('user_id').textContent;
    console.log('user id is' , userId)
    window.location.href = `userDetails.html?userId=${userId}`;
});
