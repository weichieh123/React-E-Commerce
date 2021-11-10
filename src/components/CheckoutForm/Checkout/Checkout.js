import React, { useState, useEffect } from 'react'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button } from '@material-ui/core'
import { commerce } from '../../../lib/commerce'
import useStyles from './styles'
import AddressForm from '../AddressForm'
import PaymentForm from '../PaymentForm'

const steps = ['Shipping address', 'Payment details']

function Checkout({ cart }) {
    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null)
    const classes = useStyles()

    useEffect(()=> {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' })
                console.log('token', token)
                setCheckoutToken(token)
            } catch (error) {

            }
        }
        generateToken()
    }, [cart])

    const Confirmation = () => (
        <div>Confirmation</div>
    )

    const Form = () => activeStep === 0 
        ? <AddressForm checkoutToken={checkoutToken} />
        : <PaymentForm />

    // React的順序: Render JSX -> useEffect -> Rerender
    // 所以當Form已經要render的時候，但還沒執行useEffect，所以還沒拿到checkoutToken，所以會報錯
    // TypeError: Cannot read properties of null (reading 'id')
    // 所以需要再做check，是否這個値存在，有值的話再render
    // checkoutToken && <Form />

    return (
        <>
          <div className={classes.toolbar} />  
          <main className={classes.layout}>
            <Paper className={classes.paper}>
                <Typography variant="h4" align="center">Checkout</Typography>
                <Stepper activeStep={activeStep} className={classes.stepper}>
                    { steps.map((step) => (
                        <Step key={step}>
                            <StepLabel>{step}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                { activeStep === steps.length ? <Confirmation /> : checkoutToken && <Form />}
            </Paper>
          </main>
        </>
    )
}

export default Checkout
