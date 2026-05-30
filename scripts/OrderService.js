import { getCollection } from './DataService.js'

export const saveOrder = async (order) => {
    const [metals, sizes, styles] = await Promise.all([
        getCollection('baseDishes'),
        getCollection('vegetables'),
        getCollection('sides')
    ])

    const metal = metals.find(m => m.id === order.metalId) || null
    const size = sizes.find(s => s.id === order.sizeId) || null
    const style = styles.find(st => st.id === order.styleId) || null

    const totalPrice = [metal, size, style].reduce((sum, item) => sum + (Number(item?.price || 0)), 0)

    const detailedOrder = {
        ...order,
        metalName: metal?.metal || null,
        sizeLabel: size ? `${size.carets}` : null,
        styleName: style?.style || null,
        totalPrice
    }

    const raw = localStorage.getItem('kneel_orders')
    const orders = raw ? JSON.parse(raw) : []
    const id = orders.length ? orders[orders.length - 1].id + 1 : 1
    const timestamp = new Date().toISOString()

    const newOrder = { id, timestamp, ...detailedOrder }
    orders.push(newOrder)
    localStorage.setItem('kneel_orders', JSON.stringify(orders))

    return newOrder
}

export const getOrders = () => {
    const raw = localStorage.getItem('kneel_orders')
    return raw ? JSON.parse(raw) : []
}
