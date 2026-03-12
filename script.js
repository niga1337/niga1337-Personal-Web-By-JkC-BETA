// ========== 液体背景跟随鼠标（实时版本）==========
const blobs = document.querySelectorAll('.liquid-blob');
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;
let targetX = mouseX;
let targetY = mouseY;

// 实时跟踪鼠标位置
document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
});

// 平滑动画循环
function animateBlobs() {
    // 让当前位置平滑移向目标位置
    mouseX += (targetX - mouseX) * 0.08;
    mouseY += (targetY - mouseY) * 0.08;

    blobs.forEach((blob, index) => {
        // 每个blob有不同的动画延迟
        const delay = index * 0.3;
        const time = Date.now() / 1000 + delay;
        
        // 多层次的随机波动，增加流动感
        const waveX = Math.sin(time * 0.8) * 80 + Math.cos(time * 0.5) * 50;
        const waveY = Math.cos(time * 0.6) * 80 + Math.sin(time * 0.7) * 50;
        
        // 跟随鼠标但有视差效果
        const parallaxX = (mouseX - window.innerWidth / 2) * (0.1 + index * 0.05);
        const parallaxY = (mouseY - window.innerHeight / 2) * (0.1 + index * 0.05);
        
        // 最终位置 = 波浪 + 视差 + 初始位置
        const finalX = parallaxX + waveX;
        const finalY = parallaxY + waveY;

        blob.style.transform = `translate(${finalX}px, ${finalY}px)`;
    });

    requestAnimationFrame(animateBlobs);
}

animateBlobs();

// ========== 页面加载动画 ==========
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
    // 添加进入动画
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        setTimeout(() => {
            section.style.transition = 'all 0.8s ease-out';
            section.style.opacity = '1';
            section.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// ========== 导航栏高亮 ==========
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function() {
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// ========== 滚动导航更新 ==========
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');
    let currentSection = '';

    sections.forEach(section => {
        if (pageYOffset >= section.offsetTop - 200) {
            currentSection = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === currentSection) {
            link.classList.add('active');
        }
    });

    // 滚动时的视差效果
    const blobs = document.querySelectorAll('.liquid-blob');
    blobs.forEach((blob, index) => {
        blob.style.filter = `blur(${80 + pageYOffset * 0.02}px)`;
    });
});

// ========== 表单提交 ==========
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // 顯示成功彈窗
    showSuccessPopup('感謝你的訊息！我會盡快回覆你。');
    this.reset();
});

// ========== 成功彈窗函數 ==========
function showSuccessPopup(message) {
    // 創建彈窗容器
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <div class="popup-icon">✓</div>
            <h3>成功！</h3>
            <p>${message}</p>
            <button class="popup-btn">關閉</button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // 觸發動畫
    setTimeout(() => {
        popup.classList.add('show');
    }, 10);
    
    // 關閉按鈕
    popup.querySelector('.popup-btn').addEventListener('click', () => {
        popup.classList.remove('show');
        setTimeout(() => {
            popup.remove();
        }, 300);
    });
    
    // 3秒後自動關閉
    setTimeout(() => {
        if (popup.parentNode) {
            popup.classList.remove('show');
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                }
            }, 300);
        }
    }, 3000);
}

// ========== 平滑滚动 ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== 元素进入视口时的动画 ==========
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'slideIn 0.8s ease-out forwards';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.skill-item, .project-item, .stat-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    observer.observe(el);
});

// ========== 鼠标跟随光晕效果 ==========
const createGlowEffect = () => {
    const glowSize = 300;
    const glow = document.createElement('div');
    glow.style.position = 'fixed';
    glow.style.width = glowSize + 'px';
    glow.style.height = glowSize + 'px';
    // 金黃色/橙黃色的顯眼漸變
    glow.style.background = 'radial-gradient(circle, rgba(255, 215, 0, 0.25), rgba(255, 165, 0, 0.15), transparent)';
    glow.style.borderRadius = '50%';
    glow.style.pointerEvents = 'none';
    glow.style.zIndex = '5';
    glow.style.filter = 'blur(50px)';
    glow.style.transition = 'all 0.3s ease-out';
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
        glow.style.left = (e.clientX - glowSize / 2) + 'px';
        glow.style.top = (e.clientY - glowSize / 2) + 'px';
    });
};

createGlowEffect();

