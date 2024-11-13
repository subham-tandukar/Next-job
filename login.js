"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { validateError } from "@/helper/validateError";

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

  // Map formValues to match the structure required by validateError
  const valuesToValidate = [
    { name: "email", value: formValues.email },
    { name: "password", value: formValues.password },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });

    // Update validation on each change
    if (isSubmit) {
      // Validate the field that is being changed
      const fieldToValidate = [{ name, value }];

      const fieldError = validateError(fieldToValidate);

      // Update formError state with only the specific field’s error
      setFormError((prevErrors) => ({
        ...prevErrors,
        ...fieldError,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setFormError(validateError(valuesToValidate));
    setIsSubmit(true);
    
  };

  const submitData = async () => {
    try {
      setLoading(true);
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
      setLoading(false);
    }
  };

  useEffect(() => {
    const hasNoError = Object.values(formError).every((error) => error === "");
    if (hasNoError && isSubmit) {
      submitData();
    }
  }, [formError]);

  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div>
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
      </div>

      <div>
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
      </div>

      <button type="submit">{loading ? "Please Wait" : "Login"}</button>
    </form>
  );
}
