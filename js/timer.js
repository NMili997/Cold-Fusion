console.log("hello from timer.js");

function startTimer() {
  console.log("hello from timer#startTimer");

  var counter = 10;

  var id = setInterval(
    function(){
      debugger;
      document.getElementById('wtf').innerHTML = counter;

      counter--;
      console.log(counter);
      if (counter === 0) {
        clearInterval(id);
      }

  }, 500);
}
