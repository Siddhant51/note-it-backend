const express = require("express");

const {
  Register,
  Login,
  Create,
  Notes,
  Update,
  Delete,
  getNote,
} = require("./controller");
const { requireAuth } = require("./authenticate");
const router = express.Router();

require("./server");

router.post("/register", Register);

router.post("/login", Login);

router.post("/create", requireAuth, Create);

router.get("/notes", Notes);

router.get("/note/:noteId", getNote);

router.put("/note/update/:noteId", Update);

router.delete("/note/delete/:noteId", Delete);

module.exports = router;
