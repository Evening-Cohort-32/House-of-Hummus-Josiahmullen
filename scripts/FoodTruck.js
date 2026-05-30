import { BaseDishOptions } from './BaseDishOptions.js'
import { VegetableOptions } from './VegetableOptions.js'
import { SideOptions } from './SideOptions.js'
import { saveOrder, getOrders } from './OrderService.js'

const container = document.querySelector('#container')

// in-memory transient selection
const selection = {
    baseDishId: null,
    vegetableId: null,
    sideId: null
}

const render = async () => {
    const baseDishOptionsHTML = await BaseDishOptions()
    const vegetableOptionsHTML = await VegetableOptions()
    const sideOptionsHTML = await SideOptions()

    const composedHTML = `
        <h1>Laura Kathryn's House of Hummus</h1>

        <article class="choices">
            <section class="choices__metals options">
                <h2>Base Dish</h2>
                ${baseDishOptionsHTML}
            </section>

            <section class="choices__sizes options">
                <h2>Vegetable</h2>
                ${vegetableOptionsHTML}
            </section>

            <section class="choices__styles options">
                <h2>Sides</h2>
                ${sideOptionsHTML}
            </section>
        </article>

        <article class="order">
            <button id="placeOrderBtn">Purchase Combo</button>
            <div id="orderMessage"></div>
        </article>

        <article class="customOrders">
            <h2>Monthly Sales</h2>
            <div id="ordersList"></div>
        </article>
    `

    container.innerHTML = composedHTML

    // attach direct listeners to inputs
    const baseDishInputs = container.querySelectorAll("input[name='baseDish']")
    const vegetableInputs = container.querySelectorAll("input[name='vegetable']")
    const sideInputs = container.querySelectorAll("input[name='side']")

    const placeBtn = document.getElementById('placeOrderBtn')
    const messageDiv = document.getElementById('orderMessage')
    const ordersList = document.getElementById('ordersList')

    if (placeBtn) placeBtn.disabled = true

    const updatePlaceButtonState = () => {
        if (!placeBtn) return
        placeBtn.disabled = !(selection.baseDishId && selection.vegetableId && selection.sideId)
    }

    baseDishInputs.forEach(i => i.addEventListener('change', (e) => {
        selection.baseDishId = parseInt(e.target.value)
        updatePlaceButtonState()
    }))
    vegetableInputs.forEach(i => i.addEventListener('change', (e) => {
        selection.vegetableId = parseInt(e.target.value)
        updatePlaceButtonState()
    }))
    sideInputs.forEach(i => i.addEventListener('change', (e) => {
        selection.sideId = parseInt(e.target.value)
        updatePlaceButtonState()
    }))

    placeBtn.addEventListener('click', async () => {
        messageDiv.innerText = ''

        if (!selection.baseDishId || !selection.vegetableId || !selection.sideId) {
            messageDiv.innerText = 'Please choose a base dish, vegetable, and side before placing an order.'
            return
        }

        const newOrder = await saveOrder({
            metalId: selection.baseDishId,
            sizeId: selection.vegetableId,
            styleId: selection.sideId
        })

        messageDiv.innerText = `Order placed! Order #${newOrder.id} — $${newOrder.totalPrice.toFixed(2)} (${newOrder.metalName}, ${newOrder.sizeLabel}, ${newOrder.styleName})`
        renderOrders()
    })

    const renderOrders = () => {
        const orders = getOrders()
        if (!orders.length) {
            ordersList.innerHTML = '<div>No orders yet</div>'
            return
        }

        ordersList.innerHTML = orders.map(o => `
            <div class="orderItem">Order #${o.id} — ${o.timestamp} — $${(o.totalPrice || 0).toFixed(2)} — ${o.metalName || ''} / ${o.sizeLabel || ''} / ${o.styleName || ''}</div>
        `).join('')
    }

    renderOrders()
}

const start = async () => {
    try {
        await render()
    } catch (error) {
        console.error('App failed to start:', error)
        if (container) container.innerHTML = `<div class="error">App failed to start: ${error.message}</div>`
    }
}

start()
