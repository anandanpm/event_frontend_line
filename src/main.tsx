import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { store } from "./store"
import App from "./App"
import "./styles/main.scss"


import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Elements stripe={stripePromise}>
          <App />
        </Elements>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
)
