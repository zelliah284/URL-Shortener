//Variables
const toggleNav = document.getElementById('toggleNav');
const form = document.getElementById('form');
const navBarContainer = document.querySelector('.navbar-container');
const copiedUrl = document.querySelector('.shortUrl-container');
const urlInput = document.getElementById('input-field');
const submitBtn = document.getElementById('submit-btn');
const error = document.getElementById('responseError');


//function to open/close mobile navigation menu
toggleNav.addEventListener('click', () => {
    toggleNav.classList.toggle('show');
    navBarContainer.classList.toggle('show');
    if(navBarContainer.classList.contains('smooth')) {
        setTimeout(() => {
            navBarContainer.classList.remove('smooth')
        }, 200)
    } else {
        navBarContainer.classList.add('smooth');
    }
});


  //Function that generates the result card containing the short link
const resultLink = function(link, shortLink) {
    urlInput.value = "";
    return `<div class="result-card">
              <span class="link-url">${link}</span>
              <div class="short-link">
              <a href="https://${shortLink}" target="_blank">https://${shortLink}</a>
              <button class="url-btn copy-btn">Copy!</button>
             </div>
    </div>`;
}


  //Function to generate shortlink
   async function getShortLink() {
    let link = urlInput.value;
    let ok;
    submitBtn.innerHTML = "Shortening...";

    let res = await fetch(`https://api.shrtco.de/v2/shorten?url=${link}`).then(async (res) => {
     let data = await res.json();
      if (res.ok) {
        ok = true;
        return data;
      }


      if (data.error_code == 2) {
        ok = res.ok;
        return
      }
      ok = res.ok;
    });
    submitBtn.innerHTML = 'Shorten it'
    if (!ok) {
        return;
    };

    copiedUrl.insertAdjacentHTML(
        "afterbegin",
        resultLink(link, res.result.short_link2)
      );

  }

  //eventListener to call getShortLink() after the form is submitted
form.addEventListener("submit", function (event) {
    event.preventDefault();
    if (!urlInput.value) {
        showError('add a link', false);
        return;
    }
    showError('', true);
      getShortLink();
});


//toggle error to show error function
function showError(text, remove) {
    if (!remove) {
        urlInput.classList.add("error-outline");
        error.innerHTML = text;
        return;
    }
    urlInput.classList.remove("error-outline");
    error.innerHTML = "";
}

document.addEventListener('click', function (event) {
    if (!event.target.classList.contains('copy-btn'))
    return;
    let short_link = event.target.parentNode.querySelector('.short-link > a');
    navigator.clipboard.writeText(short_link.href);
    event.target.classList.add('copied');
    event.target.textContent = 'Copied!';

    setTimeout(() => {
        event.target.classList.remove('copied');
        event.target.textContent = 'Copy';
    }, 2000);
});