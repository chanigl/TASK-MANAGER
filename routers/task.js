const express = require('express');
const mongoose = require('mongoose');

const taskModel = require('../models/Task')
const userModel = require('../models/User')

const router = new express.Router()

 


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