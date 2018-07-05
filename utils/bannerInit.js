
/*
===============================================>>>>>
=== PRELOAD IMAGE ASSETS AND APPEND TO DOM ELEMENTS ===
===============================================>>>>>
*/

  function bannerInit(callback) {
    loader = new createjs.LoadQueue(false);
    loader.addEventListener('complete', function() {
      appendImages(callback);
    });
    loader.loadManifest(manifest, true, 'assets/');
  }

  function appendImages(callback) {
    for (var i = 0; i < manifest.length; i++) {
      var item = manifest[i];
      if (typeof item === 'object' && item.append) {
        var itemId = item.id;
        // if only one element to append
        if (typeof item.append === 'string') {
          var domEl = document.getElementById(item.append);
          domEl.appendChild(loader.getResult(itemId));
          // if array has been passed to append
        } else if (typeof item.append === 'object') {
          var elsArray = item.append;
          for (var q = 0; q < elsArray.length; q++) {
            var domEl = document.getElementById(elsArray[q]);
            // append the loader result then clone it as required and append to other elements
            var newEl = q == 0 ? loader.getResult(itemId) : loader.getResult(itemId).cloneNode();
            domEl.appendChild(newEl);
          }
        }
      }
    }
    callback();
  }