const weatherForm = document.querySelector('form');
const search = document.querySelector('input');
const messageOne = document.querySelector('#message-1');
const messageTwo = document.querySelector('#message-2');
const messageThree = document.querySelector('#message-3');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = search.value;

    messageOne.textContent = 'Loading ...';
    messageTwo.textContent = '';
    messageThree.textContent = '';

    fetch(`/weather?address=${location}`)
    .then((response) => {
        response.json().then((data) => {
            //console.log(data);
            if (data.error) {
                messageOne.textContent = `ERROR: ${data.error}`;
            }
            else {
                messageOne.textContent = data.location;
                messageTwo.textContent = data.forecast;
                messageThree.textContent = data.timeStamp;

                const skycons = new Skycons({"color": "#146EB4"});
                 skycons.add("icon1", data.icon);
                skycons.play();
            }
        });
    })
    .catch(err => {
        messageOne.textContent = err;
        messageTwo.textContent = '';
    });
});

  
  