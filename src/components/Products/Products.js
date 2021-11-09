import React from 'react'
import Grid from '@material-ui/core/Grid'
import Product from './Product/Product'

const products = [
    { id: 1, name: 'Hamburger', info: 'Hamburger with bacon and tomato.', price: '$5', image: '/static/images/Product/Food-01.svg'},
    { id: 2, name: 'Spaghetti', info: 'Spaghetti Carbonara.', price: '$10', image: '/static/images/Product/Food Icons-02.svg'},
]

function Products() {
    return (
        <main>
            <Grid container justify="center" spacing={4}>
                {products.map((product)=>(
                    <Grid item key={product.id} xs={12} sm={6} md={4} lg={3} >
                        <Product product={product} />
                    </Grid>
                ))}
            </Grid>
        </main>
    )
}

export default Products