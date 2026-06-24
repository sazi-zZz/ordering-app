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
                    <button class="payment-btn" data-total-price="${totalPrice}">Pay & Place Order</button>
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


document.getElementById('order-container').addEventListener('click', function (e) {
    // removing items
    if (e.target.classList.contains('remove-item-btn')) {
        const itemName_r = e.target.dataset.itemName

        const currentStorage_r = JSON.parse(localStorage.getItem('orderItems'))

        const newCurrentStorage = currentStorage_r.filter((item) => {
            return item.name !== itemName_r
        })

        localStorage.setItem('orderItems', JSON.stringify(newCurrentStorage))

        renderOrderItems(JSON.parse(localStorage.getItem('orderItems')))
    }

    // payment 
    if (e.target.classList.contains('payment-btn')) {
        const totalPrice = e.target.dataset.totalPrice
        if (totalPrice > 0) {
            document.getElementById('card-details').style.display = "flex"
            document.getElementById("card-details").innerHTML = `
                <div id="card-details-heading">
                    <h2>Enter Card Details</h2>
                </div>
                <form id="card-details-form" action="#">
                    <input type="text" name="cardHolder" id="cardHolder" placeholder="Card Holder's Name..." required>
                    <input type="text" name="cardNumber" id="cardNumber" placeholder="Car Number..." required>
                    <input type="text" name="cvc" id="cvc" placeholder="CVC..." required>
                    <button type="submit" class="final-pay" data-total-price="${totalPrice}">Pay $${totalPrice}</button>
                    <button type="button" class="remove-modal">Cancel</button>
                </form>
            `
        } else {
            document.getElementById('card-details').style.display = "flex"
        }
    }
})

document.getElementById('card-details').addEventListener('click', function (e) {
    // final payment process
    if (e.target.classList.contains('final-pay')) {
        const totalPrice = e.target.dataset.totalPrice
        document.getElementById('card-details-form').addEventListener('submit', (e) => {
            e.preventDefault()
            console.log('paid!')

            document.getElementById("card-details").innerHTML = `
                        <h4 id="payment-ongoing">
                            Payment of $${totalPrice} is in Progress...
                        </h4>
                    `

            setTimeout(() => {
                document.getElementById("card-details").innerHTML = `<h4 id="payment-done">
                            Payment of $${totalPrice} is Completed!
                            </h4>`

                setTimeout(() => {
                    document.getElementById('card-details').style.display = "none"
                    document.getElementById('order-container').innerHTML = `
                        <div id="success-message">
                            <h3>
                                Your Order is Comming!!
                            </h3>
                        </div>
                `
                    localStorage.setItem("orderItems", JSON.stringify([]))
                }, 3000);

            }, 3000);
        })
    }

    // cancel payment
    if (e.target.classList.contains('remove-modal')) {
        document.getElementById('card-details').style.display = "none"
    }
})