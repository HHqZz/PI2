import { Connection, Model, Document, Schema, Mongoose } from "mongoose";
import { DATABASE_URL } from "../ServiceLexical/settings";

export class Database<Data, DataModel extends Document> {

    private document: Model<Document>;
    private connection: Connection;
    private mongoose: Mongoose = require("mongoose");

    constructor(public collection: string, private dataSchema: Schema) {
        this.mongoose.Promise = global.Promise;
    }

    public async connect(): Promise<boolean> {
        return new Promise<boolean>(async (res: (value?: boolean | PromiseLike<boolean>) => void , rej: (reason?: never) => void) => {
            await this.doConnect().catch(this.handleError);
            res(this.connection != null);
        });

    }

    private async doConnect(): Promise<void> {

        return this.mongoose.connect(DATABASE_URL, (err: Error) => {
            if (err) {
                throw err;
            }
            this.connection = this.mongoose.connection;
            this.connection.on("error", console.error.bind(console, "connection error"));
            this.document = this.connection.model<DataModel>(this.collection, this.dataSchema);
        });

    }

    public close(): void {
        this.mongoose.connection.close().catch(this.handleError);
    }

    public async findOne(dataFind: Data): Promise<boolean> {

        let find: boolean = false;
        await this.document.findOne(dataFind)
        .then((result: Document) => {
            if (result !== null) {
                find = true;
            }
        }).catch(this.handleError);

        return Promise.resolve(find);
    }

    public async getFindOne(dataToFind: Data): Promise<Document> {
        return this.document.findOne(dataToFind)
        .then((res: Document) => {
            return res;
        }).catch(this.handleError);

    }

    public async delete(dataDelete: Data): Promise<boolean> {

        let success: boolean = false;
        await this.document.findOneAndRemove(dataDelete)
            .then((result: Document) => {
                if (result !== null) {
                    success = true;
                }
            })
            .catch(this.handleError);

        return Promise.resolve(success);
    }

    public async update(oldData: Data, dataUpdate: Data): Promise<boolean> {

        let succes: boolean = false;
        await this.document.findOneAndUpdate(oldData, dataUpdate)
            .then((result: Document) => {
                succes = (result != null);
            })
            .catch(this.handleError);

        return Promise.resolve(succes);
    }

    public async insert(data: Data): Promise<void> {

        await this.document.create(data).catch(this.handleError);
    }

    public async find(): Promise<Array<Document>> {

        const array: Array<Document> = new Array<Document>();

        await this.document.find()
            .then((res: Document[]) => {
                res.forEach((element: Document) => {
                    array.push(element);
                });
            })
            .catch(this.handleError);

        return Promise.resolve(array);
    }

    public async handleError(error: Error): Promise<never> {
        return Promise.reject(error.message || error);
    }
}
