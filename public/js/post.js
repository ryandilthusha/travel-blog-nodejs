//To Check Whether User Logged in or Not
document.addEventListener('DOMContentLoaded', ()=>{
    if(!localStorage.getItem('token'))
    {
        alert('Please Log in')
        window.location.href = '/public/index.html';
    }
});



const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');
console.log(postId); // Use this postId to fetch or display more details



// ------------------------------------ To Get Post Data ------------------------------------
const reqPayLoad = JSON.stringify({postId:postId})
fetch('http://localhost:3001/post/getPostData' ,{
    method: 'POST',
    headers : {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body : reqPayLoad
})

.then((response) =>
{
    return response.json();
})

.then((response)=>
{
    //Set Post Title
    const post_title = document.getElementById('post_title');
    post_title.textContent = response.title;

    //Set Post Content
    const post_content = document.getElementById('post_content');
    post_content.innerHTML  = response.content;

    //Set Post Date
    const post_date = document.getElementById('post_date');
    post_date.textContent = response.formatted_post_date;

    //Set Post author
    const post_author = document.getElementById('author_name');
    post_author.textContent = response.username;

    //Set Post Cover Pic
    const coverImageElement = document.getElementById('post_image');
    coverImageElement.src = `http://localhost:3001/${response.cover_image}`;
    
    //Set Profile Pic To Post Author
    const author_pic = document.getElementById('author_image');
    author_pic.src = `http://localhost:3001/${response.profile_picture}`;

    //Set Post ID
    const postID = document.getElementById('post_id');
    postID.textContent = response.post_id;

    //Set User ID
    const userID = document.getElementById('user_id');
    userID.textContent = response.user_id;

})


// ------------------------------------ To Get Comment Data ------------------------------------
function loadAllComments() {
    const comment_section = document.getElementById('post_comments');
    comment_section.innerHTML = '';  //Clear existing comments

    fetch('http://localhost:3001/post/getCommentData', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: reqPayLoad
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);

        response.result.forEach(element => {
            const commentDiv = document.createElement('div');
            commentDiv.className = 'individual-comment-area';
            commentDiv.innerHTML = `
                <div class="d-flex align-items-center mb-3">
                    <p class="comment-user-id" hidden>${element.user_id}</p>
                    <img class="comment-avatar me-3 profile-img profile-header-img"
                        src="http://localhost:3001/${element.profile_picture}" alt="avatar"/>
                    <div>
                        <h6 class="fw-bold mb-1">${element.username}</h6>
                        <p class="text-muted">${element.formatted_comment_date}</p>
                        <p>${element.comment_text}</p>
                    </div>
                </div>`;

            if (element.user_id === response.user) {
                const controlDiv = document.createElement('div');
                controlDiv.className = 'comment-controls';

                const editButton = document.createElement('button');
                editButton.className = 'btn btn-primary btn-sm';
                editButton.textContent = 'Edit';
                editButton.onclick = () => editComment(element.comment_id, element.comment_text);

                const deleteButton = document.createElement('button');
                deleteButton.className = 'btn btn-danger btn-sm';
                deleteButton.textContent = 'Delete';
                deleteButton.onclick = () => deleteComment(element.comment_id);

                controlDiv.appendChild(editButton);
                controlDiv.appendChild(deleteButton);
                commentDiv.appendChild(controlDiv);
            }

            comment_section.append(commentDiv);
            comment_section.appendChild(document.createElement('hr'));
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    loadAllComments();

    document.getElementById('post_comments').addEventListener('click', function(event) {
        if (event.target.classList.contains('comment-avatar')) {
            const userId = event.target.closest('.individual-comment-area').querySelector('.comment-user-id').textContent;
            console.log('User ID is', userId);
            window.location.href = `userDetails.html?userId=${userId}`;
        }
    });
});




// ------------------------------------ To EDIT Comment Data ------------------------------------
function editComment(commentId, currentText) 
{
    document.getElementById('editCommentText').value = currentText; // Set current text to textarea
    document.getElementById('editingCommentId').value = commentId; // Store comment ID in hidden input
    var editModal = new bootstrap.Modal(document.getElementById('editCommentModal'));
    editModal.show(); // Show the modal
}

// Function to handle the submission of the edited comment
function submitEditComment() {
    const commentId = document.getElementById('editingCommentId').value;
    const updatedText = document.getElementById('editCommentText').value;

    fetch(`http://localhost:3001/post/updateComment/${commentId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ commentText: updatedText })
    })
    .then(response => {
        if (!response.ok) throw new Error('Failed to update comment');
        return response.json();
    })
    .then(data => {
        console.log('Comment updated successfully:', data);
        loadAllComments(); // Reload comments to display the updated text
        var editModal = bootstrap.Modal.getInstance(document.getElementById('editCommentModal'));
        editModal.hide(); // Hide the modal after update
    })
    .catch(error => console.error('Error updating comment:', error));
}




// ------------------------------------ To Delete Comment Data ------------------------------------
function deleteComment(commentId) 
{
    if (confirm('Are you sure you want to delete this comment?')) 
    {
        fetch(`http://localhost:3001/post/deleteComment/${commentId}`, 
        {
            method: 'DELETE',
            headers: 
            {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(response => response.json())
        .then(result => 
        {
            console.log('Comment deleted:', result);
            //loadAllComments(); // Reload comments after deletion            
            location.reload(); // Optional: reload to update like count
        })
        .catch(error => console.error('Error deleting comment:', error));
    }
}





// ------------------------------------ To Get Likes and Comments Count ------------------------------------
fetch('http://localhost:3001/post/getLikesCount' ,{
    method: 'POST',
    headers : {
        'Content-Type':'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
    },
    body : reqPayLoad
})

.then((response) =>
{
    return response.json();
})

.then((response)=>
{
    console.log(response);

    const likeCount = document.getElementById('like_count');
    likeCount.textContent = response.likes_count;

    const commentCount = document.getElementById('comment_count');
    commentCount.textContent = response.comments_count;


}) 

    


// ------------------------------------ To Make a Comment ------------------------------------
    
const commentButton = document.getElementById('comment_btn');
commentButton.addEventListener('click', (event)=>
{  
    event.preventDefault();       
    console.log('Comment Button Clicked!');

    const commentText = document.getElementById('comment_area').value;  
    
    if (commentText.length < 2)
    {
        displayError(['The comments field cannot be empty.']);
        return false;
    }

    fetch('http://localhost:3001/post/makeComment' ,{
        method: 'POST',
        headers : {
            'Content-Type':'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body : JSON.stringify({postId:postId, comment:commentText})
    })

    .then((response) =>
    {
        return response.json();
    })

    .then((response)=>
    {
        console.log(response);
        document.getElementById('comment_area').value = '';  
        //loadAllComments();        
        location.reload(); // Optional: reload to update like count
        
    })
    .catch((error) => {
        console.error('Failed to post comment:', error);
    });
    
});    


// ------------------------------------ To Check Like ------------------------------------
// Set up initial state for the like button when the page loads (The fucntion will called when the DOM is loaded (At Below)
const btn_like = document.getElementById('btn_like');

function setupLikeButton(postId) {
    fetch(`http://localhost:3001/post/checkLike/${postId}`, 
    {
        method: 'GET',
        headers: 
        {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json'
        }
    })
    .then(response => response.json())
    .then(data => 
    {
        if (data.alreadyLiked) 
        {
            console.log('Already Liked')
            btn_like.innerHTML = `<i class="fa-solid fa-heart fa-xl" style="color: #ff0000;"></i>`; // Heart solid if already liked
        } 
        
        else 
        {
            console.log('Not Liked Yet')
            btn_like.innerHTML = `<i class="fa-regular fa-heart fa-xl"></i>`; // Heart outline if not liked
        }
    })
    .catch(error => console.error('Error checking like status:', error));
}

// ------------------------------------ To Make a Like ------------------------------------
btn_like.addEventListener('click', (event) => 
{
    event.preventDefault();
    console.log('Like button clicked!');

    fetch('http://localhost:3001/post/makeLike', {
        method: 'POST',
        headers: 
        {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ postId: postId })
    })
    .then(response => response.json())
    .then(response => 
    {
        console.log('Like status:', response.message);
        if (response.alreadyLiked) 
        {
            alert('You have already liked this post.');
        } 
        else 
        {
            btn_like.innerHTML = `<i class="fa-solid fa-heart fa-xl" style="color: #ff0000;"></i>`; // Heart normal
            location.reload(); // Optional: reload to update like count
        }

    })
    .catch(error => console.error('Error liking post:', error));
});


// Initial call to setup the like button based on current like status
document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const postId = urlParams.get('postId');
    setupLikeButton(postId);
});



// ------------------------------------ Report Button ------------------------------------
document.getElementById('btn_report').addEventListener('click', function() {
    const postId = document.getElementById('post_id').textContent;
    console.log(postId)
    window.location.href = `reportus.html?postId=${postId}`;
});



// ------------------------------------ Author Image Click ------------------------------------
document.getElementById('author_image').addEventListener('click', function() {
    const userId = document.getElementById('user_id').textContent;
    console.log('user id is' , userId)
    window.location.href = `userDetails.html?userId=${userId}`;
});
