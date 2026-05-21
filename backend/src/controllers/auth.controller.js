import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken"; 
import { registerSchema, loginSchema } from "../validators/auth.validator.js";

//  REGISTER
export const register = async (req, res, next) => {
  console.log(req.body);
  
  try {

    const { error } = registerSchema.validate(req.body);

if (error) {
  return res.status(400).json({
    error: error.details[0].message
  });
}
    const { username, email, password, role, adminPassword } = req.body;
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

    let finalRole = "user";

    if (role === "admin") {
      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(400).json({
          error: "Contraseña de admin incorrecta"
        });
      }
      finalRole = "admin";
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({
      username,
      email,
      password: hashedPassword,
      role: finalRole
    });

    await user.save();

    res.json({ message: "Usuario registrado correctamente" });
  } catch (error) {
    next(error);
  }
};

// LOGIN
export const login = async (req, res, next) => {
  try {

    const { error } = loginSchema.validate(req.body);

    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    const {email, password, adminPassword, loginAdmin} = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Usuario no encontrado"
      });
    }

    if (user.blocked) {
      return res.status(400).json({
        message: "Usuario baneado"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(400).json({
        message: "Contraseña incorrecta"
      });
    }

    if (loginAdmin) {

      if (user.role !== "admin") {
        return res.status(400).json({
          message: "No eres admin"
        });
      }

      if (adminPassword !== process.env.ADMIN_PASSWORD) {
        return res.status(400).json({
          message: "Contraseña admin incorrecta"
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h"
      }
    );

    res.json({
      message: "Login exitoso",
      token
    });

  } catch (error) {
    next(error);
  }
};