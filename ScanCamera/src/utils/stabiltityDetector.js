  let lastTime = 0;
  let stableCounter = 0;

  export default function isStable() {
    const now = Date.now();
    const diff = now - lastTime;

    lastTime = now;

    if (diff > 300) {
      stableCounter++;
    } else {
      stableCounter = 0;
    }

    return stableCounter > 5;
  }