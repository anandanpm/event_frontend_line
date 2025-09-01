import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { BrowserRouter } from "react-router-dom"
import { store } from "./store"
import App from "./App"
import "./styles/main.scss"


import { Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"


const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY||"pk_test_51Qll4sQYsYoxQv6c4onEzQTe1LgeSBRke8vF2cOfYMmojybtG08Sx3dAd1fObbDIXODeTlaVHXhtxPqudY9CsBg900c0fkb6SE")

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
