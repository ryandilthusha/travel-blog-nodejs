document.addEventListener('DOMContentLoaded', function () {
    const postContainer = document.getElementById('post_container');


    // Function to fetch posts from the server
    function fetchPosts() {
        fetch('http://localhost:3001/index/allPosts', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` // Include the authentication token stored in localStorage in the Authorization header.
            },
        })
            .then((response) => {
                return response.json()
            })

            .then((response) => {
                displayPosts(response)
            })

            .catch((error) => {
                console.error('Error loading posts:', error);
                displayError('Failed to load posts. Please Login'); // Display a user-friendly error message
            });
    }

    // Function to display posts in the DOM
    function displayPosts(response) {
        console.log('inside the function',response)
        const postsContainer = document.getElementById('post_container');
        postsContainer.innerHTML = '';  // Clear existing posts

        if (response.length === 0) {
            postContainer.innerHTML = '<p>No posts to display.</p>';
            return;
        }

        // Initialize a new row
        let divGrid = document.createElement('div');
        divGrid.className = 'row';

        response.forEach((postElement, index) => {
            // Create a new column for each post
            const divColumn = document.createElement('div');
            divColumn.className = 'col-md-6'; // Set the column to take half of the width on medium devices
            divGrid.appendChild(divColumn);

            const postCard = createPostCard(postElement);
            divColumn.appendChild(postCard);

            // Add event listener to the post card
            postCard.addEventListener('click', () => {
                window.location.href = `post.html?postId=${postElement.post_id}`;
            });

            // Every two posts, append the current row to the container and start a new row
            if ((index + 1) % 2 === 0) {
                postContainer.appendChild(divGrid);
                divGrid = document.createElement('div');
                divGrid.className = 'row';
            }
        });

        // Append the last row if it has any posts
        if (response.length % 2 !== 0) {
            postContainer.appendChild(divGrid);
        }
    }

    // Function to create a post card element
    function createPostCard(post) {
        const card = document.createElement('div');
        card.className = 'card blog-card mb-3';
        card.innerHTML = `
            <img src="http://localhost:3001/${post.cover_image}" class="card-img-top" alt="...">
            <div class="card-body">
                <div class="post-content-container">
                    <div class="post-meta post-meta-one">
                    <img src="http://localhost:3001/${post.profile_picture}" id="author_image" alt="Avatar" class="main-post-avatar rounded-circle"/>
                        <span class="post-meta-author">by <a href="#" class="bypostauthor">${post.username} &nbsp; &nbsp;${formatDate(post.post_date)}</a></span>
                    </div>
                    <a href="#" class="post-title"><h2>${post.title}</h2></a>
                    <div class="post-content">${post.content.substring(0, 100)}...</div>
                    <br/><br/>
                    <div class="post-meta post-meta-two">
                        <div class="sh-columns post-meta-comments">
                            <a href="#" class="post-meta-comments">
                                <span class="post-meta-categories"><i class="fa-regular fa-heart fa-lg"></i></i></i> ${post.likes_count}</span>
                            </a>
                            <a href="#" class="post-meta-likes">
                                <span class="post-meta-categories"><i class="fa-regular fa-comment fa-lg"></i></i> ${post.comments_count}</span>
                            </a>
                        </div>
                    </div>
                    <div class="post-card-cat">
                        <span class="post-meta-categories"> ${post.category_name}</span>
                    </div>
                </div>
            </div>
        `;
        return card;
    }


    // Function to display an error message
    function displayError(message) {
        postContainer.innerHTML = `<p class="error-message">${message}</p>`;
    }

    // Call fetchPosts to load and display posts
    fetchPosts();









    //................................. SEARCH AN POST by NAV BAR .................................//
    const btn_search = document.getElementById('btn_search')
    btn_search.addEventListener('click', function (event) {
        event.preventDefault(); // Prevent the form from submitting traditionally
        const searchQuery = document.getElementById('searchInput').value;

        fetch(`http://localhost:3001/index/search?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayPosts(response); // Call the displayPosts function to render the search results
            })
            .catch(error => {
                console.error('Error loading search results:', error);
                const postsContainer = document.getElementById('posts_container');
                postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
            });
    });




    //................................. 1. SEARCH AN POST by CATEGORY "All" .................................//
    const btn_search_all = document.getElementById('btn_search_all')
    const btn_search_tips = document.getElementById('btn_search_tips')
    const btn_search_adventure = document.getElementById('btn_search_adventure')
    const btn_search_solo = document.getElementById('btn_search_solo')
    const btn_search_family = document.getElementById('btn_search_family')
    const btn_search_friends = document.getElementById('btn_search_friends')
    const btn_search_nature = document.getElementById('btn_search_nature')
    const btn_search_getaways = document.getElementById('btn_search_getaways')

    btn_search_all.addEventListener('click', (event) => {
        event.preventDefault();

        fetch(`http://localhost:3001/index/allPosts`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayPosts(response); // Call the displayPosts function to render the search results

                btn_search_all.setAttribute('class', 'nav-link active')
                btn_search_tips.setAttribute('class', 'nav-link')
                btn_search_adventure.setAttribute('class', 'nav-link')
                btn_search_solo.setAttribute('class', 'nav-link')
                btn_search_family.setAttribute('class', 'nav-link')
                btn_search_friends.setAttribute('class', 'nav-link')
                btn_search_nature.setAttribute('class', 'nav-link')
                btn_search_getaways.setAttribute('class', 'nav-link')
            })
            .catch(error => {
                console.error('Error loading search results:', error);
                const postsContainer = document.getElementById('posts_container');
                postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
            });

    });



    //................................. 2. SEARCH AN POST by CATEGORY "Travel Tips & Advice" .................................//
    btn_search_tips.addEventListener('click', function (event) {
        event.preventDefault();
        const searchQuery = document.getElementById('btn_search_tips').textContent;
        console.log(searchQuery)

        fetch(`http://localhost:3001/index/searchCategory?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayPosts(response); // Call the displayPosts function to render the search results

                btn_search_all.setAttribute('class', 'nav-link')
                btn_search_tips.setAttribute('class', 'nav-link active')
                btn_search_adventure.setAttribute('class', 'nav-link')
                btn_search_solo.setAttribute('class', 'nav-link')
                btn_search_family.setAttribute('class', 'nav-link')
                btn_search_friends.setAttribute('class', 'nav-link')
                btn_search_nature.setAttribute('class', 'nav-link')
                btn_search_getaways.setAttribute('class', 'nav-link')
            })
            .catch(error => {
                console.error('Error loading search results:', error);
                const postsContainer = document.getElementById('posts_container');
                postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
            });
    });

    //................................. 3. SEARCH AN POST by CATEGORY "Adventure Travel" .................................//
    btn_search_adventure.addEventListener('click', function (event) {
        event.preventDefault();
        const searchQuery = document.getElementById('btn_search_adventure').textContent;
        console.log(searchQuery)

        fetch(`http://localhost:3001/index/searchCategory?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayPosts(response); // Call the displayPosts function to render the search results

                btn_search_all.setAttribute('class', 'nav-link')
                btn_search_tips.setAttribute('class', 'nav-link')
                btn_search_adventure.setAttribute('class', 'nav-link active')
                btn_search_solo.setAttribute('class', 'nav-link')
                btn_search_family.setAttribute('class', 'nav-link')
                btn_search_friends.setAttribute('class', 'nav-link')
                btn_search_nature.setAttribute('class', 'nav-link')
                btn_search_getaways.setAttribute('class', 'nav-link')
            })
            .catch(error => {
                console.error('Error loading search results:', error);
                const postsContainer = document.getElementById('posts_container');
                postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
            });
    });


    //................................. 4. SEARCH AN POST by CATEGORY "Solo Travel" .................................//
    btn_search_solo.addEventListener('click', function (event) {
        event.preventDefault();
        const searchQuery = document.getElementById('btn_search_solo').textContent;
        console.log(searchQuery)

        fetch(`http://localhost:3001/index/searchCategory?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayPosts(response); // Call the displayPosts function to render the search results

                btn_search_all.setAttribute('class', 'nav-link')
                btn_search_tips.setAttribute('class', 'nav-link')
                btn_search_adventure.setAttribute('class', 'nav-link')
                btn_search_solo.setAttribute('class', 'nav-link active')
                btn_search_family.setAttribute('class', 'nav-link')
                btn_search_friends.setAttribute('class', 'nav-link')
                btn_search_nature.setAttribute('class', 'nav-link')
                btn_search_getaways.setAttribute('class', 'nav-link')
            })
            .catch(error => {
                console.error('Error loading search results:', error);
                const postsContainer = document.getElementById('posts_container');
                postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
            });
    });


    //................................. 5. SEARCH AN POST by CATEGORY "Family Travel" .................................//
    btn_search_family.addEventListener('click', function (event) {
        event.preventDefault();
        const searchQuery = document.getElementById('btn_search_family').textContent;
        console.log(searchQuery)

        fetch(`http://localhost:3001/index/searchCategory?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayPosts(response); // Call the displayPosts function to render the search results

                btn_search_all.setAttribute('class', 'nav-link')
                btn_search_tips.setAttribute('class', 'nav-link')
                btn_search_adventure.setAttribute('class', 'nav-link')
                btn_search_solo.setAttribute('class', 'nav-link')
                btn_search_family.setAttribute('class', 'nav-link active')
                btn_search_friends.setAttribute('class', 'nav-link')
                btn_search_nature.setAttribute('class', 'nav-link')
                btn_search_getaways.setAttribute('class', 'nav-link')
            })
            .catch(error => {
                console.error('Error loading search results:', error);
                const postsContainer = document.getElementById('posts_container');
                postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
            });
    });


    //................................. 6. SEARCH AN POST by CATEGORY "Travel with Friends" .................................//
    btn_search_friends.addEventListener('click', function (event) {
        event.preventDefault();
        const searchQuery = document.getElementById('btn_search_friends').textContent;
        console.log(searchQuery)

        fetch(`http://localhost:3001/index/searchCategory?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayPosts(response); // Call the displayPosts function to render the search results

                btn_search_all.setAttribute('class', 'nav-link')
                btn_search_tips.setAttribute('class', 'nav-link')
                btn_search_adventure.setAttribute('class', 'nav-link')
                btn_search_solo.setAttribute('class', 'nav-link')
                btn_search_family.setAttribute('class', 'nav-link')
                btn_search_friends.setAttribute('class', 'nav-link active')
                btn_search_nature.setAttribute('class', 'nav-link')
                btn_search_getaways.setAttribute('class', 'nav-link')
            })
            .catch(error => {
                console.error('Error loading search results:', error);
                const postsContainer = document.getElementById('posts_container');
                postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
            });
    });


    //................................. 7. SEARCH AN POST by CATEGORY "Wildlife & Nature" .................................//
    btn_search_nature.addEventListener('click', function (event) {
        event.preventDefault();
        const searchQuery = document.getElementById('btn_search_nature').textContent;
        console.log(searchQuery)

        fetch(`http://localhost:3001/index/searchCategory?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayPosts(response); // Call the displayPosts function to render the search results

                btn_search_all.setAttribute('class', 'nav-link')
                btn_search_tips.setAttribute('class', 'nav-link')
                btn_search_adventure.setAttribute('class', 'nav-link')
                btn_search_solo.setAttribute('class', 'nav-link')
                btn_search_family.setAttribute('class', 'nav-link')
                btn_search_friends.setAttribute('class', 'nav-link')
                btn_search_nature.setAttribute('class', 'nav-link')
                btn_search_getaways.setAttribute('class', 'nav-link')
            })
            .catch(error => {
                console.error('Error loading search results:', error);
                const postsContainer = document.getElementById('posts_container');
                postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
            });
    });

    //................................. 8. SEARCH AN POST by CATEGORY "Beach & Island Getaways" .................................//
    btn_search_getaways.addEventListener('click', function (event) {
        event.preventDefault();
        const searchQuery = document.getElementById('btn_search_getaways').textContent;
        console.log(searchQuery)

        fetch(`http://localhost:3001/index/searchCategory?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
            .then(response => response.json())
            .then(response => {
                console.log(response);
                displayPosts(response); // Call the displayPosts function to render the search results

                btn_search_all.setAttribute('class', 'nav-link')
                btn_search_tips.setAttribute('class', 'nav-link')
                btn_search_adventure.setAttribute('class', 'nav-link')
                btn_search_solo.setAttribute('class', 'nav-link')
                btn_search_family.setAttribute('class', 'nav-link')
                btn_search_friends.setAttribute('class', 'nav-link')
                btn_search_nature.setAttribute('class', 'nav-link')
                btn_search_getaways.setAttribute('class', 'nav-link active')
            })
            .catch(error => {
                console.error('Error loading search results:', error);
                const postsContainer = document.getElementById('posts_container');
                postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
            });
    });



});











//................................. ADD POST Button .................................//
const add_post_button = document.getElementById('add_post_btn');

add_post_button.addEventListener('click', (event) => {
    event.preventDefault();

    if (localStorage.getItem('token')) {
        window.location.href = './addNewPost.html';
    }
    else {
        alert('You need to login first!')
    }
});



//................................. HOT TOPICS Part .................................//
document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:3001/index/popularPosts', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
    })
        .then(response => response.json())
        .then(data => {
            const postsContainer = document.getElementById('popularPostsContainer');
            postsContainer.innerHTML = data.map(post => `
            <div class="single-recent d-flex pb-3 mb-3" onclick="redirectToPost(${post.post_id})" style="cursor: pointer;">
                <div class="recent-image ratio-container">
                    <div class="ratio" style="width: 75px; height: 75px; overflow: hidden; border-radius: 50%; position: relative;">
                        <img src="http://localhost:3001/${post.cover_image}" alt="Post Image" class="main-post-avatar rounded-circle" style="width: 100%; height: 100%; object-fit: cover; object-position: center;"/>
                    </div>
                </div>
                <div class="recent-content">
                    <h6>${post.title}</h6>
                    <p>Likes: ${post.likes_count} | Comments: ${post.comments_count}</p>
                </div>
            </div>
        `).join('');
        })
        .catch(error => {
            console.error('Error loading popular posts:', error);
            postsContainer.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
        });
});

// Function to redirect to the post detail page
function redirectToPost(postId) {
    window.location.href = `post.html?postId=${postId}`;
}



// When the user scrolls down 20px from the top of the document, show the button
window.onscroll = function() {scrollFunction()};

function scrollFunction() {
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
        document.getElementById("backToTopBtn").style.display = "block";
    } else {
        document.getElementById("backToTopBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document smoothly
document.getElementById("backToTopBtn").addEventListener("click", function() {
    document.body.scrollTop = 0; // For Safari
    document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
});


  document.addEventListener("DOMContentLoaded", function() {
    const slider = document.querySelector('.carousel');
    const sidebar = document.querySelector('.side-bar');
  
    const sidebarOriginalLeft = sidebar.getBoundingClientRect().left; 
  
    window.addEventListener('scroll', function() {
      const sliderHeight = slider.offsetHeight; 
      const scrolledHeight = window.pageYOffset; 
  
      if (scrolledHeight > (sliderHeight + 150)) {
        sidebar.style.position = 'fixed';
        sidebar.style.top = '10%';
        sidebar.style.left = sidebarOriginalLeft + 'px'; 
        sidebar.style.width = sidebar.offsetWidth + 'px'; 
      } else {
        sidebar.style.position = 'relative';
        sidebar.style.top = '0';
        sidebar.style.left = '0'; 
      }
    });
  });
  
