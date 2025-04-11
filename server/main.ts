import { config } from "dotenv";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { Server } from "./src/server";

export async function main() {
    config()

    const args = await yargs(hideBin(process.argv))
        .option('build', {
            alias: 'b',
            type: 'boolean',
            description: 'Use frontend build'
        })
        .option('import', {
            alias: 'i',
            type: 'boolean',
            description: 'Import comments from comments.json'
        })
        .option('delete', {
            alias: 'd',
            type: 'boolean',
            description: 'Delete all data from the database'
        })
        .help('h')
        .alias('h', 'help')
        .parse()
    
    const server = new Server({
        useBuild: Boolean(args.build)
    });

    if (args.delete) {
        await server.deleteAllData();
        process.exit(0);
    }

    if (args.import) {
        await server.importComments();
        process.exit(0);
    }
}

main()