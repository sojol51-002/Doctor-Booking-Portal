import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../../Contexts/AuthProvider";
import useToken from "../../hooks/useToken";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const { createUser, updateuser } = useContext(AuthContext);
  const [signupError, setSignupError] = useState("");
  const [createdUserEmail, setCreatedUserEmail] = useState("");
  const [token, setToken] = useToken(createdUserEmail);
  const navigate = useNavigate();

  if (token) {
    navigate("/");
  }

  const handleSignup = (data) => {
    createUser(data.email, data.password)
      .then((result) => {
        const user = result.user;
        console.log(user);
        toast.success("sign up successfully");
        navigate("/");
        setSignupError("");
        const userInfo = {
          displayName: data.name,
        };
        updateuser(userInfo)
          .then(() => {
            saveUser(data.name, data.email);
          })
          .catch((error) => console.error(error));
      })
      .catch((error) => {
        console.error(error);
        const err = error.message;
        const CuttingErrorMessage = err.split("/");
        const errorMessage = CuttingErrorMessage[1];
        const removeLastChar = errorMessage.slice(0, -1);
        const removeSecondLastChar = removeLastChar.slice(0, -1);
        setSignupError(removeSecondLastChar);
      });
  };

  const saveUser = (name, email) => {
    const user = { name, email };

    fetch("https://doctors-portal-server-eight-orcin.vercel.app/users", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((data) => {
        setCreatedUserEmail(email);
      });
  };

  return (
    <div className="max-w-md mx-auto border rounded-md shadow-xl my-5 py-10">
      <h3 className="text-2xl font-bold text-center">Sign up</h3>
      <form onSubmit={handleSubmit(handleSignup)} className="px-6">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold">Name</span>
          </label>
          <input
            type="text"
            {...register("name")}
            className="input input-bordered w-full"
          />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold">Email*</span>
          </label>
          <input
            type="email"
            {...register("email", {
              required: "This field is required",
            })}
            className="input input-bordered w-full"
          />
          {errors.email && (
            <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text font-bold">Password*</span>
          </label>
          <input
            type="password"
            {...register("password", {
              required: "This field is required",
              minLength: {
                value: 6,
                message: "password must be 6 character or longer",
              },
              // pattern: {value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])$/, message: "password must be stronger."}
            })}
            className="input input-bordered w-full"
          />
          {errors.password && (
            <p role="alert" className="text-sm text-red-500 mt-1">
              {errors.password.message}
            </p>
          )}
          {signupError && (
            <p className="text-red-500 text-sm mt-1">{signupError}</p>
          )}
        </div>

        <div className="form-control mt-4">
          <input type="submit" value="Sign up" className="btn bg-accent" />
        </div>
        <div className=" mt-3 text-center">
          <p>
            Already have an account?
            <Link to={"/login"} className="text-primary">
              {" "}
              Please login
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
