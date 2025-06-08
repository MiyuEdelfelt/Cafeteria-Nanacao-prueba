const request = require("supertest");
const app = require("../index");

describe("Operaciones CRUD de cafes", () => {

  // 1. GET /cafes => status 200 y arreglo con al menos un objeto
  test("GET /cafes debe responder con status 200 y al menos un café", async () => {
    const res = await request(app).get("/cafes");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  // 2. DELETE /cafes/:id que no existe => status 404
  test("DELETE /cafes/:id debe responder con 404 si el café no existe", async () => {
    const idInexistente = "999";
    const res = await request(app)
      .delete(`/cafes/${idInexistente}`)
      .set("Authorization", "Bearer tokenFake");
    expect(res.statusCode).toBe(404);
  });

  // 3. POST /cafes => agrega nuevo café => status 201
  test("POST /cafes debe agregar un nuevo café y responder con 201", async () => {
    const nuevoCafe = { id: Date.now(), nombre: "Café de prueba" };
    const res = await request(app).post("/cafes").send(nuevoCafe);
    expect(res.statusCode).toBe(201);
    expect(res.body).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ nombre: "Café de prueba" }),
      ])
    );
  });

  // 4. PUT /cafes/:id con ID diferente al body => status 400
  test("PUT /cafes/:id debe responder con 400 si el id no coincide", async () => {
    const id = "1";
    const otroId = "123";
    const cafeActualizado = { id: otroId, nombre: "Nuevo Nombre" };

    const res = await request(app).put(`/cafes/${id}`).send(cafeActualizado);
    expect(res.statusCode).toBe(400);
  });

});
