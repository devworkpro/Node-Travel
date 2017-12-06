document.fullscreenEnabled = document.fullscreenEnabled || document.mozFullScreenEnabled || document.documentElement.webkitRequestFullScreen;

function requestFullscreen( element ) {
  if ( element.requestFullscreen ) {
    element.requestFullscreen();
  } else if ( element.mozRequestFullScreen ) {
    element.mozRequestFullScreen();
  } else if ( element.webkitRequestFullScreen ) {
    element.webkitRequestFullScreen( Element.ALLOW_KEYBOARD_INPUT );
  }
}

document.getElementById('oops').addEventListener('click', () => {
    const el = document.getElementById('video');
if ( document.fullscreenEnabled ) {
  requestFullscreen( el );
}
});