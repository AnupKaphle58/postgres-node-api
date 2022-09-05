import express from "express";
import bcrypt from "bcrypt";
import { v4 as uuidv4 } from "uuid";

import pool from "../database/db.js";
import { createToken, refreshToken } from "../validator/jwt.js";
import registrationValidation from "../validator/user-details.js";

const createUser = async (req, res) => {
  try {
    const u_id = uuidv4();
    const result = await registrationValidation.validateAsync(req.body);
    // const { first_name, last_name, email } = req.body;
    const pass = await bcrypt.hash(result.pass, 10);
    const user = await pool.query(
      "INSERT INTO users (user_id, first_name, last_name, email, pass) VALUES ($1, $2, $3, $4, $5)",
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
    if (userEmail.rowCount > 0) {
      const user = userEmail.rows[0];
      const user_id = userEmail.rows[0].user_id;
      try {
        if (user) {
          bcrypt.compare(pass, user.pass, (err, isMatch) => {
            if (err) {
              res.send(err.message);
            }
            if (isMatch) {
              res
                .header({
                  "auth-token": createToken(user_id, email, pass),
                  "refresh-token": refreshToken(user_id),
                })
                .redirect(`/users/books/${user_id}`);
            } else {
              res.send("Either email or password incorrect!");
            }
          });
        } else {
          res.send("Either email or password incorrect!");
        }
      } catch (err) {
        res.send(err.message);
      }
    } else {
      res.status(404).send("email or password not correct!");
    }
  } else {
    res.send("email or password cannot be empty");
  }
};

const getBooks = async (req, res) => {
  const books = await pool.query(
    `SELECT book_id, book_name, author FROM bookslend WHERE email = $1`,
    [req.user.email]
  );
  if (books.rows.length > 0) {
    res.send(books.rows);
  } else {
    res.send("You have no books");
  }
};

export default { createUser, logUser, getBooks };
