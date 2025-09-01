
import { Formik, Form, Field, ErrorMessage } from "formik"
import * as Yup from "yup"
import { useAppDispatch, useAppSelector } from "../store/hooks"
import { register } from "../features/auth/authSlice"
import { Link, useNavigate } from "react-router-dom"

const RegisterSchema = Yup.object({
  name: Yup.string().min(2, "Too short").required("Required"),
  email: Yup.string().email("Invalid email").required("Required"),
  password: Yup.string().min(6, "Min 6 chars").required("Required"),
})

export default function Register() {
  const dispatch = useAppDispatch()
  const { loading, error } = useAppSelector((s) => s.auth)
  const navigate = useNavigate()

  return (
    <div className="card" style={{ maxWidth: 520, margin: "2rem auto" }}>
      <h2>Create account</h2>
      <Formik
        initialValues={{ name: "", email: "", password: "" }}
        validationSchema={RegisterSchema}
        onSubmit={async (values, { setSubmitting }) => {
          const res = await dispatch(register(values))
          setSubmitting(false)
          if ((res as any).meta.requestStatus === "fulfilled") {
            navigate("/events")
          }
        }}
      >
        {({ isSubmitting }) => (
          <Form className="form">
            <div>
              <label className="label" htmlFor="name">
                Name
              </label>
              <Field className="input" id="name" name="name" placeholder="Ada Lovelace" />
              <div className="error">
                <ErrorMessage name="name" />
              </div>
            </div>
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
              {isSubmitting || loading ? "Creating..." : "Register"}
            </button>
            <div className="helper">
              Already have an account? <Link to="/login">Login</Link>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}
