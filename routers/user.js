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

//       נתיב להוספת משתמשים 

/*router.post("/api/create/:user", async (req, res) => {
  try {
    ///console.log(req.body);
    const find =
      req.params.user === "user" ? userModel : "task" ? taskModel : null;
      console.log(find);
    const findModel =
      req.params.user === "user" ? taskModel : "task" ? userModel : null;
      console.log(findModel);
    const findUser =
      req.params.user === "user" ? users : "task" ? task : null;
      console.log(findUser);
    const users = new find(req.body);
    await users.save();
    const addTask = await findModel.find({id:findUser.task})
    console.log(addTask[0].users);
    console.log(findUser.id);
    for(arr of addTask){
        //console.log(arr.users);
        const a= await findModel.findOneAndUpdate({findUser:arr.findUser},{findUser:[...arr.findUser,users.id]})
        console.log(a);
    }
    //console.log(a);
    res.send('users');
  } catch (error) {
    res.send(error);
  }
});*/
router.post("/api/create/user", async (req, res) => {
    try {
      const users = new userModel(req.body);
      await users.save();
      const addTask = await taskModel.find({id:users.task})
      for(arr of addTask){
          const a= await taskModel.findOneAndUpdate({users:arr.users},{users:[...arr.users,users.id]})
          console.log(a);
      }
      res.send('users');
    } catch (error) {
      res.send(error);
    }
  });
  
//    ---להכניס כפרמטר לנתיב הבא ---נתיב למחיקת המשתמש מהמשימות

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
    await userModel.findOneAndDelete({id:id})
    res.send(newarray);
  } catch (error) {
    res.send(error);
  }
});

//     נתיב שמציג את כל הנתונים של המשימות של המשתמש ולהיפך- את כל הנתונים של המשתמשי במשימה

router.get("/api/findbyid/:user/:id", async (req, res) => {
  try {
    console.log(req.params);
    const { user, id } = req.params;
    console.log(user);
    console.log(id);
    if (user === "user") {
      const findById = await userModel.find({ id: id });
      const newarray = await taskModel.find({ id: findById[0].task });
      console.log(newarray);
      res.send(newarray);
    }
    if (user === "task") {
      const findById = await taskModel.find({ id: id });
      console.log(findById);
      const newarray = await userModel.find({ id: findById[0].users });
      console.log(newarray);
      res.send(newarray);
    }
  } catch (error) {
    res.send(error);
  }
});

//     נתיב לעדכון פרטי משתמש

router.post("/api/user/update/:user", async (req, res) => {
  try {
    const { user } = req.params;
    const updateUser = await userModel.findOneAndUpdate(
      { users: user },
      {
        users: req.body.users,
        id: req.body.id,
        email: req.body.email,
        password: req.body.password,
        age: req.body.age,
        task: req.body.task,
      }
    );
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
    res.send('Mission successfully added');
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
