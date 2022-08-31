import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import pool from "../database/db.js";
import { createToken } from "../validator/jwt.js";
import registrationValidation from "../validator/user-details.js";

const createUser = async (req, res) => {
  try {
    const u_id = uuidv4();
    const result = await registrationValidation.validateAsync(req.body);
    // const { first_name, last_name, email } = req.body;
    const pass = await bcrypt.hash(result.pass, 10);
    const user = await pool.query(
      "INSERT INTO users (u_id, first_name, last_name, email, pass) VALUES ($1, $2, $3, $4, $5)",
      [u_id, result.first_name, result.last_name, result.email, pass]
    );
    res.send("User Created");
  } catch (error) {
    if (error.isJoi === true) {
      error.status = 422;
      res.send(error.details[0].message);
    } else {
      res.send(error.detail);
    }
  }
};

const logUser = async (req, res) => {
  const email = req.body.email;
  const pass = req.body.pass;
  if (email.length > 0 && pass.length > 0) {
    const userEmail = await pool.query(`SELECT * FROM users WHERE email =$1`, [
      email,
    ]);
    const user = userEmail.rows[0];
    const user_id = userEmail.rows[0].u_id;
    try {
      if (user) {
        bcrypt.compare(pass, user.pass, (err, isMatch) => {
          if (err) {
            res.send(err.message);
          }
          if (isMatch) {
            res.header("auth-token", createToken(user_id)).send("Logged In");
            // res.send("logged IN");
          } else {
            res.send("Either email or password incorrect!");
          }
        });
      } else {
        res.send("Either email or password incorrect!");
      }
    } catch (err) {
      console.log(err.message);
      res.send(err.message);
    }
  } else {
    res.send("email or password cannot be empty");
  }
};

const getBooks = (req, res) => {
  res.send("This is a private page");
};

export default { createUser, logUser, getBooks };
