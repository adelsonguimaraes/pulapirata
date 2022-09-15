class onBoard {
    constructor(emitMessage, user_id) {
        this.CHATS = []
        this.bootstrap()
        this.emitMessage = emitMessage
        this.user_id = user_id
    }

    async bootstrap() {
        await this.render()

        this.ON_BOARD = document.querySelector('.on_board')
        this.BOARD = document.querySelector('.on_board .board')
        this.FLOAT_BTN = document.querySelector('.on_board .float_btn')
        this.FLOAT_BTN_LABEL = document.querySelector('.on_board .float_btn .online_count')
        this.BADGE = document.querySelector('.on_board .float_btn .badge')

        this.CHAT = document.querySelector('.on_board .chat')
        this.CHAT_TITLE = document.querySelector('.on_board .chat .title div')
        this.LIST = document.querySelector('.on_board .board .list')
        this.CHAT_LIST = document.querySelector('.on_board .chat .list')

        this.CHAT_FOOTER_INPUT = document.querySelector('.on_board .chat .footer input')
        this.CHAT_FOOTER_BTN = document.querySelector('.on_board .chat .footer a')

        this.BOARD_CLOSE_BTN = document.querySelector('.on_board .cancel_btn')

        this.events()
    }

    async render() {
        const box_css = document.createElement('link')
        box_css.rel="stylesheet"
        box_css.type = "text/css"
        box_css.href = "views/components/on_board/on_board.css"


        let material = document.querySelector('link[href*="Material+Icons"]')
        if (!material) {
            material = document.createElement('link')
            material.rel="stylesheet"
            material.type = "text/css"
            material.href = "https://fonts.googleapis.com/icon?family=Material+Icons"
        }

        document.head.append(box_css)
        document.head.append(material)

        const response = await fetch('./views/components/on_board/on_board.html').then(e => e.text())
        const div = document.createElement('div')
        div.innerHTML = response
        document.body.append(div)
    }

    events() {
        setTimeout(() => {
            this.FLOAT_BTN.onclick = (_) => {
                this.FLOAT_BTN.classList.add('float_btn_active')
                this.CHAT.classList.remove('chat_show')
                this.ON_BOARD.classList.add('on_board_show')
            }
            this.BOARD_CLOSE_BTN.onclick = (_) => {this.ON_BOARD.classList.remove('on_board_show')}


            this.CHAT_FOOTER_INPUT.onkeypress = (e) => {
                if (e.key == 'Enter') {
                    this.sendMessage(this.CHAT_FOOTER_INPUT.value)
                }
            }

            this.CHAT_FOOTER_BTN.onclick = (_) => this.sendMessage( this.CHAT_FOOTER_INPUT.value)

        }, 500)
    }

    setPlayers(rooms) {
        this.ROOMS = rooms
        let total = 0

        this.LIST.innerHTML = ''

        this.ROOMS.forEach(r => r.room_players.forEach(e => {

            if (e.user_id.toString().indexOf('bot')===-1) {
                const _name = e.user_name
                const _status = (e.room_id === 'lobby') ? 'status_av' : 'status_oc'
                let _location = (e.room_id === 'lobby') ? '(LOBBY)' : '(JOGANDO)'

                const li = document.createElement('li')
                li.id = 'user_' + e.user_id

                if (e.user_id == this.user_id) {
                    _location = ''
                }else{
                    li.onclick = () => {this.openChat(e)}
                }

                const i = document.createElement('i')
                i.classList.add('material-icons')
                i.classList.add(_status)
                i.innerHTML = 'account_circle'
                const label = document.createElement('label')
                label.innerText = `${_name} ${_location}`
                const div = document.createElement('div')
                div.classList.add('badge')

                li.append(i)
                li.append(label)
                li.append(div)

                this.LIST.append(li)

                this.addChat(e)

                total++
            }
        }));

        this.FLOAT_BTN_LABEL.innerText = `${("0" + total).slice(-2)}`
    }

    addChat(user) {
        if (this.CHATS.find(e => parseInt(e.id) == parseInt(user.user_id)) == undefined) {
            this.CHATS.push({
                'id': user.user_id,
                'name':user.user_name,
                'messages': []
            })
        }
    }

    openChat(user) {
        let chat = this.CHATS.find(e => e.id == user.user_id)

        this.CHAT_LIST.innerHTML = ''
        chat.messages.forEach(msg => {
            this.showMessage(msg.message, msg.me)
        })

        this.CHAT_TITLE.id = user.user_id
        this.CHAT_TITLE.innerText = user.user_name    
        this.CHAT.classList.add('chat_show')

        this.removeBadge(user.user_id)
    }

    showMessage(msg, me = false) {
        const li = document.createElement('li')
        const div = document.createElement('div')
        div.innerText = msg
        div.classList.add('msg')
        if (me) div.classList.add('me')
        li.append(div)

        this.CHAT_LIST.append(li)
        this.CHAT_LIST.scrollTo(0, this.CHAT_LIST.scrollHeight)
    }

    sendMessage(msg) {
        const chat = this.CHATS.find(e => e.id == this.CHAT_TITLE.id)
        chat.messages.push({message: msg, me: true})

        this.showMessage(msg, true)

        this.emitMessage(this.CHAT_TITLE.id, msg)
        this.CHAT_FOOTER_INPUT.value = ''
    }

    receiveMessage(msg, user_id) {
        const chat = this.CHATS.find(e => parseInt(e.id) == parseInt(user_id))
        chat.messages.push({message: msg, me: false})
        this.showBadge(user_id)

        if (parseInt(user_id) === parseInt(this.CHAT_TITLE.id)) this.showMessage(msg)
    }

    showBadge(user_id) {
        const li_user = this.LIST.querySelector('#user_' + user_id)
        const badge_user = li_user.querySelector('.badge')

        badge_user.classList.add('badge_show')
        this.BADGE.classList.add('badge_show')
    }

    removeBadge(user_id) {
        const li_user = this.LIST.querySelector('#user_' + user_id)
        const badge_user = li_user.querySelector('.badge')

        badge_user.classList.remove('badge_show')

        const badge_list = this.LIST.querySelectorAll('.badge_show')
        
        if(badge_list.length==0) this.BADGE.classList.remove('badge_show')
    }
 }