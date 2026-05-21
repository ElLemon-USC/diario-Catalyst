import Diary from "../models/diary.model.js";
import User from "../models/user.model.js";

// Crear entrada
export const createEntry = async (req, res, next) => {
  try {
    const { content, fontFamily, visibility, sharedWith } = req.body;

    if (
      visibility === "public" &&
      content.length > 333
    ) {
      return res.status(400).json({
        message: "La entrada pública no puede superar los 333 caracteres"
      });
    }

    if (
      visibility === "shared" &&
      content.length > 120
    ) {
      return res.status(400).json({
        message: "La entrada compartida no puede superar los 120 caracteres"
      });
    }

    const user = await User.findById(req.user.id);
    if (
      user.BloquearHasta &&
      user.BloquearHasta > new Date()
    ) {
      return res.status(403).json({
        message: "Usuario Bloqueado Temporalmente"
      });
    }

    const PalabrasProhibidas = ["hack", "virus"];

    const  lowerContent = content.toLowerCase();

    const contienePalabrasProhibidas = 
    PalabrasProhibidas.some(palabra => lowerContent.includes(palabra)
  );

  const numeros = content.match(/\d/g) || [];
  
  if (numeros.length > 35 ||
    contienePalabrasProhibidas
  ) {
    user.IntentosFallidos += 1;

    if (user.IntentosFallidos >= 3) {
      user.BloquearHasta = new Date(Date.now() + 60000);
      user.IntentosFallidos = 0;
    }
    
    await user.save();
    return res.status(400).json({
      message: "Entrada rechazada por sospechosidad"
    });
  }

    let usersShared = [];

   if (
       visibility === "shared" &&
       sharedWith &&
       sharedWith.length
      ) {
      const users = await User.find({
        username: { $in: sharedWith }
      });

      usersShared = users.map(user => user._id);
    }

    const entry = new Diary({
      user: req.user.id,
      content,
      fontFamily,
      visibility,
      sharedWith: usersShared
    });

    await entry.save();

    res.json({ message: "Entrada guardada" });

  } catch (error) {
    next(error);
  }
};

// Ver entradas
export const getEntries = async (req, res, next) => {
  try {
    
    let entries;

    if(req.user.role === "admin") {
      entries = await Diary.find()
      .populate("user", "username")
      .sort({ createdAt: -1 });
    }
    else {
      entries = await Diary.find({

        $or: [
          { user: req.user.id },
          { visibility: "public" },
          {
            visibility: "shared",
            sharedWith: req.user.id
          }
        ]
      })
      .populate("user", "username blocked")
      .sort({ createdAt: -1 });
    }

    res.json(entries);

  } catch (error) {
   next(error);
  }
};

// Eliminar SOLO del usuario dueño
export const deleteEntry = async (req, res, next) => {
  try {
    await Diary.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    res.json({ message: "Entrada eliminada" });

  } catch (error) {
    next(error);
  }
};

// Editar-actualizar las entradas 
export const updateEntry = async (req, res, next) => {
  try {
    const { content, fontFamily, visibility, sharedWith } = req.body;

    if (visibility === "public" &&
      content.length > 333
    ) {
      return res.status(400).json({
        message: "La entrada pública no puede superar los 333 caracteres"
      });
    }

    if (visibility === "shared" &&
      content.length > 120
    ) {
      return res.status(400).json({
        message: "La entrada compartida no puede superar los 120 caracteres"
      });
    }

    let usersShared = [];

    if (
      visibility === "shared" &&
      sharedWith &&
      sharedWith.length
    ) {
      const users = await User.find({
        username: { $in: sharedWith }
      });

      usersShared = users.map(user => user._id);
    }

    const existingEntry = await Diary.findById(req.params.id);
    if (existingEntry.blocked) {
      return res.status(400).json({
        message: "La entrada está bloqueada"
      });
    }

    await Diary.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id
      },
      {
        content,
        fontFamily,
        visibility,
        sharedWith: usersShared
      }
    );

    res.json({ message: "Entrada actualizada" });

  } catch (error) {
    next(error);
  }
};

export const toggleFavorite = async (req, res, next) => {
  try {
    const entry = await Diary.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!entry) {
      return res.status(404).json({
        message: "Entrada no encontrada"
      });
    }

    entry.favorite = !entry.favorite;

    await entry.save();

    res.json({
      message: "Favorito actualizado",
      favorite: entry.favorite
    });

  } catch (error) {
    next(error);
  }
};

export const blockEntry = async (req, res, next) => {
  try {
    const entry = await Diary.findById(req.params.id);

    if(!entry) {
      return res.status(404).json({
        message: "Entrada no encontrada"
      })
    }

    entry.blocked = !entry.blocked;

    await entry.save();

    res.json({
      message : entry.blocked
      ? "Entrada bloqueada"
      : "Entrada desbloqueada"
    });
  }catch (error) {
    next(error);
  }
  };


  export const blockUser = async(req,res,next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return res.status(404).json({
          message: "Usuario no encontrado"
        });
      }

     user.blocked = !user.blocked;

     await user.save();

     res.json({
      message: user.blocked
      ? "Usuario baneado"
      : "Usuario desbaneado"
     });
   } catch (error) {
    next(error);
   }
};