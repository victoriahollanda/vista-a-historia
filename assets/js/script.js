//variável contendo o ID da camisa selecionada
let windowKey = 0

//variável contendo a quantidade de camisas selecionadas
let qtdTshirts = 1

//variável para o carrinho
let cart = []

const select = (element) => document.querySelector(element)
const selectAll = (element) => document.querySelectorAll(element)


//windows functions
const openWindow = () => {
    select('.tshirtWindowArea').style.opacity = 0
    select('.tshirtWindowArea').style.display = 'flex'
    setTimeout(() => select('.tshirtWindowArea').style.opacity = 1, 150)
}

const closeWindow = () => {
    select('.tshirtWindowArea').style.opacity = 0
    setTimeout(() => select('.tshirtWindowArea').style.display = 'none', 500)
}

const closeButtons = () => {
    selectAll('.tshirtWindow--cancelButton, .tshirtWindow--cancelButtonMob').forEach((tshirt) => tshirt.addEventListener('click', closeWindow))
}

//windows info for tshirt
const windowsInfo = (tshirt) => {
    select('.tshirtWindowImg img').src = tshirt.img
    select('.tshirtInfo h2').innerHTML = tshirt.model
    select('.tshirtInfo--desc').innerHTML = tshirt.config
    select('.tshirtInfo--actualPrice').innerHTML = `R$ ${tshirt.price}`
}



//set/get keys for Tshirt:
const getKey = (event) => {
    let key = event.target.closest('.each-tshirt').getAttribute('data-key')


    qtdTshirts = 1

    windowKey = key

    return key
}

const readSizes = (key) => {
    select('.tshirtInfo--size.selected').classList.remove('selected')

    selectAll('.tshirtInfo--size').forEach((size, sizeIndex) => {
        (sizeIndex == 3) ? size.classList.add('selected') : ''

    })
}

const chooseSize = (key) => {
    selectAll('.tshirtInfo--size').forEach((size, sizeIndex) => {
        size.addEventListener('click', (event) => {
            select('.tshirtInfo--size.selected').classList.remove('selected')
            size.classList.add('selected')
        })
    })
}

const changeQtd = () => {
    select('.tshirtInfo--qtdmore').addEventListener('click', () => {
        qtdTshirts++
        select('.tshirtInfo--qtd').innerHTML = qtdTshirts
    })

    select('.tshirtInfo--qtdless').addEventListener('click', () => {
        if (qtdTshirts > 1) {
            qtdTshirts--
            select('.tshirtInfo--qtd').innerHTML = qtdTshirts
        }
    })

}

// cart functions
const addToCart = () => {
    select('.tshirtInfo--addButton').addEventListener('click', () => {


        let size = select('.tshirtInfo--size.selected').getAttribute('data-key')
        let price = select('.tshirtInfo--actualPrice').innerHTML.replace('R$ ', '')
        let identificator = camisasFlamengoJson[windowKey].id + 't' + size
        let key = cart.findIndex((tshirt) => tshirt.identificator == identificator)

        if (key > -1) {
            cart[key].qt += qtdTshirts
        } else {
            //adiciona tshirt no cart:
            let tshirtInCart = {
                identificator,
                id: camisasFlamengoJson[windowKey].id,
                size: 'Tam: ' + size,
                qt: qtdTshirts,
                model: camisasFlamengoJson[windowKey].model + ' (' + camisasFlamengoJson[windowKey].cup + ')',
                img: camisasFlamengoJson[windowKey].img,
                subtotal: qtdTshirts * parseFloat(price),
            }
            cart.push(tshirtInCart)
            console.log(tshirtInCart)
            console.log('Subtotal R$ ' + (tshirtInCart.subtotal))

        }

        closeWindow()
        openCart()
        updateCart()
        gerarCarrinho()

    })
}

const openCart = () => {
    if (cart.length > 0) {
        select('aside').classList.add('show')
        select('aside').style.left = '0'
    }

    //mobile:
    select('.menu-openner').addEventListener('click', () => {
        if (cart.length > 0) {
            select('aside').classList.add('show')
            select('aside').style.left = '0'
        }
    })
}

const closeCart = () => {
    select('.menu-closer').addEventListener('click', () => {
        select('aside').style.left = '100vw'
    })
}

