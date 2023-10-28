const { User, Note } = require("./schema");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// User Registration
const Register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(400).json({ error: "User already exists" });
    } else {
      const user = new User({ username, email, password });

      // The password hashing will be handled by the pre-save middleware defined in the schema

      await user.save();
      res.status(200).json({ message: "User registered" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// User Login
const Login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Please fill in all fields" });
  }

  try {
    const user = await User.findOne({ email: email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Check if the provided password matches the stored hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: "Incorrect password" });
    }

    const secretKey = "mysecretkey";
    const token = jwt.sign({ userId: user._id }, secretKey, {
      expiresIn: "365d",
    });

    res.status(200).json({ message: "Login successful", token: token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// Create a New Note
const Create = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title, content, color, font } = req.body;

    const note = new Note({
      title,
      content,
      color,
      font,
      userId,
    });

    await note.save();

    res.status(201).json({ message: "Note created successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Retrieve Notes
const Notes = async (req, res) => {
  try {
    // Get the user's ID from the decoded token
    const userId = req.user.id;

    const notes = await Note.find({ userId })
      .sort({ updatedAt: -1, createdAt: -1 }) // Sort by updatedAt in descending order, then by createdAt in descending order
      .exec();

    res.status(200).json(notes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Retrieve Note
const getNote = async (req, res) => {
  try {
    // Extract the noteId from the URL parameter
    const noteId = req.params.noteId;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    res.status(200).json(note);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Update a Note
const Update = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    // Extract the updated note data from the request body
    const { title, content, color, font } = req.body;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    // Update the note's fields
    note.title = title || note.title;
    note.content = content || note.content;
    note.color = color || note.color;
    note.font = font || note.font;

    await note.save();

    res.status(200).json({ message: "Note updated successfully", note });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

// Delete a Note
const Delete = async (req, res) => {
  try {
    const noteId = req.params.noteId;

    const note = await Note.findById(noteId);

    if (!note) {
      return res.status(404).json({ error: "Note not found" });
    }

    await Note.findByIdAndDelete(noteId);

    res.status(200).json({ message: "Note deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  Register,
  Login,
  Create,
  Notes,
  getNote,
  Update,
  Delete,
};
