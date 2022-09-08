window.musicBox = {
    MUSIC_BOX: null,
    HEADER: null,
    BODY: null,
    LABEL: null,
    AUDIO: null,
    PLAY_PAUSE_BTN: null,
    PLAY_PAUSE_ICON: null,
    PREV_BTN: null,
    NEXT_BTN: null,
    VOL_MUTE_BTN: null,
    VOL_MUTE_ICON: null,
    VOL_SEEKBAR: null,
    DURATION_SEEKBAR: null,
    CURRENT_DURATION: null,
    TOTAL_DURATION: null,
    LABEL_DATA: null,
    VOL_INIT: 12,
    MUSIC_DATA: [],
    CURRENT_DATA: {},
    CURRENT_PLAYING: 0,
    async start() {
        await this.mountHtml()

        setTimeout(() => {
            this.random()
            // this.MUSIC_DATA = musicData

            this.toggle()
            this.update()

            this.setVolume(this.VOL_INIT)
            this.VOL_SEEKBAR.value = this.VOL_INIT

            this.PLAY_PAUSE_BTN.onclick = (_) => this.playToggle()
            this.PREV_BTN.onclick = (_) => this.prev()
            this.NEXT_BTN.onclick = (_) => this.next()

            this.VOL_MUTE_BTN.onclick = (e) => this.muteToggle(e)
            this.AUDIO.onended = (_) => this.next()
            this.VOL_SEEKBAR.oninput = (e) => this.setVolume(e.target.value)
            this.AUDIO.ontimeupdate = (_) => this.setCurrentDuration()
            this.DURATION_SEEKBAR.oninput = (e) => this.setCurrentTime(e.target.value)
        }, 500)
    },
    random() {
        const list = []
        while(list.length < musicData.length) {
            const index = Math.floor(Math.random() * musicData.length)
            const i = list.findIndex(e => e == musicData[index])
            if (i==-1) list.push(musicData[index])
        }

        this.MUSIC_DATA = list
    },
    prev() {
        this.CURRENT_PLAYING--;
        if (this.CURRENT_PLAYING == -1) this.CURRENT_PLAYING = this.MUSIC_DATA.length-1
        this.update()
    },
    next() {
        this.CURRENT_PLAYING++;
        if (this.CURRENT_PLAYING == this.MUSIC_DATA.length) this.CURRENT_PLAYING = 0
        this.update()
    },
    update() {
        this.LABEL_DATA.innerText = `${("0" + (this.CURRENT_PLAYING+1)).slice(-2)}/${("0" + this.MUSIC_DATA.length).slice(-2)}`

        this.CURRENT_DATA = this.MUSIC_DATA[this.CURRENT_PLAYING]

        this.BODY.style.backgroundImage = `url("${this.CURRENT_DATA.image}")`
        this.LABEL.innerHTML = `${this.CURRENT_DATA.author} - ${this.CURRENT_DATA.title}`
        this.AUDIO.src = this.CURRENT_DATA.audio

        this.AUDIO.onloadeddata = (_) => {
            this.TOTAL_DURATION.innerText = this.secondsToMinutes(this.AUDIO.duration)
            this.DURATION_SEEKBAR.max = this.AUDIO.duration
        }
        
    },
    playToggle() {
        if (this.AUDIO.paused) {
            this.AUDIO.play()
            this.PLAY_PAUSE_ICON.innerHTML = 'pause_arrow'
         }else{ 
            this.AUDIO.pause()
            this.PLAY_PAUSE_ICON.innerHTML = 'play_arrow'
         }
    },
    muteToggle(e) {
        if (e.target.nodeName != 'I') return false

        if (this.AUDIO.muted) {
            this.AUDIO.muted = false
            this.VOL_MUTE_ICON.innerHTML = 'volume_up';
        }else{
            this.AUDIO.muted = true
            this.VOL_MUTE_ICON.innerHTML = 'volume_off';
        }
    },
    setVolume(value) {
        this.AUDIO.volume = value / 100
    },
    setCurrentDuration() {
        this.CURRENT_DURATION.innerText = this.secondsToMinutes(this.AUDIO.currentTime)
        this.DURATION_SEEKBAR.value = this.AUDIO.currentTime
    },
    setCurrentTime(value) {
        this.AUDIO.currentTime = value;
    },
    toggle() {
        this.HEADER.addEventListener('click', (_) => {
            Array.from(this.MUSIC_BOX.classList).indexOf('show-music-box') == -1 ?
                this.MUSIC_BOX.closest('.music-box').classList.add('show-music-box') :
                this.MUSIC_BOX.closest('.music-box').classList.remove('show-music-box')
        })
    },
    secondsToMinutes(time) {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${("0" + minutes).slice(-2)}:${("0" + seconds).slice(-2)}`
    },
    async mountHtml() {
        const div = document.createElement('div')
        const result = await fetch('./views/components/music_box/music_box.html');
        div.innerHTML = await result.text()

        document.body.append(div)
        this.bootstrap()
    },
    bootstrap() {
        const box_css = document.createElement('link')
        box_css.rel="stylesheet"
        box_css.type = "text/css"
        box_css.href = "views/components/music_box/music_box.css"
        
        const material = document.createElement('link')
        material.rel="stylesheet"
        material.type = "text/css"
        material.href = "https://fonts.googleapis.com/icon?family=Material+Icons"

        document.head.append(box_css)
        document.head.append(material)

        const md = document.createElement('script')
        md.src = "views/components/music_box/music_data.js"

        document.head.append(md)

        this.MUSIC_BOX = document.querySelector('.music-box')
        this.HEADER = document.querySelector('.music-box .header')
        this.BODY = document.querySelector('.music-box .body')
        this.LABEL = document.querySelector('.music-box .footer .title label')
        this.AUDIO = document.querySelector('.music-box .footer audio')
        this.PLAY_PAUSE_BTN = document.querySelector('.music-box .body .controls .play_pause')
        this.PLAY_PAUSE_ICON = document.querySelector('.music-box .body .controls .play_pause i')
        this.PREV_BTN = document.querySelector('.music-box .body .controls .prev')
        this.NEXT_BTN = document.querySelector('.music-box .body .controls .next')
        this.VOL_MUTE_BTN = document.querySelector('.music-box .footer .vol-mute')
        this.VOL_MUTE_ICON = document.querySelector('.music-box .footer .vol-mute i')
        this.VOL_SEEKBAR = document.querySelector('.music-box .footer .controls .vol-seekbar input')
        this.DURATION_SEEKBAR = document.querySelector('.music-box .footer .controls .duration_seekbar input')
        this.CURRENT_DURATION = document.querySelector('.music-box .footer .controls .current-duration')
        this.TOTAL_DURATION = document.querySelector('.music-box .footer .controls .total-duration')
        this.LABEL_DATA = document.querySelector('.music-box .header label')
    }
}