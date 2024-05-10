let triggerCount = 0;
let timerId;

const safeExit = () => {
  if (triggerCount === 3) {
    window.location.replace('https://www.google.com/search?q=clima');
  }
};

const keydownHandler = (e) => {
  if (e.key == 'Escape') {
    triggerCount += 1;
    safeExit();
  }
};

const touchHandler = (e) => {
  triggerCount += 1;

  if (timerId) {
    clearTimeout(timerId);
  }

  timerId = setTimeout(() => {
    triggerCount = 0;
  }, 500);

  safeExit();
};

// document.body.addEventListener('keydown', keydownHandler);
// document.body.addEventListener('touchend', touchHandler);
