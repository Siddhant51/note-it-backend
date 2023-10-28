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

router.get("/notes", requireAuth, Notes);

router.get("/note/:noteId", requireAuth, getNote);

router.put("/note/update/:noteId", requireAuth, Update);

router.delete("/note/delete/:noteId", requireAuth, Delete);

module.exports = router;
