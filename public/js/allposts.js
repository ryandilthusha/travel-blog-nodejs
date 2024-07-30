//To Check Whether User Logged in or Not
document.addEventListener('DOMContentLoaded', ()=>{
  if(!localStorage.getItem('token'))
  {
      alert('Please Log in')
      window.location.href = '/public/index.html';
  }
});

document.addEventListener('DOMContentLoaded', function() 
{
  fetch('http://localhost:3001/allposts/getAllPosts', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  })
  .then(response => 
    {
    const postsContainer = document.getElementById('posts_container');
    postsContainer.innerHTML = ''; // Clear any existing content

    response.forEach(postElement => {
      const postCard = document.createElement('div');
      postCard.className = 'col-md-6 post-card'; // Added 'post-card' class for styling
      postCard.style.margin = '0px auto';
      postCard.innerHTML = `
        <div class="post" style="font-size: 0.9rem;">          

          <p class="post-title">${postElement.title}</p>
          <p id="post_id" hidden>${postElement.post_id}</p>

          <p class="updatedtime mt-0">
            <small>${postElement.formatted_post_date}</small>
          </p>

          <img src="http://localhost:3001/${postElement.cover_image}" class="post-img" alt="Post Image" style="max-width: 600px; width: 100%; height: auto;">
          
          <div class="post-body mt-3">
            <p class="post-text pt-2">${postElement.content.substring(0, 100)}...</p>     
            <hr class="post-hr">
            <div class="blog-icons">

              <div class="icons-left">
     
                <button class="btn icon-button" id="btn_like">
                  <i class="fa-regular fa-heart fa-lg"></i> <p class="like-number count-style">${postElement.likes_count}</p>
                </button>
                
                <button class="btn icon-button" id="btn_comment">
                  <i class="fa-regular fa-comment fa-lg"></i> <p class="comment-number count-style">${postElement.comments_count}</p>
                </button>                
              </div>
              <button class="btn read-more-btn" data-post-id="${postElement.post_id}">Read More</button>
            </div>
            <div class="edit-cont-main">
              <span class="edit-cont"> 
                  <button class="btn icon-button" id="btn_edit" data-post-id="${postElement.post_id}" data-bs-toggle="modal" data-bs-target="#editPostModal">
                  <i class="fa-regular fa-pen-to-square fa-sm"></i>
                </button>
                <button class="btn icon-button" id="btn_delete" data-post-id="${postElement.post_id}">
                  <i class="fa-solid fa-trash-can fa-sm"></i>
                </button>
              </span>
                
              </div>        

          </div>
        </div>
      `; 
      

      postsContainer.appendChild(postCard);       

      
    });





    //................................. SEARCH AN POST by NAV BAR .................................//
    const btn_search = document.getElementById('btn_search')
    btn_search.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent the form from submitting traditionally
        const searchQuery = document.getElementById('searchInput').value;
        console.log(searchQuery);

        fetch(`http://localhost:3001/allposts/search?query=${encodeURIComponent(searchQuery)}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('token')}` 
            }
        })
        .then(response => response.json())
        .then(response => 
        {
          console.log(response); 


          const postsContainer = document.getElementById('posts_container');
          postsContainer.innerHTML = ''; // Clear any existing content


          response.forEach(postElement => {
            const postCard = document.createElement('div');
            postCard.className = 'container-fluid post-card'; // Added 'post-card' class for styling
            postCard.style.maxWidth = '75%';
            postCard.style.margin = '20px auto';
            postCard.innerHTML = `
              <div class="post" style="font-size: 0.9rem; padding: 10px;">          
      
                <p class="post-title">${postElement.title}</p>
                <p hidden>${postElement.post_id}</p>
      
                <p class="updatedtime mt-0 ms-3">
                  <small>Posted on ${new Date(postElement.post_date).toLocaleDateString()}</small>
                </p>
      
                <img src="http://localhost:3001/${postElement.cover_image}" class="post-img" alt="Post Image" style="max-width: 600px; width: 100%; height: auto;">
                
                <div class="post-body mt-3">
                  <p class="post-text pt-3">${postElement.content.substring(0, 100)}...</p>     
                  <hr>
                  <br>
                  <div class="blog-icons">
      
                    <div class="icons-left">
                      <!-- Like Button with link to specific post page -->
                      <button class="btn icon-button" id="btn_like">
                        <i class="fa-regular fa-heart fa-lg"></i> <p class="like-number count-style">${postElement.likes_count}</p>
                      </button>
                      
                      <!-- Comment Button with link to specific post page -->
                      <button class="btn icon-button" id="btn_comment">
                      <i class="fa-regular fa-comment fa-lg"></i> <p class="comment-number count-style">${postElement.comments_count}</p>
                      </button>
                    </div>


                    <button class="btn btn-primary read-more-btn" data-post-id="${postElement.post_id}">Read More</button>
      
                    
                    <div class="icons-right">
                      <!-- Edit Button with link to specific post page -->
                      <button class="btn icon-button" id="btn_edit" data-post-id="${postElement.post_id}" data-bs-toggle="modal" data-bs-target="#editPostModal">
                        <i class="fa-regular fa-pen-to-square fa-lg"></i>
                      </button>
      
                      <!-- Delete Button with link to specific post page -->
                      <button class="btn icon-button" id="btn_delete" data-post-id="${postElement.post_id}">
                        <i class="fa-solid fa-trash-can fa-lg"></i>
                      </button>
                    </div>
      
                  </div>
      
                </div>
              </div>
            `; 
            
      
            postsContainer.appendChild(postCard);       
      
            
          });
        })
        .catch(error => {
            console.error('Error loading search results:', error);
            const postsContainer = document.getElementById('posts_container');
            postsContainer.innerHTML = `<p>Error loading search results: ${error.message}</p>`;
        });
    });

    
    
    



  })
  
  
  .catch(error => 
    {
    console.error('Error loading posts:', error);
    const postsContainer = document.getElementById('posts_container');
    postsContainer.innerHTML = `<p>Error loading posts: ${error.message}</p>`;
  });
});





