function init()
{
var iconReplay = $('#replay'),
	  playing = true,
	  myVid = myFT.$("#ad-vid");

  myVid[0].loop = false;

  myVid.on("ended", function() {
    playing = false;
    iconReplay.removeClass('off');
  });

  function replay() {
    playing = true;
    iconReplay.addClass('off');
    myVid[0].restart();
  }

  iconReplay.on("click", function() {
    replay();
  })

  document.addEventListener("visibilitychange", function(){
    if(!document["hidden"] && myVid[0].paused && playing === true) {
        myVid[0].play();
    }
  });
}
