import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { commerce } from './lib/commerce'
import { Products, Navbar, Cart, Checkout } from './components'

function App() {
    const [products, setProducts] = useState([])
    const [cart, setCart] = useState({})

    const fetchProducts = async () => {
        const { data } = await commerce.products.list()
        setProducts(data)
    }
    
    const fetchCart = async () => {
        const newCart = await commerce.cart.retrieve()
        setCart(newCart)
    }

    const handleAddToCart = async (productId, quantity) => {
        // const response = await commerce.cart.add(productId, quantity)
        // setCart(response.cart)
        const { cart } = await commerce.cart.add(productId, quantity) //destructure
        setCart(cart)
    }

    const handleUpdateCartQty = async (productId, quantity) => {
        const { cart }  = await commerce.cart.update(productId, { quantity })
        setCart(cart)
    }

    const handleRemoveFromCart = async (productId) => {
        const { cart }  = await commerce.cart.remove(productId)
        setCart(cart)
    }

    const handleEmptyCart = async () => {
        const { cart } = await commerce.cart.empty()
        setCart(cart)
    }

    useEffect(()=> {
        fetchProducts()
        fetchCart()
    }, [])

    // console.log(products, cart)

    return (
        <Router>
            <div>
                <Navbar totalItems={cart.total_items} />
                {/* Switch these Route */}
                <Switch> 
                    <Route exact path="/">
                        <Products products={products} onAddToCart={handleAddToCart} />
                    </Route>
                    <Route exact path="/cart">
                        <Cart cart={cart} 
                            onUpdateCartQty={handleUpdateCartQty} 
                            onRemoveFromCart={handleRemoveFromCart} 
                            onEmptyCart={handleEmptyCart} />
                    </Route>
                    <Route exact path="/checkout">
                        <Checkout cart={cart} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App
