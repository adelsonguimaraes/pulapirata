class onBoard {
    constructor() {
        this.bootstrap()
    }

    async bootstrap() {
        await this.render()

        this.FLOAT_BTN_LABEL = document.querySelector('.on_board .float_btn label')
        this.LIST = document.querySelector('.on_board .board .list')
    }

    async render() {
        const response = await fetch('./views/components/on_board/on_board.html').then(e => e.text())
        const div = document.createElement('div')
        div.innerHTML = response
        document.body.append(div)
    }

    setPlayers(rooms) {
        this.DATA = rooms
        let list = ''
        let total = 0

        this.DATA.forEach(r => r.room_players.forEach(e => {

            if (e.user_id.toString().indexOf('bot')===-1) {
                const _name = e.user_name
                const _status = (e.room_id === 'lobby') ? 'status_av' : 'status_oc'
                const _location = (e.room_id === 'lobby') ? 'LOBBY' : 'JOGANDO'

                list += `
                    <li>
                        <span class="material-icons ${_status}">
                            account_circle
                        </span>
                        <label>${_name} (${_location})</label>
                    </li>
                `

                total++
            }
        }));

        this.FLOAT_BTN_LABEL.innerText = `${("0" + total).slice(-2)}`
        this.LIST.innerHTML = list
    }
 }