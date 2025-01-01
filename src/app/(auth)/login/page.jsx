"use client";

import { signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { validateError } from "@/helper/validateError";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { FaUserShield } from "react-icons/fa";
import { IoIosLock } from "react-icons/io";
import styles from "./Login.module.scss";
import Link from "next/link";
import Image from "next/image";

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
  const [successMsg, setSuccessMsg] = useState("");

  // Map formValues to match the structure required by validateError
  const valuesToValidate = [
    { name: "email", value: formValues.email },
    { name: "password", value: formValues.password },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
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
        setSuccessMsg("Login successful");
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
    if (Object.keys(formError).length === 0 && isSubmit) {
      submitData();
    }
  }, [formError]);

  return (
    <div className={styles.form}>
      <form onSubmit={handleSubmit} className={styles.form__container}>
        <Link href="/" className="">
          <Image
            width={155}
            height={28}
            src="/images/logo.png"
            alt="Site Logo"
            className="object-contain mx-auto mb-10 block h-full object-left"
          />
        </Link>

        <h1 className="text-lg font-semibold mb-5">Login to your account</h1>

        {error && (
          <p className={`${styles.form__msg} bg-[#ff000014] text-destructive `}>
            {error}
          </p>
        )}

        {successMsg && (
          <p
            className={`${styles.form__msg} text-center bg-[#18a8181c] text-[#18a818]`}
          >
            {successMsg}
          </p>
        )}

        <div className={styles.form__wrapper}>
          <div>
            <Label htmlFor="email">Email</Label>

            <div className={styles.input__icon}>
              <div className={styles.form__icon}>
                <FaUserShield />
              </div>
              <Input
                type="text"
                id="email"
                name="email"
                placeholder="Enter your email address"
                value={formValues.email}
                onChange={handleChange}
              />
            </div>
            {formError.email && (
              <p className={styles.form__error}>{formError.email}</p>
            )}
          </div>

          <div>
            <Label htmlFor="password">Password</Label>

            <div className={styles.input__icon}>
              <div className={styles.form__icon}>
                <IoIosLock />
              </div>

              <Input
                type="password"
                id="password"
                name="password"
                placeholder="Enter your password"
                value={formValues.password}
                onChange={handleChange}
              />
            </div>

            {formError.password && (
              <p className={styles.form__error}>{formError.password}</p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={loading}
              className={`w-full h-12 uppercase font-bold`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" />
                  Please Wait
                </>
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
