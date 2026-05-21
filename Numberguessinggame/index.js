const minNum = 1;
const maxNum = 100;

let answer, attempts, running, low, high;

function resetGame() {
  answer   = Math.floor(Math.random() * (maxNum - minNum + 1)) + minNum;
  attempts = 0;
  running  = true;
  low      = minNum;
  high     = maxNum;

  document.getElementById('attempts').textContent = 0;
  document.getElementById('range').textContent = `${minNum} – ${maxNum}`;
  document.getElementById('hint').textContent = 'Enter your first guess below 👇';
  document.getElementById('hint').className = 'hint';
  document.getElementById('guessInput').value = '';
  document.getElementById('guessInput').disabled = false;
  document.getElementById('guessBtn').disabled = false;
  document.getElementById('historyList').innerHTML = '';
  document.getElementById('historySection').style.display = 'none';
  document.getElementById('guessInput').focus();
}

function makeGuess() {
  if (!running) return;

  const input = document.getElementById('guessInput');
  const guess = Number(input.value);
  const hint  = document.getElementById('hint');

  if (!input.value || isNaN(guess)) {
    hint.textContent = '⚠️ Please enter a valid number.';
    hint.className = 'hint';
    return;
  }

  if (guess < minNum || guess > maxNum) {
    hint.textContent = `⚠️ Number must be between ${minNum} and ${maxNum}.`;
    hint.className = 'hint';
    return;
  }

  attempts++;
  document.getElementById('attempts').textContent = attempts;
  document.getElementById('historySection').style.display = 'block';

  const chip = document.createElement('span');
  chip.className = 'history-chip';
  chip.textContent = guess;

  if (guess < answer) {
    hint.textContent = `📈 Too low! Try higher.`;
    hint.className = 'hint too-low';
    low = Math.max(low, guess + 1);
    chip.classList.add('low');
  } else if (guess > answer) {
    hint.textContent = `📉 Too high! Try lower.`;
    hint.className = 'hint too-high';
    high = Math.min(high, guess - 1);
    chip.classList.add('high');
  } else {
    hint.textContent = `✅ Correct! The answer was ${answer}.`;
    hint.className = 'hint correct';
    chip.classList.add('win');
    running = false;
    input.disabled = true;
    document.getElementById('guessBtn').disabled = true;
  }

  document.getElementById('range').textContent = `${low} – ${high}`;
  document.getElementById('historyList').appendChild(chip);
  input.value = '';
  input.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('guessInput').addEventListener('keydown', e => {
    if (e.key === 'Enter') makeGuess();
  });
  resetGame();
});