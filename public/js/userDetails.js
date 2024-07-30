
document.addEventListener('DOMContentLoaded', function() 
{
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    console.log(userId); // Use this postId to fetch or display more details

    fetchUserProfile();
    fetchUserStats();
    fetchTravelStats();
    fetchHotTopics();


    
});

function fetchUserProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    // Fetch user profile details
    fetch('http://localhost:3001/userDetails/userProfile', {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(response => 
    {
        //console.log(response);
        document.getElementById('profilePicture').src = `http://localhost:3001/${response.profile_picture}`;
        document.getElementById('username').textContent = response.username;
        document.getElementById('bio').textContent = response.bio;

        // Set the same image for the modal
        document.getElementById('modalProfilePicture').src = `http://localhost:3001/${response.profile_picture}`;
    })
    .catch(error => console.error('Error fetching user profile:', error));
}

function fetchUserStats() 
{
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    // Fetch user stats (totalPosts, totalLikes, totalComments)
    fetch('http://localhost:3001/userDetails/userStats', {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(response => 
    {
        //console.log(response);
        document.getElementById('totalPosts').textContent = response.totalPosts;
        document.getElementById('totalLikes').textContent = response.totalLikes;
        document.getElementById('totalComments').textContent = response.totalComments;
    })
    .catch(error => console.error('Error fetching user stats:', error));
}

function fetchTravelStats() 
{
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');
    // Fetch travel stats
    fetch('http://localhost:3001/userDetails/travelStats', {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(response => 
    {
        //console.log(response);
        document.getElementById('countriesVisited').textContent = response.countries_visited;
        document.getElementById('citiesExplored').textContent = response.cities_explored;
        document.getElementById('favoriteDestination').textContent = response.favorite_destination;
        document.getElementById('bucketList').textContent = response.bucket_list;
    })
    .catch(error => console.error('Error fetching travel stats:', error));
}

function fetchHotTopics() 
{
    const urlParams = new URLSearchParams(window.location.search);
    const userId = urlParams.get('userId');

    // Fetch hot topics
    fetch('http://localhost:3001/userDetails/popularPosts', {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ user_id: userId })
    })
    .then(response => response.json())
    .then(response => 
    {
        console.log(response);

        const container = document.getElementById('hotTopicsContainer');
        response.forEach(post_element => {
            const postDiv = document.createElement('div');
            postDiv.className = 'hot-topic';
            postDiv.innerHTML = `
            <div class="" onclick="redirectToPost(${post_element.post_id})" style="cursor: pointer;">
                <p id="post_id" hidden>post id: ${post_element.post_id}</p>
                <h4>${post_element.title}</h4>
                <img src="http://localhost:3001/${post_element.cover_image}" alt="${post_element.title}" style="width: 100%; max-height: 200px; object-fit: cover;">
                <p>Likes: ${post_element.likes_count}, Comments: ${post_element.comments_count}</p>
            </div>
            `;
            container.appendChild(postDiv);
        });
    })
    .catch(error => console.error('Error fetching hot topics:', error));    
}

// Function to redirect to the post detail page
function redirectToPost(postId) {
    window.location.href = `post.html?postId=${postId}`;
}











//................................. NAV BAR ITEM's RELATED CODES .................................//


//Login Nav Item Related Code
addEventListener('DOMContentLoaded', ()=>
{
    if(localStorage.getItem('token'))
    {
        const loginNavItem = document.getElementById('login_nav_item')
        loginNavItem.style.display = 'none'
    }
});

//Logout Nav Item Related Code
addEventListener('DOMContentLoaded', ()=>
{
    if(localStorage.getItem('token'))
    {
        const loginNavItem = document.getElementById('logout_nav_item')
        loginNavItem.style.display = 'block'
    }
});


//Logout related code
const logoutLink = document.getElementById('logout_nav_item');

logoutLink.addEventListener('click', ()=>
{
    localStorage.clear();
    window.location.href = 'index.html'
});