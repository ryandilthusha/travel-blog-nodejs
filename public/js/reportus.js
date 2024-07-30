const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('postId');
console.log(postId); // Use this postId to fetch or display more details




document.getElementById('btn_save').addEventListener('click', function(event) 
{
    event.preventDefault();
    
    const reqPayLoad = JSON.stringify(
        {
            postId: postId, 
            reportReason: document.getElementById('reportDetails').value
        })

    console.log(reqPayLoad);

    if(document.getElementById('reportDetails').value < 5){
        displayError(['The repot us field cannot be empty.']);
        return false;
    }

    if(!localStorage.getItem('token'))
    {
        displayError(['You have to create an account to be able to report!']);
        return false;
    }

    else
    {
        // Implement fetch to send data to backend
        fetch('http://localhost:3001/reportus/report', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token') // Assuming JWT for auth
            },
            body: reqPayLoad
        })
        .then(response => response.json())
        .then(response => 
        {
            console.log('Report submitted:', response);
            document.getElementById('reportDetails').value = '';
            displayError(['Thank you for supporting our travel blog and amke it better place for all travelers. We will review and take the necessary action'], 'success');
            //window.location.href = 'index.html'; // or any other redirection
        })
        .catch(error => 
        {
            console.error('Error submitting report:', error);
            displayError(['There was a problem submitting your report.'], 'success');
        });
    }

    
});



if (postId) {
    fetch(`http://localhost:3001/reportus/details/${postId}`, {
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem('token')
        }
    })
    .then(response => response.json())
    .then(data => {
        document.getElementById('postPreview').style.display = 'block';
        document.getElementById('postImage').src = `http://localhost:3001/${data.cover_image}`;
        document.getElementById('postTitle').textContent = data.title;
        document.getElementById('postContent').innerHTML = data.content;
        document.getElementById('postId').value = postId;
    })
    .catch(error => console.error('Error fetching post details:', error));
}


//................................. NAV BAR ITEM's RELATED CODES .................................//
