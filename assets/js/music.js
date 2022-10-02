const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const audio = $("#audio");
const imageSong = $(".image-song");
const nameSong = $(".name-song");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const playLists = $(".playlists");
const nextBtn = $(".btn-next");
const prevBtn = $(".btn-prev");
const repeatBtn = $(".btn-repeat");
const randomBtn = $(".btn-random");
const slideMain = $(".slider-main");
const nextSilde = $(".next-slide");
const prevSlide = $(".prev-slide");
const slideItems = $$(".slider-item");
const tabMusic = $(".tab-music");
const btnTabMusic = $(".btn-tab-music");
let indexSlide = 0;
const recentlyLists = [
	{
		name: "At My Worst",
		singer: "Pink Sweat",
		path: "../music/atmyworst.mp3",
		image: "../assets/imgs/atmyworst.jpeg",
	},
	{
		name: "Abcdfu",
		singer: "Raftaar x Salim Merchant x Karma",
		path: "../music/abcdfu.mp3",
		image:
			"https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
	},
	{
		name: "Beutiful In White",
		singer: "Shane Filan",
		path: "../music/beutifulinwhite.mp3",
		image:
			"https://zmp3-photo-fbcrawler.zmdcdn.me/avatars/a/6/a6945a50b698adb81c29021ef66c9dc7_1494246803.jpg",
	},
];