// ========== Spotify 播放器 ==========
const SPOTIFY_CONFIG = {
    clientId: '148e6de59efb496f8e09572d1f267ec4',
    redirectUri: 'https://niga1337-personal-web-by-jk-c.vercel.app/callback.html',
    scopes: [
        'streaming',
        'user-read-email',
        'user-read-private',
        'user-read-playback-state',
        'user-modify-playback-state',
        'user-read-currently-playing',
        'user-read-playback-position'
    ]
};

class SpotifyPlayer {
    constructor() {
        this.accessToken = localStorage.getItem('spotify_access_token');
        this.deviceId = null;
        this.currentTrack = null;
        this.isPlaying = false;
        this.player = null;
        
        this.island = document.getElementById('dynamicIsland');
        this.islandExpanded = document.getElementById('islandExpanded');
        this.playBtn = document.getElementById('playBtn');
        this.playToggle = document.getElementById('playToggle');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.closeBtn = document.getElementById('closeBtn');
        this.progressSlider = document.getElementById('progressSlider');
        this.volumeSlider = document.getElementById('volumeSlider');
        this.progress = document.querySelector('.progress');
        this.currentTimeEl = document.getElementById('currentTime');
        this.durationEl = document.getElementById('duration');
        this.trackTitle = document.getElementById('trackTitle');
        this.trackArtist = document.getElementById('trackArtist');
        this.musicIcon = document.querySelector('.music-icon');
        this.albumArt = document.getElementById('albumArt');
        
        this.init();
    }
    
    init() {
        if (this.accessToken) {
            this.initializeSpotifyWebAPI();
        } else {
            this.showLoginPrompt();
        }
    }
    
