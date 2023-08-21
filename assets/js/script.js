//variável contendo o ID da camisa selecionada
let windowKey = 0

//variável contendo a quantidade de camisas selecionadas
let qtdTshirts = 1

//variável para o carrinho - colocar no localStorage
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
const updateCartAndOpenCart = () => {
    updateCart(() => {
        openCart();
    });
};

const addToCart = () => {
    select('.tshirtInfo--addButton').addEventListener('click', () => {
        console.log('Adicionar no carrinho')

        let size = select('.tshirtInfo--size.selected').getAttribute('data-key')
        console.log("Tamanho " + size)

        console.log("Quantidade " + qtdTshirts)

        let price = select('.tshirtInfo--actualPrice').innerHTML.replace('R$ ', '')

        let id = camisasFlamengoJson[windowKey].id + 't' + size
        let key = cart.findIndex((tshirt) => tshirt.id == id)
        console.log(key)

        if (key >= 0) {
            cart[key].qt += qtdTshirts
        } else {
            //add tshirt in cart
            let tshirtInCart = {
                id,
                id: camisasFlamengoJson[windowKey].id,
                size,
                qt: qtdTshirts,
                price: parseFloat(price)
            }
            cart = JSON.parse(localStorage.getItem("cart"))
            console.log(cart);
            cart.push(tshirtInCart)
            console.log(tshirtInCart)
            console.log('Sub total R$ ' + (tshirtInCart.qt * tshirtInCart.price))
        }

        //APAGAR ATÉ AQUI
        //Converte array cart em string JSON e armazena no LocalStorage com a key cart
        localStorage.setItem('cart', JSON.stringify(cart))

        updateCartAndOpenCart()
    })
}

const openCart = () => {
    if (cart.length > 0) {
        localStorage.setItem('cartIsOpen', 'true');
        window.location.href = "./carrinho.html";
    }
}

const updateCart = (callback) => {
    const cartIsOpen = localStorage.getItem('cartIsOpen');
    if (cartIsOpen === 'true') {
        // Remove o indicador de carrinho aberto
        localStorage.removeItem('cartIsOpen');

        // Recupera o carrinho do Local Storage
        const cartFromStorage = JSON.parse(localStorage.getItem('cart'));
        if (cartFromStorage && cartFromStorage.length > 0) {
            // Limpa o conteúdo atual do carrinho na página
            const cartContainer = select('.cart');
            cartContainer.innerHTML = '';

            let subtotal = 0;

            // Itera sobre os itens do carrinho e preenche a página
            for (const cartItem of cartFromStorage) {
                const eachTshirt = camisasFlamengoJson.find(tshirt => tshirt.id === cartItem.id);

                const cartItemContainer = document.createElement('div');
                cartItemContainer.classList.add('cart-item');

                const tshirtImage = document.createElement('img');
                tshirtImage.src = eachTshirt.img;
                tshirtImage.alt = eachTshirt.model;
                cartItemContainer.appendChild(tshirtImage);

                const tshirtName = document.createElement('div');
                tshirtName.textContent = `${eachTshirt.model} (${cartItem.size})`;
                cartItemContainer.appendChild(tshirtName);

                const tshirtQuantity = document.createElement('div');
                tshirtQuantity.textContent = `Quantidade: ${cartItem.qt}`;
                cartItemContainer.appendChild(tshirtQuantity);

                const removeButton = document.createElement('button');
                removeButton.textContent = 'Remover';
                removeButton.addEventListener('click', () => {
                    // Remova o item do carrinho e atualize o Local Storage
                    cartFromStorage.splice(cartFromStorage.indexOf(cartItem), 1);
                    localStorage.setItem('cart', JSON.stringify(cartFromStorage));
                    // Atualize a exibição do carrinho
                    updateCart();
                });
                cartItemContainer.appendChild(removeButton);

                cartContainer.appendChild(cartItemContainer);

                subtotal += cartItem.price * cartItem.qt;
            }


            // Atualiza o subtotal na página
            select('.subtotal-value').textContent = subtotal;
            // Calcula o total (se necessário) e atualiza na página
            const total = subtotal; // Aqui você pode adicionar taxas ou descontos, se necessário
            select('.total-value').textContent = total;
        } else {
            // Carrinho vazio
            // ...
        }
    } else {
        // Redireciona de volta para a página de seleção de camisas
        setTimeout(function () {
            window.location.href = "./flamengo.html";
        });
    }

    if (typeof callback === 'function') {
        callback()
    }
};



let blusas = select('#blusas')
blusas.innerHTML = ''

// fetch('http://localhost:3000/camisas/flamengo')
// .then(response => responde.json())
// .then(data => {



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

// })


changeQtd()

const renderizarCarrinhoNaPaginaCarrinho = (cartItens) => {
    const cartContainer = document.getElementById('cart-container');
    cartContainer.innerHTML = '';

    cartItens.forEach((cartItem) => {
        const eachTshirt = camisasFlamengoJson.find(tshirt => tshirt.id === cartItem.id);

        const cartItemContainer = document.createElement('div');
        cartItemContainer.classList.add('cart-item');

        // Crie os elementos HTML para exibir as informações da camisa no carrinho, semelhante ao exemplo anterior.

        cartContainer.appendChild(cartItemContainer);
    });
}

const exibirCarrinhoNaPaginaCarrinho = () => {
    const cartFromStorage = JSON.parse(localStorage.getItem('cart'));
    if (cartFromStorage && cartFromStorage.length > 0) {
        renderizarCarrinhoNaPaginaCarrinho(cartFromStorage);

        // Outras atualizações necessárias na página, como exibir subtotal e total.
    } else {
        // Carrinho vazio, exibir uma mensagem ou tratamento apropriado.
    }
};

// changeQtd()


addToCart()

exibirCarrinhoNaPaginaCarrinho()