// 1. Again fetch all the post data and assign post related value in the modal in the event of clicking edit button
// 2. And also then add event listners to each Read More Button. When user clicks it, user redirect to post.html with post id  
document.addEventListener('DOMContentLoaded',()=>
{
  fetch('http://localhost:3001/allposts/getAllPosts', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('token')}`,
      'Content-Type': 'application/json',
    },
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Failed to fetch posts');
    }
    return response.json();
  })
  .then(response => 
    {     
      
      // Add event listeners for edit buttons outside of foreach button
      document.querySelectorAll('#btn_edit').forEach(buttonElement => 
        {
          buttonElement.addEventListener('click', function() 
          {
            console.log('Edit button clicked')
            const postId = buttonElement.getAttribute('data-post-id');
            console.log(postId)

            //The find() is an array method returns the value of the first element that passes a test.
            //So when responseElement.post_id is eqal to postId, save it as a variable called post
            const post = response.find(responseElement => responseElement.post_id.toString() === postId);

            if (post) {
              document.getElementById('postTitle').value = post.title;
              document.getElementById('postContent').value = post.content;
              tinymce.activeEditor.setContent(post.content);
              tinymce.triggerSave();


              
              const post_img = document.getElementById('postProfilePicture');
              post_img.setAttribute('src', `http://localhost:3001/${post.cover_image}`)


              document.getElementById('post-id').textContent = post.post_id;
              // Trigger the modal display if it's not automatically shown by Bootstrap
              //$('#editPostModal').modal('show');
            }
          });
        });

        
      //This connects each Read More button with post.html page
      document.querySelectorAll('.read-more-btn').forEach(buttonElement => 
        {
          buttonElement.addEventListener('click', () =>
          {
            console.log('Read More Button Clicked')
            const postId = buttonElement.getAttribute('data-post-id');
            window.location.href = `post.html?postId=${postId}`;
          });
        });  

        //This connects each Delete button with database
        document.querySelectorAll('#btn_delete').forEach(buttonElement => 
          {
            buttonElement.addEventListener('click', () =>
            {
              console.log('Delete button clicked');
              const postId = buttonElement.getAttribute('data-post-id');
              console.log(postId)

              const requestPayLoad = JSON.stringify({post_id:postId});

              fetch('http://localhost:3001/allposts/deletePost/', 
              {
                method: 'DELETE',
                headers: 
                {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${localStorage.getItem('token')}` 
                },
                body: requestPayLoad
                })
                .then(response => 
                {                  
                  return response.json();
                })
                .then((response)=>
                {
                  console.log(`Delete Succussful ${response.post_id}`)
                  location.reload(); // Optional: reload page to see updated post
                })

            });
          }); 
        
    })       
        
        

})




// When user click on save button of each post modal, the new values save in the database
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('savePostForm').addEventListener('click', function(event) {
    event.preventDefault();
    tinymce.triggerSave();

    const formData = new FormData();
    formData.append('title', document.getElementById('postTitle').value);
    formData.append('content', document.getElementById('postContent').value);
    const fileInput = document.getElementById('newProfilePicture');
    if (fileInput.files.length > 0) {
      formData.append('cover_image', fileInput.files[0]);
    }
    formData.append('post_id', document.getElementById('post-id').textContent);

    fetch('http://localhost:3001/allposts/update', { // Ensure the endpoint is correct
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
        // Refresh or update UI as needed
        location.reload();
    })
    .catch(error => {
        console.error('Error:', error);
    });
  });
});



document.getElementById('btn_remove_modalpic').addEventListener('click', function() {
  const postId = document.getElementById('post-id').textContent; // Get the post ID
  if (!postId) {
      console.error('Post ID is missing.');
      return;
  }

  if (confirm('Are you sure you want to remove the picture?')) {
      fetch(`http://localhost:3001/allposts/removePicture/${postId}`, {
          method: 'DELETE',
          headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
      })
      .then(response => {
          if (!response.ok) {
              throw new Error('Failed to remove the picture.');
          }
          return response.json();
      })
      .then(data => {
          console.log('Picture removed successfully:', data);
          document.getElementById('postProfilePicture').src = ''; // Clear the image src
          alert('Picture removed successfully.');
      })
      .catch(error => {
          console.error('Error removing picture:', error);
          alert('Failed to remove the picture.');
      });
  }
});
