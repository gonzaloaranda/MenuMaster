const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000; // Puedes cambiar el puerto si es necesario

const menuFilePath = path.join(__dirname, "menu.json"); // Ruta absoluta del archivo menu.json

// Middleware para parsear el cuerpo de las solicitudes como JSON
app.use(express.json());

// Ruta 1: Consultar y mostrar el menú en consola
app.get("/menu", (req, res) => {
  console.log("Intentando leer el archivo JSON desde:", menuFilePath);

  fs.readFile(menuFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON.", err);
      return res.status(500).json({ error: "Error al leer el archivo JSON" });
    }

    try {
      const menu = JSON.parse(data);
      console.log("Menú:");
      console.log(menu);
      res.json(menu);
    } catch (parseError) {
      console.error("Error al parsear el contenido JSON.", parseError);
      res.status(500).json({ error: "Error al parsear el contenido JSON" });
    }
  });
});

// Ruta 2: Agregar un nuevo plato al menú
app.post("/agregar-plato", (req, res) => {
  const nuevoPlato = req.body;

  if (!nuevoPlato || !nuevoPlato.nombre || !nuevoPlato.precio) {
    return res.status(400).json({ error: "Parámetros inválidos" });
  }

  fs.readFile(menuFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON.", err);
      return res.status(500).json({ error: "Error al leer el archivo JSON" });
    }

    try {
      const menu = JSON.parse(data);
      menu.almuerzos.push(nuevoPlato);

      fs.writeFile(menuFilePath, JSON.stringify(menu), (err) => {
        if (err) {
          console.error("Error al escribir el archivo JSON.", err);
          return res
            .status(500)
            .json({ error: "Error al escribir el archivo JSON" });
        }

        console.log(`Plato "${nuevoPlato.nombre}" agregado al menú.`);
        res.json({ message: "Plato agregado correctamente" });
      });
    } catch (parseError) {
      console.error("Error al parsear el contenido JSON.", parseError);
      res.status(500).json({ error: "Error al parsear el contenido JSON" });
    }
  });
});

// Ruta 3: Eliminar un plato del menú
app.delete("/borrar-plato/:nombre", (req, res) => {
  const platoABorrar = req.params.nombre;

  fs.readFile(menuFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error al leer el archivo JSON.", err);
      return res.status(500).json({ error: "Error al leer el archivo JSON" });
    }

    try {
      const menu = JSON.parse(data);
      const platoIndex = menu.almuerzos.findIndex(
        (plato) => plato.nombre === platoABorrar
      );

      if (platoIndex === -1) {
        return res
          .status(404)
          .json({ error: "Plato no encontrado en el menú" });
      }

      menu.almuerzos.splice(platoIndex, 1);

      fs.writeFile(menuFilePath, JSON.stringify(menu), (err) => {
        if (err) {
          console.error("Error al escribir el archivo JSON.", err);
          return res
            .status(500)
            .json({ error: "Error al escribir el archivo JSON" });
        }

        console.log(`Plato "${platoABorrar}" eliminado del menú.`);
        res.json({ message: "Plato eliminado correctamente" });
      });
    } catch (parseError) {
      console.error("Error al parsear el contenido JSON.", parseError);
      res.status(500).json({ error: "Error al parsear el contenido JSON" });
    }
  });
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
