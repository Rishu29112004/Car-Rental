"use client"
import React, { ChangeEvent, FormEvent, useState } from "react";

type formDataProps = {
  name: string;
  email: string;
  password: string;
};

type errorProps = {
  name?: string;
  email?: string;
  password?: string;
};

const page = () => {
  const [formData, setFormData] = useState<formDataProps>({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState<errorProps>({});
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validation = () => {
    const newError: errorProps = {};

    if (!formData.name) {
      newError.name = "no name present";
    }
    if (!formData.email) {
      newError.email = "no email present";
    }
    if (!formData.password) {
      newError.password = "no password present";
    }

    setError(newError);

    return Object.keys(newError).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (validation()) {
      setFormData({
        name: "",
        email: "",
        password: "",
      });
    }
  };
  return (
    <div className="flex items-center justify-center bg-green-50">
      <form
        onSubmit={handleSubmit}
        className="rounded-md bg-white p-4 max-w-3xl"
      >
        <div className="flex flex-col gap-2">
          <label htmlFor="name">Name</label>
          <input
            value={formData.name}
            onChange={handleChange}
            type="text"
            name="name"
            className="ronded-md p-4 border border-gray-400"
          />
          {
            error.name && (
                <p className="text-red-500 font-bold">{error.name}</p>
            )
          }
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="email">Email</label>
          <input
            value={formData.email}
            onChange={handleChange}
            type="email"
            name="email"
            className="ronded-md p-4 border border-gray-400"
          />
            {
            error.email && (
                <p className="text-red-500 font-bold">{error.email}</p>
            )
          }
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="password">Password</label>
          <input
            value={formData.password}
            onChange={handleChange}
            type="text"
            name="password"
            className="ronded-md p-4 border border-gray-400"
          />
            {
            error.password && (
                <p className="text-red-500 font-bold">{error.password}</p>
            )
          }
        </div>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 w-full"
        >
          submit
        </button>
      </form>
    </div>
  );
};

export default page;
