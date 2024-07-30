document.addEventListener('DOMContentLoaded', function() {
    const saveBtn = document.getElementById('btn_save');
    const clearBtn = document.getElementById('clear_btn');

    // Setup click event for the photo upload button
    const photoUploadBtn = document.querySelector('.photo-upload-btn');
    photoUploadBtn.addEventListener('click', function() {
        document.getElementById('profilePicUpload').click();
    });

    // Update the filename display when a file is chosen
    document.getElementById('profilePicUpload').addEventListener('change', function() {
        const fileName = this.files[0] ? this.files[0].name : 'No file chosen';
        document.getElementById('file-chosen').textContent = fileName;
    });

    // Setup the save button click event
    saveBtn.addEventListener('click', (event) => {
        event.preventDefault();
        let isValid = true;
        let errors = [];
        tinymce.triggerSave();

        const titleName = document.getElementById('titleName').value;
        const contentDetails = document.getElementById('contentDetails').value;
        const radios = document.querySelectorAll('input[name="flexRadioDefault"]:checked');

        

        if (titleName.length < 3){
            errors.push('The post title cannot be empty');
            isValid = false;
        }

        if (radios.length == 0){
            console.log(radios.length)
            errors.push('The post category cannot be empty');
            isValid = false;
        }
      
        const formData = new FormData();
        formData.append('title', titleName);
            
        const catOption = radios.length > 0 ? radios[0].value : 'Solo Travel';

        formData.append('catName', catOption);
        formData.append('content', contentDetails);

        const fileInput = document.getElementById('profilePicUpload');
        if (fileInput.files.length > 0) {
            formData.append('coverpic', fileInput.files[0]);
        } else {
            errors.push('Please select a file to upload');
            isValid = false;
        }

        if (!isValid) {
            displayError(errors);
            return false;
        }

        fetch('http://localhost:3001/newPost/new/', {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            },
            body: formData
        })
        .then(response => response.json())
        .then(response => {
            console.log('Add Post Successful', response);
            displayError(['Your post has been successfully added. You will be redirected to the post page soon.'], 'success');
                    setTimeout(function(){
                        window.location.href = '/public/allposts.html';
                    }, 4000);
        })
        .catch(error => {
            displayError([error]);
        });
    });

    // Setup the clear button click event
    clearBtn.addEventListener('click', function(event) {
        event.preventDefault();
        document.getElementById('titleName').value = '';
        document.getElementById('contentDetails').value = '';
        const radios = document.querySelectorAll('input[name="flexRadioDefault"]');
        radios.forEach(radio => radio.checked = false);
        document.getElementById('profilePicUpload').value = '';  // Reset file input
        document.getElementById('file-chosen').textContent = 'No file chosen';  // Reset file label
        tinyMCE.activeEditor.setContent('');

    });
});
