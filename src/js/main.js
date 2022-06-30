const swiper = new Swiper('.content-swiper', {
  
    // If we need pagination
    pagination: {
      el: '.swiper-pagination',
    },
  
    // Navigation arrows
    navigation: {
      nextEl: '.swiper-next',
      prevEl: '.swiper-prev',
    },

  //   // Responsive breakpoints
    breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1.1,
      spaceBetween: 20
    },
    // when window width is >= 480px
    480: {
      slidesPerView: 1.1,
      spaceBetween: 30
    },

    768: {
        slidesPerView: 1.2,
        spaceBetween: 30
    },

    1200:{
        slidesPerView: 2,
        spaceBetween: 30
    }

  }
  });



  // select

  const getTemplate = (data = [], placeholder, selectedId) => {
    let text = placeholder ?? 'placeholder не указан'

    const items = data.map(item => {
        let cls = ''
        if (item.id === selectedId) {
            text = item.value
            cls = 'selected'
        }
        return `
            <li class="select__item ${cls}" data-type="item" data-id="${item.id}">${item.value}</li>
        `
    })
    return `
        <input type="hidden" class="hidden__input">
        <div class="select__backdrop" data-type="backdrop"></div>
        <div class="select__input" data-type="input">
            <span data-type="value">${text}</span>
            <img src="./img/down-arrow.svg" alt="arrow" data-type="arrow" class="select__arrow">
        </div>
        <div class="select__dropdown">
            <ul class="select__list">
                ${items.join('')}
            </ul>
        </div>
    `
}
class Select {
    constructor(selector, options) {
        this.$el = document.querySelector(selector)
        this.options = options
        this.selectedId = options.selectedId

        this.render()
        this.setup()
    }

    render() {
        const { placeholder, data } = this.options
        this.$el.classList.add('select')
        this.$el.innerHTML = getTemplate(data, placeholder, this.selectedId)
    }
    setup() {
        this.clickHandler = this.clickHandler.bind(this)
        this.$el.addEventListener('click', this.clickHandler)
        this.$arrow = this.$el.querySelector('[data-type="arrow"]')
        this.$value = this.$el.querySelector('[data-type="value"]')
    }

    clickHandler(event) {
        const { type } = event.target.dataset
        if (type === 'input') {
            this.toggle()
        } else if (type === 'item') {
            const id = event.target.dataset.id
            this.select(id)
        }  else if (type === 'backdrop') {
            this.close()
        }
    }

    get isOpen() {
        return this.$el.classList.contains('open')
    }

    get current() {
        return this.options.data.find(item => item.id === this.selectedId)
    }

    select(id) {
        this.selectedId = id
        this.$value.textContent = this.current.value

        this.$el.querySelectorAll(`[data-type="item"]`).forEach( el => el.classList.remove('selected'))
        this.$el.querySelector(`[data-id="${id}"]`).classList.add('selected')

        this.options.onSelect ? this.options.onSelect(this.current) : null
        this.close()
    }

    toggle() {
        this.isOpen ? this.close() : this.open()
    }

    open() {
        this.$el.classList.add('open')
        this.$arrow.classList.add('open')
    }

    close() {
        this.$el.classList.remove('open')
        this.$arrow.classList.remove('open')
    }

    destroy() {
        this.$el.removeEventListener('click', this.clickHandler)
        this.$el.innerHTML = ''
    }
}


// Инициализация плагина
const select = new Select('#select', {
    placeholder: 'Выберите элемент',
    selectedId: '1',
    data: [
        {id: '1', value: 'Вольфганг'},
        {id: '2', value: 'no name'},
    ],
    onSelect(item) {
        const input = document.querySelector('.hidden__input')
        input.value = item.value
    } 
})

const select2 = new Select('#select2', {
    placeholder: 'Выберите элемент',
    selectedId: '1',
    data: [
        {id: '1', value: '+7 910 234-56-78'},
        {id: '2', value: '+7 000 000 00 00'},
    ],
    onSelect(item) {
        const input = document.querySelector('.hidden__input')
        input.value = item.value
    } 
})


// popap

// Модальное окно
function bindModal(trigger, modal, close) {
    trigger = document.querySelector(trigger),
      modal = document.querySelector(modal),
      close = document.querySelector(close)
  
    const body = document.body
  
    trigger.addEventListener('click', e => {
      e.preventDefault()
      modal.style.display = 'flex'
      body.classList.add('locked')
    });
    close.addEventListener('click', () => {
      modal.style.display = 'none'
       body.classList.remove('locked')
    });
    modal.addEventListener('click', e => {
      if (e.target === modal) {
        modal.style.display = 'none'
         body.classList.remove('locked')
      }
    })
  }
  
  // ПЕРВЫЙ аргумент - класс кнопки, при клике на которую будет открываться модальное окно.
  // ВТОРОЙ аргумент - класс самого модального окна.
  // ТРЕТИЙ аргумент - класс кнопки, при клике на которую будет закрываться модальное окно.
  bindModal('.btn-popap', '.modal__wrapper', '.modal__body-btn')