const updateCart = () => {
    if (cart.length > 0) {
        const cartContainer = select('.cart')
        cartContainer.innerHTML = ''

        let subtotal = 0
        let total = 0

        for (let i = 0; i < cart.length; i++) {
            const eachTshirt = camisasFlamengoJson.find((tshirt) => tshirt.id == cart[i].id)

            subtotal += cart[i].price * cart[i].qt //tentar trocar por subtotal += cart[i].subtotal 

            const tshirtName = `${cart[i].model} ${cart[i].size}`


            const cartItem = document.createElement('div');
            cartItem.classList.add('cart--item');

            const imgElement = document.createElement('img');
            imgElement.src = eachTshirt.img;
            cartItem.appendChild(imgElement);

            const nomeElement = document.createElement('div');
            nomeElement.classList.add('cart--item-nome');
            nomeElement.innerHTML = tshirtName;
            cartItem.appendChild(nomeElement);

            const qtAreaElement = document.createElement('div');
            qtAreaElement.classList.add('cart--item--qtarea');

            const qtMenosButton = document.createElement('button');
            qtMenosButton.classList.add('cart--item-qtmenos');
            qtMenosButton.innerHTML = '-';
            qtMenosButton.addEventListener('click', () => {
                if (cart[i].qt > 1) {
                    cart[i].qt--;
                    cart[i].subtotal = cart[i].qt * parseFloat(eachTshirt.price);
                    updateCart(); // Update the cart after modifying quantity
                } else {
                    cart.splice(i, 1);
                    updateCart(); // Update the cart after removing an item
                }
            });
            qtAreaElement.appendChild(qtMenosButton);

            const qtElement = document.createElement('div');
            qtElement.classList.add('cart--item--qt');
            qtElement.innerHTML = cart[i].qt;
            qtAreaElement.appendChild(qtElement);

            const qtMaisButton = document.createElement('button');
            qtMaisButton.classList.add('cart--item-qtmais');
            qtMaisButton.innerHTML = '+';
            qtMaisButton.addEventListener('click', () => {
                cart[i].qt++;
                cart[i].subtotal = cart[i].qt * parseFloat(eachTshirt.price);
                updateCart(); // Update the cart after modifying quantity
            });
            qtAreaElement.appendChild(qtMaisButton);

            cartItem.appendChild(qtAreaElement);
            cartContainer.appendChild(cartItem);
        }

        total += subtotal; //tentar só =

        select('.subtotal').innerHTML = subtotal.toFixed(2); // Assuming two decimal places for display
        select('#totalSpace').innerHTML = total.toFixed(2); // Assuming two decimal places for display

        select('aside').classList.add('show');
        select('aside').style.left = '0';
    } else {
        select('aside').classList.remove('show');
        select('aside').style.left = '100vw';
    }
}

            

const endBuy = () => {
    select('.cart--finalizar').addEventListener('click', () => {

        select('aside').classList.remove('show')
        select('aside').style.left = '100vw'
    })
}


let blusas = select('#blusas')
blusas.innerHTML = ''

// fetch('http://localhost:3000/camisas/flamengo')
// .then(response => response.json())
// .then(data => {


camisasFlamengoJson.map((tshirt, index) => {
    let eachTshirt = `<div class="each-tshirt col-md-6 col-sm-6" data-key="${index}">
        <div
        class="card-tshirts row g-0 border rounded overflow-hidden flex-md-row mb-4 shadow-sm h-md-250 position-relative">
        <div class="tshirt-item--img col-auto d-none d-lg-block">
            <img class="bd-placeholder-img" width="200" height="250" src="${tshirt.img}" role="img"
            aria-label="Placeholder: Thumbnail" preserveAspectRatio="xMidYMid slice" focusable="false">
            <title>Placeholder</title>
            <rect width="100%" height="100%" fill="#55595c"></rect><text x="50%" y="50%" fill="#eceeef"
            dy=".3em"></text>
        </div>
        <div class="col p-4 d-flex flex-column position-static">
            <h4 class="tshirt-item--name mb-0">${tshirt.model}</h4>
            <div class="tshirt-item--cup mb-1 text-body-secondary">${tshirt.cup}</div>
            <p class="tshirt-item--description card-text mb-auto">${tshirt.description}</p>
            <strong class="tshirt-item--mkt text-decoration-line-through">${'R$ ' + tshirt.mktPrice}</strong>
            <strong class="tshirt-item--price d-inline-block mb-4 text-dark-emphasis">${'R$ ' + tshirt.price}</strong>
            <div class="tshirt-item--link">
            <a href="#" class=" icon-link gap-1 icon-link-hover stretched-link">
                <button type="button" class="btn btn-sm btn-dark"> Compre aqui</button>
            </a>
            </div>
        </div>
        </div>
    </div>`

    blusas.innerHTML += eachTshirt


    blusas.querySelectorAll('.each-tshirt a').forEach((button, index) => {
        button.addEventListener('click', (e) => {
            e.preventDefault();


            let specificKey = getKey(e);

            openWindow();

            windowsInfo(camisasFlamengoJson[index]);
            readSizes(specificKey);
            chooseSize(specificKey);
        });
    });

    closeButtons()
})

function gerarCarrinho() {
    let localCart = select('#local--cart')
    localCart.innerHTML = ''
    cart.map(tshirt => {
        let cartItem = ` <div class="cart--item">
            <img src="${tshirt.img}" />
            <div class="cart--item-nome">${tshirt.model} ${tshirt.size}</div>
            
            <div class="cart--item--qtarea">
              <button class="cart--item-qtmenos">-</button>
              <div class="cart--item--qt">${tshirt.qt}</div>
              <button class="cart--item-qtmais">+</button>
            </div>
          </div>`
        localCart.innerHTML += cartItem
    })

    // let localTotal = select('#cart--details')
    // localTotal.innerHTML = ''
    // cart.map(tshirt => {
    //     let totalCart = `        <div class="cart--totalitem total big">
    //     <span>Total</span>
    //     <span>R$ ${tshirt.subtotal}</span>
    //   </div>
    //   <div class="cart--finalizar">Finalizar a compra</div>`
    //   localTotal.innerHTML = totalCart
    // })
    
}

changeQtd()
addToCart()
updateCart()
closeCart()
endBuy()

//CTRL Z ATÉ AQUI