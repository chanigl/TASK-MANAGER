const express = require('express');
const mongoose = require('mongoose');

const taskModel = require('../models/Task')
const userModel = require('../models/User')

const router = new express.Router()

 

//    נתיב ליצירת משימה חדשה  

router.post("/api/create/task", async (req, res) => {
    try {
      const users = new taskModel(req.body);
      await users.save();
      const addTask = await userModel.find({id:users.users})
      console.log(addTask);
      console.log(users.id);
      for(arr of addTask){
          console.log(arr.task);
          const a= await userModel.findOneAndUpdate({task:arr.task},{task:[...arr.task,users.id]})
          console.log(a);
      }
      res.send('users');
    } catch (error) {
      res.send(error);
    }
  });

  
//     נתיב לעדכון פרטי משימה

router.post("/api/task/update/:task", async (req, res) => {
    try {
      const { task } = req.params;
      const updateUser = await taskModel.findOneAndUpdate(
        { description: task },
        {
          description: req.body.description,
          completed: req.body.completed,
          id: req.body.id,
          users: req.body.users,
        }
      );
      console.log(updateUser);
      res.send(updateUser);
    } catch (error) {
      res.send(error);
    }
  });
  
//    ---נתיב למחיקת המשימה מהמשתמש

router.get("/api/deletetask/:id", async (req, res) => {
    try {
      console.log(req.params);
      const { id } = req.params;
      console.log(id);
      const findById = await taskModel.find({ id: id });
      const newarray = await userModel.find({ id: findById[0].users });
      for (arr of newarray) {
        const del = arr.task.filter(function (el) {
          return el != id;
        });
        const deleteUser = await taskModel.findOneAndUpdate(
          { task: arr.task },
          { task: del }
        );
      }
      await taskModel.findOneAndDelete({id:id})
      res.send(newarray);
    } catch (error) {
      res.send(error);
    }
  });

module.exports = router