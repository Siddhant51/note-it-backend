const express = require("express");

const {
  Register,
  Login,
  Create,
  Notes,
  Update,
  Delete,
  GetNote,
  NoteCount,
} = require("./controller");
const { requireAuth } = require("./authenticate");
const router = express.Router();

require("./server");

router.post("/register", Register);

router.post("/login", Login);

router.post("/create", requireAuth, Create);

router.get("/notes", requireAuth, Notes);

router.get("/note-count", requireAuth, NoteCount);

router.get("/note/:noteId", requireAuth, GetNote);

router.put("/update/:noteId", requireAuth, Update);

router.delete("/delete/:noteId", requireAuth, Delete);

module.exports = router;
