function CountdownTimer(seconds, tickRate) {
    this.seconds = seconds || (25*60);
    this.tickRate = tickRate || 500; // Milliseconds
    this.tickFunctions = [];
    this.isRunning = false;
    this.remaining = this.seconds;

    /** CountdownTimer starts ticking down and executes all tick
        functions once per tick. */
    this.start = function() {
        if (this.isRunning) {
            return;
        }

        this.isRunning = true;

        // Set variables related to when this timer started
        var startTime = Date.now(),
            thisTimer = this;

        // Tick until complete or interrupted
        (function tick() {
            secondsSinceStart = ((Date.now() - startTime) / 1000) | 0;
            var secondsRemaining = thisTimer.remaining - secondsSinceStart;

            // Check if timer has been paused by user
            if (thisTimer.isRunning === false) {
                thisTimer.remaining = secondsRemaining;
            } else {
                if (secondsRemaining > 0) {
                    // Execute another tick in tickRate milliseconds
                    setTimeout(tick, thisTimer.tickRate);
                } else {
                    // Stop this timer
                    thisTimer.remaining = 0;
                    thisTimer.isRunning = false;

                    // Alert user that time is up
                    playAlarm();
                    changeFavicon('green');
                }

                var timeRemaining = parseSeconds(secondsRemaining);

                // Execute each tickFunction in the list with thisTimer
                // as an argument
                thisTimer.tickFunctions.forEach(
                    function(tickFunction) {
                        tickFunction.call(this,
                                          timeRemaining.minutes,
                                          timeRemaining.seconds);
                    },
                    thisTimer);
            }
        }());
    };

    /** Pause the timer. */
    this.pause = function() {
        this.isRunning = false;
    };


    /** Pause the timer and reset to its original time. */
    this.reset = function(seconds) {
        this.isRunning = false;
        this.seconds = seconds
        this.remaining = seconds
    };

    /** Add a function to the timer's tickFunctions. */
    this.onTick = function(tickFunction) {
        if (typeof tickFunction === 'function') {
            this.tickFunctions.push(tickFunction);
        }
    };
}
function parseSeconds(seconds){
  return{
    'minutes' : (seconds / 60) | 0,
    'seconds' : (seconds % 60) | 0
  }
}

window.onload = function() {
  var timerDisplay = document.getElementById('timer'),
  timer = new CountdownTimer(),
  timeObj = parseSeconds(25*60);

  function setTimeOnAllDisplays(minutes,seconds){
    if (minutes >= 60) {
      hours = Math.floor(minutes / 60);
      minutes = minutes % 60;
      clockHours = hours + ':'
      document.title = '(' + hours + 'h' + minutes + 'm) Pomodore'
    }else {
      clockHours = '';
      document.title = '(' + minutes + 'm) Pomodoro';
    }
    clockMinutes = minutes < 10 ? '0' + minutes : minutes;
    clockMinutes += ':';
    clockSeconds = seconds < 10 ? '0' + seconds : seconds;
    timerDisplay.textContent = clockHours + clockMinutes + clockSeconds;
  }
  function resetMainTimer(seconds) {
      timer.pause();
      timer = new CountdownTimer(seconds);
      timer.onTick(setTimeOnAllDisplays);
  }
  setTimeOnAllDisplays(timeObj.minutes, timeObj.seconds);
  timer.onTick(setTimeOnAllDisplays);

  //Add buttons onlick (start,stop,reset,pomodore...etc)

  document.getElementById('btn_start').addEventListener(
    'click', function () {
      timer.start();
    });
    document.getElementById('btn_stop').addEventListener(
        'click', function () {
            timer.pause();
        });

    document.getElementById('btn_reset').addEventListener(
        'click', function () {
            resetMainTimer(timer.seconds);
            timer.start();
        });

    document.getElementById('btn_pomodoro').addEventListener(
        'click', function () {
            resetMainTimer(25*60);
            timer.start();
        });

    document.getElementById('btn_shortbreak').addEventListener(
        'click', function () {
            resetMainTimer(5*60);
            timer.start();
        });

    document.getElementById('btn_longbreak').addEventListener(
        'click', function () {
            resetMainTimer(15*60);
            timer.start();
        });
}
