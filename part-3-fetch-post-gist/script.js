function createGist(opts) {
  console.log('Posting request to GitHub API...');
  fetch('https://api.github.com/gists', {
    method: 'post',
    body: JSON.stringify(opts),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'token [YOUR TOKEN HERE]'
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      console.log('Created Gist:', data.html_url);
    });
}

function submitGist() {
  var content = document.querySelector('textarea').value;
  if (content) {
    createGist({
      description: 'Fetch API Post example',
      public: true,
      files: {
        'Hi LMU!': {
          content: content
        }
      }
    });
  } else {
    console.log('Please enter in content to POST to a new Gist.');
  }
}

var submitBtn = document.querySelector('button');
submitBtn.addEventListener('click', submitGist);
