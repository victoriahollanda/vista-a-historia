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
    console.log('Tshirt nº ' + key)
    console.log(camisasFlamengoJson[key])

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
        console.log('Adicionar no carrinho')

        let size = select('.tshirtInfo--size.selected').getAttribute('data-key')
        console.log("Tamanho " + size)

        console.log("Quantidade " + qtdTshirts)

        let price = select('.tshirtInfo--actualPrice').innerHTML.replace('R$ ', '')

        let identificator = camisasFlamengoJson[windowKey].id + 't' + size
        let key = cart.findIndex( (tshirt) => tshirt.identificator == identificator)
        console.log(key)

        if (key > -1) {
            cart[key].qt += qtdTshirts
        } else {
            //adiciona tshirt no cart:
            let tshirtInCart = {
                identificator,
                id: camisasFlamengoJson[windowKey].id,
                size,
                qt: qtdTshirts,
                price: parseFloat(price)
            }
            cart.push(tshirtInCart)
            console.log(tshirtInCart)
            console.log('Subtotal R$ ' + (tshirtInCart.qt * tshirtInCart.price))
        }

        closeWindow()
        openCart()
        updateCart()
    })
}

const openCart = () => {
    if (cart.length > 0) {
        select('aside').classList.add('show')
        select('aside').style.left = '0'
    }

    //mobile:
    select('.menu-openner').addEventListener('click', () => {
        if(cart.length > 0) {
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
    console.log("o tamanho do carrinho é: " + cart.length);
    if (cart.length > 0) {
        select('aside').classList.add('show')
        select('.cart').innerHTML = ''

        let subtotal = 0
        let total = 0

        for (let i in cart) {
            let eachTshirt = camisasFlamengoJson.find((tshirt) => tshirt.id == cart[i].id)
            console.log(eachTshirt)

            subtotal += cart[i].price * cart[i].qt
            
            //SUBSTITUIR POR MAP 
            let cartItem = select('.cart--item').cloneNode(true)
            select('.cart').append(cartItem)


            let tshirtSize = cart[i].size
            let tshirtName = `${eachTshirt.model} (${tshirtSize})`

            cartItem.querySelector('img').src = eachTshirt.img
            cartItem.querySelector('.cart--item-nome').innerHTML = tshirtName
            cartItem.querySelector('.cart--item--qt').innerHTML = cart[i].qt

            cartItem.querySelector('.cart--item-qtmais').addEventListener('click', () => {
                console.log('Clicou no botão mais')
                cart[i].qt++
                updateCart()
            })

            cartItem.querySelector('.cart--item-qtmenos').addEventListener('click', () => {
                console.log('Clicou no botão menos')
                if (cart[i].qt > 1) {
                    cart[i].qt--
                } else {
                    cart.splice(i, 1)
                }
                
                (cart.length < 1) ? seleciona('header').style.display = 'flex' : ''

                updateCart()
            })

            select('.cart').append(cartItem)

        }
        
        total=subtotal

        select('.subtotal').innerHTML = subtotal
        select('.total').innerHTML = total
    } else {
        select('aside').classList.remove('show')
		select('aside').style.left = '100vw'

    }
}

const endBuy = () => {
    select('.cart--finalizar').addEventListener('click', () => {
        console.log('Finalizar compra')
        select('aside').classList.remove('show')
        select('aside').style.left = '100vw'
    })
}


let blusas = select('#blusas')
blusas.innerHTML = ''

camisasFlamengoJson.map((tshirt, index) => {
    console.log(index);
    
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
            console.log('Clicou na camisa');
    
            let specificKey = getKey(e);
    
            openWindow();
            
            windowsInfo(camisasFlamengoJson[index]);
            readSizes(specificKey);
            chooseSize(specificKey);
        });
    });
    
    closeButtons()
})


changeQtd()
addToCart()
updateCart()
closeCart()
endBuy()
