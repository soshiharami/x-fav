function getTweetLink(likeButton) {
  const tweetContainer = likeButton.closest('article');
  if (tweetContainer) {
    const tweetLinkElement = tweetContainer.querySelector('a[href*="/status/"]');
    if (tweetLinkElement) {
      const tweetLink = tweetLinkElement.href;
      return tweetLink;
    }
  }
  return null;
}

var requestOptions = {
  method: 'POST',
  redirect: 'follow'
};


const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    if (mutation.addedNodes.length > 0) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          const likeButtons = node.querySelectorAll('[data-testid="like"]');
          likeButtons.forEach((likeButton) => {
            if (!likeButton.dataset.listenerAttached) {
              likeButton.dataset.listenerAttached = true;
                likeButton.addEventListener('click', () => {
                const tweetLink = getTweetLink(likeButton);
                if (tweetLink) {
                  console.log(URL)
                  console.log(tweetLink)
                  fetch(`${URL}/likes?x=${tweetLink}`, requestOptions)
                    .then(response => response.text())
                    .then(result => console.log(result))
                    .catch(error => console.log('error', error));
                }
              });
            }
          });
        }
      });
    }
  });
});


observer.observe(document.body, { childList: true, subtree: true });
