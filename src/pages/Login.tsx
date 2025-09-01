"use client"

import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { login } from "../features/auth/authSlice"
import { Link, useLocation, useNavigate } from "react-router-dom"

const LoginSchema = Yup.object({
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min 6 chars").required("Required"),
})

export default function Login() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.auth)
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || "/events"

  return (
    <div className="card" style={{ maxWidth: 480, margin: "2rem auto" }}>
      <h2>Login</h2>
      <Formik
        initialValues={{ email: "", password: "" }}
        validationSchema={LoginSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await dispatch(login(values))
          console.log(res,'the result after the login is comming')
          setSubmitting(false)
          if ((res as any).meta.requestStatus === "fulfilled") {
            navigate(from, { replace: true })
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <div>
              <label className="label" htmlFor="email">
                Email
              </label>
              <Field className="input" id="email" name="email" placeholder="you@example.com" />
              <div className="error">
                <ErrorMessage name="email" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="password">
                Password
              </label>
              <Field className="input" id="password" name="password" type="password" />
              <div className="error">
                <ErrorMessage name="password" />
              </div>
            </div>
            {error && <div className="error">{error}</div>}
            <button className="btn" type="submit" disabled={isSubmitting || loading}>
              {isSubmitting || loading ? "Signing in..." : "Login"}
            </button>
            <div className="helper">
              No account? <Link to="/register">Register</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
