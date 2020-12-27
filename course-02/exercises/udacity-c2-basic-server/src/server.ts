import express, { Router, Request, Response } from "express";
import bodyParser from "body-parser";

import { Car, cars as cars_list } from "./cars";

(async () => {
  let cars: Car[] = cars_list;

  //Create an express applicaiton
  const app = express();
  //default port to listen
  const port = 8082;

  //use middleware so post bodies
  //are accessable as req.body.{{variable}}
  app.use(bodyParser.json());

  // Root URI call
  app.get("/", (req: Request, res: Response) => {
    res.status(200).send("Welcome to the Cloud!");
  });

  // Get a greeting to a specific person
  // to demonstrate routing parameters
  // > try it {{host}}/persons/:the_name
  app.get("/persons/:name", (req: Request, res: Response) => {
    let { name } = req.params;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Get a greeting to a specific person to demonstrate req.query
  // > try it {{host}}/persons?name=the_name
  app.get("/persons/", (req: Request, res: Response) => {
    let { name } = req.query;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Post a greeting to a specific person
  // to demonstrate req.body
  // > try it by posting {"name": "the_name" } as
  // an application/json body to {{host}}/persons
  app.post("/persons", async (req: Request, res: Response) => {
    const { name } = req.body;

    if (!name) {
      return res.status(400).send(`name is required`);
    }

    return res.status(200).send(`Welcome to the Cloud, ${name}!`);
  });

  // Eendpoint to get a specific car
  app.get("/cars/:id", (req: Request, res: Response) => {
    const { id } = req.params;

    // it should require id
    if (!id) {
      return res.status(400).send(`id is required`);
    }

    const car = cars.find((c) => c.id === parseInt(id));

    // it should fail gracefully if no matching car is found
    if (!car) {
      return res.status(400).send(`car with id: ${id} can't be found`);
    }

    return res.status(200).json(car);
  });

  // Endpoint to GET a list of cars
  app.get("/cars", (req: Request, res: Response) => {
    const { make } = req.query;
    let carsResponse = cars;

    // it should be filterable by make with a query paramater
    if (make) {
      carsResponse = carsResponse.filter((car) => car.make === make);
    }

    return res.status(200).json(carsResponse);
  });

  // Endpoint to post a new car to our list
  app.post("/cars", (req: Request, res: Response) => {
    // it should require id, type, model, and cost
    const {
      id,
      type,
      model,
      cost,
      make,
    }: {
      //
      id: number;
      type: string;
      model: string;
      cost: number;
      make: string;
    } = req.body;

    if (!id || !type || !model || !cost) {
      return res.status(400).send(`please provide id, type, model and cost`);
    }

    const found = cars.find((c) => c.id === id);
    if (found) {
      return res.status(400).send(`car with id: ${id} already exists`);
    }

    const newCar = { id, type, model, cost, make };
    cars.push(newCar);

    return res.status(201).json(cars[cars.length - 1]);
  });

  // Start the Server
  app.listen(port, () => {
    console.log(`server running http://localhost:${port}`);
    console.log(`press CTRL+C to stop server`);
  });
})();
