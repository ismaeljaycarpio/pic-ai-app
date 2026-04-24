import ImageKit, { toFile } from "@imagekit/nodejs";

let _client: InstanceType<typeof ImageKit> | null = null;

function getClient() {}
