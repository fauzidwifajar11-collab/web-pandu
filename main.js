/* ============================
   BIRTHDAY WEBSITE — script.js
============================ */

document.addEventListener('DOMContentLoaded', () => {

    /* ─── DOM REFS ─── */
    const pages = document.querySelectorAll('.page');
    const envelope = document.getElementById('envelope');
    const envWrapper = document.getElementById('envelope-wrapper');
    const clickHint = document.getElementById('click-hint');
    const btnSurprise = document.getElementById('btn-surprise');
    const bgMusic = document.getElementById('bg-music');
    const musicToggle = document.getElementById('music-toggle');
    const iconOn = document.getElementById('music-icon-on');
    const iconOff = document.getElementById('music-icon-off');

    /* ─── STATE ─── */
    let currentPage = 'page-1';
    let musicPlaying = false;
    let envelopeOpened = false;

    /* ─── PAGE NAVIGATION ─── */
    function goTo(pageId) {
        const current = document.getElementById(currentPage);
        const next = document.getElementById(pageId);
        if (!next || pageId === currentPage) return;

        if (current) {
            current.classList.add('exit');
            current.classList.remove('active');
        }

        setTimeout(() => {
            if (current) current.classList.remove('exit');
            next.classList.add('active');
            currentPage = pageId;

            // Trigger confetti on entering page-2
            if (pageId === 'page-2') launchConfetti(80);

            // After typing animation finishes on page-4, make text scrollable
            if (pageId === 'page-4') {
                const typingText = document.querySelector('.typing-text');
                if (typingText) {
                    typingText.classList.remove('done');
                    setTimeout(() => {
                        typingText.classList.add('done');
                    }, 4200); // slightly after the 4s animation
                }
            }

            // Trigger animation if entering page-5
            if(pageId === "page-5"){
                // Auto-play "Ini Abadi" by Perunggu
                const bgMusicEl = document.getElementById('bg-music');
                if (bgMusicEl) {
                    bgMusicEl.src = 'script/Perunggu - Ini Abadi (Video Lirik).mp3';
                    bgMusicEl.play().then(() => {
                        musicPlaying = true;
                        songPicked = true;
                        updateMusicUI();
                    }).catch(() => {});
                }

                setTimeout(() => {
                    if(window.startPage5Animation){
                        window.startPage5Animation();
                    }
                }, 300);
            }
        }, 400);
    }

    // Expose goTo globally so inline handlers or other scripts can use it
    window.goTo = goTo;

    /* ─── MEMORY CARDS ─── */
    document.querySelectorAll('.memory-card').forEach(card => {
        card.addEventListener('click', () => {
            const target = card.dataset.page;
            if (target) goTo(target);
        });
    });

    /* ─── BACK BUTTONS ─── */
    document.querySelectorAll('.btn-back').forEach(btn => {
        btn.addEventListener('click', () => {
            const target = btn.dataset.page;
            if (target) goTo(target);
        });
    });

    /* ─── ENVELOPE OPEN ─── */
    function openEnvelope() {
        if (envelopeOpened) return;
        envelopeOpened = true;

        if (envelope) envelope.classList.add('opening');
        if (envWrapper) envWrapper.classList.add('opening');
        if (clickHint) clickHint.style.opacity = '0';

        // Try to start background music on interaction
        tryPlayMusic();

        // Show the "Buka Kejutan" button after animation
        setTimeout(() => {
            if (btnSurprise) {
                btnSurprise.classList.remove('hidden');
                btnSurprise.classList.add('visible');
            }
        }, 1200);
    }

    if (envWrapper) {
        envWrapper.addEventListener('click', openEnvelope);
    }

    if (btnSurprise) {
        btnSurprise.addEventListener('click', () => {
            launchConfetti(120);
            setTimeout(() => goTo('page-2'), 300);
        });
    }

    /* ─── BACKGROUND MUSIC ─── */
    if (bgMusic) {
        bgMusic.volume = 0.25;
    }

    const RANDOM_SONGS = [
        "script/Aku Milikmu - Dewa 19 (Lyrics Video).mp3",
        "script/Chrisye - Untukku (Official Music Video) [n6TmzCGSKgY].mp3",
        "script/Nadhif Basalamah - kota ini tak sama tanpamu (Official Lyric Video).mp3",
        "script/Perunggu - Ini Abadi (Video Lirik).mp3",
        "script/Sal Priadi & Nadin Amizah - Amin Paling Serius (Official Audio) [ZRMDxjRdJV8].mp3"
    ];

    let songPicked = false;

    function tryPlayMusic() {
        if (musicPlaying || !bgMusic) return;
        
        // Pick random song the first time it plays
        if (!songPicked) {
            const randomSong = RANDOM_SONGS[Math.floor(Math.random() * RANDOM_SONGS.length)];
            bgMusic.src = randomSong;
            songPicked = true;
        }

        const p = bgMusic.play();
        if (p !== undefined) {
            p.then(() => {
                musicPlaying = true;
                updateMusicUI();
            }).catch(() => {
                // Autoplay blocked — user must click music button
            });
        }
    }

    function updateMusicUI() {
        if (iconOn) iconOn.style.display = musicPlaying ? 'block' : 'none';
        if (iconOff) iconOff.style.display = musicPlaying ? 'none' : 'block';
        highlightActiveOption();
    }

    const musicMenu = document.getElementById('music-menu');
    const musicMenuClose = document.getElementById('music-menu-close');
    const musicOptions = document.querySelectorAll('.music-option');
    const musicMenuPlayPause = document.getElementById('music-menu-playpause');

    if (musicToggle) {
        musicToggle.addEventListener('click', () => {
            if (musicMenu) musicMenu.classList.toggle('hidden');
            highlightActiveOption();
        });
    }

    if (musicMenuClose) {
        musicMenuClose.addEventListener('click', () => {
            musicMenu.classList.add('hidden');
        });
    }

    function highlightActiveOption() {
        if (!bgMusic) return;
        const currentSrc = decodeURI(bgMusic.src || "");
        musicOptions.forEach(opt => {
            const optSrc = opt.getAttribute('data-src');
            if (currentSrc.includes(optSrc)) {
                opt.classList.add('active');
            } else {
                opt.classList.remove('active');
            }
        });
    }

    musicOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            const src = opt.getAttribute('data-src');
            if (src) {
                bgMusic.src = src;
                bgMusic.play().then(() => {
                    musicPlaying = true;
                    songPicked = true;
                    updateMusicUI();
                }).catch(() => {});
            }
        });
    });

    if (musicMenuPlayPause) {
        musicMenuPlayPause.addEventListener('click', () => {
            if (!bgMusic) return;
            if (musicPlaying) {
                bgMusic.pause();
                musicPlaying = false;
            } else {
                if (!songPicked && (!bgMusic.src || bgMusic.src.includes('bensound-romantic.mp3'))) {
                    tryPlayMusic();
                } else {
                    bgMusic.play().then(() => {
                        musicPlaying = true;
                    }).catch(() => {});
                }
            }
            updateMusicUI();
        });
    }



    /* ─── FLOATING PETALS ─── */
    const petalsContainer = document.getElementById('petals-container');
    const petalSymbols = ['🌹', '🌸', '❤️', '✨', '💕', '🌺'];

    function createPetal() {
        if (!petalsContainer || currentPage !== 'page-1') return;
        const el = document.createElement('span');
        el.classList.add('petal');
        el.textContent = petalSymbols[Math.floor(Math.random() * petalSymbols.length)];
        el.style.left = Math.random() * 100 + '%';
        el.style.top = '-20px';
        el.style.fontSize = (Math.random() * 0.8 + 0.6) + 'rem';
        el.style.animationDuration = (Math.random() * 8 + 8) + 's';
        el.style.animationDelay = (Math.random() * 5) + 's';
        petalsContainer.appendChild(el);
        setTimeout(() => el.remove(), 18000);
    }
    setInterval(createPetal, 1200);
    for (let i = 0; i < 5; i++) createPetal();

    /* ─── CONFETTI ─── */
    const confettiCanvas = document.getElementById('confetti-canvas');
    const ctx = confettiCanvas ? confettiCanvas.getContext('2d') : null;

    function resizeConfettiCanvas() {
        if (!confettiCanvas) return;
        confettiCanvas.width = document.body.clientWidth;
        confettiCanvas.height = window.innerHeight;
    }

    if (confettiCanvas) {
        resizeConfettiCanvas();
        window.addEventListener('resize', resizeConfettiCanvas);
    }

    let confettiParticles = [];
    let confettiRunning = false;

    function launchConfetti(count = 100) {
        if (!confettiCanvas || !ctx) return;
        const colors = ['#c41e3a', '#ff6b8a', '#ffb3c1', '#d4a537', '#f0c65a', '#ffffff', '#8B0000'];
        for (let i = 0; i < count; i++) {
            confettiParticles.push({
                x: Math.random() * confettiCanvas.width,
                y: -10,
                vx: (Math.random() - 0.5) * 4,
                vy: Math.random() * 3 + 2,
                size: Math.random() * 8 + 4,
                color: colors[Math.floor(Math.random() * colors.length)],
                angle: Math.random() * 360,
                spin: (Math.random() - 0.5) * 10,
                shape: Math.random() > 0.5 ? 'rect' : 'circle',
                life: 1,
                decay: Math.random() * 0.005 + 0.003,
            });
        }
        if (!confettiRunning) animateConfetti();
    }

    // Expose launchConfetti globally
    window.launchConfetti = launchConfetti;

    function animateConfetti() {
        if (!confettiCanvas || !ctx) return;
        if (confettiParticles.length === 0) { confettiRunning = false; return; }
        confettiRunning = true;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        confettiParticles = confettiParticles.filter(p => p.life > 0 && p.y < confettiCanvas.height + 20);
        confettiParticles.forEach(p => {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.05;
            p.vx *= 0.99;
            p.angle += p.spin;
            p.life -= p.decay;

            ctx.save();
            ctx.globalAlpha = Math.max(0, p.life);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.angle * Math.PI / 180);
            ctx.fillStyle = p.color;

            if (p.shape === 'rect') {
                ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
            } else {
                ctx.beginPath();
                ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
                ctx.fill();
            }
            ctx.restore();
        });
        requestAnimationFrame(animateConfetti);
    }

    /* ─── CATCH THE HEARTS GAME ─── */
    const catchCanvas = document.getElementById('catch-canvas');
    const catchCtx = catchCanvas ? catchCanvas.getContext('2d') : null;
    const btnCatchStart = document.getElementById('btn-catch-start');
    const catchOverlay = document.getElementById('catch-overlay');
    const scoreVal = document.getElementById('catch-score-val');
    const livesVal = document.getElementById('catch-lives-val');
    const catchOverlayTitle = document.getElementById('catch-overlay-title');
    const catchOverlayDesc = document.getElementById('catch-overlay-desc');
    const catchFinalScore = document.getElementById('catch-final-score');

    let catchGameRunning = false;
    let catchScore = 0;
    let catchLives = 3;
    let catchItems = [];
    let catchBasket = { x: 0, y: 0, width: 120, height: 80 };
    let catchAnimationFrame;
    let lastItemTime = 0;
    let itemSpawnRate = 1000;

    // Image and Emojis mapping
    const PANDU_IMAGES = [];
    for (let i = 1; i <= 22; i++) {
        const img = new Image();
        img.src = `script/pandu${i}.jpeg`;
        PANDU_IMAGES.push(img);
    }
    const BAD_ITEMS = ['💔', '💣', '💩'];

    function resizeCatchCanvas() {
        if (!catchCanvas) return;
        const rect = catchCanvas.parentElement.getBoundingClientRect();
        catchCanvas.width = rect.width;
        catchCanvas.height = rect.height;
        catchBasket.y = catchCanvas.height - catchBasket.height - 20;
        if (catchBasket.x === 0 || catchBasket.x > catchCanvas.width) {
            catchBasket.x = catchCanvas.width / 2 - catchBasket.width / 2;
        }
    }

    if (catchCanvas) {
        window.addEventListener('resize', resizeCatchCanvas);
        resizeCatchCanvas();

        // Mouse control
        catchCanvas.addEventListener('mousemove', (e) => {
            if (!catchGameRunning) return;
            const rect = catchCanvas.getBoundingClientRect();
            catchBasket.x = e.clientX - rect.left - catchBasket.width / 2;
        });

        // Touch control
        catchCanvas.addEventListener('touchmove', (e) => {
            if (!catchGameRunning) return;
            e.preventDefault(); // Prevent scrolling while playing
            const rect = catchCanvas.getBoundingClientRect();
            catchBasket.x = e.touches[0].clientX - rect.left - catchBasket.width / 2;
        }, { passive: false });
    }

    function updateCatchUI() {
        if (scoreVal) scoreVal.innerText = catchScore;
        let hearts = '';
        for (let i = 0; i < Math.max(0, catchLives); i++) hearts += '❤️';
        if (livesVal) livesVal.innerText = hearts || '💀';
    }

    function spawnCatchItem() {
        if (!catchCanvas) return;
        const isBad = Math.random() < 0.2; // 20% chance bad
        let itemImg = null;
        let itemEmoji = null;

        if (!isBad) {
            itemImg = PANDU_IMAGES[Math.floor(Math.random() * PANDU_IMAGES.length)];
        } else {
            itemEmoji = BAD_ITEMS[Math.floor(Math.random() * BAD_ITEMS.length)];
        }

        catchItems.push({
            x: Math.random() * (catchCanvas.width - 100) + 50, // Keep padding
            y: -80,
            size: Math.random() * 25 + 75, // 75-100px for much larger visibility
            img: itemImg,
            emoji: itemEmoji,
            isBad: isBad,
            speed: Math.random() * 2 + 3 + (catchScore * 0.02) // Speed increases over time
        });
    }

    function drawCatchGame() {
        if (!catchCanvas || !catchCtx) return;
        catchCtx.clearRect(0, 0, catchCanvas.width, catchCanvas.height);

        // Draw Basket (a stylized shape or emoji)
        catchCtx.font = "80px Arial";
        catchCtx.textAlign = "center";
        catchCtx.textBaseline = "middle";
        catchCtx.fillText("🧺", catchBasket.x + catchBasket.width / 2, catchBasket.y + catchBasket.height / 2);

        // Draw and update items
        const now = Date.now();
        if (now - lastItemTime > itemSpawnRate) {
            spawnCatchItem();
            lastItemTime = now;
            itemSpawnRate = Math.max(400, 1000 - catchScore * 5); // Speeds up spawn rate
        }

        for (let i = catchItems.length - 1; i >= 0; i--) {
            let item = catchItems[i];
            item.y += item.speed;

            if (item.img && item.img.complete) {
                catchCtx.save();
                
                const imgX = item.x - item.size / 2;
                const imgY = item.y - item.size / 2;
                
                // Calculate square crop (object-fit: cover equivalent)
                const imgRatio = item.img.width / item.img.height;
                let sx, sy, sWidth, sHeight;
                
                if (imgRatio > 1) {
                    // Landscape
                    sHeight = item.img.height;
                    sWidth = sHeight;
                    sx = (item.img.width - sWidth) / 2;
                    sy = 0;
                } else {
                    // Portrait or square
                    sWidth = item.img.width;
                    sHeight = sWidth;
                    sx = 0;
                    sy = (item.img.height - sHeight) / 2;
                }
                
                // Draw image proportionally without stretching
                catchCtx.drawImage(item.img, sx, sy, sWidth, sHeight, imgX, imgY, item.size, item.size);
                
                // Add a cute border
                catchCtx.lineWidth = 3;
                catchCtx.strokeStyle = '#ff6b8a';
                catchCtx.strokeRect(imgX, imgY, item.size, item.size);
                
                catchCtx.restore();
            } else if (item.emoji) {
                catchCtx.font = item.size + "px Arial";
                catchCtx.fillText(item.emoji, item.x, item.y);
            }

            // Detect Catch Collision
            if (
                item.y + item.size / 2 >= catchBasket.y &&
                item.y - item.size / 2 <= catchBasket.y + catchBasket.height &&
                item.x >= catchBasket.x - catchBasket.width / 4 &&
                item.x <= catchBasket.x + catchBasket.width + catchBasket.width / 4
            ) {
                // Caught
                if (item.isBad) {
                    catchLives--;
                    updateCatchUI();
                    // Shake effect using inline keyframes
                    if (catchCanvas) {
                        catchCanvas.style.transform = 'translateX(-5px)';
                        setTimeout(() => { catchCanvas.style.transform = 'translateX(5px)'; }, 50);
                        setTimeout(() => { catchCanvas.style.transform = 'translateX(-3px)'; }, 100);
                        setTimeout(() => { catchCanvas.style.transform = 'translateX(3px)'; }, 150);
                        setTimeout(() => { catchCanvas.style.transform = 'translateX(0)'; }, 200);
                    }
                } else {
                    catchScore += 10;
                    updateCatchUI();
                }
                // Remove caught item
                catchItems.splice(i, 1);
            } else if (item.y > catchCanvas.height + 50) {
                // Missed
                catchItems.splice(i, 1);
            }
        }

        if (catchLives <= 0) {
            endCatchGame();
            return;
        }

        if (catchGameRunning) {
            catchAnimationFrame = requestAnimationFrame(drawCatchGame);
        }
    }

    function startCatchGame() {
        catchScore = 0;
        catchLives = 3;
        catchItems = [];
        itemSpawnRate = 1000;
        lastItemTime = Date.now();
        updateCatchUI();
        if (catchOverlay) catchOverlay.classList.add('hidden');
        if (catchFinalScore) catchFinalScore.classList.add('hidden');
        catchGameRunning = true;
        resizeCatchCanvas();
        drawCatchGame();
    }

    function endCatchGame() {
        catchGameRunning = false;
        cancelAnimationFrame(catchAnimationFrame);
        
        // Auto-restart game after 2 seconds
        setTimeout(() => {
            const page6 = document.getElementById('page-6');
            if (page6 && page6.classList.contains('active')) {
                startCatchGame();
            }
        }, 2000);
    }

    if (btnCatchStart) {
        btnCatchStart.addEventListener('click', startCatchGame);
    }

    const page6 = document.getElementById('page-6');
    if (page6) {
        const observerCatch = new MutationObserver(() => {
            if (!page6.classList.contains('active')) {
                catchGameRunning = false;
                if (catchOverlay) {
                    catchOverlay.classList.remove('hidden'); 
                    if (catchOverlayTitle) catchOverlayTitle.innerText = "Tangkap Hati & Kado!";
                    if (catchOverlayDesc) catchOverlayDesc.innerText = "Geser keranjang ke kiri dan kanan untuk menangkap, pastikan tidak mengambil hati yang retak (💔)!";
                    if (btnCatchStart) btnCatchStart.innerText = "Mulai Main";
                    if (catchFinalScore) catchFinalScore.classList.add('hidden');
                }
            } else if (!catchGameRunning) {
                // Auto-start game on enter instead of waiting for button
                startCatchGame();
                if (catchOverlay) {
                    catchOverlay.classList.add('hidden');
                }
            }
        });
        observerCatch.observe(page6, { attributes: true, attributeFilter: ['class'] });
    }


    /* ─── KEYBOARD NAVIGATION ─── */
    document.addEventListener('keydown', e => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            if (currentPage === 'page-1' && !envelopeOpened) { openEnvelope(); return; }
            if (currentPage === 'page-1' && envelopeOpened && btnSurprise) { btnSurprise.click(); return; }
        }
        if (e.key === 'Escape') {
            if (['page-3', 'page-4', 'page-5', 'page-6', 'page-7'].includes(currentPage)) goTo('page-2');
        }
    });

    /* ─── TOUCH SWIPE ─── */
    let touchStartX = 0;
    let touchStartY = 0;

    document.addEventListener('touchstart', e => {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
    }, { passive: true });

    document.addEventListener('touchend', e => {
        const dx = e.changedTouches[0].clientX - touchStartX;
        const dy = e.changedTouches[0].clientY - touchStartY;
        if (Math.abs(dx) < 30 && Math.abs(dy) < 30) return; // tap, ignore

        // Swipe left — go back to page-2 from sub-pages
        if (dx < -50 && Math.abs(dy) < Math.abs(dx)) {
            if (['page-3', 'page-4', 'page-5', 'page-6', 'page-7'].includes(currentPage)) {
                goTo('page-2');
            }
        }

        // Swipe up on page-1 — open envelope or go to page-2
        if (dy < -50 && Math.abs(dx) < Math.abs(dy)) {
            if (currentPage === 'page-1' && !envelopeOpened) {
                openEnvelope();
            } else if (currentPage === 'page-1' && envelopeOpened && btnSurprise) {
                btnSurprise.click();
            }
        }
    }, { passive: true });

    /* ─── INIT CONFETTI ON LOAD ─── */
    setTimeout(() => launchConfetti(60), 600);

    /* ─── GLOBAL MUSIC LISTENER ─── */
    document.body.addEventListener("click", () => {
        const music = document.getElementById("bg-music");
        if(music) music.play().catch(()=>{});
    }, { once: true });

    /* ─── JOURNEY PAGE: DYNAMIC LANDSCAPE SCALE ─── */
    function updateScrapbookScale() {
        // The scrapbook canvas is 1440×900 in landscape
        const CANVAS_W = 1440;
        const CANVAS_H = 900;
        const vw = window.innerWidth;
        const vh = window.innerHeight;
        
        // Always keep straight (no rotation), scale to fit viewport
        document.documentElement.style.setProperty('--scrap-rotate', '0deg');
        const scaleByW = (vw * 0.97) / CANVAS_W;
        const scaleByH = (vh * 0.97) / CANVAS_H;
        const scale = Math.min(scaleByW, scaleByH);
        document.documentElement.style.setProperty('--scrap-scale', scale.toFixed(4));
    }
    updateScrapbookScale();
    window.addEventListener('resize', updateScrapbookScale);
    window.addEventListener('orientationchange', () => {
        setTimeout(updateScrapbookScale, 200);
    });

    /* ─── RANDOMIZE PHOTOS ─── */
    function randomizePhotos() {
        const totalPhotos = 22;
        
        // 1. (Halaman pertama tidak diacak karena sudah diset di index.html)

        // 2. Acak semua foto lainnya di semua halaman (Journey, Moment, dll)
        const randomPhotoSelectors = [
            '.pol-photo', '.film-photo', '.oval-photo', '.cut-photo', 
            '.girl-photo', '.pb-photo', '.card-image', '.moment-photo'
        ];
        
        const elementsToRandomize = document.querySelectorAll(randomPhotoSelectors.join(', '));
        
        elementsToRandomize.forEach(el => {
            const randomNum = Math.floor(Math.random() * totalPhotos) + 1;
            const randomSrc = `script/pandu${randomNum}.jpeg`;
            
            // Override CSS background-image
            el.style.backgroundImage = `url('${randomSrc}')`;
            el.style.backgroundPosition = 'center';
            el.style.backgroundSize = 'cover';
            el.style.backgroundRepeat = 'no-repeat';
        });
    }
    randomizePhotos();

}); // end DOMContentLoaded