    showLoginPrompt() {
        this.playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.redirectToSpotifyAuth();
        });
    }
    
    redirectToSpotifyAuth() {
        const params = new URLSearchParams({
            client_id: SPOTIFY_CONFIG.clientId,
            response_type: 'token',
            redirect_uri: SPOTIFY_CONFIG.redirectUri,
            scope: SPOTIFY_CONFIG.scopes.join(' '),
            show_dialog: 'true'
        });
        
        window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
    }
    
    initializeSpotifyWebAPI() {
        // 加載Spotify SDK
        window.onSpotifyWebPlaybackSDKReady = () => {
            this.setupWebPlayback();
        };
        
        const script = document.createElement('script');
        script.src = 'https://sdk.scdn.co/spotify-player.js';
        document.head.appendChild(script);
        
        this.setupEventListeners();
        this.updatePlaybackState();
        
        // 定期更新狀態
        setInterval(() => this.updatePlaybackState(), 1000);
    }
    
    setupWebPlayback() {
        const token = this.accessToken;
        
        this.player = new Spotify.Player({
            name: 'Chicken Hub Player',
            getOAuthToken: cb => { cb(token); },
            volume: 0.5
        });
        
        this.player.addListener('player_state_changed', state => {
            if (!state) return;
            this.handleStateChanged(state);
        });
        
        this.player.addListener('initialization_error', ({ message }) => {
            console.error('初始化錯誤:', message);
        });
        
        this.player.addListener('authentication_error', ({ message }) => {
            console.error('認證錯誤:', message);
            localStorage.removeItem('spotify_access_token');
            window.location.reload();
        });
        
        this.player.addListener('account_error', ({ message }) => {
            console.error('帳戶錯誤:', message);
            alert('❌ 你需要Spotify Premium帳戶才能播放音樂');
        });
        
        this.player.connect();
    }
    
    handleStateChanged(state) {
        if (!state) return;
        
        this.currentTrack = state.track_window.current_track;
        this.isPlaying = !state.paused;
        this.updateUI();
    }
    
    setupEventListeners() {
        // 靈動島點擊展開
        this.island.addEventListener('click', (e) => {
            if (!e.target.closest('.control-btn')) {
                this.toggleExpanded();
            }
        });
        
        // 播放按鈕
        this.playBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.togglePlay();
        });
        
        this.playToggle.addEventListener('click', () => this.togglePlay());
        this.prevBtn.addEventListener('click', () => this.prevTrack());
        this.nextBtn.addEventListener('click', () => this.nextTrack());
        
        this.closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleExpanded();
        });
        
        this.progressSlider.addEventListener('input', (e) => {
            const percent = e.target.value;
            const positionMs = (percent / 100) * this.currentTrack.duration_ms;
            this.seek(positionMs);
        });
        
        this.volumeSlider.addEventListener('input', (e) => {
            this.setVolume(e.target.value);
        });
    }
    
    async updatePlaybackState() {
        if (!this.accessToken) return;
        
        try {
            const response = await fetch('https://api.spotify.com/v1/me/player/currently-playing', {
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            
            if (response.status === 401) {
                localStorage.removeItem('spotify_access_token');
                window.location.reload();
                return;
            }
            
            if (response.ok) {
                const data = await response.json();
                if (data && data.item) {
                    this.currentTrack = data.item;
                    this.isPlaying = data.is_playing;
                    this.updateUI();
                }
            }
        } catch (error) {
            console.error('更新狀態失敗:', error);
        }
    }
    
    updateUI() {
        if (!this.currentTrack) return;
        
        // 更新歌曲信息
        this.trackTitle.textContent = this.currentTrack.name;
        this.trackArtist.textContent = this.currentTrack.artists[0]?.name || 'Unknown Artist';
        
        // 更新專輯封面
        if (this.currentTrack.album?.images[0]) {
            const albumUrl = this.currentTrack.album.images[0].url;
            this.albumArt.innerHTML = `<img src="${albumUrl}" alt="Album" style="width: 100%; height: 100%; object-fit: cover; border-radius: 20px;">`;
        }
        
        // 更新播放按鈕
        const symbol = this.isPlaying ? '⏸' : '▶';
        this.playBtn.textContent = symbol;
        this.playToggle.textContent = symbol;
        
        // 動畫
        if (this.isPlaying) {
            this.albumArt.classList.add('playing');
            this.musicIcon.style.animation = 'musicBounce 0.6s ease-in-out infinite';
        } else {
            this.albumArt.classList.remove('playing');
            this.musicIcon.style.animation = 'none';
        }
        
        // 更新進度
        this.updateProgress();
    }
    
    updateProgress() {
        if (!this.currentTrack) return;
        
        const percent = (this.currentTrack.progress_ms / this.currentTrack.duration_ms) * 100;
        this.progress.style.width = percent + '%';
        this.progressSlider.value = percent;
        this.currentTimeEl.textContent = this.formatTime(this.currentTrack.progress_ms);
        this.durationEl.textContent = this.formatTime(this.currentTrack.duration_ms);
    }
    
    async togglePlay() {
        if (!this.accessToken) return;
        
        try {
            const endpoint = this.isPlaying 
                ? 'https://api.spotify.com/v1/me/player/pause'
                : 'https://api.spotify.com/v1/me/player/play';
            
            const response = await fetch(endpoint, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            
            if (response.ok) {
                this.isPlaying = !this.isPlaying;
                this.updateUI();
            }
        } catch (error) {
            console.error('播放失敗:', error);
        }
    }
    
    async nextTrack() {
        if (!this.accessToken) return;
        
        try {
            await fetch('https://api.spotify.com/v1/me/player/next', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            
            setTimeout(() => this.updatePlaybackState(), 500);
        } catch (error) {
            console.error('下一首失敗:', error);
        }
    }
    
    async prevTrack() {
        if (!this.accessToken) return;
        
        try {
            await fetch('https://api.spotify.com/v1/me/player/previous', {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
            
            setTimeout(() => this.updatePlaybackState(), 500);
        } catch (error) {
            console.error('上一首失敗:', error);
        }
    }
    
    async seek(positionMs) {
        if (!this.accessToken) return;
        
        try {
            await fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=${Math.floor(positionMs)}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
        } catch (error) {
            console.error('尋找失敗:', error);
        }
    }
    
    async setVolume(volume) {
        if (!this.accessToken) return;
        
        try {
            await fetch(`https://api.spotify.com/v1/me/player/volume?volume_percent=${Math.floor(volume)}`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${this.accessToken}` }
            });
        } catch (error) {
            console.error('音量設置失敗:', error);
        }
    }
    
    toggleExpanded() {
        this.islandExpanded.classList.toggle('active');
    }
    
    formatTime(milliseconds) {
        if (isNaN(milliseconds)) return '0:00';
        const seconds = Math.floor(milliseconds / 1000);
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    }
}

// 初始化Spotify播放器
document.addEventListener('DOMContentLoaded', () => {
    new SpotifyPlayer();
});