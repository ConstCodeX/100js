document.addEventListener('DOMContentLoaded', () => {

    const $ = (tag) => document.querySelector(tag);

    const playPauseBtn = $('#play-pause');
    const progress = $('#progress');
    const currentTimeEl = $('#current-time');
    const durationEl = $('#duration');
    const audio = $('#audio');
    const volumeBtn = $('#volume-btn');
    const volumeMenu = $('#volume-menu');
    const volumeControl = $('#volume');

    let isPlaying = false;

    playPauseBtn.addEventListener('click', () => {
        if (isPlaying) {
            audio.pause();
            playPauseBtn.querySelector('span').textContent = 'play_arrow';
        } else {
            audio.play();
            playPauseBtn.querySelector('span').textContent = 'stop';
        }
        isPlaying = !isPlaying;
    });

    audio.addEventListener('timeupdate', () => {
        const { currentTime, duration, } = audio;
        const progressValue = (currentTime / duration) * 100;
        progress.value = progressValue;
        progress.style.setProperty('--progress-value', `${progressValue}%`);

        let currentMinutes = Math.floor(currentTime / 60);
        let currentSeconds = Math.floor(currentTime % 60);
        let durationMinutes = Math.floor(duration / 60);
        let durationSeconds = Math.floor(duration % 60);

        if (currentSeconds < 10) currentSeconds = `0${currentSeconds}`;
        if (durationSeconds < 10) durationSeconds = `0${durationSeconds}`;

        currentTimeEl.textContent = `${currentMinutes}:${currentSeconds}`;
        durationEl.textContent = `${durationMinutes}:${durationSeconds}`;
    });

    progress.addEventListener('input', () => {
        const { value } = progress;
        const duration = audio.duration;
        const currentTime = (value / 100) * duration;
        audio.currentTime = currentTime;
        progress.style.setProperty('--progress-value', `${value}%`);
    });

    volumeBtn.addEventListener('click', () => {
        volumeBtn.classList.add('active');
        volumeMenu.style.display = volumeMenu.style.display === 'none' || volumeMenu.style.display === '' ? 'block' : 'none';
        volumeMenu.style.left = `${volumeBtn.offsetLeft + volumeBtn.offsetWidth - 26}px`;
        volumeMenu.style.top = `${volumeBtn.offsetTop - volumeBtn.offsetHeight + 30}px`;
    });

    volumeControl.addEventListener('input', () => {
        const { value } = volumeControl;
        audio.volume = value;
    });

    document.addEventListener('click', (event) => {
        if (!volumeMenu.contains(event.target) && event.target !== volumeBtn) {
            volumeMenu.style.display = 'none';
            volumeBtn.classList.remove('active');
        }
    });
});
