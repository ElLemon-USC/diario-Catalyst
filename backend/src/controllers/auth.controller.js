import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

//  REGISTER
export const register = async (req, res) => {
  console.log(req.body);
  
  try {

    const { error } = registerSchema.validate(req.body);

if (error) {
  return res.status(400).json({
    error: error.details[0].message
  });
}
    const { username, email, password } = req.body;
    const existUser = await User.findOne({
      $or: [
        { email },
        { username }
      ]
    });
    
    if (existUser) {
      return res.status(400).json({
        error: "Correo o username ya registrado"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
    });

    await user.save();

    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);

if (error) {
  return res.status(400).json({
    error: error.details[0].message
  });
}
    const { email, password } = req.body;

    // buscar usuario
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    // comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    // generar token
    const token = jwt.sign(
      { id: user._id, 
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      message: "Login exitoso",
      token,
    });

  } catch (error) {
  console.log(error);
  res.status(500).json({ error: error.message });
}
};