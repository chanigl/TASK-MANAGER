const express = require("express");
const mongoose = require("mongoose");

const userModel = require("../models/User");
const taskModel = require("../models/Task");

const router = new express.Router();

//     נתיב להצגת רשימת המשתמשים / המשימות

router.get("/api/find/:user", async (req, res) => {
  try {
    const find =
      req.params.user === "user" ? userModel : "task" ? taskModel : null;
    const users = await find.find({});
    console.log(users);
    res.send(users);
  } catch (error) {
    res.send(error);
  }
});

//       נתיב להוספת משתמשים או משימות

router.post("/api/create/:type", async (req, res) => {
  try {
    const type = req.params.type;
    const find = type === "user" ? userModel : "task" ? taskModel : null;
    const findModel = type === "user" ? taskModel : "task" ? userModel : null;
    const newUser = new find(req.body);
    await newUser.save();
    const findUsers = type === "user" ? "users" : "task" ? "task" : null;
    const findTask = type === "user" ? "task" : "task" ? "users" : null;
    const addTask = await findModel.find({ id: newUser[findTask] });
    for (arr of addTask) {
      const addNew = await findModel.findOneAndUpdate(
        { [findUsers]: arr[findUsers] },
        { [findUsers]: [...arr[findUsers], parseInt(newUser.id)] }
      );
    }
    res.send(newUser);
  } catch (error) {
    res.send(error);
  }
});


router.get("/api/deleteUser/:id", async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;
    console.log(id);
    const findById = await userModel.find({ id: id });
    const newarray = await taskModel.find({ id: findById[0].task });
    for (arr of newarray) {
      const del = arr.users.filter(function (el) {
        return el != id;
      });
      const deleteUser = await taskModel.findOneAndUpdate(
        { users: arr.users },
        { users: del }
      );
    }
    await userModel.findOneAndDelete({ id: id });
    res.send(newarray);
  } catch (error) {
    res.send(error);
  }
});

//     נתיב שמציג את כל הנתונים של המשימות של המשתמש ולהיפך- את כל הנתונים של המשתמשי במשימה

router.get("/api/findbyid/:type/:id", async (req, res) => {
  try {
    console.log(req.params);
    const { type, id } = req.params;
    const findModel = type === "user" ? userModel : "task" ? taskModel : null;
    const findType = type === "user" ? taskModel : "task" ? userModel : null;
    const findUser = type === "user" ? "task" : "task" ? "users" : null;
    const findById = await findModel.find({ id: id });
    const newarray = await findType.find({ id: findById[0][findUser] });
    console.log(newarray);
    res.send(newarray);
  } catch (error) {
    res.send(error);
  }
});

//     נתיב לעדכון פרטי משתמש

router.post("/api/update/:type/:id", async (req, res) => {
  try {
    const { id } = req.params;
    console.log(id);
    const findModel =
      req.params.type === "user" ? userModel : "task" ? taskModel : null;
    const updateUser = await findModel
      .find({ id: id })
      .findOneAndUpdate({ ...req.body });
    console.log(updateUser);
    res.send(updateUser);
  } catch (error) {
    res.send(error);
  }
});

//    נתיב שבודק האם המשתמש עושה משימה זו, ואם לא- מוסיף לרשימה

router.get("/api/examination/:iduser/:idtask", async (req, res) => {
  try {
    const { iduser, idtask } = req.params;
    const testIdUser = await userModel.find({ id: iduser });
    const arrTask = testIdUser[0].task;
    const task = await taskModel.find({ id: idtask });
    var user;
    arrTask.includes(idtask)
      ? res.send(task)
      : (user = await userModel.findOneAndUpdate(
          { task: arrTask },
          { task: [...arrTask, idtask] }
        ));
    res.send("Mission successfully added");
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