const PLAYER_STORAGE_KEY = "user_player";
const app = {
	currentIndex: Math.floor(Math.random() * 6),
	isRepeatSong: false,
	isOpenTabMusic: true,
	isPlaying: false,
	isProgress: false,
	isRandom: false,
	config: JSON.parse(localStorage.getItem(PLAYER_STORAGE_KEY)) || {},
	setConfig: function (key, value) {
		this.config[key] = value;
		localStorage.setItem(PLAYER_STORAGE_KEY, JSON.stringify(this.config));
	},
	songs: [
		{
			name: "At My Worst",
			singer: "Pink Sweat",
			path: "../music/atmyworst.mp3",
			image: "../assets/imgs/atmyworst.jpeg",
		},
		{
			name: "Abcdfu",
			singer: "Raftaar x Salim Merchant x Karma",
			path: "../music/abcdfu.mp3",
			image:
				"https://1.bp.blogspot.com/-kX21dGUuTdM/X85ij1SBeEI/AAAAAAAAKK4/feboCtDKkls19cZw3glZWRdJ6J8alCm-gCNcBGAsYHQ/s16000/Tu%2BAana%2BPhir%2BSe%2BRap%2BSong%2BLyrics%2BBy%2BRaftaar.jpg",
		},
		{
			name: "Beutiful In White",
			singer: "Shane Filan",
			path: "../music/beutifulinwhite.mp3",
			image:
				"https://zmp3-photo-fbcrawler.zmdcdn.me/avatars/a/6/a6945a50b698adb81c29021ef66c9dc7_1494246803.jpg",
		},
		{
			name: "Bad Liar",
			singer: "Imagine Dragons",
			path: "../music/badliar.mp3",
			image:
				"https://i.pinimg.com/originals/0a/fa/62/0afa628528a62ebc8b594ff0c40bda68.jpg",
		},
		{
			name: "Lemon Tree",
			singer: "Fool's Garden",
			path: "../music/lemontree.mp3",
			image: "https://i.ytimg.com/vi/l2UiY2wivTs/maxresdefault.jpg",
		},
		{
			name: "You Broke Me First",
			singer: "Honeyfox, Pop Mage",
			path: "../music/honey.mp3",
			image: "https://i.ytimg.com/vi/zwh1QtRLUhY/maxresdefault.jpg",
		},
	],
	render() {
		const htmls = this.songs.map((song, indexSong) => {
			return `
        <li data-index="${indexSong}" class="${
				indexSong == app.currentIndex ? "active-song" : ""
			} song-item d-flex p-2 shadow rounded g-col-12 user-select-none cursor-pointer">
					<div class="icon cd-thumb"><img class="img-fluid rounded-circle shadow" src="${
						song.image
					}" alt=""></div>
					<div class="d-flex flex-column flex-grow-1 flex-shrink-1 ms-3">
						<h6 class="fs-6  m-0">${song.name}</h6>
						<p class="m-0 fs-7 text-gray">${song.singer}</p>
					</div>
				</li>
    `;
		});
		playLists.innerHTML = htmls.join("\n");
	},
	defineProperties() {
		Object.defineProperty(this, "currentSong", {
			get() {
				return this.songs[this.currentIndex];
			},
		});
	},
	handleEvent() {
		const _this = this;
		//playing Song
		const widthSlideItem = slideItems[0].offsetWidth;
		playBtn.onclick = () => {
			if (_this.isPlaying) {
				audio.pause();
			} else {
				audio.play();
			}
		};
		nextBtn.onclick = () => {
			if (_this.isRandom) {
				_this.playRandomSong();
			} else {
				_this.nextSong();
			}
			audio.play();
			_this.songIntoView();
		};
		prevBtn.onclick = () => {
			if (_this.isRandom) {
				_this.playRandomSong();
			} else {
				_this.prevSong();
			}
			audio.play();
		};
		// repeat Song
		repeatBtn.onclick = function () {
			_this.isRepeatSong = !_this.isRepeatSong;
			_this.isRandom = false;
			_this.setConfig("isRepeatSong", _this.isRepeatSong);
			_this.setConfig("isRandom", _this.isRandom);
			this.classList.toggle("active-btn", _this.isRepeatSong);
			randomBtn.classList.remove("active-btn");
		};
		randomBtn.onclick = function () {
			_this.isRandom = !_this.isRandom;
			_this.isRepeatSong = false;
			_this.setConfig("isRandom", _this.isRandom);
			_this.setConfig("isRepeatSong", _this.isRepeatSong);
			this.classList.toggle("active-btn", _this.isRandom);
			repeatBtn.classList.remove("active-btn");
		};
		audio.onplay = () => {
			_this.isPlaying = true;
			playBtn.innerHTML = `<i class="fs-7 fa-solid fa-pause"></i>`;
			_this.loadRecentlyList();
		};
		audio.onpause = () => {
			_this.isPlaying = false;
			playBtn.innerHTML = `<i class="fs-7 fa-solid fa-play"></i>`;
		};
		audio.onended = () => {
			if (_this.isRepeatSong) {
				audio.play();
			} else {
				nextBtn.click();
			}
		};
		//mouse events
		progress.onmousedown = () => {
			_this.isProgress = true;
		};
		progress.onmouseup = (e) => {
			_this.isProgress = false;
			const seekTime = (audio.duration / 100) * e.target.value;
			progress.value = e.target.value;
			audio.currentTime = seekTime;
		};
		// touch events mobile
		progress.addEventListener(
			"touchstart",
			() => {
				_this.isProgress = true;
			},
			{ passive: true }
		);
		progress.addEventListener(
			"touchend",
			(e) => {
				_this.isProgress = false;
				const seekTime = (audio.duration / 100) * e.target.value;
				progress.value = e.target.value;
				audio.currentTime = seekTime;
			},
			{ passive: true }
		);
		audio.ontimeupdate = () => {
			const duration = audio.duration;
			const currentTime = audio.currentTime;
			const progressPercent = (currentTime / duration) * 100;
			if (duration && !_this.isProgress) {
				progress.value = Math.floor(progressPercent);
			}
		};
		playLists.onclick = function (e) {
			const songNode = e.target.closest(".song-item:not(.active-song)");
			if (songNode) {
				const indexSong = parseInt(songNode.dataset.index);
				_this.currentIndex = indexSong;
				_this.loadCurrentSong();
				_this.render();
				audio.play();
			}
		};
		nextSilde.onclick = () => {
			indexSlide++;
			if (indexSlide >= 3) {
				indexSlide = 2;
			} else {
				slideMain.style = `transform :translateX(${
					-1 * indexSlide * widthSlideItem - 8
				}px);
        transition : transform 0.5s linear
      `;
			}
		};
		prevSlide.onclick = () => {
			indexSlide--;
			if (indexSlide < 0) {
				indexSlide = 0;
			} else {
				slideMain.style = `transform :translateX(${
					-1 * indexSlide * widthSlideItem + 8
				}px);
        transition : transform 0.5s linear
      `;
			}
		};
		btnTabMusic.onclick = () => {
			if (window.innerWidth < 576) {
				if(_this.isOpenTabMusic){
					// tabMusic.classList.remove('d-none')
					tabMusic.classList.remove("toggle-tab-music");
					_this.isOpenTabMusic = false;
				}else{
					tabMusic.classList.add("toggle-tab-music");
					_this.isOpenTabMusic = true;
				}
			}
		};
	},
	nextSong() {
		if (this.currentIndex >= this.songs.length - 1) {
			this.currentIndex = 0;
		} else {
			this.currentIndex++;
		}
		this.loadCurrentSong();
		this.render();
	},
	prevSong() {
		if (this.currentIndex <= 0) {
			this.currentIndex = this.songs.length - 1;
		} else {
			this.currentIndex--;
		}
		this.loadCurrentSong();
		this.render();
	},
	playRandomSong() {
		let newIndex;
		do {
			newIndex = Math.floor(Math.random() * this.songs.length);
		} while (newIndex === this.currentIndex);
		this.currentIndex = newIndex;
		this.loadCurrentSong();
		this.render();
	},
	songIntoView() {
		setTimeout(() => {
			$(".song-item.active-song").scrollIntoView({
				behavior: "smooth",
				block: "center",
			});
		}, 200);
	},
	loadCurrentSong() {
		imageSong.src = this.currentSong.image;
		audio.src = this.currentSong.path;
		nameSong.textContent = this.currentSong.name;
	},
	renderRecently(input) {
		let htmls = input.reverse().map((item) => {
			return `
			<div 
        class="d-flex rounded g-col-12 user-select-none cursor-pointer align-content-center py-3 songs-recently-item">
        <div class="icon cd-thumb d-none d-md-block">
          <img class="img-fluid rounded-2 shadow" src="${item.image}" alt="">
        </div>
        <div class="text-truncate d-flex flex-column flex-grow-1 flex-shrink-1 ms-3 justify-content-center pe-2">
          <h6 class="fs-6 m-0">${item.name}</h6>
          <p class="text-truncate m-0 fs-7 text-gray">${item.singer}</p>
        </div>
        <div class="d-flex gap-2 align-items-center flex-shrink-0">
          <span class="d-flex align-items-center">
            <ion-icon class="fs-4" name="play-circle-sharp"></ion-icon>
          </span>
          <span class="d-flex align-items-center">
            <ion-icon class="fs-6" name="ellipsis-horizontal-sharp"></ion-icon>
          </span>
        </div>
      </div>
			`;
		});
		$(".songs-recently").innerHTML = htmls.join("\n");
	},
	loadRecentlyList() {
		let check = recentlyLists.every((item, index) => {
			return (
				JSON.stringify(item) !== JSON.stringify(this.songs[this.currentIndex])
			);
		});
		if (check) {
			if (recentlyLists.length >= 3) {
				recentlyLists.shift();
			}
			recentlyLists.push(this.songs[this.currentIndex]);
		}
		const unique = [...new Set(recentlyLists)];
		this.renderRecently(unique);
	},
	handleSlide() {
		// slideWrapper.onclick = () => {
		// 	slideMain.style =`transform : translateX(0px) `
		// };
	},
	loadConfig() {
		this.isRandom = this.config.isRandom || Boolean(false);
		this.isRepeatSong = this.config.isRepeatSong || Boolean(false);
	},
	start() {
		this.loadConfig();
		repeatBtn.classList.toggle("active-btn", this.isRepeatSong);
		randomBtn.classList.toggle("active-btn", this.isRandom);
		this.defineProperties();
		this.loadCurrentSong();
		this.handleEvent();
		this.render();
		this.loadRecentlyList();
		this.handleSlide();
	},
};
function music() {
	app.start();
}

export default music;
