import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import { Paper, Stepper, Step, StepLabel, Typography, CircularProgress, Divider, Button, CssBaseline } from '@material-ui/core'
import { commerce } from '../../../lib/commerce'
import useStyles from './styles'
import AddressForm from '../AddressForm'
import PaymentForm from '../PaymentForm'

const steps = ['Shipping address', 'Payment details']

function Checkout({ cart, order, onCaptureCheckout, error }) {
    const [activeStep, setActiveStep] = useState(0)
    const [checkoutToken, setCheckoutToken] = useState(null)
    const [shippingData, setShippingData] = useState({})
    const [isFinished, setIsFinished] = useState(false)
    const classes = useStyles()
    const history = useHistory()

    useEffect(()=> {
        const generateToken = async () => {
            try {
                const token = await commerce.checkout.generateToken(cart.id, { type: 'cart' })
                console.log('token', token)
                setCheckoutToken(token)
            } catch (error) {
                history.pushState('/')
            }
        }
        generateToken()
    }, [cart])

    const nextStep = () => setActiveStep((prevActiveStep) => prevActiveStep + 1 )
    const backStep = () => setActiveStep((prevActiveStep) => prevActiveStep - 1 )

    const next = (data) => {
        setShippingData(data)
        nextStep()
    }

    const timeout = () => {
        setTimeout(() => {
            setIsFinished(true)
        }, 3000)
    }

    let Confirmation = () => order.customer ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase, {order.customer.firstname} {order.customer.lastname}</Typography>
                <Divider className={classes.divider} />
                <Typography variant="subtitle2">Order ref: {order.customer_reference}</Typography>
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ) : isFinished ? (
        <>
            <div>
                <Typography variant="h5">Thank you for your purchase</Typography>
                <Divider className={classes.divider} />
            </div>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    ) : (
        <div className={classes.spinner}>
            <CircularProgress />
        </div>
    )

    if (error) {
        <>
            <Typography variant="h5">Error: {error}</Typography>
            <br />
            <Button component={Link} to="/" variant="outlined" type="button">Back to Home</Button>
        </>
    }

    const Form = () => activeStep === 0 
        ? <AddressForm checkoutToken={checkoutToken} next={next} />
        : <PaymentForm shippingData={shippingData} checkoutToken={checkoutToken} nextStep={nextStep} backStep={backStep} onCaptureCheckout={onCaptureCheckout} timeout={timeout} />

    // React的順序: Render JSX -> useEffect -> Rerender
    // 所以當Form已經要render的時候，但還沒執行useEffect，所以還沒拿到checkoutToken，所以會報錯
    // TypeError: Cannot read properties of null (reading 'id')
    // 所以需要再做check，是否這個値存在，有值的話再render
    // checkoutToken && <Form />

    return (
        <>
        <CssBaseline />
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
