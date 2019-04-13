import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Routes } from "./routes";
import { GridGenerator } from "./ServiceGrid/GridGenerator";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);

container.bind(Types.GridGenerator).to(GridGenerator);

export { container };
