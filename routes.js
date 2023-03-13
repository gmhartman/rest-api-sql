"use strict";

const auth = require("basic-auth");
var express = require("express");
const router = express.Router();
const { authenticateUser } = require('./middleware/authenticate');

var { User, Course } = require("./models");

function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}

// users GET route

router.get(
  "/users", authenticateUser,
  asyncHandler(async (req, res) => {
    const user = req.currentUser;
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      emailAddress: user.emailAddress,
    });
  })
);

// users POST route

router.post(
  "/users",
  asyncHandler(async (req, res) => {
    try {
      await User.create(req.body);
      res.location("/");
      res.status(201).end();
    } catch (error) {
      res.status(400).json({ error });
    }
  })
);

// Courses Routes

// /api.courses GET

router.get(
  "/courses",
  asyncHandler(async (req, res) => {
    const courses = await Course.findAll();
    console.log(courses);
    res.json(courses);
  })
);

// /api.courses/:id GET

router.get(
  "/courses/:id",
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    console.log(course);
    if (course) {
      res.json(course);
    } else {
      const error = new Error("404 - Course Not Found");
      error.status = 404;
      next(error);
    }
  })
);

// /api.courses POST

router.post(
  "/courses", authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.create(req.body);
      res.location(`/courses/${course.id}`);
      res.status(201).end();
    } catch (error) {
      if ((error.name === "SequelizeValidationError")) {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  })
);

// /api.courses/:id PUT

router.put(
  "/courses/:id", authenticateUser,
  asyncHandler(async (req, res) => {
    try {
      const course = await Course.findByPk(req.params.id);
      if (course.userId === user.id) {
        await course.update(req.body)
        res.status(204).end();
      } else {
        res.status(403).json({message: 'You cannot edit this course.'}).end();
      } 
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const errors = error.errors.map((err) => err.message);
        res.status(400).json({ errors });
      } else {
        throw error;
      }
    }
  }));

// /api/courses/:id DELETE

router.delete(
  "/courses/:id", authenticateUser,
  asyncHandler(async (req, res) => {
    const course = await Course.findByPk(req.params.id);
    if (course) {
      await course.destroy();
      res.status(204).end();
    } else {
      res.sendStatus(404);
    }
  })
);

module.exports = router;
