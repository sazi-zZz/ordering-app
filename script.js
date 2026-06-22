import { items } from '/items.js'

// renders the items 
export function renderItems() {
    function returnItemsString(itemsArray) {
        return itemsArray.map((item) => {
            return `
            <div class="item">
                    <div class="item-info">
                        <div class="item-image">
                            <img src="img/${item.image}" alt="${item.image}">
                        </div>
                        <div class="item-desc">
                            <h2>${item.name}</h2>
                            <p>${item.description.join(', ')}</p>
                            <h3>$${item.price}</h3>
                        </div>
                    </div>
                    <div class="add-item-btn">
                        <button class="add-item-btn-in" data-item-name="${item.name}">+</button>
                    </div>
            </div>
        `
        }).join('')
    }

    document.getElementById('item-container').innerHTML = returnItemsString(items)
}
renderItems()

// on visit/reload storage checking
if (localStorage.getItem('orderItems') && JSON.parse(localStorage.getItem('orderItems')).length > 0) {
    renderOrderItems(JSON.parse(localStorage.getItem('orderItems')))
} else {
    localStorage.setItem('orderItems', JSON.stringify([]))
}

function renderOrderItems(orderItems) {
    let totalPrice = 0

    if (orderItems.length > 0) {
        totalPrice = orderItems.map((item) => {
            return item.price
        }).reduce((total, price) => {
            return total + price
        })
    }


    const orderContainer = document.getElementById('order-container')

    const orderListPre = `<div id="order-heading">
                    <h2>Your Order</h2>
                </div>
                <div id="order-list">
    `
    const orderListEnd = `
        </div>

                <hr id="order-list-end-divider">

                <!-- total order -->
                <div id="total-order">
                    <div id="total-heading">
                        <strong>Total: </strong>
                    </div>

                    <div id="total-price">
                        <strong>$${totalPrice}</strong>
                    </div>
                </div>

                <div id="place-order-btn">
                    <button data-total-price="${totalPrice}">Pay & Place Order</button>
                </div>
    `

    const orderList = orderItems.map((item) => {
        return `
            <div class="order-item">
                 <div class="order-item-name">
                    <strong>${item.name}</strong>
                    <small class="remove-item-btn" data-item-name="${item.name}">(remove item)</small>
                </div>
                <div class="order-item-price">
                    $${item.price}
                </div>
            </div>
        `
    }).join('')

    orderContainer.innerHTML = orderListPre + orderList + orderListEnd
}

// adding new items 
document.getElementById('item-container').addEventListener('click', function (e) {
    if (e.target.classList.contains('add-item-btn-in')) {
        const itemName = e.target.dataset.itemName

        const newItem = items.filter((item) => {
            return item.name === itemName
        })[0]

        let currentStorage = JSON.parse(localStorage.getItem('orderItems'))

        currentStorage.push(newItem)

        localStorage.setItem('orderItems', JSON.stringify(currentStorage))

        renderOrderItems(JSON.parse(localStorage.getItem('orderItems')))
    }
})

// removing items 
document.getElementById('order-container').addEventListener('click', function (e) {
    if (e.target.classList.contains('remove-item-btn')) {
        const itemName_r = e.target.dataset.itemName

        const currentStorage_r = JSON.parse(localStorage.getItem('orderItems'))

        const newCurrentStorage = currentStorage_r.filter((item) => {
            return item.name !== itemName_r
        })

        console.log(currentStorage_r)

        localStorage.setItem('orderItems', JSON.stringify(newCurrentStorage))

        console.log(newCurrentStorage)

        renderOrderItems(JSON.parse(localStorage.getItem('orderItems')))
    }

})