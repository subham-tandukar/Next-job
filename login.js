"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function LoginPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const initialValues = {
    email: "",
    password: "",
  };

  const [formValues, setFormValues] = useState(initialValues);
  const [formError, setFormError] = useState({});
  const [isSubmit, setIsSubmit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const validateError = (values) => {
    const errors = {};
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/i;

    if (!values.email) {
      errors.email = "Required";
    }else if (!regex.test(values.email)) {
      errors.email = "This is not a valid email format";
    }

    if (!values.password) {
      errors.password = "Required";
    }
  
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormError(validateError(formValues));
    setIsSubmit(true);
  };

  const submitData = async () => {
    try {
      setLoading(true)
      const result = await signIn("credentials", {
        ...formValues,
        redirect: false,
      });
      if (result.error) {
        setError(result.error);
      } else {
        // Redirect to the admin dashboard after successful login
        router.push("/admin/dashboard");
      }
    } catch (error) {
      setError(
        error.message || "An unexpected error occurred. Please try again."
      );
    } finally {
      setIsSubmit(false);
      setLoading(false)
    }
  };

  useEffect(() => {
    if (Object.keys(formError).length === 0 && isSubmit) {
      submitData();
    }
  }, [formError]);

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <label>
        Email:
        <input
          type="text"
          name="email"
          value={formValues.email}
          onChange={handleChange}
        />
      </label>
      {formError.email && <p style={{ color: "red" }}>{formError.email}</p>}
      <label>
        Password:
        <input
          type="password"
          name="password"
          value={formValues.password}
          onChange={handleChange}
        />
      </label>
      {formError.password && (
        <p style={{ color: "red" }}>{formError.password}</p>
      )}
      <button type="submit">{loading ? "Please Wait" : "Login"}</button>
    </form>
  );
}