/* ─── PAGE 5 ANIMATION ─── */
            window.startPage5Animation = function() {
                const letter = document.getElementById('p5-letter');
                
                if (!letter) return;

                // Reset animation (jika dibuka ulang)
                letter.classList.remove('rising');
                letter.offsetHeight; // trigger reflow

                // Stop any previous voice playback
                if (window._p5VoiceAudio) {
                    window._p5VoiceAudio.pause();
                    window._p5VoiceAudio.currentTime = 0;
                    window._p5VoiceAudio = null;
                }

                // Hilangkan debu emas yang mungkin masih ada
                document.querySelectorAll('.magic-dust').forEach(d => d.remove());

                // Daftar suara yang BENAR-BENAR ADA
                const voices = [
                    'script/pandu suara 1.ogg',
                    'script/pandu suara 2.ogg',
                    'script/pandu suara 3.ogg',
                    'script/pandu suara 4.ogg'
                ];

                // Preload semua audio
                const preloadedVoices = voices.map(src => {
                    const audio = new Audio();
                    audio.preload = 'auto';
                    audio.src = src;
                    return audio;
                });

                // Mulai animasi: surat turun dari lubang
                setTimeout(() => {
                    letter.classList.add('rising');
                    
                    // Debu emas muncul saat surat mulai turun
                    setTimeout(() => {
                        createDust();
                    }, 500);

                    // Voice sequence dimulai setelah surat sudah setengah keluar
                    setTimeout(() => {
                        playVoiceSequence();
                    }, 1500);

                }, 800);

                function playVoiceSequence() {
                    const bgMusic = document.getElementById('bg-music');
                    const originalVolume = bgMusic ? bgMusic.volume : 0.25;
                    
                    // Fade out background music smoothly
                    if (bgMusic) {
                        let fadeVol = bgMusic.volume;
                        const fadeOut = setInterval(() => {
                            fadeVol = Math.max(0.03, fadeVol - 0.03);
                            bgMusic.volume = fadeVol;
                            if (fadeVol <= 0.03) clearInterval(fadeOut);
                        }, 50);
                    }
                    
                    let currentIndex = 0;
                    
                    function playNext() {
                        if (currentIndex >= preloadedVoices.length) {
                            // Fade back in background music
                            if (bgMusic) {
                                let fadeVol = bgMusic.volume;
                                const fadeIn = setInterval(() => {
                                    fadeVol = Math.min(originalVolume, fadeVol + 0.02);
                                    bgMusic.volume = fadeVol;
                                    if (fadeVol >= originalVolume) clearInterval(fadeIn);
                                }, 50);
                            }
                            window._p5VoiceAudio = null;
                            return;
                        }
                        
                        const audio = preloadedVoices[currentIndex];
                        window._p5VoiceAudio = audio;
                        audio.currentTime = 0;
                        audio.volume = 1.0;
                        
                        audio.play().then(() => {
                            // Successfully playing
                        }).catch(e => {
                            console.warn("Gagal memutar suara " + (currentIndex + 1) + ":", e.message);
                            currentIndex++;
                            // Coba langsung ke suara berikutnya
                            setTimeout(playNext, 300);
                        });
                        
                        audio.onended = () => {
                            currentIndex++;
                            // Jeda kecil antar suara agar lebih natural
                            setTimeout(playNext, 400);
                        };
                        
                        audio.onerror = () => {
                            console.warn("Error loading suara " + (currentIndex + 1));
                            currentIndex++;
                            setTimeout(playNext, 300);
                        };
                    }
                    
                    playNext();
                }

                // Stop voice when leaving page 5
                const page5El = document.getElementById('page-5');
                if (page5El && !page5El._p5Observer) {
                    page5El._p5Observer = new MutationObserver(() => {
                        if (!page5El.classList.contains('active')) {
                            // Stop voice playback
                            if (window._p5VoiceAudio) {
                                window._p5VoiceAudio.pause();
                                window._p5VoiceAudio.currentTime = 0;
                                window._p5VoiceAudio = null;
                            }
                            // Restore bg music volume
                            const bgMusic = document.getElementById('bg-music');
                            if (bgMusic) bgMusic.volume = 0.25;
                        }
                    });
                    page5El._p5Observer.observe(page5El, { attributes: true, attributeFilter: ['class'] });
                }

                function createDust() {
                    const slotWrapper = document.querySelector('.p5-slot-wrapper');
                    if (!slotWrapper) return;
                    
                    for(let i=0; i<30; i++) {
                        let dust = document.createElement('div');
                        dust.className = 'magic-dust';
                        
                        // Start from the slot opening area (at the top)
                        dust.style.left = (40 + Math.random() * 20) + '%';
                        dust.style.top = '50px';
                        
                        let angle = Math.random() * Math.PI * 2;
                        let dist = 60 + Math.random() * 120; 
                        let tx = Math.cos(angle) * dist + 'px';
                        let ty = Math.sin(angle) * dist + 'px';
                        
                        dust.style.setProperty('--tx', tx);
                        dust.style.setProperty('--ty', ty);
                        
                        dust.style.animation = `poof ${1 + Math.random()}s ${Math.random()*0.5}s ease-out forwards`;
                        
                        slotWrapper.appendChild(dust);
                        setTimeout(()=> dust.remove(), 2000);
                    }
                }
            };

