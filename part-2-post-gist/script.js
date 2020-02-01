function createGist(opts) {
  console.log('Posting request to GitHub API...');
  fetch('https://api.github.com/gists', {
    method: 'post',
    body: JSON.stringify(opts),
    headers: new Headers({
      'Content-Type': 'application/json',
      Authorization: 'token [YOUR_TOKEN_HERE]'
    })
  })
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      if (data.html_url) {
        console.log('Created Gist:', data.html_url);
        document.querySelector('span').innerHTML =
          '<a href="' + data.html_url + '">View Your New Gist Here!</a>';
      } else {
        document.querySelector('span').innerHTML =
          'There was an error creating your Gist. Please check your authentication headers.';
      }
    });
}

function submitGist() {
  const content = document.querySelector('textarea').value;
  if (content) {
    createGist({
      description: 'Fetch API Post example',
      public: true,
      files: {
        'hi-lmu-hacks.txt': {
          content: content
        }
      }
    });
  } else {
    console.log('Please enter in content to POST to a new Gist.');
  }
}

const submitBtn = document.querySelector('button');
submitBtn.addEventListener('click', submitGist);
