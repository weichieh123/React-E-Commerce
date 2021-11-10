import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { commerce } from './lib/commerce'
import { Products, Navbar, Cart } from './components'

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
        const item = await commerce.cart.add(productId, quantity)
        setCart(item.cart)
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
                        <Cart cart={cart} />
                    </Route>
                </Switch>
            </div>
        </Router>
    )
}

export default App
